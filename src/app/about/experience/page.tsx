import Image from "next/image";
import { EXPERIENCE, type Role } from "@/content/experience";

const monthFormat = new Intl.DateTimeFormat("en-NZ", { month: "short", year: "numeric", timeZone: "UTC" });

function month(value: string) {
  return monthFormat.format(new Date(`${value}-01T00:00:00Z`));
}

function range(role: Role) {
  return `${month(role.start)} – ${role.end ? month(role.end) : "Present"}`;
}

function latestStart(roles: Role[]) {
  return roles.reduce((latest, role) => (role.start > latest ? role.start : latest), "");
}

export default function ExperiencePage() {
  const orgs = [...EXPERIENCE]
    .map((org) => ({ ...org, roles: [...org.roles].sort((a, b) => b.start.localeCompare(a.start)) }))
    .sort((a, b) => latestStart(b.roles).localeCompare(latestStart(a.roles)));

  return (
    <>
      <h1 className="font-display text-6xl font-medium text-chalk">Experience</h1>

      <div className="mt-10 border-t border-line">
        {orgs.map((org) => {
          const earliest = org.roles.at(-1)!;
          const current = org.roles.some((role) => role.end === null);
          const latestEnd = current ? null : org.roles.map((r) => r.end!).sort().at(-1)!;
          return (
            <section key={org.org} className="grid gap-4 border-b border-line py-6 sm:grid-cols-[13rem_1fr] sm:gap-6">
              <div className="flex flex-col">
                <p className="text-xs text-faint">
                  {month(earliest.start)} – {latestEnd ? month(latestEnd) : "Present"}
                </p>
                {org.logo && (
                  <div className="flex flex-1 items-center justify-center py-4">
                    <div className="relative h-14 w-48">
                      <Image src={org.logo} alt={`${org.org} logo`} fill sizes="192px" className="object-contain" />
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-display text-4xl font-medium text-chalk">
                  {org.link ? (
                    <a
                      href={org.link}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-muted"
                    >
                      {org.org} <span className="font-mono text-sm text-faint">↗</span>
                    </a>
                  ) : (
                    org.org
                  )}
                </h2>
                <ol className="mt-4 space-y-4 border-l border-line pl-5">
                  {org.roles.map((role) => (
                    <li key={`${role.title}${role.start}`} className="relative">
                      <span
                        aria-hidden
                        className={`absolute top-1.5 -left-[26px] size-2.5 rounded-full border-[1.5px] ${
                          role.end === null ? "border-chalk bg-chalk" : "border-faint bg-background"
                        }`}
                      />
                      <p className="text-sm text-muted">{role.title}</p>
                      <p className="mt-0.5 text-xs text-faint">{range(role)}</p>
                      {role.summary && <p className="mt-2 max-w-xl text-sm text-muted">{role.summary}</p>}
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
