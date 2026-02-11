
import React from 'react';
import { Database, Settings, Home } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = ({ onViewChange, currentView }) => {
    const navItems = [
        { id: 'HOME', label: 'Home', icon: Home },
        { id: 'HISTORY', label: 'History', icon: Database },
        { id: 'SETTINGS', label: 'Settings', icon: Settings },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 pointer-events-none flex justify-center">
            <div className="bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-full px-8 py-3 flex justify-between items-center pointer-events-auto shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] max-w-2xl w-full">
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onViewChange('HOME')}>
                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center border border-white/10 shadow-inner group-hover:border-white/30 transition-colors overflow-hidden">
                        <img src={logo} className="w-full h-full object-cover scale-150 rounded-md opacity-90 group-hover:opacity-100 transition-opacity" alt="H2H" />
                    </div>
                </div>

                {/* Nav Items */}
                <div className="flex gap-1">
                    {navItems.map((item) => {
                        const isActive = currentView === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onViewChange(item.id)}
                                className={`
                                    relative px-5 py-2 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 transition-all duration-300
                                    ${isActive
                                        ? 'bg-white text-black shadow-lg shadow-white/10'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }
                                `}
                            >
                                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : ''}`} />
                                <span className="">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
