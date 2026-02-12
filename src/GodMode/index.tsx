import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { GlitchTitle } from "./GlitchTitle";
import { VideoContainer } from "./VideoContainer";
import { HighlightCaption } from "./HighlightCaption";

export const GodMode: React.FC = () => {
    const frame = useCurrentFrame();

    // Subtle background scaling/floating
    const bgScale = interpolate(frame, [0, 450], [1, 1.2]);

    return (
        <AbsoluteFill style={{
            backgroundColor: '#000',
            overflow: 'hidden'
        }}>
            {/* Animated Background */}
            <AbsoluteFill style={{
                background: 'linear-gradient(45deg, #1a1a1a 0%, #000000 100%)',
                transform: `scale(${bgScale})`,
                zIndex: 0
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 60%)',
                    transform: `translate(${Math.sin(frame / 50) * 50}px, ${Math.cos(frame / 50) * 50}px)`
                }} />
            </AbsoluteFill>

            {/* Intro Sequence: The "Hook" */}
            <Sequence from={0} durationInFrames={90}>
                <GlitchTitle text="WATCH THIS" />
            </Sequence>

            {/* Main Video Content */}
            <Sequence from={45}>
                <AbsoluteFill style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '200px' // Adjust for caption space
                }}>
                    <VideoContainer />
                </AbsoluteFill>
            </Sequence>

            {/* Captions Overlay */}
            <Sequence from={70}>
                <AbsoluteFill style={{
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingBottom: '150px',
                    gap: '20px'
                }}>
                    <HighlightCaption text="THIS IS" delay={0} />
                    <HighlightCaption text="HIGH END" delay={30} />
                    <HighlightCaption text="MOTION" delay={60} />
                </AbsoluteFill>
            </Sequence>
        </AbsoluteFill>
    );
};
