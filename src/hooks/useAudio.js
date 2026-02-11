
import { useEffect, useRef, useCallback } from 'react';

// Simple synthesizer for sci-fi UI sounds
const createOscillator = (ctx, type, frequency, duration, type2 = 'sine') => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
};

export const useAudio = () => {
    const audioCtx = useRef(null);

    useEffect(() => {
        // Initialize Audio Context on user interaction (handled by browser policy, usually needs a click first)
        // We'll define it but it might need to be "resumed" on first click
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        }
    }, []);

    const playSound = useCallback((type) => {
        if (!audioCtx.current) return;
        const ctx = audioCtx.current;
        if (ctx.state === 'suspended') ctx.resume();

        switch (type) {
            case 'hover':
                createOscillator(ctx, 'sine', 800, 0.1);
                break;
            case 'click':
                createOscillator(ctx, 'square', 400, 0.1);
                break;
            case 'scan':
                // Rapid high pitch beeps
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.frequency.setValueAtTime(1200, now);
                osc.frequency.linearRampToValueAtTime(2000, now + 0.5);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.5);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(now + 0.5);
                break;
            case 'win':
                // Ascending major triad
                [440, 554, 659].forEach((freq, i) => {
                    setTimeout(() => createOscillator(ctx, 'triangle', freq, 0.3), i * 100);
                });
                break;
            case 'lose':
                // Descending tritone (error)
                createOscillator(ctx, 'sawtooth', 150, 0.5);
                setTimeout(() => createOscillator(ctx, 'sawtooth', 100, 0.5), 200);
                break;
            case 'countdown':
                createOscillator(ctx, 'square', 440, 0.05);
                break;
            case 'fight':
                // Big impact
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.frequency.setValueAtTime(100, ctx.currentTime);
                osc2.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
                gain2.gain.setValueAtTime(1, ctx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);
                osc2.start();
                osc2.stop(ctx.currentTime + 1);
                break;
            default:
                break;
        }
    }, []);

    const speak = useCallback((text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.2; // Faster, more robotic
            utterance.pitch = 0.8; // Deep voice
            // Try to find a sci-fi sounding voice
            const voices = window.speechSynthesis.getVoices();
            const preferred = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
            if (preferred) utterance.voice = preferred;

            window.speechSynthesis.cancel(); // Stop previous
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    return { playSound, speak };
};
