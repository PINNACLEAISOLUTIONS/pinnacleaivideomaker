import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const KineticWord: React.FC<{
    text: string;
    delay?: number;
    fontSize?: number;
    color?: string;
    outline?: boolean;
}> = ({ text, delay = 0, fontSize = 280, color = "white", outline = false }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame: frame - delay,
        fps,
        config: {
            stiffness: 400, // snappier
            damping: 10,    // more bounce
        },
    });

    const scale = interpolate(entrance, [0, 1], [3, 1]);
    const opacity = interpolate(entrance, [0, 0.2], [0, 1]);
    const blur = interpolate(entrance, [0, 1], [20, 0]);
    const rotate = interpolate(entrance, [0, 1], [interpolate(Math.random(), [0, 1], [-15, 15]), 0]); // slight random rotation on entrance

    return (
        <div
            style={{
                fontSize: `${fontSize}px`,
                fontWeight: 900,
                fontFamily: "Montserrat, sans-serif",
                color: outline ? "transparent" : color,
                WebkitTextStroke: outline ? `4px ${color}` : "none",
                textTransform: "uppercase",
                letterSpacing: "-0.05em",
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                opacity,
                filter: `blur(${blur}px)`,
                textShadow: outline ? "none" : "0 20px 80px rgba(0,0,0,0.5)",
            }}
        >
            {text}
        </div>
    );
};
