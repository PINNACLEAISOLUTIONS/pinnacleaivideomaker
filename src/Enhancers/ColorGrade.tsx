import React from "react";
import { AbsoluteFill } from "remotion";

export type ColorGradeType = "none" | "cyberpunk" | "vintage" | "high-contrast" | "bw";

export const ColorGrade: React.FC<{
    type: ColorGradeType;
    children: React.ReactNode;
}> = ({ type, children }) => {

    const getStyle = (): React.CSSProperties => {
        switch (type) {
            case "cyberpunk":
                return { filter: "contrast(1.2) saturate(1.5) hue-rotate(-10deg)" };
            case "vintage":
                return { filter: "sepia(0.4) contrast(0.9) brightness(1.1)" };
            case "high-contrast":
                return { filter: "contrast(1.5) brightness(1.1)" };
            case "bw":
                return { filter: "grayscale(1)" };
            default:
                return {};
        }
    };

    return (
        <AbsoluteFill style={{ ...getStyle(), backgroundColor: 'transparent' }}>
            {children}
        </AbsoluteFill>
    );
};
