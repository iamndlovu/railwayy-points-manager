import React from 'react';
import styles from './Dashboard.module.scss';
import DashboardHeader from './DashboardHeader';

const Dashboard = ({ user, handler }) => {
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
            <article>
              <table className={`article-container`}>
                <thead className={`article-header`}>
                  <tr>
                    <h3>Point A</h3>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Status:</td>
                    <td>Securely Aligned{/* in mootion / stuck */}</td>
                  </tr>
                  <tr>
                    <td>Safe Route:</td>
                    <td>
                      Station A - Station B
                      {/* station-station / station-point / point-point */}
                    </td>
                  </tr>
                  <tr>
                    <td>Last Fault:</td>
                    <td>{new Date().toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </article>

            <article>
              <table className={`article-container`}>
                <thead className={`article-header`}>
                  <tr>
                    <h3>Point B</h3>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Status:</td>
                    <td>Securely Aligned{/* in mootion / stuck */}</td>
                  </tr>
                  <tr>
                    <td>Safe Route:</td>
                    <td>
                      Station A - Station B
                      {/* station-station / station-point / point-point */}
                    </td>
                  </tr>
                  <tr>
                    <td>Last Fault:</td>
                    <td>{new Date().toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </article>

            <article>
              <table className={`article-container`}>
                <thead className={`article-header`}>
                  <tr>
                    <h3>Point C</h3>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Status:</td>
                    <td>Securely Aligned{/* in mootion / stuck */}</td>
                  </tr>
                  <tr>
                    <td>Safe Route:</td>
                    <td>
                      Station A - Station B
                      {/* station-station / station-point / point-point */}
                    </td>
                  </tr>
                  <tr>
                    <td>Last Fault:</td>
                    <td>{new Date().toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </article>
          </div>
        </section>
        {/* MAINTENANCE SECTION */}
        <section
          className={`${styles.maintenanceData} column center app-section`}
        >
          <div className={`section-header`}>
            <h2>Maintenance Data</h2>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
