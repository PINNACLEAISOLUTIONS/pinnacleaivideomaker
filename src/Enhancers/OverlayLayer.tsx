import React, { useEffect, useState } from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    spring,
    staticFile,
    continueRender,
    delayRender,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily: montserrat } = loadFont();

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
                fontFamily: montserrat,
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
    const [transcript, setTranscript] = useState<TranscriptWord[]>(propTranscript || []);
    const [timeline, setTimeline] = useState<BlueprintSegment[]>(propTimeline || []);
    const [handle] = useState(() => delayRender());

    useEffect(() => {
        if ((propTranscript && propTranscript.length > 0) || (propTimeline && propTimeline.length > 0)) {
            setTranscript(propTranscript || []);
            setTimeline(propTimeline || []);
            continueRender(handle);
            return;
        }

        fetch(staticFile("blueprint.json"))
            .then((res) => res.json())
            .then((data) => {
                setTimeline(data.timeline || []);
                // If the blueprint ALSO has a transcript key (from a hybrid run), we can use it
                setTranscript(data.transcript || []);
                continueRender(handle);
            })
            .catch((err) => {
                console.error("OverlayLayer: Could not load blueprint", err);
                continueRender(handle);
            });
    }, [handle, propTranscript, propTimeline]);

    const currentTime = frame / fps;

    // SCENARIO A: Word-level analysis exists
    if (transcript.length > 0) {
        const activeIdx = transcript.findIndex(
            (w) => currentTime >= w.start && currentTime < w.end
        );

        if (activeIdx !== -1) {
            const windowStart = Math.max(0, activeIdx - 1);
            const windowEnd = Math.min(transcript.length, activeIdx + 3);
            const visibleWords = transcript.slice(windowStart, windowEnd);

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
    if (timeline.length > 0) {
        let currentTotalSecs = 0;
        const activeSegment = timeline.find((s) => {
            const start = currentTotalSecs;
            const end = currentTotalSecs + s.duration;
            currentTotalSecs = end;
            return currentTime >= start && currentTime < end;
        });

        if (activeSegment && activeSegment.caption) {
            // Split segment caption into simulated "fast words" or just show the whole thing
            const words = activeSegment.caption.split(" ");
            return (
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none", paddingTop: "15%" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", maxWidth: "85%", gap: "4px" }}>
                        {words.map((word, idx) => (
                            <HormoziWord
                                key={idx}
                                word={word}
                                isActive={true} // Pop the whole caption for visual impact if no word-level timing
                                isPast={false}
                                localFrame={frame % 30}
                                fps={fps}
                                color={brandColor}
                            />
                        ))}
                    </div>
                </AbsoluteFill>
            );
        }
    }

    return null;
};

