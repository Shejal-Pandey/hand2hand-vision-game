
import React, { useState, useEffect, useRef } from 'react';
import Scanner from './Scanner';
import AICore from './AICore';
import { MOVES, GAME_STATES, determineWinner, getRandomMove, MOVE_EMOJIS } from '../utils';
import { useAudio } from '../hooks/useAudio';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, User, Shield, Trophy, Zap, Home } from 'lucide-react';
import '../App.css';

function GameEngine({ onExit, onSaveHistory, settings }) {
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  const [userName, setUserName] = useState('');
  const [currentRound, setCurrentRound] = useState(1);
  const [scores, setScores] = useState({ user: 0, cpu: 0 });
  const [history, setHistory] = useState([]);
  const [userGesture, setUserGesture] = useState(MOVES.NONE);
  const [countdown, setCountdown] = useState(null);
  const [roundResult, setRoundResult] = useState(null);
  const [cpuMove, setCpuMove] = useState(MOVES.NONE);
  const [glitch, setGlitch] = useState(false);

  const maxRounds = 5;
  const historyRef = useRef([]);

  const { playSound: rawPlaySound, speak: rawSpeak } = useAudio();

  const playSound = (type) => {
    if (settings?.audio !== false) rawPlaySound(type);
  };

  const speak = (text) => {
    if (settings?.audio !== false) rawSpeak(text);
  };

  useEffect(() => {
    if (gameState === GAME_STATES.IDLE) {
      playSound('scan');
    }
  }, []);

  useEffect(() => {
    if (gameState === GAME_STATES.COUNTDOWN) {
      if (countdown === 3) {
        speak(`Round ${currentRound}. Get Ready.`);
      }
      if (countdown > 0) {
        playSound('countdown');
      }
    }
  }, [countdown, gameState, currentRound]);

  const handleStartGame = () => {
    if (!userName.trim()) return;
    playSound('click');
    playSound('fight');
    setGameState(GAME_STATES.COUNTDOWN);
    setCurrentRound(1);
    setScores({ user: 0, cpu: 0 });
    setHistory([]);
    historyRef.current = [];
    startRound();
  };

  const cpuMoveRef = useRef(MOVES.NONE);

  const startRound = () => {
    setRoundResult(null);
    setCpuMove(MOVES.NONE);
    let nextMove = getRandomMove();

    const currentHistory = historyRef.current;
    if (currentHistory.length >= 2) {
      const last1 = currentHistory[currentHistory.length - 1].cpu;
      const last2 = currentHistory[currentHistory.length - 2].cpu;

      if (last1 === last2) {
        while (nextMove === last1) {
          nextMove = getRandomMove();
        }
      }
    }

    cpuMoveRef.current = nextMove;
    setCountdown(3);
  };

  useEffect(() => {
    let timer;
    if (gameState === GAME_STATES.COUNTDOWN && countdown !== null) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        handleRoundEnd();
      }
    }
    return () => clearTimeout(timer);
  }, [countdown, gameState]);

  const handleRoundEnd = () => {
    let finalCpu = cpuMoveRef.current;
    if (!finalCpu || finalCpu === MOVES.NONE) {
      finalCpu = getRandomMove();
      cpuMoveRef.current = finalCpu;
    }

    const result = determineWinner(userGesture, finalCpu);
    setCpuMove(finalCpu);

    let newScores = { ...scores };
    let winnerName = 'Tie';

    if (result === 'user') {
      newScores.user += 1;
      winnerName = userName;
      playSound('win');
      speak('You Win');
    } else if (result === 'cpu') {
      newScores.cpu += 1;
      winnerName = 'CPU';
      playSound('lose');
      speak('System Win');
      triggerGlitch();
    } else {
      speak('Draw');
    }
    setScores(newScores);
    setRoundResult({ winner: result, userMove: userGesture, cpuMove: finalCpu });

    const historyEntry = {
      round: currentRound,
      user: userGesture,
      cpu: finalCpu,
      winner: winnerName,
      timestamp: new Date().toISOString()
    };

    onSaveHistory(historyEntry);
    setHistory(prev => [...prev, historyEntry]);
    historyRef.current = [...historyRef.current, historyEntry];

    setGameState(GAME_STATES.RESULT);

    setTimeout(() => {
      if (currentRound < maxRounds) {
        setCurrentRound(c => c + 1);
        setGameState(GAME_STATES.COUNTDOWN);
        startRound();
      } else {
        setGameState(GAME_STATES.FINISHED);
        if (newScores.user > newScores.cpu) {
          speak(`Game Over. ${userName} Wins.`);
        } else if (newScores.cpu > newScores.user) {
          speak("Game Over. System Wins.");
        } else {
          speak("Game Over. It is a Draw.");
        }
      }
    }, 3000);
  };

  const triggerGlitch = () => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 300);
  };

  const handleGestureUpdate = (gesture) => {
    if (gameState === GAME_STATES.COUNTDOWN || gameState === GAME_STATES.PLAYING) {
      let mapped = MOVES.NONE;
      if (gesture === 'Closed_Fist') mapped = MOVES.ROCK;
      if (gesture === 'Open_Palm') mapped = MOVES.PAPER;
      if (gesture === 'Victory') mapped = MOVES.SCISSORS;

      setUserGesture(mapped);
    }
  };

  const resetGame = () => {
    playSound('click');
    setGameState(GAME_STATES.IDLE);
    setUserName('');
    if (onExit) onExit();
  };

  return (
    <div className={`h-full w-full bg-transparent text-white flex flex-col relative overflow-hidden ${glitch ? 'animate-glitch' : ''}`}>

      {glitch && <div className="absolute inset-0 bg-red-500/10 z-50 pointer-events-none mix-blend-overlay"></div>}

      <header className="z-10 p-6 flex justify-between items-center m-4">
      </header>

      {gameState !== GAME_STATES.IDLE && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex gap-8 text-sm font-bold tracking-wide bg-black/80 backdrop-blur-xl px-8 py-3 rounded-full border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase">Player</span>
            <span className="text-white text-xl">{scores.user}</span>
          </div>
          <div className="w-px bg-white/10 h-8"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase">Round</span>
            <span className="text-white text-xl">{currentRound}<span className="text-gray-600 text-sm">/{maxRounds}</span></span>
          </div>
          <div className="w-px bg-white/10 h-8"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase">System</span>
            <span className="text-red-500 text-xl">{scores.cpu}</span>
          </div>
        </div>
      )}

      {gameState !== GAME_STATES.IDLE && (
        <button
          onClick={resetGame}
          className="absolute top-8 right-8 z-50 bg-black hover:bg-white/10 text-white p-3 rounded-full border border-white/10 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      )}

      <main className="z-10 flex-1 flex items-center justify-center p-4 gap-4">

        {gameState === GAME_STATES.IDLE && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="figma-card card-purple p-16 flex flex-col items-center gap-8 max-w-md w-full shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
          >
            <div className="text-center">
              <h2 className="text-3xl font-black text-white mb-2">Identify Yourself</h2>
              <p className="text-gray-400 text-sm">Enter operator credentials to begin.</p>
            </div>

            <div className="w-full relative group">
              <User className="absolute left-4 top-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="text"
                placeholder="Operator ID"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all font-medium text-white placeholder:text-gray-600"
              />
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleStartGame}
                disabled={!userName}
                className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 px-8 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/10 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" /> Start Session
              </button>

              <button
                onClick={resetGame}
                className="w-full text-gray-500 hover:text-white font-medium py-2 transition-colors text-sm flex items-center justify-center gap-2"
              >
                Cancel and Return
              </button>
            </div>
          </motion.div>
        )}

        {(gameState === GAME_STATES.COUNTDOWN || gameState === GAME_STATES.RESULT || gameState === GAME_STATES.FINISHED) && (
          <div className="flex w-full h-full gap-8 max-w-7xl items-center">

            {/* Left: AI Core */}
            <div className={`flex-1 figma-card card-blue h-[60vh] flex flex-col items-center justify-center relative p-8 transition-colors duration-500 ${roundResult?.winner === 'cpu' ? 'border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : ''}`}>
              <h3 className="absolute top-8 text-center font-bold text-gray-500 text-xs uppercase tracking-widest">
                System Core
              </h3>
              <div className="scale-150">
                <AICore
                  state={gameState === GAME_STATES.COUNTDOWN ? 'THINKING' : roundResult?.winner === 'cpu' ? 'WIN' : 'LOSE'}
                  move={cpuMove === MOVES.NONE ? '...' : MOVE_EMOJIS[cpuMove]}
                />
              </div>
              {gameState === GAME_STATES.RESULT && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  className="mt-12 text-2xl font-black text-white tracking-wider uppercase bg-white/5 px-6 py-2 rounded-lg border border-white/5"
                >
                  {cpuMove.replace('_', ' ')}
                </motion.div>
              )}
            </div>

            {/* Center: Countdown */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none w-full flex justify-center">
              <AnimatePresence mode="wait">
                {gameState === GAME_STATES.COUNTDOWN && countdown > 0 && (
                  <motion.div
                    key={countdown}
                    initial={{ scale: 1.5, opacity: 0, rotate: -5 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
                    className="text-[10rem] font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                  >
                    {countdown}
                  </motion.div>
                )}

                {gameState === GAME_STATES.RESULT && roundResult && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0 }}
                    className="px-12 py-6 rounded-2xl bg-black/90 border border-white/20 backdrop-blur-xl shadow-2xl"
                  >
                    <span className={`text-5xl font-black uppercase ${roundResult.winner === 'user' ? 'text-emerald-400' :
                      roundResult.winner === 'cpu' ? 'text-red-500' :
                        'text-amber-400'
                      }`}>
                      {roundResult.winner === 'user' ? 'Victory' : roundResult.winner === 'cpu' ? 'Defeat' : 'Draw'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: User Scanner */}
            <div className={`flex-1 h-[60vh] rounded-[24px] overflow-hidden relative border border-white/10 shadow-2xl transition-all duration-500 bg-black ${roundResult?.winner === 'user' ? 'border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.2)]' : ''}`}>
              <Scanner onGestureUpdate={handleGestureUpdate} />

              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                <div className="flex flex-col items-center">
                  <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mb-1">Detected</span>
                  <span className="text-4xl filter drop-shadow-lg">{MOVE_EMOJIS[userGesture] || '...'}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {gameState === GAME_STATES.FINISHED && (
          <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="figma-card card-orange max-w-2xl w-full p-12 flex flex-col items-center gap-8 shadow-[0_0_100px_rgba(0,0,0,1)]"
            >
              <Trophy className={`w-20 h-20 ${scores.user > scores.cpu ? 'text-yellow-400' : 'text-gray-600'}`} />

              <div className="text-center">
                <h2 className="text-5xl font-black mb-2 text-white uppercase text-center">
                  {scores.user > scores.cpu ? `${userName} Wins` : scores.user < scores.cpu ? 'System Wins' : 'Match Draw'}
                </h2>
                <div className="flex justify-center gap-6 text-3xl font-bold font-mono mt-4 text-gray-500">
                  <span className="text-white">{scores.user}</span> - <span className="text-white">{scores.cpu}</span>
                </div>
              </div>

              <div className="flex gap-4 w-full mt-4">
                <button
                  onClick={handleStartGame}
                  className="flex-1 bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-full transition-colors shadow-lg shadow-white/10"
                >
                  Restart
                </button>
                <button
                  onClick={resetGame}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-4 rounded-full transition-colors"
                >
                  Home
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </main>
    </div>
  );
}

export default GameEngine;
