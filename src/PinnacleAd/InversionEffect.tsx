import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const InversionEffect: React.FC<{
    startFrame: number;
    duration?: number;
}> = ({ startFrame, duration = 5 }) => {
    const frame = useCurrentFrame();

    const progress = interpolate(
        frame - startFrame,
        [0, duration / 2, duration],
        [0, 1, 0],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

    if (frame < startFrame || frame > startFrame + duration) {
        return null;
    }

    return (
        <AbsoluteFill
            style={{
                backdropFilter: `invert(${progress})`,
                zIndex: 1000,
                pointerEvents: "none",
            }}
        />
    );
};
