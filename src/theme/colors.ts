const NON_COLOR_KEYS = [
  "font-sans",
  "font-serif",
  "font-mono",
  "radius",
  "spacing",
  "shadow-opacity",
  "shadow-blur",
  "shadow-spread",
  "shadow-offset-x",
  "shadow-offset-y",
  "letter-spacing",
]

export function isColorProperty(key: string): boolean {
  return !NON_COLOR_KEYS.includes(key)
}

function rgbToHsl(r: number, g: number, b: number, a: number, precision: number): string {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h *= 60
  }

  const prec = (num: number) => parseFloat(num.toFixed(precision))
  if (a !== 1) {
    return `hsl(${prec(h)} ${prec(s * 100)}% ${prec(l * 100)}% / ${prec(a)})`
  }
  return `hsl(${prec(h)} ${prec(s * 100)}% ${prec(l * 100)}%)`
}

function oklchToHsl(l: number, c: number, h: number, a: number | undefined, precision: number): string {
  const hRad = (h * Math.PI) / 180
  const a_lab = c * Math.cos(hRad)
  const b_lab = c * Math.sin(hRad)
  const l_lms = l + 0.3963377774 * a_lab + 0.2158037573 * b_lab
  const m_lms = l - 0.1055613458 * a_lab - 0.0638541728 * b_lab
  const s_lms = l - 0.0894841775 * a_lab - 1.2914855480 * b_lab
  const l_lms3 = Math.pow(Math.max(0, l_lms), 3)
  const m_lms3 = Math.pow(Math.max(0, m_lms), 3)
  const s_lms3 = Math.pow(Math.max(0, s_lms), 3)
  const r_lin = +4.0767416621 * l_lms3 - 3.3077115913 * m_lms3 + 0.2309699292 * s_lms3
  const g_lin = -1.2684380046 * l_lms3 + 2.6097574011 * m_lms3 - 0.3413193965 * s_lms3
  const b_lin = -0.0041960863 * l_lms3 - 0.7034186147 * m_lms3 + 1.7076346010 * s_lms3
  const toSRGB = (x: number) => {
    const clipped = Math.max(0, Math.min(1, x))
    return clipped <= 0.0031308
      ? 12.92 * clipped
      : 1.055 * Math.pow(clipped, 1 / 2.4) - 0.055
  }
  const r = toSRGB(r_lin)
  const g = toSRGB(g_lin)
  const b = toSRGB(b_lin)
  return rgbToHsl(r, g, b, a ?? 1, precision)
}

export function colorFormatter(value: string, _format: "hsl", precision: string | number = 4): string {
  const p = Number(precision)
  const val = value.trim().toLowerCase()
  if (val === "transparent") {
    return "hsl(0 0% 0% / 0)"
  }
  const parsePercent = (str: string, max: number) => {
    if (str.endsWith("%")) {
      return (parseFloat(str) / 100) * max
    }
    return parseFloat(str)
  }
  const oklchMatch =
    val.match(/oklch\(\s*([\d\.]+%?)\s+([\d\.]+%?)\s+([\d\.]+(?:deg|rad|turn)?)\s*(?:\/\s*([\d\.]+%?))?\s*\)/i) ||
    val.match(/oklch\(\s*([\d\.]+%?)\s*,\s*([\d\.]+%?)\s*,\s*([\d\.]+(?:deg|rad|turn)?)\s*(?:,\s*([\d\.]+%?))?\s*\)/i)
  if (oklchMatch) {
    const lRaw = oklchMatch[1]
    const cRaw = oklchMatch[2]
    const hRaw = oklchMatch[3]
    const aRaw = oklchMatch[4]
    const l = lRaw.endsWith("%") ? parseFloat(lRaw) / 100 : parseFloat(lRaw)
    const c = cRaw.endsWith("%") ? parseFloat(cRaw) / 100 : parseFloat(cRaw)
    let h = parseFloat(hRaw)
    if (hRaw.endsWith("rad")) {
      h = (parseFloat(hRaw) * 180) / Math.PI
    } else if (hRaw.endsWith("turn")) {
      h = parseFloat(hRaw) * 360
    }
    let a: number | undefined
    if (aRaw) {
      a = aRaw.endsWith("%") ? parseFloat(aRaw) / 100 : parseFloat(aRaw)
    }
    return oklchToHsl(l, c, h, a, p)
  }
  if (val.startsWith("#")) {
    let r = 0, g = 0, b = 0, a = 1
    if (val.length === 4 || val.length === 5) {
      r = parseInt(val[1] + val[1], 16)
      g = parseInt(val[2] + val[2], 16)
      b = parseInt(val[3] + val[3], 16)
      if (val.length === 5) {
        a = parseInt(val[4] + val[4], 16) / 255
      }
    } else if (val.length === 7 || val.length === 9) {
      r = parseInt(val.slice(1, 3), 16)
      g = parseInt(val.slice(3, 5), 16)
      b = parseInt(val.slice(5, 7), 16)
      if (val.length === 9) {
        a = parseInt(val.slice(7, 9), 16) / 255
      }
    }
    return rgbToHsl(r / 255, g / 255, b / 255, a, p)
  }
  const rgbMatch = val.match(
    /rgba?\(\s*([\d\.]+%?)\s*[\s,]\s*([\d\.]+%?)\s*[\s,]\s*([\d\.]+%?)\s*(?:[\s,\/]\s*([\d\.]+%?))?\s*\)/i
  )
  if (rgbMatch) {
    const r = parsePercent(rgbMatch[1], 255) / 255
    const g = parsePercent(rgbMatch[2], 255) / 255
    const b = parsePercent(rgbMatch[3], 255) / 255
    const a = rgbMatch[4]
      ? rgbMatch[4].endsWith("%") ? parseFloat(rgbMatch[4]) / 100 : parseFloat(rgbMatch[4])
      : 1
    return rgbToHsl(r, g, b, a, p)
  }
  const hslMatch = val.match(
    /hsla?\(\s*([\d\.]+(?:deg|rad|turn)?)\s*[\s,]\s*([\d\.]+%?)\s*[\s,]\s*([\d\.]+%?)\s*(?:[\s,\/]\s*([\d\.]+%?))?\s*\)/i
  )
  if (hslMatch) {
    let h = parseFloat(hslMatch[1])
    if (hslMatch[1].endsWith("rad")) {
      h = (parseFloat(hslMatch[1]) * 180) / Math.PI
    } else if (hslMatch[1].endsWith("turn")) {
      h = parseFloat(hslMatch[1]) * 360
    }
    const s = parseFloat(hslMatch[2])
    const l = parseFloat(hslMatch[3])
    const a = hslMatch[4]
      ? hslMatch[4].endsWith("%") ? parseFloat(hslMatch[4]) / 100 : parseFloat(hslMatch[4])
      : undefined
    const prec = (num: number) => parseFloat(num.toFixed(p))
    if (a !== undefined) {
      return `hsl(${prec(h)} ${prec(s)}% ${prec(l)}% / ${prec(a)})`
    }
    return `hsl(${prec(h)} ${prec(s)}% ${prec(l)}%)`
  }
  return value
}

export function adjustHslColor(
  hslString: string,
  adjustments: { hueShift: number; saturationScale: number; lightnessScale: number }
): string {
  const match = hslString.match(/hsl\(\s*([\d\.]+)\s+([\d\.]+)%\s+([\d\.]+)%\s*(?:\/\s*([\d\.]+))?\s*\)/i)
  if (!match) return hslString
  let h = parseFloat(match[1])
  let s = parseFloat(match[2])
  let l = parseFloat(match[3])
  const a = match[4] ? parseFloat(match[4]) : undefined
  h = (h + adjustments.hueShift) % 360
  if (h < 0) h += 360
  s = Math.max(0, Math.min(100, s * adjustments.saturationScale))
  l = Math.max(0, Math.min(100, l * adjustments.lightnessScale))
  const prec = (num: number) => parseFloat(num.toFixed(4))
  if (a !== undefined) {
    return `hsl(${prec(h)} ${prec(s)}% ${prec(l)}% / ${prec(a)})`
  }
  return `hsl(${prec(h)} ${prec(s)}% ${prec(l)}%)`
}

export function toHexColor(value: string): string | null {
  const hsl = colorFormatter(String(value).trim(), "hsl", 4)
  const match = hsl.match(/hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*(?:\/\s*([\d.]+))?\)/i)
  if (!match) return null
  const h = ((((parseFloat(match[1]) % 360) + 360) % 360) / 360)
  const s = Math.max(0, Math.min(100, parseFloat(match[2]))) / 100
  const l = Math.max(0, Math.min(100, parseFloat(match[3]))) / 100
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const channel = (t: number) => {
    let x = t
    if (x < 0) x += 1
    if (x > 1) x -= 1
    if (x < 1 / 6) return p + (q - p) * 6 * x
    if (x < 1 / 2) return q
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6
    return p
  }
  const r = Math.round(channel(h + 1 / 3) * 255)
  const g = Math.round(channel(h) * 255)
  const b = Math.round(channel(h - 1 / 3) * 255)
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`
}
