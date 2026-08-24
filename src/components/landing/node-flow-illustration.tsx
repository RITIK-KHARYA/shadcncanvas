export function NodeFlowIllustration() {
  return (
    <div className="nf-illustration relative mx-auto w-full max-w-md" aria-hidden="true">
      <svg viewBox="0 0 480 360" className="h-full w-full" role="img">
        <title>Components wiring together and exporting as code</title>

        <defs>
          <pattern
            id="nf-grid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              className="nf-grid-line"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="480" height="360" fill="url(#nf-grid)" />

        <path className="nf-path" d="M140 76 C 220 76, 220 150, 300 150" />
        <path className="nf-path" d="M140 180 C 220 180, 220 180, 300 176" />
        <path className="nf-path" d="M140 284 C 220 284, 220 210, 300 202" />

        <circle r="3.5" className="nf-packet nf-packet-1" />
        <circle r="3.5" className="nf-packet nf-packet-2" />
        <circle r="3.5" className="nf-packet nf-packet-3" />

        <g className="nf-node nf-node-1">
          <rect x="24" y="56" width="116" height="40" rx="8" />
          <text x="40" y="80">
            Input
          </text>
          <circle cx="140" cy="76" r="3.5" className="nf-handle" />
        </g>

        <g className="nf-node nf-node-2">
          <rect x="24" y="160" width="116" height="40" rx="8" />
          <text x="40" y="184">
            Button
          </text>
          <circle cx="140" cy="180" r="3.5" className="nf-handle" />
        </g>

        <g className="nf-node nf-node-3">
          <rect x="24" y="264" width="116" height="40" rx="8" />
          <text x="40" y="288">
            Card
          </text>
          <circle cx="140" cy="284" r="3.5" className="nf-handle" />
        </g>

        <g className="nf-node nf-node-export">
          <rect x="300" y="140" width="130" height="72" rx="10" />
          <text x="332" y="184" className="nf-export-text">
            {"</>"}
          </text>
        </g>
      </svg>
    </div>
  )
}
