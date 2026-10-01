export const NAV_HIGHLIGHT =
  "isolate before:pointer-events-none before:absolute before:inset-y-1 before:-inset-x-3 before:-z-10 before:rounded-sm before:bg-chalk/[0.07] before:opacity-0 before:transition-opacity before:duration-150 hover:before:opacity-100 focus-visible:before:opacity-100";

export const NAV_NUDGE =
  "transition-[color,translate] duration-150 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5";

export function NavPointer({ className = "-left-6" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute top-1/2 -translate-x-1.5 -translate-y-1/2 text-chalk opacity-0 transition duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${className}`}
    >
      <svg width="9" height="12" viewBox="0 0 9 12">
        <path d="M0 0L9 6L0 12Z" fill="currentColor" />
      </svg>
    </span>
  );
}
