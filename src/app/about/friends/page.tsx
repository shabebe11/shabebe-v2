import Image from "next/image";
import { FRIENDS, type Friend } from "@/content/friends";

const PLATES = [
  { bar: "bg-squat", edge: "group-hover:border-squat" },
  { bar: "bg-bench", edge: "group-hover:border-bench" },
  { bar: "bg-deadlift", edge: "group-hover:border-deadlift" },
  { bar: "bg-total", edge: "group-hover:border-total" },
];

export default function FriendsPage() {
  return (
    <>
      <h1 className="font-display text-6xl font-medium text-chalk">Friends</h1>
      <p className="mt-4 text-muted">
        {String(FRIENDS.length).padStart(2, "0")} lifters
      </p>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {FRIENDS.map((friend, i) => (
          <FriendCard key={friend.name} friend={friend} lot={i + 1} plate={PLATES[i % PLATES.length]} />
        ))}
      </ul>
    </>
  );
}

function FriendCard({
  friend,
  lot,
  plate,
}: {
  friend: Friend;
  lot: number;
  plate: (typeof PLATES)[number];
}) {
  return (
    <li className="group relative flex flex-col border border-line p-5 transition-colors duration-200 hover:border-faint">
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-0.5 opacity-30 transition-opacity duration-200 group-hover:opacity-100 ${plate.bar}`}
      />

      <div className="flex items-start justify-between">
        <div className="relative flex size-14 items-center justify-center overflow-hidden border border-line">
          {friend.image ? (
            <Image
              src={friend.image}
              alt=""
              fill
              sizes="56px"
              className="object-cover grayscale transition duration-300 group-hover:grayscale-0"
            />
          ) : (
            <span className="font-display text-2xl font-medium text-faint transition-colors duration-200 group-hover:text-chalk">
              {initials(friend.name)}
            </span>
          )}
        </div>
        <span className="text-xs text-faint">lot {String(lot).padStart(2, "0")}</span>
      </div>

      <h2 className="mt-5 font-display text-3xl font-medium text-chalk">{friend.name}</h2>
      <p className="mt-1 text-sm text-muted">{friend.tagline}</p>
      <p className="mt-4 text-xs text-faint">met @ {friend.met}</p>

      {friend.links.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-5 text-xs">
          {friend.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-muted underline decoration-line underline-offset-4 transition-colors hover:text-chalk hover:decoration-chalk"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
    </li>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
