import React from 'react';
import DashboardHeader from './DashboardHeader';
import ReportCard from '../ReportCard';
import styles from './Dashboard.module.scss';

const Dashboard = ({ user, handler }) => {
  /********************************************************************************
   *                                                                              *
   *  NB: FOR STATUS AND TIME TO FAULT                                            *
   *    0 -> SAFE                                                                 *
   *    1 -> WARNING                                                              *
   *    2 -> DANGER                                                               *
   * _____________________________________________________________________________*
   *                                                                              *
   *  NB: FOR SAFE ROUTE, 0 & 1 INDICATE ONE OF THE TWO ROUTES,                   *
   *  2 MEANS NO ROUTE IS SAFE                                                    *
   * _____________________________________________________________________________*
   *                                                                              *
   *  NB: FOR ROUTES  ->  [right, left, none]                                     *
   *                                                                              *
   ********************************************************************************/

  // from DB
  const pointsData = [
    {
      pointName: 'point a',
      status: 0,
      routes: ['station a - station b', 'station a - point b', 'none'],
      safeRoute: 0,
      lastFault: new Date().toLocaleString(),
      timeToFault: 1,
      changeTime: 10,
    },
    {
      pointName: 'point b',
      status: 1,
      routes: ['point a - station c', 'point a - point c', 'none'],
      safeRoute: 3,
      lastFault: new Date().toLocaleString(),
      timeToFault: 2,
      changeTime: 3,
    },
    {
      pointName: 'point c',
      status: 2,
      routes: ['point b - station d', 'point b - station e', 'none'],
      safeRoute: 3,
      lastFault: new Date().toLocaleString(),
      timeToFault: 0,
      changeTime: 6,
    },
  ];

  //actual code starts here
  return (
    <div className={styles.Dashboard}>
      <DashboardHeader handler={handler} user={user} />
      {/* TODO: ALERT BANNER & ALERT SUMMARY */}
      <main className={`${styles.Main} center column`}>
        {/* POINTS STATUS */}
        <section className={`${styles.pointsStatus} column center app-section`}>
          <div className={`section-header`}>
            <h2>Points Status</h2>
          </div>
          <div className={`section-container center`}>
            {pointsData.map(
              ({ pointName, status, routes = [], safeRoute, lastFault }) => {
                let statusValue, indicator, route;
                switch (status) {
                  case 0:
                    statusValue = 'securely aligned';
                    indicator = 'box safe';
                    route = safeRoute;
                    break;
                  case 1:
                    statusValue = 'in motion';
                    indicator = 'box warning';
                    route = 2;
                    break;
                  case 2:
                    statusValue = 'misaligned / stuck';
                    indicator = 'box danger';
                    route = 2;
                    break;
                  default:
                    statusValue = 'unknown';
                    indicator = 'box danger';
                    route = 3;
                    break;
                }

                return (
                  <ReportCard
                    data={{
                      header: pointName,
                      tableItems: [
                        {
                          key: 'status',
                          value: statusValue,
                          indicator,
                        },
                        {
                          key: 'safe route',
                          value: routes[route] ? routes[route] : 'unknown',
                          indicator: route > 1 ? 'box danger' : undefined,
                        },
                        { key: 'last fault', value: lastFault },
                      ],
                    }}
                  />
                );
              }
            )}
          </div>
        </section>
        {/* MAINTENANCE SECTION */}
        <section
          className={`${styles.maintenanceData} column center app-section`}
        >
          <div className={`section-header`}>
            <h2>Maintenance Data</h2>
          </div>
          <div className={`section-container center`}>
            {/* TIME TO FAULT */}
            {(() => {
              let tableItems = [];

              pointsData.forEach(({ pointName, timeToFault }) => {
                let timeToFaultValue = '',
                  indicator = '';
                switch (timeToFault) {
                  case 0:
                    timeToFaultValue = '> 4 months';
                    indicator = 'box safe';
                    break;

                  case 1:
                    timeToFaultValue = '1 - 4 months';
                    indicator = 'box warning';
                    break;

                  case 2:
                    timeToFaultValue = '< 1 month';
                    indicator = 'box danger';
                    break;

                  default:
                    timeToFaultValue = 'unknown';
                    indicator = 'box danger';
                    break;
                }

                tableItems.push({
                  key: pointName,
                  value: timeToFaultValue,
                  indicator,
                });
              });

              const data = {
                header: 'time to fault',
                tableItems,
              };

              return <ReportCard data={data} />;
            })()}

            {/* CHANGE TIME */}
            {(() => {
              let tableItems = [];

              pointsData.forEach(({ pointName, changeTime }) => {
                let indicator = '';

                if (changeTime >= 10 || changeTime <= 0.5)
                  indicator = 'box danger';
                else if (changeTime >= 5 && changeTime < 10)
                  indicator = 'box warning';
                else indicator = 'box safe';

                tableItems.push({
                  key: pointName,
                  value: changeTime + ' min',
                  indicator,
                });
              });

              const data = {
                header: 'current change time',
                tableItems,
              };

              return <ReportCard data={data} />;
            })()}
            <ReportCard />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
