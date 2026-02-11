
import React from 'react';

const CyberBackground = () => {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#050505] overflow-hidden pointer-events-none">
            {/* Subtle Grid Pattern - Figma Style */}
            <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '80px 80px'
                }}
            ></div>

            {/* Vignette to focus center */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/50 to-[#050505]"></div>
        </div>
    );
};

export default CyberBackground;
