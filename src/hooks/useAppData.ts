import { useState, useEffect } from 'react';
import { AppData } from '../types';

const STORAGE_KEY = 'rocketAppData';

const defaultData: AppData = {
  customers: {},
  transactions: {}
};

export function useAppData() {
  const [appData, setAppData] = useState<AppData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return defaultData;
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  }, [appData]);

  const updateAppData = (newData: AppData) => {
    setAppData(newData);
  };

  return { appData, updateAppData };
}
