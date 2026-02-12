import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Oswald";

const { fontFamily } = loadFont();

export const GlitchTitle: React.FC<{ text: string }> = ({ text }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { stiffness: 200, damping: 10 },
    });

    const glitchOffset = Math.sin(frame * 0.8) * interpolate(spring({ frame: frame - 10, fps, config: { damping: 5 } }), [0, 1], [20, 0]);
    const opacity = interpolate(frame, [0, 5, 20], [0, 1, 1]);
    const scale = interpolate(entrance, [0, 1], [2, 1]);

    return (
        <div style={{
            fontFamily,
            fontSize: 200,
            fontWeight: 900,
            color: 'white',
            textAlign: 'center',
            position: 'absolute',
            width: '100%',
            top: '20%',
            transform: `scale(${scale})`,
            opacity
        }}>
            {/* Chromatic Aberration Layers */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: glitchOffset,
                color: '#f0f',
                width: '100%',
                mixBlendMode: 'screen',
                opacity: 0.8
            }}>{text}</div>
            <div style={{
                position: 'absolute',
                top: 0,
                left: -glitchOffset,
                color: '#0ff',
                width: '100%',
                mixBlendMode: 'screen',
                opacity: 0.8
            }}>{text}</div>
            <div style={{ position: 'relative' }}>{text}</div>
        </div>
    );
};
