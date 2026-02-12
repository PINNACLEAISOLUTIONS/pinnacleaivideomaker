import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const TextLayer: React.FC<{
    text: string;
    startFrame: number;
    durationInFrames: number;
}> = ({ text, startFrame, durationInFrames }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame: frame - startFrame,
        fps,
        config: {
            damping: 12,
        },
    });

    const exit = spring({
        frame: frame - (startFrame + durationInFrames - 15),
        fps,
        config: {
            damping: 12,
        },
    });

    const opacity = interpolate(entrance, [0, 1], [0, 1]) - interpolate(exit, [0, 1], [0, 1]);
    const translateY = interpolate(entrance, [0, 1], [20, 0]) + interpolate(exit, [0, 1], [0, -20]);

    return (
        <div
            style={{
                opacity: Math.max(0, opacity),
                transform: `translateY(${translateY}px)`,
                color: "white",
                fontSize: "80px",
                fontWeight: "bold",
                fontFamily: "sans-serif",
                textAlign: "center",
                width: "100%",
                textShadow: "0 4px 12px rgba(0,0,0,0.5)",
                padding: "0 40px",
            }}
        >
            {text}
        </div>
    );
};
