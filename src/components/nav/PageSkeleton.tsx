export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="animate-pulse">
      <div className="h-14 w-56 rounded-sm bg-line" />
      <div className="mt-10 space-y-4">
        <div className="h-4 w-full max-w-xl rounded-sm bg-line" />
        <div className="h-4 w-full max-w-lg rounded-sm bg-line" />
        <div className="h-4 w-full max-w-md rounded-sm bg-line" />
      </div>
      <div className="mt-12 grid max-w-xl grid-cols-3 gap-4">
        <div className="h-24 rounded-sm bg-line" />
        <div className="h-24 rounded-sm bg-line" />
        <div className="h-24 rounded-sm bg-line" />
      </div>
    </div>
  );
}
