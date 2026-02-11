
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Volume2, VolumeX, Database, AlertTriangle } from 'lucide-react';

const SettingsPage = ({ localSettings, onUpdateSettings, onClearHistory }) => {
    const { audio, graphics } = localSettings || { audio: true, graphics: 'HIGH' };

    const toggleAudio = () => {
        onUpdateSettings({ audio: !audio });
    };

    const setGraphics = (val) => {
        onUpdateSettings({ graphics: val });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
            className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pt-32 pb-12 px-6"
        >
            <div className="figma-card card-purple max-w-2xl w-full p-12 flex flex-col gap-10 shadow-[0_20px_100px_rgba(0,0,0,0.8)] z-10">

                <div className="flex items-center gap-6 mb-4 border-b border-white/5 pb-8 relative z-10">
                    <div className="w-16 h-16 bg-[#8b5cf6]/10 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                        <Settings className="w-8 h-8 text-[#a78bfa] animate-[spin_10s_linear_infinite]" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black tracking-tight text-white mb-1">System Settings</h2>
                        <p className="text-gray-500 text-sm font-medium tracking-wide">Configure AI Interaction Parameters</p>
                    </div>
                </div>

                {/* Audio Section */}
                <div className="relative z-10 bg-white/5 rounded-2xl p-6 flex justify-between items-center group hover:bg-white/8 transition-colors cursor-pointer border border-white/5 shadow-sm" onClick={toggleAudio}>
                    <div className="flex flex-col gap-1">
                        <span className="text-lg font-bold text-white flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${audio ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                {audio ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                            </div>
                            Audio Output
                        </span>
                        <span className="text-xs text-gray-500 font-medium ml-12">Synthesized Voice & Sfx</span>
                    </div>

                    <div className={`w-14 h-8 rounded-full p-1 transition-all border border-white/10 ${audio ? 'bg-purple-600 shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-gray-800'}`}>
                        <motion.div
                            animate={{ x: audio ? 24 : 0 }}
                            className="w-6 h-6 rounded-full shadow-md bg-white"
                        />
                    </div>
                </div>

                {/* Graphics Section */}
                <div className="relative z-10 bg-white/5 rounded-2xl p-6 flex justify-between items-center group border border-white/5">
                    <div className="flex flex-col gap-1">
                        <span className="text-lg font-bold text-white ml-2">Visual Fidelity</span>
                        <span className="text-xs text-gray-500 font-medium ml-2">Rendering Quality</span>
                    </div>
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                        {['LOW', 'MED', 'HIGH'].map(q => (
                            <button
                                key={q}
                                onClick={() => setGraphics(q)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${graphics === q
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="relative z-10 mt-8 pt-8 border-t border-white/5">
                    <button
                        onClick={() => {
                            if (window.confirm('WARNING: IRREVERSIBLE ACTION. CLEAR ALL MATCH DATA?')) {
                                onClearHistory();
                            }
                        }}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-4 rounded-xl flex items-center justify-center gap-3 transition-all font-bold text-sm group"
                    >
                        <AlertTriangle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Purge All Data
                    </button>
                </div>

                <div className="absolute bottom-6 right-8 text-[10px] text-gray-700 font-bold tracking-widest z-10">
                    v.2.0.4 // PRO
                </div>
            </div>
        </motion.div>
    );
};

export default SettingsPage;
