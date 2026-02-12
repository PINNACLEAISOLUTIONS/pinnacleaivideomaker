import React from "react";

export const Logo: React.FC<{ color?: string }> = ({ color = "white" }) => {
    return (
        <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))" }}
        >
            <path
                d="M60 10L110 90H10L60 10Z"
                stroke={color}
                strokeWidth="6"
                strokeLinejoin="round"
            />
            <circle cx="60" cy="55" r="8" fill={color} />
            <path
                d="M45 80L60 65L75 80"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
            />
        </svg>
    );
};
