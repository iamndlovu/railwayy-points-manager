// import axios from 'axios';
import React, { useEffect, useState } from 'react';

import styles from './LoginForm.module.scss';

const LoginForm = ({ handler, show, toggle }) => {
  const [users, setUsers] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // axios.get('http://localhost:5000/users').then((res) => setUsers(res.data));
    setUsers([
      {
        fullName: 'Administrator',
        username: 'Admin',
        email: 'admin@example.mail',
        password: 'admin',
      },
    ]);
  }, []);

  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangePwd = (e) => setPassword(e.target.value);

  const submitForm = (e) => {
    e.preventDefault();

    for (let user of users) {
      if (user.email === email && user.password === password) {
        handler(user);
        return;
      }
    }

    alert('Wrong email or password');
  };

  return (
    <form
      className={`${styles.LoginForm} ${!show && styles.hide}`}
      onSubmit={submitForm}
    >
      <button className={styles.closeBtn} onClick={() => toggle()}>
        X
      </button>
      <div className={styles.formGroup}>
        <label htmlFor='email' className={styles.offscreen}>
          Your email address
        </label>
        <input
          type='email'
          name='email'
          id='email'
          placeholder='Email'
          value={email}
          onChange={onChangeEmail}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='password' className={styles.offscreen}>
          Your password
        </label>
        <input
          type='password'
          name='password'
          id='password'
          placeholder='Password'
          value={password}
          onChange={onChangePwd}
          required
        />
      </div>
      <input type='submit' value='LOGIN' />
    </form>
  );
};

export default LoginForm;
