interface CheckIconProps {
  size?: number;
  className?: string;
}

// Ícone de "check" customizado — usado no lugar do caractere ✓.
export default function CheckIcon({ size = 12, className = "" }: CheckIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 10.5L8 14.5L16 5.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
