import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const EnhancedText: React.FC<{
    text: string;
    startFrame: number;
    durationInFrames: number;
    fontSize?: number;
}> = ({ text, startFrame, durationInFrames, fontSize = 90 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const exit = spring({
        frame: frame - (startFrame + durationInFrames - 15),
        fps,
        config: { damping: 15 },
    });

    const words = text.split(" ");

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.3em',
            width: '100%',
            padding: '0 100px'
        }}>
            {words.map((word, i) => {
                const wordEntrance = spring({
                    frame: frame - (startFrame + i * 3),
                    fps,
                    config: { damping: 15 }
                });

                const opacity = interpolate(wordEntrance, [0, 1], [0, 1]) - interpolate(exit, [0, 1], [0, 1]);
                const y = interpolate(wordEntrance, [0, 1], [40, 0]) + interpolate(exit, [0, 1], [0, -40]);

                return (
                    <span
                        key={i}
                        style={{
                            opacity: Math.max(0, opacity),
                            transform: `translateY(${y}px)`,
                            color: "white",
                            fontSize: `${fontSize}px`,
                            fontWeight: 900,
                            fontFamily: "'Montserrat', sans-serif",
                            textAlign: "center",
                            textShadow: "0 10px 30px rgba(0,0,0,0.5)",
                            display: 'inline-block'
                        }}
                    >
                        {word}
                    </span>
                );
            })}
        </div>
    );
};
