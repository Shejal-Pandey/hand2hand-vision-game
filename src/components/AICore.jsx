
import React from 'react';
import { motion } from 'framer-motion';

const AICore = ({ state, move }) => {
    // state: 'IDLE', 'THINKING', 'WIN', 'LOSE'

    const coreColor =
        state === 'WIN' ? '#ef4444' : // Red (Evil/Angry)
            state === 'LOSE' ? '#3b82f6' : // Blue (Defeated/Calm)
                state === 'THINKING' ? '#eab308' : // Yellow (Processing)
                    '#ef4444'; // Red default

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Outer Rotating Rings */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute w-full h-full rounded-full border border-dashed border-red-500/30"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-56 h-56 rounded-full border border-dotted border-red-400/20"
            />

            {/* Main Core Pulse */}
            <motion.div
                animate={{
                    scale: state === 'THINKING' ? [1, 1.1, 1] : [1, 1.05, 1],
                    boxShadow: [
                        `0 0 20px ${coreColor}`,
                        `0 0 50px ${coreColor}`,
                        `0 0 20px ${coreColor}`
                    ]
                }}
                transition={{ duration: state === 'THINKING' ? 0.5 : 2, repeat: Infinity }}
                className="relative w-32 h-32 rounded-full bg-black border-4 flex items-center justify-center z-10"
                style={{ borderColor: coreColor }}
            >
                <div className="text-6xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                    {move === 'None' ? (
                        <div className="w-16 h-16 bg-red-500 rounded-full blur-xl opacity-50" />
                    ) : (
                        <span>{move}</span>
                    )}
                </div>

                {/* Glitch Lines */}
                <div className="absolute inset-0 overflow-hidden rounded-full opacity-30">
                    <div className="w-full h-1 bg-white/50 absolute top-10 animate-pulse"></div>
                    <div className="w-full h-1 bg-white/30 absolute bottom-10 animate-pulse delay-75"></div>
                </div>
            </motion.div>

            {/* HUD Lines */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-[10px] text-red-500/50 font-mono tracking-widest">
                SYS.CORE.V.9.0
            </div>
        </div>
    );
};

export default AICore;
