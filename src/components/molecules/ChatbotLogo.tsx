export function ChatbotLogo({ size = 180 }: { size?: number }) {
  const h = Math.round(size * 1.2);
  return (
    <div className="flex flex-col items-center">
      <style>{`
        @keyframes botFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes shadowSync {
          0%,100% { transform: scaleX(1);    opacity: 0.9; }
          50%      { transform: scaleX(0.5); opacity: 0.3; }
        }
      `}</style>

      {/* Robot */}
      <div style={{ animation: 'botFloat 3.5s ease-in-out infinite', transformOrigin: 'bottom center' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 245 300"
          width={size} height={h} style={{ display: 'block', overflow: 'visible' }}>

          <path d="M-10,118 C-10,118 22,36 122.5,36 C223,36 255,118 255,118 C255,118 223,200 122.5,200 C22,200 -10,118 -10,118 Z" fill="white"/>
          <rect x="65" y="99" width="115" height="38" rx="19" fill="#1a1a1a"/>

          <g transform="translate(95,118)">
            <ellipse cx="0" cy="0" rx="9" ry="9" fill="#e8405a">
              <animateTransform attributeName="transform" type="scale"
                values="1 1;1 1;1 1;1 1;1 1;1 1;1 1;1 0.08;1 1;1 1;1 1;1 1;1 1;1 1;1 1;1 1;1 1;1 0.08;1 1;1 1;1 1"
                keyTimes="0;.05;.1;.15;.2;.25;.3;.34;.38;.43;.48;.53;.58;.63;.68;.73;.78;.82;.86;.92;1"
                dur="5s" repeatCount="indefinite" additive="sum"/>
            </ellipse>
          </g>

          <g transform="translate(150,118)">
            <ellipse cx="0" cy="0" rx="9" ry="9" fill="#e8405a">
              <animateTransform attributeName="transform" type="scale"
                values="1 1;1 1;1 1;1 1;1 1;1 1;1 1;1 0.08;1 1;1 1;1 1;1 1;1 1;1 1;1 1;1 1;1 1;1 0.08;1 1;1 1;1 1"
                keyTimes="0;.05;.1;.15;.2;.25;.3;.34;.38;.43;.48;.53;.58;.63;.68;.73;.78;.82;.85;.92;1"
                dur="5s" repeatCount="indefinite" additive="sum"/>
            </ellipse>
          </g>

          <g transform="translate(12,190) scale(0.898)">
            <path d="M49.493 6.01586C44.86 4.17819 40.316 2.17026 35.869 0C21.4169 9.97132 9.19957 22.3902 0 36.5589C15.6369 60.6421 39.9924 79.6696 69.2214 90.2156C83.1494 95.2409 98.184 98.3404 113.909 99.1433H130.296C146.017 98.3406 173.65 113.595 133.525 152.092C162.758 141.546 228.567 60.6448 244.205 36.5589C235.032 22.4305 222.858 10.0421 208.46 0.0852605C204.064 2.22496 199.574 4.20615 194.997 6.02118C175.837 13.6192 155.156 18.3054 133.525 19.5196C129.795 19.729 126.036 19.8352 122.252 19.8352C118.468 19.8352 114.709 19.729 110.979 19.5196C89.3424 18.3051 68.6565 13.617 49.493 6.01586Z" fill="white"/>
          </g>

          <circle cx="94.5"  cy="234" r="7.5" fill="#1a1a1a"/>
          <circle cx="122.5" cy="234" r="7.5" fill="#1a1a1a"/>
          <circle cx="150.5" cy="234" r="7.5" fill="#1a1a1a"/>
        </svg>
      </div>

      {/* Shadow — fully outside the robot div so it never overlaps the tail */}
      <div style={{
        width: size * 0.9,
        height: 24,
        marginTop: 10,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 65%, transparent 80%)',
        animation: 'shadowSync 3.5s ease-in-out infinite',
        transformOrigin: 'center',
      }}/>
    </div>
  );
}