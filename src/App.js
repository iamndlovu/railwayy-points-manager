import { useEffect, useState } from 'react';
import appData from './assets/data/appData.json';
import Dashboard from './components/Dashboard';
import Welcome from './components/Welcome';

const App = () => {
  const [user, setUser] = useState(null);
  const localStorageUserVariable = appData.localStorageUserVariable;

  const handleLogin = (_user) => {
    setUser(_user);
    localStorage.setItem(localStorageUserVariable, JSON.stringify(_user));
    return;
  };

  const handleLogout = () => {
    localStorage.removeItem(localStorageUserVariable);
    setUser(null);
    return;
  };

  // eslint-disable-next-line
  useEffect(() => {
    if (localStorage.getItem(localStorageUserVariable))
      setUser(JSON.parse(localStorage.getItem(localStorageUserVariable)));
  }, [localStorageUserVariable]);

  return (
    <div className='App'>
      {user ? (
        <Dashboard user={user} handler={handleLogout} />
      ) : (
        <Welcome handler={handleLogin} />
      )}
    </div>
  );
};

export default App;
