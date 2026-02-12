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
}> = ({ word, isActive, isPast, localFrame, fps }) => {
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
                color: isActive ? "#FFE600" : isPast ? "#FFFFFF" : "rgba(255,255,255,0.25)",
                WebkitTextStroke: "5px black",
                paintOrder: "stroke fill",
                textShadow: isActive
                    ? "0 6px 25px rgba(0,0,0,0.95), 0 0 40px rgba(255,230,0,0.3)"
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
}> = ({ transcript: propTranscript }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const [transcript, setTranscript] = useState<TranscriptWord[]>(propTranscript || []);
    const [handle] = useState(() => delayRender());

    useEffect(() => {
        if (propTranscript && propTranscript.length > 0) {
            setTranscript(propTranscript);
            continueRender(handle);
            return;
        }
        // Fallback: load from file
        fetch(staticFile("hybrid_plan.json"))
            .then((res) => res.json())
            .then((data) => {
                setTranscript(data.transcript || []);
                continueRender(handle);
            })
            .catch((err) => {
                console.error("OverlayLayer: Could not load transcript", err);
                continueRender(handle);
            });
    }, [handle, propTranscript]);

    if (transcript.length === 0) return null;

    const currentTime = frame / fps;

    // Show a sliding window of ~4 words around the active word
    const activeIdx = transcript.findIndex(
        (w) => currentTime >= w.start && currentTime < w.end
    );

    if (activeIdx === -1) return null;

    // Window: 2 words before, active, 2 words after
    const windowStart = Math.max(0, activeIdx - 1);
    const windowEnd = Math.min(transcript.length, activeIdx + 3);
    const visibleWords = transcript.slice(windowStart, windowEnd);

    return (
        <AbsoluteFill
            style={{
                justifyContent: "center",
                alignItems: "center",
                pointerEvents: "none",
                // Slightly below center — true Hormozi positioning
                paddingTop: "15%",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    maxWidth: "85%",
                    gap: "4px",
                }}
            >
                {visibleWords.map((w, i) => {
                    const globalIdx = windowStart + i;
                    const isActive = globalIdx === activeIdx;
                    const isPast = globalIdx < activeIdx;

                    // Local frame relative to this word's start for pop animation
                    const wordStartFrame = Math.floor(w.start * fps);
                    const localFrame = Math.max(0, frame - wordStartFrame);

                    return (
                        <HormoziWord
                            key={`${globalIdx}-${w.word}`}
                            word={w.word}
                            isActive={isActive}
                            isPast={isPast}
                            localFrame={localFrame}
                            fps={fps}
                        />
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};
