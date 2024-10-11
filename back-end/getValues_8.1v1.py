import argparse
import pandas as pd
# from utils import getValues
from datetime import datetime
from datetime import timedelta


def main(args):
    if args.currentTime:
        pass
    else:
        stats_df = pd.read_csv('filled_stats.csv')
        # stats_df = pd.read_csv('stats.csv')
        # stats_df = dfInterpolate(stats_df)
        print(getValues(stats_df, args.datetime, args.period))

    input("\nPress enter to exit")

def getValues(df, datetime_str, period):

    # Get datapoints
    format = "%Y-%m-%d %H:%M:%S"
    obj = datetime.strptime(datetime_str, format) 
    df = df.loc[getTimeGap(obj, period, df.datetime, format)]
    # df_graph = getPoints(df, obj, format)
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

    return baseline, RL, rate, enerCons, df[-96:]


def getPoints(df, obj, format):
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
    gaps = []

    for i in range(len(times)):
        gaps.append(-period <= (datetime.strptime(times[i], format) - obj).days < 0)

    
    return gaps

def dfInterpolate(df):

    df.set_index('datetime', inplace = True)
    df['datetime'] = df.index
    full_index = pd.date_range(df.index.min(), df.index.max(), freq = '15min')
    full_index = [dt.strftime('%Y-%m-%d %H:%M:%S') for dt in full_index]  
    df = df.reindex(full_index, )

    df = df.infer_objects()
    df = df.interpolate(method='linear', limit_direction='forward', axis=0)
    df.drop(columns=['datetime', 'month', 'day_of_week', 'hour', '3-hours', 'day_time'], inplace=True)
    # df.datetime = df.index
    df.to_csv('filled_stats.csv', index=True)
    print(df.loc[df.index == '2022-06-01 02:15:00'].true_EnergyCons)

    return df

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='DDPG policy evaluation for AHU Env')
    parser.add_argument('--datetime', type=str, default="2022-06-02 00:15:00",
                        help='Time of evaluation (default: 2022-06-02 00:00:00)')
    parser.add_argument('--currentTime', type=bool, default=False,
                        help='Current time (default: False)')
    parser.add_argument('--period', type=int, default=1,
                        help='Period of evaluation (default: 1)')
    args = parser.parse_args()

    main(args)
