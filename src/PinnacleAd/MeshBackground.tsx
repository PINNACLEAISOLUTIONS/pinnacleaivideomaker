import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

const Blob: React.FC<{ color: string; delay: number; scale: number }> = ({ color, delay, scale }) => {
    const frame = useCurrentFrame();

    const moveX = Math.sin((frame + delay) / 50) * 100;
    const moveY = Math.cos((frame + delay) / 40) * 80;

    return (
        <div
            style={{
                position: 'absolute',
                width: '800px',
                height: '800px',
                borderRadius: '50%',
                background: color,
                filter: 'blur(120px)',
                opacity: 0.4,
                left: `calc(50% + ${moveX}px)`,
                top: `calc(50% + ${moveY}px)`,
                transform: `translate(-50%, -50%) scale(${scale + Math.sin(frame / 60) * 0.1})`,
            }}
        />
    );
};

export const MeshBackground: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: "#020617", overflow: 'hidden' }}>
            <Blob color="#38bdf8" delay={0} scale={1.2} />
            <Blob color="#818cf8" delay={100} scale={1.5} />
            <Blob color="#4f46e5" delay={200} scale={1} />

            {/* Film Grain Overlay */}
            <AbsoluteFill style={{
                opacity: 0.05,
                pointerEvents: 'none',
                background: `url('https://grainy-gradients.vercel.app/noise.svg')`,
                mixBlendMode: 'overlay'
            }} />
        </AbsoluteFill>
    );
};
