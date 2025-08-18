import React from 'react';
import TokenSaleWidget from './components/TokenSaleWidget';
import useSettings from './hooks/useSettings';
import './styles/style.css';

const App = () => {
  const { settings, loading, error } = useSettings();

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