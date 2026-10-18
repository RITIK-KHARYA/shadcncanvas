import {
  alsoIncluded,
  featuredFeature,
  features,
  featuresSection,
} from "./content";

const FrameDot = "rgba(20,23,24,0.22)";
const FrameNode = "rgba(20,23,24,0.18)";
const FrameFill = "rgba(20,23,24,0.05)";

/* The wiring idea, stated once, as a small schematic. */
function CanvasSchematic() {
  return (
    <svg
      viewBox="0 0 292 142"
      role="img"
      aria-label="Two components connected to a third, with an add affordance."
      className="h-auto w-full max-w-[292px] shrink-0"
      fill="none"
    >
      <rect
        x="0.5"
        y="0.5"
        width="291"
        height="141"
        rx="10"
        stroke={FrameDot}
        strokeDasharray="6 5"
      />
      <rect
        x="34"
        y="27"
        width="88"
        height="30"
        rx="5"
        fill={FrameFill}
        stroke={FrameNode}
      />
      <rect
        x="34"
        y="77"
        width="88"
        height="30"
        rx="5"
        fill={FrameFill}
        stroke={FrameNode}
      />
      <path
        d="M122 42 C 148 42, 148 67, 172 67"
        stroke={FrameDot}
        strokeWidth="1.5"
      />
      <path
        d="M122 92 C 148 92, 148 67, 172 67"
        stroke={FrameDot}
        strokeWidth="1.5"
      />
      <rect
        x="172"
        y="52"
        width="88"
        height="30"
        rx="5"
        className="stroke-lp-signal"
        strokeWidth="1.5"
      />
      <circle cx="270" cy="120" r="11" className="fill-lp-signal" />
      <path
        d="M270 115.5 V124.5 M265.5 120 H274.5"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Features() {
  return (
    <section id="features" className="relative z-10 px-6 py-20 sm:px-16 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1312px] flex-col gap-14 lg:flex-row lg:gap-16">
        {/* left: what this is, and the short list */}
        <div className="flex w-full shrink-0 flex-col lg:w-[320px]">
          <h2 className="font-display text-[34px] leading-[1.06] font-bold tracking-[-0.035em] text-lp-ink sm:text-[40px]">
            {featuresSection.heading}
          </h2>
          <p className="mt-5 text-[15px] leading-[1.6] text-lp-muted">
            {featuresSection.lead}
          </p>
          <div className="mt-10 border-y border-lp-hairline">
            <p className="py-4 text-[12px] text-lp-muted">
              {featuresSection.includedLabel}
            </p>
            {alsoIncluded.map((item) => (
              <p
                key={item}
                className="border-t border-lp-hairline py-3.5 text-[14px] text-lp-ink"
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* right: the spec sheet */}
        <div className="flex-1 lg:border-l lg:border-lp-hairline lg:pl-16">
          <div className="flex flex-col gap-10 border-t border-lp-hairline py-10 md:flex-row md:items-start md:justify-between md:gap-12">
            <div className="max-w-[420px]">
              <featuredFeature.icon
                className="size-5 text-lp-ink"
                strokeWidth={1.5}
              />
              <h3 className="mt-5 text-[18px] font-semibold text-lp-ink">
                {featuredFeature.title}
              </h3>
              <p className="mt-3 text-[13px] leading-[1.6] text-lp-muted">
                {featuredFeature.description}
              </p>
            </div>
            <CanvasSchematic />
          </div>

          <div className="grid grid-cols-1 border-b border-lp-hairline sm:grid-cols-2 sm:[&>*:nth-child(even)]:border-l sm:[&>*:nth-child(even)]:border-lp-hairline sm:[&>*:nth-child(even)]:pl-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border-t border-lp-hairline py-8 pr-8"
              >
                <feature.icon className="size-5 text-lp-ink" strokeWidth={1.5} />
                <h3 className="mt-5 text-[17px] font-semibold text-lp-ink">
                  {feature.title}
                </h3>
                <p className="mt-3 text-[13px] leading-[1.6] text-lp-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
