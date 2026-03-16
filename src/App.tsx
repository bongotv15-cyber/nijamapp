import React from 'react';
import { AppProvider, useAppContext } from './AppContext';
import HomeScreen from './components/HomeScreen';
import AddScreen from './components/AddScreen';
import TransactionScreen from './components/TransactionScreen';
import ShareScreen from './components/ShareScreen';
import ReportScreen from './components/ReportScreen';

function ScreenManager() {
  const { currentScreen } = useAppContext();

  return (
    <div className="app-container">
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'add' && <AddScreen />}
      {currentScreen === 'transaction' && <TransactionScreen />}
      {currentScreen === 'share' && <ShareScreen />}
      {currentScreen === 'report' && <ReportScreen />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ScreenManager />
    </AppProvider>
  );
}
