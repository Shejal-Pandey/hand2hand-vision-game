
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import GameEngine from './components/GameEngine';
import History from './components/History';
import SettingsPage from './components/Settings';
import CyberBackground from './components/CyberBackground';
import { AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
    const [currentView, setCurrentView] = useState('HOME');
    const [history, setHistory] = useState([]);

    // Load settings from localStorage or default
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('h2h_settings');
        return saved ? JSON.parse(saved) : { audio: true, graphics: 'HIGH' };
    });

    // Save changes to localStorage automatically
    const handleUpdateSettings = (newSettings) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem('h2h_settings', JSON.stringify(updated));
            return updated;
        });
    };

    const handleStartGame = () => {
        setCurrentView('GAME');
    };

    const handleExitGame = () => {
        setCurrentView('HOME');
    };

    const handleSaveHistory = (entry) => {
        setHistory(prev => [entry, ...prev]);
    };

    const handleClearHistory = () => {
        setHistory([]);
    };

    return (
        <div className="h-screen w-screen bg-black text-white overflow-hidden relative font-sans">

            {/* Global Background */}
            <CyberBackground />

            {/* Global Navbar (Hidden during Gameplay to avoid distractions) */}
            {currentView !== 'GAME' && (
                <Navbar
                    currentView={currentView}
                    onViewChange={setCurrentView}
                />
            )}

            {/* Main Content Area */}
            <AnimatePresence mode="wait">
                {currentView === 'HOME' && (
                    <Home key="home" onStart={handleStartGame} />
                )}

                {currentView === 'GAME' && (
                    <div key="game" className="absolute inset-0 z-20">
                        <GameEngine
                            onExit={handleExitGame}
                            onSaveHistory={handleSaveHistory}
                            settings={settings}
                        />
                    </div>
                )}

                {currentView === 'HISTORY' && (
                    <History
                        key="history"
                        history={history}
                        onBack={() => setCurrentView('HOME')}
                    />
                )}

                {currentView === 'SETTINGS' && (
                    <SettingsPage
                        key="settings"
                        localSettings={settings}
                        onUpdateSettings={handleUpdateSettings}
                        onClearHistory={handleClearHistory}
                    />
                )}
            </AnimatePresence>

        </div>
    );
}

export default App;
