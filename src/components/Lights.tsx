export function Lights({ whites, active }: { whites: number; active: boolean }) {
  return (
    <div className="flex gap-1.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className={`light ${active && i < whites ? "light-on" : ""}`}
          style={{ transitionDelay: active ? `${i * 150}ms` : "0ms" }} />
      ))}
    </div>
  );
}