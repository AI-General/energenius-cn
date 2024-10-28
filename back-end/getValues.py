import argparse
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import json
from fastapi.responses import PlainTextResponse

class CustomCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers['Access-Control-Allow-Origin'] = '*'  # Allow all origins
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'  # Allow all methods
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'  # Allow specific headers
        response.headers['Access-Control-Allow-Credentials'] = 'true'  # Allow credentials
        return response

app = FastAPI()
app.add_middleware(CustomCORSMiddleware)

def getValues(df, datetime_str, period):
    format = "%Y-%m-%d %H:%M:%S"
    obj = datetime.strptime(datetime_str, format)
    df['datetime'] = pd.to_datetime(df['datetime'], format=format)
    df = df.loc[getTimeGap(obj, period, df['datetime'], format)]

    daily_energy_stat = (df['true_EnergyCons'].mean() - df['energy'].mean()) * \
                        (100 / df['true_EnergyCons'].mean())
    daily_ppd_stat = (df['true_PPD'].mean() - df['ppd'].mean()) * \
                     (100 / df['true_PPD'].mean())
    daily_co2_stat = (df['true_ZoneC'].mean() - df['zone_c'].mean()) * \
                     (100 / df['true_ZoneC'].mean())
    
    enerCons = [
        [sum(df['true_EnergyCons']), df['true_EnergyCons'].mean() * 96 * period],
        [sum(df['energy']), df['energy'].mean() * 96 * period]
    ]

    baseline = [df['true_EnergyCons'].mean(), df['true_PPD'].mean(), df['true_ZoneC'].mean()]
    RL = [df['energy'].mean(), df['ppd'].mean(), df['zone_c'].mean()]
    rate = [daily_energy_stat, daily_ppd_stat, daily_co2_stat]

    # Replace problematic float values with 0
    baseline = [0 if np.isinf(x) or np.isnan(x) else x for x in baseline]
    RL = [0 if np.isinf(x) or np.isnan(x) else x for x in RL]
    rate = [0 if np.isinf(x) or np.isnan(x) else x for x in rate]

    df[-96:] = df[-96:].replace([np.inf, -np.inf], np.nan).fillna(0)

    return baseline, RL, rate, enerCons, df[-96:].to_dict(orient='records')

def plotGraph(df, startdate, enddate):
    format = "%Y-%m-%d"
    start = datetime.strptime(startdate, format)
    end = datetime.strptime(enddate, format)
    df['datetime'] = pd.to_datetime(df['datetime'], format="%Y-%m-%d %H:%M:%S")
    df = df.loc[(df['datetime'] >= start) & (df['datetime'] < end + timedelta(days=1))]

    points = dict()
    sumEnergy = np.array([df['true_EnergyCons'].iloc[0], df['energy'].iloc[0]])
    averPPD = np.array([df['true_PPD'].iloc[0], df['ppd'].iloc[0]])
    aveZonC = np.array([df['true_ZoneC'].iloc[0], df['zone_c'].iloc[0]])
    index = 1
    date = start.date()
    for i in range(1, len(df)):
        if df['datetime'].iloc[i].date() == date:
            sumEnergy = (sumEnergy * index + np.array([df['true_EnergyCons'].iloc[i], df['energy'].iloc[i]])) / (index + 1)
            averPPD = (averPPD * index + np.array([df['true_PPD'].iloc[i], df['ppd'].iloc[i]])) / (index + 1)
            aveZonC = (aveZonC * index + np.array([df['true_ZoneC'].iloc[i], df['zone_c'].iloc[i]])) / (index + 1)
            index += 1
        else:
            points[date] = {
                "sumEnergy": (sumEnergy * 96).tolist(),
                "averPPD": averPPD.tolist(),
                "aveZonC": aveZonC.tolist()
            }
            sumEnergy = np.array([df['true_EnergyCons'].iloc[i], df['energy'].iloc[i]])
            averPPD = np.array([df['true_PPD'].iloc[i], df['ppd'].iloc[i]])
            aveZonC = np.array([df['true_ZoneC'].iloc[i], df['zone_c'].iloc[i]])
            date = df['datetime'].iloc[i].date()
            index = 1
    points[date] = {
        "sumEnergy": (sumEnergy * 96).tolist(),
        "averPPD": averPPD.tolist(),
        "aveZonC": aveZonC.tolist()
    }
    return points

def getTimeGap(obj, period, times, format):
    gaps = []
    for i in range(len(times)):
        gaps.append(-period <= (datetime.strptime(str(times[i]), format) - obj).days < 0)
    return gaps

def dfInterpolate(df):
    df.set_index('datetime', inplace=True)
    df['datetime'] = df.index
    full_index = pd.date_range(df.index.min(), df.index.max(), freq='15min')
    full_index = [dt.strftime('%Y-%m-%d %H:%M:%S') for dt in full_index]
    df = df.reindex(full_index)
    df = df.infer_objects()
    df = df.interpolate(method='linear', limit_direction='forward', axis=0)
    df.drop(columns=['datetime', 'month', 'day_of_week', 'hour', '3-hours', 'day_time'], inplace=True)
    df.to_csv('filled_stats.csv', index=True)
    return df

@app.get("/health", response_class=PlainTextResponse)
async def health_check():
    return "OK -- CICD 2 TEST PYTHON BE"

@app.get("/getValues")
def read_get_values(datetime_str: str = Query(..., alias='datetime'), period: int = Query(1)):
    stats_df = pd.read_csv('filled_stats.csv')
    # baseline, RL, rate, enerCons = getValues(stats_df, datetime_str, period)
    baseline, RL, rate, enerCons, df_graph = getValues(stats_df, datetime_str, period)
    return {
        "baseline": baseline,
        "RL": RL,
        "rate": rate,
        "energyConsumption": enerCons,
        "df_graph": df_graph
    }

@app.get("/plotGraph")
def read_plot_graph(startdate: str =Query(..., alias='startdate'), enddate: str = Query(..., alias='enddate')):
    stats_df = pd.read_csv('filled_stats.csv')
    points = plotGraph(stats_df, startdate, enddate)
    return points

@app.websocket("/ws/getValues")
async def websocket_get_values(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            datetime_str = data.get("datetime")
            period = data.get("period", 1)
            stats_df = pd.read_csv('filled_stats.csv')
            baseline, RL, rate, enerCons, df_graph = getValues(stats_df, datetime_str, period)
            await websocket.send_json({
                "baseline": baseline,
                "RL": RL,
                "rate": rate,
                "energyConsumption": enerCons,
                "df_graph": df_graph
            })
    except WebSocketDisconnect:
        print("WebSocket disconnected")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
