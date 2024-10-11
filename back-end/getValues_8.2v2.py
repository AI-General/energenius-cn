import argparse
import pandas as pd
from datetime import datetime
from datetime import timedelta
import numpy as np


def main(args):
    if args.currentTime:
        # client want to see the result of the current status
        pass
    elif args.simulation:
        # plot the graphs on simulation page
        stats_df = pd.read_csv('filled_stats.csv')
        plotGraph(stats_df, args.startdate, args.enddate)
        pass
    else:
        stats_df = pd.read_csv('filled_stats.csv')
        # stats_df = pd.read_csv('results/stats.csv')
        # stats_df = dfInterpolate(stats_df)
        print(getValues(stats_df, args.datetime, args.period))
    input("\nPress enter to exit")

def plotGraph(df, startdate, enddate):

    # Identify the datetime is in between startdate and enddate
    format = "%Y-%m-%d"
    start = datetime.strptime(startdate, format)
    end = datetime.strptime(enddate, format)
    df['datetime'] = pd.to_datetime(df['datetime'], format="%Y-%m-%d %H:%M:%S")
    df = df.loc[(df.datetime >= start) & (df.datetime < end + timedelta(days=1))]

    # get values of points that should be ploted to the graphs
    points = dict()
    sumEnergy = np.array([df.true_EnergyCons[0], df.energy[0]])
    averPPD = np.array([df.true_PPD[0], df.ppd[0]])
    aveZonC = np.array([df.true_ZoneC[0], df.zone_c[0]])
    index = 1
    date = start.date()
    for i in range(1, len(df)):
        if df.datetime[i].date() == date:
            sumEnergy = (sumEnergy * index + np.array([df.true_EnergyCons[i], df.energy[i]])) / (index + 1)
            averPPD = (averPPD * index + np.array([df.true_PPD[i], df.ppd[i]])) / (index + 1)
            aveZonC = (aveZonC * index + np.array([df.true_ZoneC[i], df.zone_c[i]])) / (index + 1)
            index = index + 1
        else:
            points[date] = [sumEnergy * 96, averPPD, aveZonC]
            sumEnergy = np.array([df.true_EnergyCons[i], df.energy[i]])
            averPPD = np.array([df.true_PPD[i], df.ppd[i]])
            aveZonC = np.array([df.true_ZoneC[i], df.zone_c[i]])
            date = df.datetime[i].date()
            index = 1
    points[date] = [sumEnergy * 96, averPPD, aveZonC]
    print(points)
    return points

def getValues(df, datetime_str, period):

    # Get datapoints
    format = "%Y-%m-%d %H:%M:%S"
    obj = datetime.strptime(datetime_str, format) 
    df = df.loc[getTimeGap(obj, period, df.datetime, format)]
    enerCons = []
    # Calculate statistics
    daily_energy_stat = (df.true_EnergyCons.mean() - df.energy.mean()) * \
                    (100 / df.true_EnergyCons.mean())
    daily_ppd_stat = (df.true_PPD.mean() - df.ppd.mean()) * \
                    (100 / df.true_PPD.mean())
    daily_co2_stat = (df.true_ZoneC.mean() - df.zone_c.mean()) * \
                    (100 / df.true_ZoneC.mean())
    
    enerCons.append([sum(df.true_EnergyCons), df.true_EnergyCons.mean() * 96 * period])
    enerCons.append([sum(df.energy), df.energy.mean() * 96 * period])

    # Get values
    baseline = [df.true_EnergyCons.mean(), df.true_PPD.mean(), df.true_ZoneC.mean()]
    RL = [df.energy.mean(), df.ppd.mean(), df.zone_c.mean()]
    rate = [daily_energy_stat, daily_ppd_stat, daily_co2_stat]
    # df[-96:].to_csv('intermidate_result.csv', index=True)
    return baseline, RL, rate, enerCons, df[-96:]

def getPoints(df, obj, format):
    # set the Gap
    subItem = timedelta(seconds = 7200)
    df_graph = []
    init = obj + subItem 
    for i in range(12):
        string = (init - subItem).strftime(format)
        if string in df.datetime.tolist():
            df_graph.append(df[df.datetime == string])
        else: 
            df_graph.append(0)
        init = init - subItem
    df_graph.reverse()
    return df_graph

def getTimeGap(obj, period, times, format):
    # Indentify if the datetime is in active period
    gaps = []
    for i in range(len(times)):
        gaps.append(-period <= (datetime.strptime(times[i], format) - obj).days < 0)
    
    return gaps

def dfInterpolate(df):

    # Interpolate the missing data points
    df.set_index('datetime', inplace = True)
    df['datetime'] = df.index
    full_index = pd.date_range(df.index.min(), df.index.max(), freq = '15min')
    full_index = [dt.strftime('%Y-%m-%d %H:%M:%S') for dt in full_index]  
    df = df.reindex(full_index, )

    df = df.infer_objects()
    df = df.interpolate(method='linear', limit_direction='forward', axis=0)
    df.drop(columns=['datetime', 'month', 'day_of_week', 'hour', '3-hours', 'day_time'], inplace=True)
    df.to_csv('filled_stats.csv', index=True)

    return df

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='DDPG policy evaluation for AHU Env')
    parser.add_argument('--datetime', type=str, default="2022-06-06 00:00:00",
                        help='Time of evaluation (default: 2022-06-02 00:00:00)')
    parser.add_argument('--currentTime', type=bool, default=False,
                        help='Current time (default: False)')
    parser.add_argument('--period', type=int, default=1,
                        help='Period of evaluation (default: 1)')
    parser.add_argument('--simulation', type=bool, default=False,
                        help='simulation mode (default: False)')
    parser.add_argument('--startdate', type=str, default="2022-06-01",
                        help='Start date of the period (default: 2022-06-01)')
    parser.add_argument('--enddate', type=str, default="2022-06-2",
                        help='End date of the period (default: 2022-08-31)')
    args = parser.parse_args()

    main(args)
