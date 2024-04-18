import React from 'react';
import styles from './Welcome.module.scss';

const Welcome = () => {
  return (
    <header className={styles.appHeader}>
      <div className={`${styles.container} center column`}>
        <h1 className={`${styles.appName} text-center`}>
          RAILROAD POINTS STATUS WARNING SYSTEM
        </h1>
        <section className={styles.appCta}>
          <button className='btn cta-btn btn-primary'>LOGIN</button>
          <button className='btn cta-btn btn-primary'>SIGNUP</button>
        </section>
      </div>
    </header>
  );
};

export default Welcome;
