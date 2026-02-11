
import React from 'react';
import { motion } from 'framer-motion';
import { Database, Trash2, Clock, Play } from 'lucide-react';

const History = ({ history, onBack }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pt-32 pb-12 px-6"
        >
            <div className="figma-card card-blue max-w-5xl w-full h-full p-10 flex flex-col shadow-[0_20px_100px_rgba(0,0,0,0.8)] z-10 relative overflow-hidden">

                <div className="flex justify-between items-center mb-8 z-10 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                            <Database className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Match History</h2>
                    </div>
                    <div className="text-gray-500 font-medium text-xs bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                        Total Games: <span className="text-white ml-2">{history.length}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 z-10">
                    {history.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-6">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                                <Database className="w-8 h-8 text-gray-600" />
                            </div>
                            <p className="font-medium text-sm">No archives found.</p>
                            <button onClick={onBack} className="bg-white text-black font-bold px-8 py-3 rounded-full hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 flex items-center gap-2">
                                <Play className="w-4 h-4 fill-current" /> Start Mission
                            </button>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-[#050505]/95 backdrop-blur-md z-20 border-b border-white/10">
                                <tr className="text-gray-500 font-bold text-xs uppercase tracking-wider">
                                    <th className="p-4 rounded-tl-xl text-center">Time</th>
                                    <th className="p-4 text-center">Round</th>
                                    <th className="p-4 text-white">Player</th>
                                    <th className="p-4 text-white">AI Core</th>
                                    <th className="p-4 rounded-tr-xl text-right">Result</th>
                                </tr>
                            </thead>
                            <tbody className="font-medium text-sm">
                                {history.map((h, i) => (
                                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="p-4 text-gray-500 group-hover:text-blue-400 transition-colors text-center w-32 font-mono text-xs">
                                            {h.timestamp ? new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                        </td>
                                        <td className="p-4 text-gray-600 font-mono text-xs text-center w-24">#{h.round}</td>
                                        <td className="p-4 text-white font-bold">{h.user}</td>
                                        <td className="p-4 text-gray-300 font-bold">{h.cpu}</td>
                                        <td className="p-4 text-right">
                                            <span className={`px-3 py-1 rounded-md text-xs font-bold border ${h.winner.includes('CPU') || h.winner === 'CPU'
                                                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                    : h.winner === 'Tie' || h.winner === 'Draw'
                                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                }`}>
                                                {h.winner === 'Tie' || h.winner === 'Draw' ? 'Draw' : h.winner === 'CPU' ? 'Loss' : 'Win'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default History;
