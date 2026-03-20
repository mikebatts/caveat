import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Caveat — AI-Powered Contract Intelligence';
export const size = { width: 1200, height: 600 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Violet glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15), transparent 70%)',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#7c3aed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 700,
              color: 'white',
              fontFamily: 'monospace',
            }}
          >
            C
          </div>
          <span
            style={{
              fontFamily: 'monospace',
              fontWeight: 700,
              fontSize: 48,
              color: 'white',
              letterSpacing: '0.15em',
            }}
          >
            CAVEAT
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span>AI-Powered <span style={{ color: '#8b5cf6' }}>Contract Intelligence</span></span>
        </div>

        {/* Subhead */}
        <div
          style={{
            fontSize: 22,
            color: '#a1a1aa',
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          Scan contracts for vulnerabilities, bad terms, and hidden risks — in 60 seconds
        </div>
      </div>
    ),
    { ...size }
  );
}
