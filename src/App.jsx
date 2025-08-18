import React from 'react';
import TokenSaleWidget from './components/TokenSaleWidget';
import useSettings from './hooks/useSettings';
import './styles/style.css';
import AdminSettings from './components/AdminSettings';

const App = () => {
  const { settings, loading, error } = useSettings();

  // render admin page when path starts with /admin
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    return <AdminSettings />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading settings: {error.message}</div>;
  }

  return (
    <div id="app">
      <TokenSaleWidget settings={settings} />
      da ce ti-am facut ma?
    </div>
  );
};

export default App;