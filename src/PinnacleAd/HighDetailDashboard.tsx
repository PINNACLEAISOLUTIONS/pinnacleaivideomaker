import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const HighDetailDashboard: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { damping: 15 }
    });

    const shimmer = interpolate(frame, [0, 100], [0, 200]);

    return (
        <div style={{
            width: '1000px',
            height: '650px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            padding: '32px',
            transform: `scale(${interpolate(entrance, [0, 1], [0.98, 1])}) translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`,
            opacity: entrance,
            fontFamily: "'Inter', sans-serif",
            color: 'white',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Glossy Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '300px',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
                pointerEvents: 'none'
            }} />

            {/* Sidebar & Content Layout */}
            <div style={{ display: 'flex', gap: '32px', height: '100%' }}>

                {/* Sidebar */}
                <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '24px', borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '20px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', background: '#38bdf8', borderRadius: '4px' }} />
                        PINNACLE
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {['Dashboard', 'Analytics', 'Reports', 'Users', 'Settings'].map((item, i) => (
                            <div key={i} style={{
                                padding: '10px 16px',
                                borderRadius: '8px',
                                background: i === 0 ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                                color: i === 0 ? '#38bdf8' : '#94a3b8',
                                fontSize: '14px',
                                fontWeight: 500,
                                border: i === 0 ? '1px solid rgba(56, 189, 248, 0.2)' : 'none'
                            }}>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Top Stats Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        {[
                            { label: 'Platform Revenue', val: '$124,592', change: '+12.5%', color: '#10b981' },
                            { label: 'Active Users', val: '8,492', change: '+5.2%', color: '#38bdf8' },
                            { label: 'Conversion Rate', val: '3.24%', change: '+1.1%', color: '#f59e0b' }
                        ].map((stat, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '16px',
                                padding: '20px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
                                <div style={{ fontSize: '24px', fontWeight: 700 }}>{stat.val}</div>
                                <div style={{ fontSize: '12px', color: stat.color, fontWeight: 600 }}>{stat.change} vs last week</div>
                            </div>
                        ))}
                    </div>

                    {/* Main Chart */}
                    <div style={{
                        flex: 1,
                        background: 'rgba(15, 23, 42, 0.5)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '24px',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div style={{ fontSize: '16px', fontWeight: 600 }}>Traffic Overview</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ padding: '4px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', fontSize: '12px' }}>Weekly</div>
                                <div style={{ padding: '4px 12px', borderRadius: '20px', background: 'transparent', fontSize: '12px', color: '#94a3b8' }}>Monthly</div>
                            </div>
                        </div>

                        {/* CSS Chart */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', paddingBottom: '10px' }}>
                            {[30, 50, 45, 60, 80, 75, 90, 85, 95, 70, 85, 100].map((h, i) => (
                                <div key={i} style={{
                                    width: '30px',
                                    height: `${h}%`,
                                    background: 'linear-gradient(180deg, #38bdf8 0%, rgba(56, 189, 248, 0.1) 100%)',
                                    borderRadius: '6px 6px 0 0',
                                    position: 'relative',
                                    opacity: 0.9
                                }}>
                                    {/* Shimmer effect */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)',
                                        transform: `translateY(${shimmer}%)`,
                                        opacity: 0.5
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
