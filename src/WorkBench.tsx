import React, { useEffect, useState } from "react";
import {
    AbsoluteFill,
    Audio,
    staticFile,
    continueRender,
    delayRender,
    useCurrentFrame,
} from "remotion";
import { z } from "zod";
import { HybridLayer } from "./Enhancers/HybridLayer";
import { OverlayLayer } from "./Enhancers/OverlayLayer";
import { BrandingLayer } from "./Enhancers/BrandingLayer";


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

export const WorkBench: React.FC<z.infer<typeof workBenchSchema> & { blueprint?: Blueprint }> = ({
    theme = "Standard",
    showCaption = true,
    blueprint: propBlueprint,
}) => {
    const frame = useCurrentFrame();

    const [videoSize, setVideoSize] = useState<{ w: number; h: number } | null>(
        null
    );
    const [blueprint, setBlueprint] = useState<Blueprint | null>(propBlueprint || null);
    const [handle] = useState(() => delayRender());

    const videoSource = staticFile("video-source.mp4");
    const overlayColor = THEME_OVERLAYS[theme] || "transparent";

    useEffect(() => {
        if (propBlueprint) {
            setVideoSize({ w: 1080, h: 1920 });
            continueRender(handle);
            return;
        }

        // Fallback for Studio (HTTP)
        setVideoSize({ w: 1080, h: 1920 });
        try {
            setBlueprint(require("../public/blueprint.json"));
        } catch (e) { }
        continueRender(handle);
    }, [handle, videoSource, propBlueprint]);

    if (!videoSize || !blueprint) {
        return (
            <AbsoluteFill style={{ backgroundColor: "black", color: "white", justifyContent: 'center', alignItems: 'center', fontSize: 40 }}>
                Initializing Level 9 Architect...
            </AbsoluteFill>
        );
    }

    const brandColor = blueprint.project.brand_color || "#FFE600";

    return (
        <AbsoluteFill style={{ backgroundColor: "black" }}>
            {/* 
               LAYER 1: AUDIO MASTER
               Pure audio stream for continuous, unbroken sound.
            */}
            <Audio
                src={videoSource}
                volume={1}
            />

            {/* 
               LAYER 2: HYBRID VISUALS
               Original TikTok footage + AI Asset Overlays
            */}
            <HybridLayer
                videoSource={videoSource}
                timeline={blueprint.timeline}
                videoSize={videoSize}
            />

            {/* 
               LAYER 3: THEME OVERLAY
               Color grading and brand aesthetics
            */}
            <AbsoluteFill
                style={{
                    backgroundColor: overlayColor,
                    mixBlendMode: "overlay",
                }}
            />

            {/* 
               LAYER 4: AI CAPTION ENGINE
               Hormozi-style kinetic typography
            */}
            {showCaption && (
                <div style={{ zIndex: 50 }}>
                    <OverlayLayer
                        timeline={blueprint.timeline}
                        brandColor={brandColor}
                    />
                </div>
            )}

            {/* LAYER 5: ENTERPRISE BRANDING */}
            <div style={{ zIndex: 100 }}>
                <BrandingLayer
                    brandName="Pinnacle AI Solutions"
                    brandColor={brandColor}
                    frame={frame}
                />
            </div>
        </AbsoluteFill>
    );
};
