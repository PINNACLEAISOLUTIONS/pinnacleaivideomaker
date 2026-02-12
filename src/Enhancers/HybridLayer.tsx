import React, { useEffect, useState } from "react";
import {
    AbsoluteFill,
    Img,
    Sequence,
    useCurrentFrame,
    interpolate,
    useVideoConfig,
    staticFile,
    continueRender,
    delayRender,
    OffthreadVideo,
} from "remotion";

// Visual Segment Type (from visuals array)
type VisualSegment = {
    start: number;
    end: number;
    type: "KEEP" | "REPLACE";
    description?: string;
    visual_prompt?: string;
    asset?: string;
};

// REPLACE segment: AI Asset + Ken Burns
const ReplaceSegment: React.FC<{ src: string; durationInFrames: number }> = ({
    src,
    durationInFrames,
}) => {
    const frame = useCurrentFrame();

    const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.15], {
        extrapolateRight: "clamp",
    });

    const translateX = interpolate(frame, [0, durationInFrames], [0, -20], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ overflow: "hidden", zIndex: 10 }}>
            <Img
                src={staticFile(src)}
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

// KEEP segment: Original Video with subtle zoom
const KeepSegment: React.FC<{
    source: string;
    startFrame: number;
    durationFrames: number;
}> = ({ source, startFrame, durationFrames }) => {
    const frame = useCurrentFrame();

    const scale = interpolate(frame, [0, durationFrames], [1.0, 1.05], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ overflow: "hidden" }}>
            <OffthreadVideo
                src={source}
                startFrom={startFrame}
                endAt={startFrame + durationFrames}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    transform: `scale(${scale})`,
                }}
                muted={true}
            />
        </AbsoluteFill>
    );
};

// Props-first: accept visuals array directly, or load from file
export const HybridLayer: React.FC<{ visuals?: VisualSegment[] }> = ({
    visuals: propVisuals,
}) => {
    const { fps } = useVideoConfig();
    const [visuals, setVisuals] = useState<VisualSegment[]>(propVisuals || []);
    const [handle] = useState(() => delayRender());
    const videoSource = staticFile("video-source.mp4");

    useEffect(() => {
        if (propVisuals && propVisuals.length > 0) {
            setVisuals(propVisuals);
            continueRender(handle);
            return;
        }
        // Fallback: load from file (reads .visuals key)
        fetch(staticFile("hybrid_plan.json"))
            .then((res) => res.json())
            .then((data) => {
                setVisuals(data.visuals || data);
                continueRender(handle);
            })
            .catch((err) => {
                console.error("HybridLayer: Failed to load plan", err);
                continueRender(handle);
            });
    }, [handle, propVisuals]);

    if (visuals.length === 0) return null;

    return (
        <AbsoluteFill>
            {visuals.map((segment, index) => {
                const startFrame = Math.floor(segment.start * fps);
                const durationFrames = Math.floor(
                    (segment.end - segment.start) * fps
                );

                return (
                    <Sequence
                        key={index}
                        from={startFrame}
                        durationInFrames={durationFrames}
                    >
                        {segment.type === "REPLACE" && segment.asset ? (
                            <ReplaceSegment
                                src={segment.asset}
                                durationInFrames={durationFrames}
                            />
                        ) : (
                            <KeepSegment
                                source={videoSource}
                                startFrame={startFrame}
                                durationFrames={durationFrames}
                            />
                        )}
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
