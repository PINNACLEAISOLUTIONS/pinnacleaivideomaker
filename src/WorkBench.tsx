import React, { useEffect, useState } from "react";
import {
    AbsoluteFill,
    OffthreadVideo,
    staticFile,
    continueRender,
    delayRender,
} from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";
import { z } from "zod";
import { HybridLayer } from "./Enhancers/HybridLayer";
import { OverlayLayer } from "./Enhancers/OverlayLayer";

// Schema for sidebar controls
export const workBenchSchema = z.object({
    theme: z.enum([
        "Standard",
        "Cyberpunk",
        "Vintage",
        "HighContrast",
        "Minimal",
    ] as const),
    customCaption: z.string(),
    showCaption: z.boolean(),
});

// Hybrid plan types
type VisualSegment = {
    start: number;
    end: number;
    type: "KEEP" | "REPLACE";
    asset?: string;
};

type TranscriptWord = {
    word: string;
    start: number;
    end: number;
};

type HybridPlan = {
    visuals: VisualSegment[];
    transcript: TranscriptWord[];
};

// Theme overlay colors
const THEME_OVERLAYS: Record<string, string> = {
    Standard: "transparent",
    Cyberpunk: "rgba(0, 255, 234, 0.08)",
    Vintage: "rgba(120, 100, 50, 0.15)",
    HighContrast: "rgba(0,0,0,0.3)",
    Minimal: "rgba(255,255,255,0.03)",
};

export const WorkBench: React.FC<z.infer<typeof workBenchSchema>> = ({
    theme = "Standard",
    showCaption = true,
}) => {
    const [videoSize, setVideoSize] = useState<{ w: number; h: number } | null>(
        null
    );
    const [plan, setPlan] = useState<HybridPlan | null>(null);
    const [handle] = useState(() => delayRender());

    const videoSource = staticFile("video-source.mp4");
    const overlayColor = THEME_OVERLAYS[theme] || "transparent";

    useEffect(() => {
        // Load video metadata + hybrid plan in parallel
        Promise.all([
            getVideoMetadata(videoSource),
            fetch(staticFile("hybrid_plan.json")).then((r) => r.json()),
        ])
            .then(([meta, planData]) => {
                setVideoSize({ w: meta.width, h: meta.height });
                setPlan(planData);
                continueRender(handle);
            })
            .catch((err) => {
                console.error("WorkBench init error:", err);
                continueRender(handle);
            });
    }, [handle, videoSource]);

    if (!videoSize || !plan) {
        return (
            <AbsoluteFill
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 40,
                    color: "white",
                    backgroundColor: "#000",
                }}
            >
                Loading…
            </AbsoluteFill>
        );
    }

    return (
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
            {/* 
               LAYER 1: AUDIO MASTER
               Hidden video for continuous, unbroken audio.
            */}
            <OffthreadVideo
                src={videoSource}
                style={{ opacity: 0 }}
                volume={1}
            />

            {/* 
               LAYER 2: HYBRID VISUALS
               Reads visuals[] — swaps KEEP (original + zoom) / REPLACE (AI + Ken Burns).
            */}
            <HybridLayer visuals={plan.visuals} />

            {/* LAYER 3: THEME OVERLAY */}
            <AbsoluteFill
                style={{
                    backgroundColor: overlayColor,
                    pointerEvents: "none",
                }}
            />

            {/* 
               LAYER 4: HORMOZI CAPTIONS
               Reads transcript[] — word-by-word stroke-outlined text.
            */}
            {showCaption && <OverlayLayer transcript={plan.transcript} />}
        </AbsoluteFill>
    );
};
