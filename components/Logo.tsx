import React from 'react';

interface LogoProps {
    className?: string;
    size?: number;
    showText?: boolean;
}

export default function Logo({ className = '', size = 32, showText = true }: LogoProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
            >
                {/* Background Shape (Optional, keeps it clean) */}
                <rect width="32" height="32" rx="8" className="fill-primary/10" />

                {/* Rods (Lines) */}
                <path d="M6 10H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary/30" />
                <path d="M6 16H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary/30" />
                <path d="M6 22H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary/30" />

                {/* Beads (Data Points) */}
                {/* Row 1: Input */}
                <circle cx="10" cy="10" r="3" className="fill-primary" />

                {/* Row 2: Processing */}
                <circle cx="16" cy="16" r="3" className="fill-primary" />
                <circle cx="12" cy="16" r="3" className="fill-primary/60" />

                {/* Row 3: Output (Action Color) */}
                <circle cx="22" cy="22" r="3" className="fill-action" />

                {/* Connection/Flow Line (Subtle) */}
                <path
                    d="M10 10C10 10 16 10 16 16C16 22 22 22 22 22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="text-primary/20"
                    strokeDasharray="2 2"
                />
            </svg>

            {showText && (
                <span className="text-xl font-bold text-foreground tracking-tight">
                    Abacus
                </span>
            )}
        </div>
    );
}
