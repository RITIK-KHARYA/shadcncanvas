const NODES_Y = [90, 190, 290];
const NODE_TEXT_Y = [127, 227, 327];
const NODE_LABELS = ["Button", "Input", "Card"];

const HANDLES: Array<[number, number]> = [
  [272, 122],
  [272, 222],
  [272, 322],
  [520, 215],
  [520, 245],
  [520, 275],
  [740, 245],
  [980, 245],
];

function NodeIcon({ kind }: { kind: "button" | "input" | "card" }) {
  if (kind === "button") {
    return <rect x="0.75" y="4.5" width="14.5" height="7" rx="3.5" />;
  }

  if (kind === "input") {
    return (
      <>
        <rect x="0.75" y="2.75" width="14.5" height="10.5" rx="2.5" />
        <path d="M4 8 H9.5" />
      </>
    );
  }

  return (
    <>
      <rect x="0.75" y="1.75" width="14.5" height="12.5" rx="2.5" />
      <path d="M4.5 6 H11.5" />
      <path d="M4.5 9.5 H8.5" />
    </>
  );
}

export function CanvasGraph() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-lp-ink"
      style={{
        backgroundImage:
          "linear-gradient(rgba(237,238,236,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(237,238,236,0.07) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <svg
        viewBox="0 0 1312 440"
        role="img"
        aria-label="Three components — Button, Input and Card — feeding a Form node, which exports to a React component file."
        className="block h-auto w-full"
      >
        {/* wires */}
        <path
          className="lp-graph-edge"
          pathLength={1}
          d="M272 122 C 396 122, 396 215, 520 215"
        />
        <path
          className="lp-graph-edge"
          pathLength={1}
          d="M272 222 C 396 222, 396 245, 520 245"
        />
        <path
          className="lp-graph-edge"
          pathLength={1}
          d="M272 322 C 396 322, 396 275, 520 275"
        />
        <path
          id="lp-flow"
          className="lp-graph-edge lp-graph-edge--flow"
          pathLength={1}
          d="M740 245 C 856 245, 862 245, 980 245"
        />

        {/* ports */}
        {HANDLES.map(([x, y]) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={3}
            className="fill-lp-on-ink"
            fillOpacity={0.4}
          />
        ))}

        {/* the signal on the live wire */}
        <circle className="lp-signal-halo" cx="860" cy="245" r="9" />
        <circle className="lp-signal-dot" cx="860" cy="245" r="4" />

        {/* palette nodes */}
        {(["button", "input", "card"] as const).map((kind, index) => (
          <g key={kind}>
            <rect
              x="72"
              y={NODES_Y[index]}
              width="200"
              height="64"
              rx="8"
              fill="rgba(237,238,236,0.06)"
              stroke="rgba(237,238,236,0.16)"
            />
            <g
              transform={`translate(90,${NODES_Y[index] + 24})`}
              fill="none"
              stroke="rgba(237,238,236,0.6)"
              strokeWidth={1.5}
              strokeLinecap="round"
            >
              <NodeIcon kind={kind} />
            </g>
            <text
              x="118"
              y={NODE_TEXT_Y[index]}
              className="fill-lp-on-ink font-medium"
              style={{ fontSize: 14 }}
            >
              {NODE_LABELS[index]}
            </text>
          </g>
        ))}

        {/* the assembled form */}
        <g>
          <rect
            x="520"
            y="203"
            width="220"
            height="84"
            rx="8"
            fill="rgba(237,238,236,0.1)"
            stroke="rgba(237,238,236,0.26)"
          />
          <g
            transform="translate(540,224)"
            fill="none"
            stroke="rgba(237,238,236,0.7)"
            strokeWidth={1.5}
            strokeLinecap="round"
          >
            <NodeIcon kind="input" />
          </g>
          <text
            x="564"
            y="236"
            className="fill-lp-on-ink font-semibold"
            style={{ fontSize: 15 }}
          >
            Form
          </text>
          <text
            x="540"
            y="260"
            className="fill-lp-on-ink font-mono"
            style={{ fontSize: 11 }}
            fillOpacity={0.45}
          >
            zod validated
          </text>
        </g>

        {/* the export */}
        <g>
          <rect
            x="980"
            y="185"
            width="240"
            height="120"
            rx="8"
            fill="rgba(46,125,116,0.16)"
            stroke="rgba(46,125,116,0.55)"
          />
          <g
            transform="translate(1000,204)"
            fill="none"
            className="stroke-[#7FCFC0]"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 3.5 L1.5 8 L6 12.5" />
            <path d="M10 3.5 L14.5 8 L10 12.5" />
          </g>
          <text
            x="1026"
            y="216"
            className="fill-[#7FCFC0] font-mono"
            style={{ fontSize: 12 }}
          >
            Form.tsx
          </text>
          <line
            x1="1000"
            y1="232"
            x2="1200"
            y2="232"
            stroke="rgba(237,238,236,0.12)"
          />
          <text
            x="1000"
            y="256"
            className="fill-lp-on-ink font-mono"
            style={{ fontSize: 12 }}
            fillOpacity={0.6}
          >
            export function Form()
          </text>
          <text
            x="1000"
            y="278"
            className="fill-lp-on-ink font-mono"
            style={{ fontSize: 12 }}
            fillOpacity={0.4}
          >
            {"return <Button />"}
          </text>
        </g>
      </svg>
    </div>
  );
}
