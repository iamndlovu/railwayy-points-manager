import React from 'react';
import styles from './DashboardHeader.module.scss';

const DashboardHeader = ({ handler, user }) => {
  return (
    <header className={`${styles.dashHeader} center`}>
      <div className={styles.headerContainer}>
        <section className={`${styles.userSection} hidden`}>
          <div className={styles.loggedUser} style={{ cursor: 'default' }}>
            Logged In as:&nbsp;{user.username}
          </div>
          <div>
            <button
              className='btn btn-primary btn-no-fill'
              style={{
                borderWidth: '2px',
                fontWeight: '400',
                fontSize: '0.9rem',
                padding: '0.3rem 0.8rem',
                cursor: 'default',
              }}
            >
              Logout
            </button>
          </div>
        </section>
        <h1 className='text-center'>RAILROAD POINTS STATUS WARNING SYSTEM</h1>
        <section className={styles.userSection}>
          <div className={styles.loggedUser}>
            Logged In as:&nbsp;{user.username}
          </div>
          <div className={styles.action}>
            <button
              onClick={() => handler()}
              className='btn btn-primary btn-no-fill'
              style={{
                border: '2px solid white',
                fontWeight: '400',
                fontSize: '0.9rem',
                padding: '0.1rem 0.8rem',
                color: 'white',
              }}
            >
              LOGOUT
            </button>
          </div>
        </section>
      </div>
    </header>
  );
};

export default DashboardHeader;
