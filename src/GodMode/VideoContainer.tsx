import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, OffthreadVideo } from "remotion";
import { staticFile } from "remotion";

export const VideoContainer: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame: frame - 20,
        fps,
        config: { mass: 1, stiffness: 100, damping: 15 },
    });

    const scale = interpolate(entrance, [0, 1], [0.8, 1]);
    const y = interpolate(entrance, [0, 1], [200, 0]);
    const rotate = interpolate(entrance, [0, 1], [-10, 0]);

    return (
        <div style={{
            width: '90%',
            height: '60%',
            borderRadius: 40,
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            transform: `translateY(${y}px) scale(${scale}) rotate(${rotate}deg)`,
            opacity: entrance,
            border: '4px solid rgba(255,255,255,0.1)'
        }}>
            <OffthreadVideo
                src={staticFile("input-video.mp4")}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            // loop
            // muted
            />
        </div>
    );
};
