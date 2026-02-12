import React from "react";
import { interpolate, useCurrentFrame, spring, useVideoConfig } from "remotion";

export const ProceduralMobile: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const moveIn = spring({
        frame,
        fps,
        config: { mass: 0.5, stiffness: 200, damping: 20 }
    });

    // Gentle floating animation
    const floatY = Math.sin(frame / 20) * 15;
    const floatRotate = Math.sin(frame / 40) * 2;

    const items = [
        { title: 'Revenue', val: '$12.4k', color: '#10b981', w: '60%' },
        { title: 'New Users', val: '+128', color: '#38bdf8', w: '40%' },
        { title: 'Bounce Rate', val: '2.1%', color: '#f59e0b', w: '30%' },
    ];

    return (
        <div style={{
            width: '380px',
            height: '750px',
            backgroundColor: '#0f172a',
            borderRadius: '55px',
            border: '8px solid #334155',
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.1) inset',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            transform: `translateY(${interpolate(moveIn, [0, 1], [300, 0]) + floatY}px) rotate(${floatRotate}deg)`,
            opacity: moveIn,
            overflow: 'hidden'
        }}>
            {/* Dynamic Island / Notch */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '28px',
                backgroundColor: '#000',
                borderRadius: '14px',
                zIndex: 20
            }} />

            {/* Screen Content */}
            <div style={{ flex: 1, padding: '60px 24px 40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>
                        Hello <span style={{ color: '#38bdf8' }}>Alex</span>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #38bdf8, #818cf8)' }} />
                    </div>
                </div>

                {/* Hero Card */}
                <div style={{
                    height: '180px',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.5)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: -50, right: -50,
                        width: '150px', height: '150px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                        borderRadius: '50%'
                    }} />

                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 600 }}>Total Balance</div>
                    <div style={{ fontSize: '36px', fontWeight: 800, color: 'white' }}>$24,592.00</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: 'white' }}>+ Deposit</div>
                        <div style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.1)', borderRadius: '12px', fontSize: '12px', fontWeight: 600, color: 'white' }}>Transfer</div>
                    </div>
                </div>

                {/* Stats List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>Recent Activity</div>
                    {items.map((item, i) => (
                        <div key={i} style={{
                            padding: '16px',
                            background: 'rgba(30, 41, 59, 0.5)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            transform: `translateX(${interpolate(frame, [0, 20], [50, 0])}px)`,
                            opacity: interpolate(frame, [i * 5, i * 5 + 10], [0, 1])
                        }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: `${item.color}20`,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: item.color
                            }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: 'white', fontWeight: 600 }}>{item.title}</div>
                                <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '8px' }}>
                                    <div style={{ height: '100%', width: item.w, background: item.color, borderRadius: '2px' }} />
                                </div>
                            </div>
                            <div style={{ color: 'white', fontWeight: 700 }}>{item.val}</div>
                        </div>
                    ))}
                </div>

                {/* Floating Action Button */}
                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    right: '30px',
                    width: '64px',
                    height: '64px',
                    background: '#38bdf8',
                    borderRadius: '20px',
                    boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    transform: `scale(${interpolate(frame % 90, [0, 20, 80], [1, 1.1, 1])})`
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </div>
            </div>
        </div>
    );
};
