interface CameraIconProps {
  size?: number;
  className?: string;
}

// Ícone de câmera customizado — botão de trocar foto no seletor de pessoa.
export default function CameraIcon({ size = 14, className = "" }: CameraIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9 4.5L7.6 6.5H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2.6L15 4.5H9Z"
        fill="currentColor"
      />
      <circle cx="12" cy="13" r="3.4" fill="white" />
      <circle cx="12" cy="13" r="2" fill="currentColor" />
    </svg>
  );
}
