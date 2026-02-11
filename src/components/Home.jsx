
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Play, Globe, Shield, Zap, Terminal } from 'lucide-react';
import logo from '../assets/logo.png';

const Home = ({ onStart }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [0, window.innerHeight], [5, -5]);
    const rotateY = useTransform(x, [0, window.innerWidth], [-5, 5]);

    const [typedText, setTypedText] = useState('');
    const fullText = "SYSTEM_READY... LINK_ESTABLISHED... AI_CORE_ONLINE... WAITING...";

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setTypedText(fullText.slice(0, i));
            i++;
            if (i > fullText.length) i = fullText.length;
        }, 50);
        return () => clearInterval(interval);
    }, []);

    function handleMouse(event) {
        x.set(event.clientX);
        y.set(event.clientY);
    }

    return (
        <div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-8 z-10 perspective-1000 bg-black/40 backdrop-blur-sm"
            onMouseMove={handleMouse}
        >
            <motion.div
                className="relative w-full max-w-6xl h-[80vh] flex flex-col justify-between"
                style={{ rotateX, rotateY, perspective: 1000 }}
            >

                {/* Top Header - Minimalist */}
                <div className="flex justify-between items-start border-b border-white/5 pb-6 mb-6">
                    <div>
                        <motion.h1
                            initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                            className="text-6xl font-bold tracking-tight text-white drop-shadow-sm flex items-center gap-6"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            <div className="bg-white/5 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg overflow-hidden">
                                <img src={logo} className="w-20 h-20 object-cover rounded-xl scale-125" alt="Logo" />
                            </div>
                            <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                Hand2Hand
                            </span>
                        </motion.h1>
                        <div className="text-xs font-bold text-gray-500 tracking-[0.3em] mt-2 ml-2 uppercase">
                            AI-Powered Gesture Interface
                        </div>
                    </div>
                </div>

                {/* Main Content - Figma Style Cards Layout */}
                <div className="flex-1 flex flex-col md:flex-row gap-8 items-stretch justify-center py-4">

                    {/* Left Card: System Logs (Blue Glow) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="w-full md:w-1/3 flex flex-col figma-card card-blue p-8 relative group hover:scale-[1.02] transition-transform duration-500"
                    >
                        {/* Upper Content */}
                        <div className="relative z-10 flex-1">
                            <div className="bg-[#3b82f6]/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                                <Terminal className="w-6 h-6 text-[#3b82f6]" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">System Activity</h3>
                            <p className="text-gray-400 text-sm mb-6 max-w-[80%]">Real-time kernel logs from the vision engine.</p>

                            <div className="font-mono text-xs text-gray-300 leading-relaxed overflow-hidden h-32 opacity-80 border-l border-white/10 pl-3">
                                {typedText}<span className="animate-blink text-blue-400">|</span>
                            </div>
                        </div>

                        {/* Bottom Action (Visual Only) */}
                        <div className="relative z-10 mt-auto flex items-center gap-2 text-sm font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                            View Logs <span>→</span>
                        </div>
                    </motion.div>

                    {/* Center Card: Play Mission (Orange Glow) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="w-full md:w-1/3 flex flex-col figma-card card-orange p-8 relative group hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
                        onClick={onStart}
                    >
                        <div className="relative z-10 flex-1 flex flex-col items-center text-center justify-center pointer-events-none">
                            <div className="bg-[#f59e0b]/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                                <Play className="w-10 h-10 text-[#f59e0b] ml-1 fill-current" />
                            </div>

                            <h3 className="text-3xl font-black text-white mb-2">Start Mission</h3>
                            <p className="text-gray-400 text-sm mb-8">Initiate combat sequence vs AI Core.</p>

                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

                            <div className="flex gap-4 text-xs font-mono text-gray-500">
                                <span>server: active</span>
                                <span>latency: 12ms</span>
                            </div>
                        </div>

                        <div className="relative z-10 mt-auto flex justify-center w-full">
                            <button className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors shadow-lg shadow-orange-500/20 w-full group-hover:shadow-orange-500/40">
                                Launch Now
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Card: Data (Green/Emerald Glow) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="w-full md:w-1/3 flex flex-col figma-card card-green p-8 relative group hover:scale-[1.02] transition-transform duration-500"
                    >
                        <div className="relative z-10 flex-1">
                            <div className="bg-[#10b981]/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                                <Globe className="w-6 h-6 text-[#10b981]" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">Gesture Data</h3>
                            <p className="text-gray-400 text-sm mb-6">Analysis of hand geometry patterns.</p>

                            <div className="space-y-3">
                                {[
                                    { icon: '✊', name: 'Rock', color: 'text-gray-300' },
                                    { icon: '✋', name: 'Paper', color: 'text-gray-300' },
                                    { icon: '✌️', name: 'Scissors', color: 'text-gray-300' }
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                        <span className="text-lg">{item.icon} <span className={`text-sm font-bold ml-2 ${item.color}`}>{item.name}</span></span>
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative z-10 mt-auto flex items-center gap-2 text-sm font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                            View Database <span>→</span>
                        </div>
                    </motion.div>

                </div>

                {/* Footer Status */}
                <div className="flex justify-between items-end border-t border-white/5 pt-6 text-[10px] font-bold text-gray-600 tracking-wider">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2"><Zap className="w-3 h-3 text-white" /> Always Current</span>
                        <span className="flex items-center gap-2"><Shield className="w-3 h-3 text-white" /> Focused for You</span>
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default Home;
