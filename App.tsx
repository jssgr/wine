
import React, { useState } from 'react';
import { User, Role, TastingRecord } from './types';
import LoginPage from './components/LoginPage';
import TasterDashboard from './components/TasterDashboard';
import AdminDashboard from './components/AdminDashboard';
import { sampleTastingRecords } from './constants';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tastingRecords, setTastingRecords] = useState<TastingRecord[]>(sampleTastingRecords);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addTastingRecord = (record: TastingRecord) => {
    setTastingRecords(prevRecords => [record, ...prevRecords]);
  };

  const renderContent = () => {
    if (!currentUser) {
      return <LoginPage onLogin={handleLogin} />;
    }

    switch (currentUser.role) {
      case Role.TASTER:
        return <TasterDashboard user={currentUser} onLogout={handleLogout} onAddRecord={addTastingRecord} />;
      case Role.ADMIN:
        return <AdminDashboard user={currentUser} onLogout={handleLogout} records={tastingRecords} />;
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-800">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
