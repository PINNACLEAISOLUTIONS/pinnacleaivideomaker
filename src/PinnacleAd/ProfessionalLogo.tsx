import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export const ProfessionalLogo: React.FC<{ size?: number }> = ({ size = 200 }) => {
    const frame = useCurrentFrame();
    const rotation = interpolate(frame, [0, 300], [0, 360]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Abstract "P" and Peak Shape */}
                <path
                    d="M100 20L180 160H20L100 20Z"
                    stroke="url(#logoGradient)"
                    strokeWidth="12"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                />
                <path
                    d="M60 160V100C60 77.9086 77.9086 60 100 60C122.091 60 140 77.9086 140 100"
                    stroke="white"
                    strokeWidth="12"
                    strokeLinecap="round"
                />
                <circle cx="100" cy="110" r="15" fill="white" filter="url(#glow)" />
            </svg>
            <div style={{
                fontSize: '48px',
                fontWeight: 900,
                color: 'white',
                letterSpacing: '4px',
                fontFamily: 'sans-serif'
            }}>
                PINNACLE <span style={{ color: '#38bdf8' }}>AI</span>
            </div>
        </div>
    );
};
