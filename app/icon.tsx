import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
    width: 32,
    height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 24,
                    background: 'transparent',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Background Shape */}
                    <rect width="32" height="32" rx="8" fill="#1e293b" fillOpacity="0.1" />

                    {/* Rods */}
                    <path d="M6 10H26" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3" />
                    <path d="M6 16H26" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3" />
                    <path d="M6 22H26" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3" />

                    {/* Beads */}
                    <circle cx="10" cy="10" r="3" fill="#1e293b" />

                    <circle cx="16" cy="16" r="3" fill="#1e293b" />
                    <circle cx="12" cy="16" r="3" fill="#1e293b" fillOpacity="0.6" />

                    {/* Action Bead */}
                    <circle cx="22" cy="22" r="3" fill="#15803d" />
                </svg>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
