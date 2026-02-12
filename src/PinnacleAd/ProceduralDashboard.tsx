import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const ProceduralDashboard: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 20], [0, 1]);
    const scale = interpolate(frame, [0, 60], [0.8, 1]);

    return (
        <div style={{
            width: '80%',
            height: '60%',
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            opacity,
            transform: `scale(${scale})`,
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', flex: 1 }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px' }}>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} style={{
                            height: '10px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '5px',
                            marginBottom: '15px',
                            width: `${Math.random() * 50 + 40}%`
                        }} />
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} style={{
                            backgroundColor: 'rgba(56, 189, 248, 0.1)',
                            borderRadius: '12px',
                            border: '1px solid rgba(56, 189, 248, 0.2)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                height: '100%',
                                width: `${interpolate((frame + i * 20) % 100, [0, 100], [0, 100])}%`,
                                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                            }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
