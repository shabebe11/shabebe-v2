import Image from "next/image";
import { getTopTracks } from "@/lib/spotify";

const ROW = "grid grid-cols-[1.5rem_2.5rem_1fr_auto] items-center gap-3 py-2";

export async function TopTracks({ limit = 5 }: { limit?: number }) {
  const tracks = await getTopTracks(limit);

  if (!tracks || tracks.length === 0) {
    return <p className="mt-4 border-t border-line pt-4 text-sm text-faint">Spotify isn&apos;t connected yet.</p>;
  }

  return (
    <ol className="mt-4 border-t border-line">
      {tracks.map((track, i) => (
        <li key={track.url} className="border-b border-line last:border-b-0">
          <a href={track.url} target="_blank" rel="noreferrer" className={`group ${ROW}`}>
            <span className="text-sm text-faint">{String(i + 1).padStart(2, "0")}</span>
            <span className="relative size-10 overflow-hidden bg-line">
              {track.image && <Image src={track.image} alt="" fill sizes="40px" className="object-cover" />}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm text-muted transition-colors group-hover:text-chalk">
                {track.name}
              </span>
              <span className="block truncate text-xs text-faint">{track.artists}</span>
            </span>
            <span className="text-xs text-faint transition-colors group-hover:text-total">↗</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export function TopTracksSkeleton({ limit = 5 }: { limit?: number }) {
  return (
    <ol aria-busy="true" aria-label="Loading top tracks" className="mt-4 animate-pulse border-t border-line">
      {Array.from({ length: limit }, (_, i) => (
        <li key={i} className={`border-b border-line last:border-b-0 ${ROW}`}>
          <span className="text-sm text-line">{String(i + 1).padStart(2, "0")}</span>
          <span className="size-10 bg-line" />
          <span className="space-y-2">
            <span className="block h-3 w-48 max-w-full rounded-sm bg-line" />
            <span className="block h-2.5 w-24 rounded-sm bg-line" />
          </span>
          <span />
        </li>
      ))}
    </ol>
  );
}
