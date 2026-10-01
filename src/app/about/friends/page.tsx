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

const CARD = "group relative flex h-full flex-col border border-line p-5 transition-colors duration-200";

function FriendCard({
  friend,
  lot,
  plate,
}: {
  friend: Friend;
  lot: number;
  plate: (typeof PLATES)[number];
}) {
  const body = (
    <>
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-0.5 opacity-30 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${plate.bar}`}
      />

      <div className="relative flex aspect-[2/1] items-center justify-center overflow-hidden border border-line bg-line/40">
        {friend.image ? (
          <Image
            src={friend.image}
            alt=""
            fill
            sizes="(min-width: 640px) 320px, 100vw"
            className="object-cover object-left-top transition-transform duration-500 origin-top-left motion-safe:group-hover:scale-[1.03] motion-safe:group-focus-visible:scale-[1.03]"
          />
        ) : (
          <span className="font-display text-6xl font-medium text-faint transition-colors duration-200 group-hover:text-chalk group-focus-visible:text-chalk">
            {initials(friend.name)}
          </span>
        )}
      </div>

      <span className="mt-5 text-xs text-faint">lot {String(lot).padStart(2, "0")}</span>
      <h2 className="mt-1 font-display text-3xl font-medium text-chalk">{friend.name}</h2>
      <p className="mt-1 text-sm text-muted">{friend.tagline}</p>
      <div className="mt-auto flex items-baseline justify-between pt-4 text-xs text-faint">
        {friend.href && (
          <>
            <span aria-hidden className="ml-auto transition-colors duration-200 group-hover:text-chalk group-focus-visible:text-chalk">
              ↗
            </span>
            <span className="sr-only">(opens in a new tab)</span>
          </>
        )}
      </div>
    </>
  );

  return (
    <li>
      {friend.href ? (
        <a
          href={friend.href}
          target="_blank"
          rel="noreferrer"
          className={`${CARD} outline-none hover:border-faint focus-visible:border-faint`}
        >
          {body}
        </a>
      ) : (
        <div className={CARD}>{body}</div>
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
