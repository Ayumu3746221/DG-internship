import { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';

export const useApps = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getApps();
        
        if (Array.isArray(data)) {
          setApps(data);
        } else {
          console.warn('API response is not an array:', data);
          setApps([]);
        }
      } catch (err) {
        console.error('Error in useApps:', err);
        setError(err.message);
        setApps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  return { apps: Array.isArray(apps) ? apps : [], loading, error };
};