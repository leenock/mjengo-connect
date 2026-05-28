"use client";

import Link from "next/link";

type StageStatus = "live" | "expanding" | "future";

interface ValueStage {
  number: number;
  status: StageStatus;
  statusLabel: string;
  title: string;
  description: string;
}

const stages: ValueStage[] = [
  {
    number: 1,
    status: "live",
    statusLabel: "Stage 1 · Live today",
    title: "Post & verify jobs",
    description:
      "Clients submit construction jobs with clear scope, location, and budget. Listings are reviewed and published once approved and paid.",
  },
  {
    number: 2,
    status: "live",
    statusLabel: "Stage 2 · Live today",
    title: "Discover skilled fundis",
    description:
      "Fundis browse listings by trade and location, review job details, and identify opportunities that match their skills.",
  },
  {
    number: 3,
    status: "expanding",
    statusLabel: "Stage 3 · Expanding",
    title: "Connect directly",
    description:
      "Clients and fundis agree terms through direct contact. Subscriptions, saved jobs, and verified listings strengthen trust on both sides.",
  },
  {
    number: 4,
    status: "future",
    statusLabel: "Stage 4 · Near future",
    title: "Construction marketplace",
    description:
      "A full workforce marketplace for Kenya — hiring, payments, and project visibility in one trusted platform for the industry.",
  },
];

const stageItemHover =
  "transition-transform duration-300 ease-out hover:-translate-y-2 hover:[&_.stage-num]:scale-125 hover:[&_.stage-title]:text-orange-700 hover:[&_.stage-desc]:text-slate-800";

export default function Service() {
  return (
    <section
      id="services-section"
      className="bg-white py-12 lg:py-16"
      aria-label="How MJENGO Connect builds value"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
            How we build value
          </p>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            From job posting to a trusted{" "}
            <span className="font-serif text-[1.05em] font-normal italic text-slate-800">
              construction marketplace.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            MJENGO Connect follows a clear path. We are not building isolated features — we are building
            infrastructure that becomes more useful the longer clients and fundis use the platform.
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5">
          {stages.map((stage) => {
            const isFuture = stage.status === "future";
            return (
              <li key={stage.number}>
                <div
                  className={`stage-item cursor-default border border-slate-200 px-4 py-8 text-center sm:px-5 ${stageItemHover}`}
                >
                  <span
                    className={`stage-num inline-block origin-center text-4xl font-semibold tabular-nums transition-transform duration-300 ease-out ${
                      isFuture ? "text-slate-300" : "text-orange-600"
                    }`}
                  >
                    {stage.number}
                  </span>

                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 transition-colors duration-300 ease-out">
                    {stage.statusLabel}
                  </p>
                  <h3 className="stage-title mt-2 text-lg font-bold text-slate-900 transition-colors duration-300 ease-out sm:text-xl">
                    {stage.title}
                  </h3>
                  <p className="stage-desc mx-auto mt-3 max-w-xs text-sm leading-relaxed text-slate-600 transition-colors duration-300 ease-out">
                    {stage.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/Jobs-list"
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
          >
            Browse jobs
          </Link>
          <Link
            href="/auth/job-posting"
            className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Post a job
          </Link>
        </div>
      </div>
    </section>
  );
}
