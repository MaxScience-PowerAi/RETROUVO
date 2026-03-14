export default function RetrouvoLogo({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#1e3a8a" stopOpacity={1} />
          <stop offset="100%" stopColor="#0f172a" stopOpacity={1} />
        </linearGradient>
      </defs>
      <rect x="45" y="30" width="22" height="140" rx="11" fill="url(#brandGrad)" />
      <path d="M67 41 C130 20 165 90 100 110" stroke="#ce1126" strokeWidth="22" fill="none" strokeLinecap="round" />
      <path d="M90 110 L145 170" stroke="#fcd116" strokeWidth="22" fill="none" strokeLinecap="round" />
      <circle cx="85" cy="110" r="14" fill="#007a5e" />
    </svg>
  )
}
