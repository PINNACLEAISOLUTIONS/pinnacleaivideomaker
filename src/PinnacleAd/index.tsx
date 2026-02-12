import React from "react";
import { AbsoluteFill, Sequence, Audio } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { MeshBackground } from "./MeshBackground";
import { ProfessionalLogo } from "./ProfessionalLogo";
import { KineticWord } from "./KineticWord";
import { FlashTransition } from "./FlashTransition";
import { HighDetailDashboard } from "./HighDetailDashboard";
import { ProceduralMobile } from "./ProceduralMobile";
import { InversionEffect } from "./InversionEffect";

const { fontFamily: montserrat } = loadMontserrat();
const { fontFamily: inter } = loadInter();

export const PinnacleAd: React.FC = () => {
    const backgroundMusic = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    // Timing Constants (at 30fps)
    const SPEED = 15; // 0.5s per word - Rapid Fire

    return (
        <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: inter }}>
            <MeshBackground />
            <Audio src={backgroundMusic} startFrom={0} volume={0.6} />

            {/* Effects Layer */}
            <FlashTransition frameTrigger={0} />
            <FlashTransition frameTrigger={90} />
            <FlashTransition frameTrigger={150} />
            <FlashTransition frameTrigger={180} />
            <InversionEffect startFrame={180} duration={5} />
            <FlashTransition frameTrigger={240} />
            <InversionEffect startFrame={240} duration={10} />
            <FlashTransition frameTrigger={330} />
            <InversionEffect startFrame={330} duration={5} />

            {/* RAPID FIRE INTRO (0-90) */}
            <Sequence from={0} durationInFrames={SPEED}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <KineticWord text="PINNACLE" delay={0} />
                </AbsoluteFill>
            </Sequence>

            <Sequence from={SPEED} durationInFrames={SPEED}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <KineticWord text="AI" delay={0} color="#38bdf8" />
                </AbsoluteFill>
            </Sequence>

            <Sequence from={SPEED * 2} durationInFrames={SPEED}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <KineticWord text="SOLUTIONS" delay={0} />
                </AbsoluteFill>
            </Sequence>

            <Sequence from={SPEED * 3} durationInFrames={SPEED}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <KineticWord text="STUNNING" delay={0} outline />
                </AbsoluteFill>
            </Sequence>

            <Sequence from={SPEED * 4} durationInFrames={SPEED}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <KineticWord text="CUSTOM" delay={0} />
                </AbsoluteFill>
            </Sequence>

            <Sequence from={SPEED * 5} durationInFrames={SPEED}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <KineticWord text="DASHBOARDS" delay={0} color="#38bdf8" />
                </AbsoluteFill>
            </Sequence>

            {/* VISUAL SHOWCASE 1: DASHBOARD (90-150) */}
            <Sequence from={90} durationInFrames={60}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <HighDetailDashboard />
                </AbsoluteFill>
            </Sequence>

            {/* MID WORDS (150-180) */}
            <Sequence from={150} durationInFrames={SPEED}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <KineticWord text="ELITE" delay={0} fontSize={350} />
                </AbsoluteFill>
            </Sequence>

            <Sequence from={150 + SPEED} durationInFrames={SPEED}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <KineticWord text="MOBILE" delay={0} color="#38bdf8" fontSize={350} />
                </AbsoluteFill>
            </Sequence>

            {/* VISUAL SHOWCASE 2: MOBILE (180-240) */}
            <Sequence from={180} durationInFrames={60}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ transform: 'scale(1.5) rotate(-5deg)' }}>
                        <ProceduralMobile />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CALL TO ACTION BUILDUP (240-330) */}
            <Sequence from={240} durationInFrames={30}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <KineticWord text="YOU" delay={0} outline fontSize={300} />
                </AbsoluteFill>
            </Sequence>

            <Sequence from={270} durationInFrames={30}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <KineticWord text="DESERVE" delay={0} fontSize={300} />
                </AbsoluteFill>
            </Sequence>

            <Sequence from={300} durationInFrames={30}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <KineticWord text="THE BEST" delay={0} color="#38bdf8" fontSize={300} />
                </AbsoluteFill>
            </Sequence>

            {/* GRAND FINALE: LOGO (330-450) */}
            <Sequence from={330} durationInFrames={120}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <div style={{ transform: 'scale(1.2)', marginBottom: '40px' }}>
                        <ProfessionalLogo />
                    </div>
                    <div style={{
                        fontSize: '80px',
                        fontWeight: 900,
                        fontFamily: montserrat,
                        color: '#38bdf8',
                        textShadow: '0 0 40px rgba(56, 189, 248, 0.6)',
                        marginTop: '20px'
                    }}>
                        PINNACLE-AI.COM
                    </div>
                </AbsoluteFill>
            </Sequence>
        </AbsoluteFill>
    );
};
