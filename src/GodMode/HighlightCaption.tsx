import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Oswald";

const { fontFamily } = loadFont();

export const HighlightCaption: React.FC<{ text: string, delay?: number }> = ({ text, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame: frame - delay,
        fps,
        config: { stiffness: 150, damping: 15 },
    });

    const width = interpolate(entrance, [0, 1], [0, 100]);
    const y = interpolate(entrance, [0, 1], [50, 0]);

    return (
        <div style={{
            position: 'relative',
            display: 'inline-block',
            margin: '10px 0',
            transform: `translateY(${y}px)`,
            opacity: interpolate(entrance, [0, 0.5], [0, 1])
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${width}%`,
                backgroundColor: '#FACC15', // Yellow highlight
                zIndex: 0,
                transform: 'skewX(-10deg)',
                borderRadius: '4px'
            }} />
            <span style={{
                position: 'relative',
                zIndex: 1,
                fontFamily,
                fontSize: 80,
                fontWeight: 800,
                color: 'black',
                padding: '0 20px',
                textTransform: 'uppercase'
            }}>
                {text}
            </span>
        </div>
    );
};
