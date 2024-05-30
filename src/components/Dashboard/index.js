import axios from 'axios';
import React, { useEffect, useState } from 'react';
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

  const [pointsData, setPointsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRes = await axios.get('http://localhost:5000/point');
        setPointsData(dataRes.data);
      } catch (err) {
        console.error(`Failed to fetch data from server:\n\t\t${err}`);
      }
    };

    const fetchDataPeriodically = setInterval(() => fetchData(), 2000);

    return () => {
      clearInterval(fetchDataPeriodically);
    };
  }, []);

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
          <div
            className={`section-container center`}
            style={{ position: 'relative' }}
          >
            {pointsData.length > 0 &&
              pointsData[0].status === 0 &&
              pointsData[0].safeRoute < 2 && (
                <button
                  onClick={() => {
                    let data = 0;
                    if (pointsData[0].safeRoute === 0) data = 1;
                    else if (pointsData[0].safeRoute === 1) data = 0;

                    axios
                      .post('http://localhost:5000/point/direction', { data })
                      .then((res) => console.log(res.data));
                  }}
                  style={{
                    position: 'absolute',
                    left: '22.8rem',
                    top: '10.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {'< >'}
                </button>
              )}
            {pointsData.map(
              ({
                pointName,
                status,
                routes = [],
                safeRoute,
                lastFault,
                _id,
              }) => {
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

                if (!lastFault) {
                  if (status === 2) {
                    lastFault = new Date().toLocaleString();
                    axios.post(`http://localhost:5000/point/add-fault/${_id}`, {
                      data: lastFault,
                    });
                  } else {
                    lastFault = 'N/A';
                  }
                } else lastFault = new Date(lastFault).toLocaleString();

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
                          toggle:
                            route < 2 && pointName.toLowerCase() === 'point a',
                          toggleVals: [0, 1],
                          toggleCurrent: [0, 1].indexOf(route),
                          toggleUrl: 'http://localhost:5000/point/direction',
                        },
                        { key: 'last fault', value: lastFault },
                      ],
                    }}
                    key={_id}
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

              pointsData.forEach(({ pointName, changeTimes }) => {
                let timeToFaultValue = '',
                  timeToFault = 7,
                  indicator = '';
                const changeTime = Number(
                  (
                    changeTimes.reduce((a, b) => a + b, 0) / changeTimes.length
                  ).toFixed(1)
                );

                if (changeTime >= 11 || changeTime <= 2) timeToFault = 2;
                else if (
                  (changeTime > 2 && changeTime < 6) ||
                  (changeTime > 8 && changeTime < 11)
                )
                  timeToFault = 1;
                else timeToFault = 0;

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

              pointsData.forEach(({ pointName, changeTimes }) => {
                let indicator = '';
                const changeTime = Number(
                  (
                    changeTimes.reduce((a, b) => a + b, 0) / changeTimes.length
                  ).toFixed(1)
                );
                if (changeTime >= 11 || changeTime <= 2)
                  indicator = 'box danger';
                else if (
                  (changeTime > 2 && changeTime < 6) ||
                  (changeTime > 8 && changeTime < 11)
                )
                  indicator = 'box warning';
                else indicator = 'box safe';

                tableItems.push({
                  key: pointName,
                  value: changeTime + ' min',
                  indicator,
                });
              });

              const data = {
                header: 'average change time',
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
