import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const FlashTransition: React.FC<{ frameTrigger: number }> = ({ frameTrigger }) => {
    const frame = useCurrentFrame();

    const intensity = interpolate(
        frame - frameTrigger,
        [0, 5, 10],
        [0, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    if (intensity === 0) return null;

    return (
        <AbsoluteFill style={{
            backgroundColor: "white",
            opacity: intensity * 0.8,
            mixBlendMode: "overlay",
            pointerEvents: "none"
        }} />
    );
};
