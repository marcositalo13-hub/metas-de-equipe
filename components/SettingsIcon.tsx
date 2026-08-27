interface SettingsIconProps {
  size?: number;
  className?: string;
}

// Ícone de engrenagem customizado na paleta do app — usado no lugar do emoji ⚙️.
export default function SettingsIcon({ size = 32, className = "" }: SettingsIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="settingsIconGrad" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="55%" stopColor="#FF7A1A" />
          <stop offset="100%" stopColor="#E5262B" />
        </linearGradient>
      </defs>
      <path
        d="M32 20a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm0 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z"
        fill="url(#settingsIconGrad)"
      />
      <path
        d="M32 4c-1.6 0-3.1.14-4.6.4l-1.3 6.4a21.9 21.9 0 0 0-6.2 3.6l-6.2-2.2a28.2 28.2 0 0 0-4.6 7.9l4.8 4.3a21.7 21.7 0 0 0 0 7.2l-4.8 4.3a28.2 28.2 0 0 0 4.6 7.9l6.2-2.2c1.8 1.5 3.9 2.7 6.2 3.6l1.3 6.4c1.5.26 3 .4 4.6.4s3.1-.14 4.6-.4l1.3-6.4a21.9 21.9 0 0 0 6.2-3.6l6.2 2.2a28.2 28.2 0 0 0 4.6-7.9l-4.8-4.3a21.7 21.7 0 0 0 0-7.2l4.8-4.3a28.2 28.2 0 0 0-4.6-7.9l-6.2 2.2a21.9 21.9 0 0 0-6.2-3.6l-1.3-6.4A27.6 27.6 0 0 0 32 4Z"
        stroke="url(#settingsIconGrad)"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
