
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Cursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseDown = () => setClicked(true);
        const handleMouseUp = () => setClicked(false);

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference">
            {/* Outer Ring */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                    scale: clicked ? 0.8 : 1,
                    borderColor: clicked ? '#f59e0b' : '#ffffff' // Amber on click
                }}
                transition={{ type: 'spring', mass: 0.2, stiffness: 800, damping: 25 }}
            >
                {/* Inner Dot */}
                <div className={`w-1 h-1 bg-white rounded-full ${clicked ? 'bg-amber-500' : ''}`} />
            </motion.div>

            {/* Crosshair Lines */}
            <motion.div
                className="fixed top-0 left-0 w-12 h-12 border-t border-b border-transparent transform -translate-x-1/2 -translate-y-1/2 opacity-30"
                animate={{ x: mousePosition.x - 24, y: mousePosition.y - 24, rotate: clicked ? 90 : 0 }}
                style={{ borderTopColor: 'white', borderBottomColor: 'white' }}
            />
        </div>
    );
};

export default Cursor;
