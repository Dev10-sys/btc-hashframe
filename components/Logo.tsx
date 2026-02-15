export function Logo({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 4L8 10V22C8 32 14 40 24 44C34 40 40 32 40 22V10L24 4Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="url(#hashframe-gradient)"
      />
      
      <rect x="16" y="16" width="4" height="4" fill="currentColor" />
      <rect x="22" y="16" width="4" height="4" fill="currentColor" />
      <rect x="28" y="16" width="4" height="4" fill="currentColor" />
      
      <rect x="16" y="22" width="4" height="4" fill="currentColor" />
      <rect x="28" y="22" width="4" height="4" fill="currentColor" />
      
      <rect x="16" y="28" width="4" height="4" fill="currentColor" />
      <rect x="22" y="28" width="4" height="4" fill="currentColor" />
      <rect x="28" y="28" width="4" height="4" fill="currentColor" />
      
      <defs>
        <linearGradient id="hashframe-gradient" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F7931A" />
          <stop offset="1" stopColor="#B66B0D" />
        </linearGradient>
      </defs>
    </svg>
  )
}
