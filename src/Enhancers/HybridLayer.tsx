import React from "react";
import {
    AbsoluteFill,
    Img,
    Sequence,
    useCurrentFrame,
    interpolate,
    useVideoConfig,
    staticFile,
    OffthreadVideo,
} from "remotion";


// Blueprint Timeline Type
type BlueprintSegment = {
    id: number;
    duration: number;
    type: "STOCK" | "GENERATE";
    asset?: string;
    caption?: string;
    transition?: "glitch" | "fade" | "cut";
};

// Glitch effect component
const GlitchOverlay: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = frame % 10 < 2 ? 0.3 : 0;
    const offset = Math.sin(frame) * 5;

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "rgba(0, 255, 234, 0.1)",
                opacity,
                transform: `translateX(${offset}px)`,
                pointerEvents: "none",
                zIndex: 20,
            }}
        />
    );
};

// REPLACE segment: AI Asset + Ken Burns
const ReplaceSegment: React.FC<{ src: string; durationInFrames: number }> = ({
    src,
    durationInFrames,
}) => {
    const frame = useCurrentFrame();

    const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.2], {
        extrapolateRight: "clamp",
    });

    const translateX = interpolate(frame, [0, durationInFrames], [0, -60], {
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

// Props-first: accept timeline array directly
export const HybridLayer: React.FC<{
    timeline: BlueprintSegment[];
    videoSource: string;
    videoSize: { w: number; h: number };
}> = ({ timeline, videoSource, videoSize }) => {
    const { fps } = useVideoConfig();

    if (!timeline || timeline.length === 0) return null;

    let currentStartFrame = 0;

    return (
        <AbsoluteFill>
            {timeline.map((segment, index) => {
                const durationFrames = Math.floor(segment.duration * fps);
                const from = currentStartFrame;
                currentStartFrame += durationFrames;

                return (
                    <Sequence
                        key={index}
                        from={from}
                        durationInFrames={durationFrames}
                    >
                        {segment.type === "GENERATE" && segment.asset ? (
                            <ReplaceSegment
                                src={segment.asset}
                                durationInFrames={durationFrames}
                            />
                        ) : (
                            <AbsoluteFill>
                                <OffthreadVideo
                                    src={videoSource}
                                    startFrom={from}
                                    volume={0}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </AbsoluteFill>
                        )}

                        {segment.transition === "glitch" && (
                            <Sequence from={0} durationInFrames={15}>
                                <GlitchOverlay />
                            </Sequence>
                        )}

                        {segment.transition === "fade" && (
                            <FadeOverlay durationInFrames={10} />
                        )}
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};

// Stateless transition components to avoid hook violations in map
const FadeOverlay: React.FC<{ durationInFrames: number }> = ({ durationInFrames }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, durationInFrames], [1, 0], {
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "black",
                opacity,
                zIndex: 30,
            }}
        />
    );
};


