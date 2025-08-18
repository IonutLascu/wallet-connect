import React, { useState, useEffect } from 'react';
import { fetchSettings } from '../services/api';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        setSettings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!settings) return <div>No settings found</div>;

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="settings-grid">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="setting-item">
            <label>{key}:</label>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}