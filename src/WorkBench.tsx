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
import { BrandingLayer } from "./Enhancers/BrandingLayer";
import { useCurrentFrame } from "remotion";

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

// Blueprint types
type BlueprintTimeline = {
    id: number;
    duration: number;
    type: "STOCK" | "GENERATE";
    asset?: string;
    caption?: string;
    transition?: "glitch" | "fade" | "cut";
};

type BlueprintProject = {
    title: string;
    duration_seconds: number;
    music_mood: string;
    brand_color: string;
};

type TranscriptWord = {
    word: string;
    start: number;
    end: number;
};

type Blueprint = {
    project: BlueprintProject;
    timeline: BlueprintTimeline[];
    transcript?: TranscriptWord[];
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
    const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
    const [handle] = useState(() => delayRender());

    const videoSource = staticFile("video-source.mp4");
    const overlayColor = THEME_OVERLAYS[theme] || "transparent";

    useEffect(() => {
        // Load video metadata + Enterprise Blueprint in parallel
        Promise.all([
            getVideoMetadata(videoSource),
            fetch(staticFile("blueprint.json")).then((r) => r.json()),
        ])
            .then(([meta, blueprintData]) => {
                setVideoSize({ w: meta.width, h: meta.height });
                setBlueprint(blueprintData);
                continueRender(handle);
            })
            .catch((err) => {
                console.error("WorkBench Enterprise init error:", err);
                // Fallback attempt for previous data format
                fetch(staticFile("hybrid_plan.json"))
                    .then(r => r.json())
                    .then(plan => {
                        // Build a fake blueprint from hybrid plan if needed
                        setBlueprint({
                            project: { title: "Remake", duration_seconds: 60, music_mood: "Cinematic", brand_color: "#FFE600" },
                            timeline: plan.visuals.map((v: any, i: number) => ({ id: i, duration: v.end - v.start, type: v.type, asset: v.asset })),
                            transcript: plan.transcript
                        });
                        continueRender(handle);
                    })
                    .catch(() => continueRender(handle));
            });
    }, [handle, videoSource]);

    if (!videoSize || !blueprint) {
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
                Loading Enterprise Engine…
            </AbsoluteFill>
        );
    }

    const brandColor = blueprint.project.brand_color || "#FFE600";

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
               Reads timeline from Blueprint — swaps types & transitions.
            */}
            <HybridLayer timeline={blueprint.timeline} />

            {/* LAYER 3: THEME OVERLAY */}
            <AbsoluteFill
                style={{
                    backgroundColor: overlayColor,
                    pointerEvents: "none",
                }}
            />

            {/* 
               LAYER 4: HORMOZI CAPTIONS
               Reads from Blueprint (transcript or captions fallback).
            */}
            {showCaption && (
                <OverlayLayer
                    transcript={blueprint.transcript}
                    timeline={blueprint.timeline}
                    brandColor={brandColor}
                />
            )}

            {/* LAYER 5: ENTERPRISE BRANDING */}
            <BrandingLayer
                brandName="Pinnacle AI Solutions"
                brandColor={brandColor}
                frame={useCurrentFrame()}
            />
        </AbsoluteFill>
    );
};

