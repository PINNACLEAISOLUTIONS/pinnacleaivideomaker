import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    spring,
} from "remotion";


// Timeline Caption Type
type BlueprintSegment = {
    id: number;
    duration: number;
    caption?: string;
};

// Word-level transcript type
type TranscriptWord = {
    word: string;
    start: number;
    end: number;
};

// Hormozi-Style Caption: No bar, stroke outline, center screen
const HormoziWord: React.FC<{
    word: string;
    isActive: boolean;
    isPast: boolean;
    localFrame: number;
    fps: number;
    color?: string;
}> = ({ word, isActive, isPast, localFrame, fps, color = "#FFE600" }) => {
    const popScale = isActive
        ? spring({
            frame: localFrame,
            fps,
            config: { damping: 8, stiffness: 220, mass: 0.4 },
        })
        : 1;

    return (
        <span
            style={{
                fontFamily: "Arial, sans-serif",
                fontSize: 88,
                fontWeight: 900,
                textTransform: "uppercase",
                color: isActive ? color : isPast ? "#FFFFFF" : "rgba(255,255,255,0.25)",
                WebkitTextStroke: "6px black",
                paintOrder: "stroke fill",
                textShadow: isActive
                    ? `0 6px 25px rgba(0,0,0,0.95), 0 0 40px ${color}44`
                    : "0 6px 20px rgba(0,0,0,0.9)",
                transform: `scale(${isActive ? popScale * 1.12 : 1})`,
                display: "inline-block",
                marginRight: "16px",
                lineHeight: 1.3,
            }}
        >
            {word}
        </span>
    );
};

export const OverlayLayer: React.FC<{
    transcript?: TranscriptWord[];
    timeline?: BlueprintSegment[];
    brandColor?: string;
}> = ({ transcript: propTranscript, timeline: propTimeline, brandColor }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const currentTime = frame / fps;

    // SCENARIO A: Word-level analysis exists
    if (propTranscript && propTranscript.length > 0) {
        const activeIdx = propTranscript.findIndex(
            (w) => currentTime >= w.start && currentTime < w.end
        );

        if (activeIdx !== -1) {
            const windowStart = Math.max(0, activeIdx - 1);
            const windowEnd = Math.min(propTranscript.length, activeIdx + 3);
            const visibleWords = propTranscript.slice(windowStart, windowEnd);

            return (
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none", paddingTop: "15%" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", maxWidth: "85%", gap: "4px" }}>
                        {visibleWords.map((w, i) => {
                            const globalIdx = windowStart + i;
                            const isActive = globalIdx === activeIdx;
                            const isPast = globalIdx < activeIdx;
                            const wordStartFrame = Math.floor(w.start * fps);
                            return (
                                <HormoziWord
                                    key={`${globalIdx}-${w.word}`}
                                    word={w.word}
                                    isActive={isActive}
                                    isPast={isPast}
                                    localFrame={Math.max(0, frame - wordStartFrame)}
                                    fps={fps}
                                    color={brandColor}
                                />
                            );
                        })}
                    </div>
                </AbsoluteFill>
            );
        }
    }

    // SCENARIO B: Segment-level captions fallback
    if (propTimeline && propTimeline.length > 0) {
        let elapsed = 0;
        let activeSegment = null;
        for (const s of propTimeline) {
            const start = elapsed;
            const end = elapsed + s.duration;
            if (currentTime >= start && currentTime < end) {
                activeSegment = s;
                break;
            }
            elapsed = end;
        }

        if (activeSegment && activeSegment.caption) {
            const words = activeSegment.caption.split(" ");
            const wordsPerSecond = 3.5; // High energy pace
            const framesPerWord = Math.floor(fps / wordsPerSecond);

            return (
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none", paddingTop: "15%" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", maxWidth: "85%", gap: "8px" }}>
                        {words.map((word, idx) => {
                            const wordStartFrame = idx * framesPerWord;
                            const isActive = frame % (activeSegment.duration * fps) >= wordStartFrame;

                            if (!isActive) return null;

                            return (
                                <HormoziWord
                                    key={`${activeSegment.id}-${idx}`}
                                    word={word}
                                    isActive={true}
                                    isPast={false}
                                    localFrame={(frame % (activeSegment.duration * fps)) - wordStartFrame}
                                    fps={fps}
                                    color={brandColor}
                                />
                            );
                        })}
                    </div>
                </AbsoluteFill>
            );
        }
    }


    return null;
};
