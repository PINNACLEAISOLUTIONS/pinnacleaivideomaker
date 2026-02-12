import React from "react";
import { AbsoluteFill, useVideoConfig, interpolate, staticFile, Img } from "remotion";

export const BrandingLayer: React.FC<{ brandName: string; brandColor: string; frame: number }> = ({
    brandName,
    brandColor,
    frame,
}) => {
    const { durationInFrames } = useVideoConfig();

    // Progress bar width
    const progressWidth = interpolate(frame, [0, durationInFrames], [0, 100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
            {/* TOP WATERMARK */}
            <div
                style={{
                    position: "absolute",
                    top: 60,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    opacity: 0.6,
                }}
            >
                {/* AI Generated Logo with Multiply blend mode to hide white background */}
                <Img
                    src={staticFile("logo.png")}
                    style={{
                        width: 180,
                        height: 180,
                        mixBlendMode: "multiply",
                        objectFit: "contain",
                    }}
                />
                <div
                    style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 900,
                        fontSize: 32,
                        color: "white",
                        marginTop: -20,
                        letterSpacing: 6,
                        textTransform: "uppercase",
                        textShadow: "0 0 10px rgba(0,0,0,0.5)",
                    }}
                >
                    {brandName}
                </div>
            </div>

            {/* BOTTOM PROGRESS BAR */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: `${progressWidth}%`,
                    height: 14,
                    backgroundColor: brandColor,
                    boxShadow: `0 0 25px ${brandColor}`,
                    zIndex: 100,
                }}
            />
        </AbsoluteFill>
    );
};
