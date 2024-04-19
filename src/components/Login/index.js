import React from 'react';
import LoginForm from './LoginForm';
import styles from './Login.module.scss';

const Login = ({ handler, show, toggle }) => {
  return (
    <div className={`${styles.Login} ${!show && styles.hide} center`}>
      <LoginForm handler={handler} show={show} toggle={toggle} />
    </div>
  );
};

export default Login;
