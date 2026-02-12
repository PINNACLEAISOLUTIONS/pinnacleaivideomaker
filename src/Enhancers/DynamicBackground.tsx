import React, { useEffect, useState } from "react";
import { AbsoluteFill, Img, Sequence, useCurrentFrame, interpolate, useVideoConfig, staticFile, continueRender, delayRender } from "remotion";

// Content Map Type
type ContentSegment = {
    start: number;
    duration: number;
    keyword: string;
    asset?: string;
};

// Ken Burns Effect Component
const KenBurnsImage: React.FC<{ src: string }> = ({ src }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    // Slow zoom from 1.0 to 1.15 over the duration
    const scale = interpolate(frame, [0, durationInFrames || 150], [1.0, 1.15], {
        extrapolateRight: "clamp",
    });

    // Slight pan
    const translateX = interpolate(frame, [0, durationInFrames || 150], [0, -20], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ overflow: "hidden" }}>
            <Img
                src={staticFile(src)} // Ensure we wrap with staticFile if it's a relative path
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${scale}) translateX(${translateX}px)`,
                }}
            />
        </AbsoluteFill>
    );
};

export const DynamicBackground: React.FC = () => {
    const { fps } = useVideoConfig();
    const [contentMap, setContentMap] = useState<ContentSegment[]>([]);
    const [handle] = useState(() => delayRender());

    useEffect(() => {
        // Fetch the generated map at runtime
        fetch(staticFile("content-map.json"))
            .then(res => res.json())
            .then(data => {
                setContentMap(data);
                continueRender(handle);
            })
            .catch(err => {
                console.error("Failed to load content map", err);
                continueRender(handle);
            });
    }, [handle]);

    if (contentMap.length === 0) return null;

    return (
        <AbsoluteFill>
            {contentMap.map((segment, index) => {
                // Asset path from JSON (e.g. "assets/filename.jpg")
                // staticFile handles the public folder resolution
                const assetPath = segment.asset;

                if (!assetPath) return null;

                return (
                    <Sequence
                        key={index}
                        from={segment.start * fps}
                        durationInFrames={segment.duration * fps}
                    >
                        <KenBurnsImage src={assetPath} />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
