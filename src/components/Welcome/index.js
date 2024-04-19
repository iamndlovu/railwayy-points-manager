import React, { useState } from 'react';
import styles from './Welcome.module.scss';
import Login from '../Login';

const Welcome = ({ handler }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);

  const toggleLoginForm = () => setShowLoginForm((oldState) => !oldState);

  return (
    <>
      <header className={styles.appHeader}>
        <div className={`${styles.container} center column`}>
          <h1 className={`${styles.appName} text-center`}>
            RAILROAD POINTS STATUS WARNING SYSTEM
          </h1>
          <section className={styles.appCta}>
            <button
              className='btn cta-btn btn-primary'
              onClick={() => setShowLoginForm(true)}
            >
              LOGIN
            </button>
            <button className='btn cta-btn btn-primary'>SIGNUP</button>
          </section>
        </div>
      </header>
      <Login handler={handler} show={showLoginForm} toggle={toggleLoginForm} />
    </>
  );
};

export default Welcome;
