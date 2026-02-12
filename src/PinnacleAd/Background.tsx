import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const Background: React.FC = () => {
    const frame = useCurrentFrame();

    // Create a subtle shift in the gradient position
    const shift = interpolate(frame, [0, 300], [0, 100]);

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(${45 + shift}deg, #0f172a 0%, #1e293b 50%, #334155 100%)`,
            }}
        />
    );
};
