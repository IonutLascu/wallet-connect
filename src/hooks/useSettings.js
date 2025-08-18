import { useEffect, useState } from 'react';
import { fetchSettings } from '../services/api';

const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const cfg = await fetchSettings();
        setSettings(cfg);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return { settings, loading, error };
};

export default useSettings;