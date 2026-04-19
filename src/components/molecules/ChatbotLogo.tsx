export function ChatbotLogo({ size = 180 }: { size?: number }) {
  const h = Math.round(size * 1.2);
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <style>{`
        @keyframes botFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes shadowSync {
          0%,100% { transform: scaleX(1);    opacity: 0.9; }
          50%      { transform: scaleX(0.5); opacity: 0.3; }
        }
        @keyframes gentleWiggle {
          0%   { transform: rotate(0deg)    translateX(0px); }
          20%  { transform: rotate(-2.5deg) translateX(-2px); }
          40%  { transform: rotate(2.5deg)  translateX(2px); }
          60%  { transform: rotate(-2deg)   translateX(-1px); }
          80%  { transform: rotate(1.5deg)  translateX(1px); }
          100% { transform: rotate(0deg)    translateX(0px); }
        }
        @keyframes idleBlink {
          0%,47%,53%,100% { ry: 9px; }
          49%,51%         { ry: 1.2px; }
        }
        @keyframes tickleEyes {
          0%,20%   { ry: 9px; }
          35%,65%  { ry: 1.2px; }
          80%,100% { ry: 9px; }
        }
        @keyframes blushIn {
          0%,20%   { opacity: 0; }
          40%,70%  { opacity: 1; }
          90%,100% { opacity: 0; }
        }
        @keyframes starPop {
          0%,20%   { transform: scale(0) rotate(0deg);  opacity: 0; }
          35%,55%  { transform: scale(1) rotate(15deg); opacity: 1; }
          75%,100% { transform: scale(0) rotate(30deg); opacity: 0; }
        }

        .bot-float { animation: botFloat 3.5s ease-in-out infinite; transform-origin: bottom center; }
        .group:hover .bot-float { animation: gentleWiggle 0.8s ease-in-out 2; }

        .eye-left, .eye-right { animation: idleBlink 4s ease-in-out infinite; }
        .group:hover .eye-left,
        .group:hover .eye-right { animation: tickleEyes 1.6s ease-in-out forwards; }

        .blush { opacity: 0; }
        .group:hover .blush { animation: blushIn 1.6s ease-in-out forwards; }

        .star { transform-origin: center; opacity: 0; }
        .group:hover .star-1 { animation: starPop 1.65s 0.1s  ease-in-out forwards; }
        .group:hover .star-2 { animation: starPop 1.65s 0.25s ease-in-out forwards; }

        .shadow-el { animation: shadowSync 3.5s ease-in-out infinite; transform-origin: center; }
      `}</style>

      <div className="bot-float">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 245 300"
          width={size} height={h} style={{ display: 'block', overflow: 'visible' }}>

          <path d="M-10,118 C-10,118 22,36 122.5,36 C223,36 255,118 255,118 C255,118 223,200 122.5,200 C22,200 -10,118 -10,118 Z" fill="white"/>
          <rect x="65" y="99" width="115" height="38" rx="19" fill="#1a1a1a"/>

          <g transform="translate(95,118)">
            <ellipse className="eye-left" cx="0" cy="0" rx="9" ry="9" fill="#e8405a"/>
          </g>
          <g transform="translate(150,118)">
            <ellipse className="eye-right" cx="0" cy="0" rx="9" ry="9" fill="#e8405a"/>
          </g>

          <ellipse className="blush" cx="52"  cy="132" rx="16" ry="8" fill="#f4a0b0" opacity="0.45"/>
          <ellipse className="blush" cx="193" cy="132" rx="16" ry="8" fill="#f4a0b0" opacity="0.45"/>

          <g className="star star-1" style={{ transformOrigin: '40px 85px' }}>
            <text x="40" y="90" textAnchor="middle" fontSize="18" fill="#fbbf24">✦</text>
          </g>
          <g className="star star-2" style={{ transformOrigin: '205px 82px' }}>
            <text x="205" y="87" textAnchor="middle" fontSize="13" fill="#e8405a">✦</text>
          </g>

          <g transform="translate(12,190) scale(0.898)">
            <path d="M49.493 6.01586C44.86 4.17819 40.316 2.17026 35.869 0C21.4169 9.97132 9.19957 22.3902 0 36.5589C15.6369 60.6421 39.9924 79.6696 69.2214 90.2156C83.1494 95.2409 98.184 98.3404 113.909 99.1433H130.296C146.017 98.3406 173.65 113.595 133.525 152.092C162.758 141.546 228.567 60.6448 244.205 36.5589C235.032 22.4305 222.858 10.0421 208.46 0.0852605C204.064 2.22496 199.574 4.20615 194.997 6.02118C175.837 13.6192 155.156 18.3054 133.525 19.5196C129.795 19.729 126.036 19.8352 122.252 19.8352C118.468 19.8352 114.709 19.729 110.979 19.5196C89.3424 18.3051 68.6565 13.617 49.493 6.01586Z" fill="white"/>
          </g>

          <circle cx="94.5"  cy="234" r="7.5" fill="#1a1a1a"/>
          <circle cx="122.5" cy="234" r="7.5" fill="#1a1a1a"/>
          <circle cx="150.5" cy="234" r="7.5" fill="#1a1a1a"/>
        </svg>
      </div>

      <div className="shadow-el" style={{
        width: size * 0.9,
        height: 24,
        marginTop: 10,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 65%, transparent 80%)',
      }}/>
    </div>
  );
}