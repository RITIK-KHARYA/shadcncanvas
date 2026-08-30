import { motion } from "framer-motion";

/**
 * Lightweight inline SVG "node-flow → code export" illustration.
 * Uses stroke-draw (staggered) for the connector curves and offset-path
 * packets that travel along them — all GPU-friendly transforms/opacity.
 * Respects prefers-reduced-motion via CSS.
 */
export function NodeFlowSVG() {
  return (
    <svg
      viewBox="0 0 480 300"
      className="mx-auto w-full max-w-lg"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <pattern id="nf-dot" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" className="nf-dot" />
        </pattern>
      </defs>

      {/* dot grid backdrop */}
      <rect width="480" height="300" fill="url(#nf-dot)" />

      {/* connector curves - draw in on load, staggered */}
      <path
        className="nf-line"
        d="M150 66 C 220 66, 220 130, 290 130"
      />
      <path
        className="nf-line nf-line-2"
        d="M150 150 C 220 150, 220 150, 290 148"
      />
      <path
        className="nf-line nf-line-3"
        d="M150 234 C 220 234, 220 166, 290 162"
      />

      {/* travelling packets */}
      <circle r="3.5" className="nf-packet nf-packet-1" />
      <circle r="3.5" className="nf-packet nf-packet-2" />
      <circle r="3.5" className="nf-packet nf-packet-3" />

      {/* nodes */}
      <g className="nf-node nf-node-1">
        <rect x="28" y="46" width="122" height="40" rx="8" />
        <text x="46" y="72">Input</text>
        <circle cx="150" cy="66" r="3.5" className="nf-handle" />
      </g>
      <g className="nf-node nf-node-2">
        <rect x="28" y="130" width="122" height="40" rx="8" />
        <text x="46" y="156">Button</text>
        <circle cx="150" cy="150" r="3.5" className="nf-handle" />
      </g>
      <g className="nf-node nf-node-3">
        <rect x="28" y="214" width="122" height="40" rx="8" />
        <text x="46" y="240">Card</text>
        <circle cx="150" cy="234" r="3.5" className="nf-handle" />
      </g>

      {/* export panel */}
      <motion.g
        className="nf-node nf-node-export"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <rect x="290" y="106" width="140" height="76" rx="10" />
        <text x="324" y="154" className="nf-export-text">{"</>"}</text>
      </motion.g>
    </svg>
  );
}
