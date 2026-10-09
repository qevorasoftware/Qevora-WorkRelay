import { useId } from 'react'

export interface AreaChartPoint {
  label: string
  value: number
}

/** Lightweight SVG area chart with gradient fill, grid and pulse on the
 *  latest point. No chart library needed — keeps the bundle lean. */
export function AreaChart({ data, height = 190, ariaLabel }: {
  data: AreaChartPoint[]
  height?: number
  ariaLabel: string
}) {
  const uid = useId().replace(/[:]/g, '')
  const w = 640
  const h = height
  const padX = 12
  const padTop = 16
  const padBottom = 28

  const maxVal = Math.max(...data.map((d) => d.value))
  const niceMax = Math.max(4, Math.ceil(maxVal / 4) * 4)
  const stepX = (w - padX * 2) / (data.length - 1)
  const yFor = (v: number) => padTop + (1 - v / niceMax) * (h - padTop - padBottom)
  const pts = data.map((d, i) => [padX + i * stepX, yFor(d.value)] as const)

  // Smooth path (Catmull–Rom → cubic Bézier)
  let path = `M ${pts[0][0]},${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(pts.length - 1, i + 2)]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    path += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  const areaPath = `${path} L ${pts[pts.length - 1][0]},${h - padBottom} L ${pts[0][0]},${h - padBottom} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel} className="w-full select-none">
      <defs>
        <linearGradient id={`area-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.32" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`line-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>

      {[0, 1, 2, 3].map((i) => {
        const gy = padTop + (i * (h - padTop - padBottom)) / 3
        return (
          <line
            key={i}
            x1={padX}
            x2={w - padX}
            y1={gy}
            y2={gy}
            stroke="var(--line)"
            strokeDasharray="3 7"
            strokeWidth="1"
          />
        )
      })}

      <path d={areaPath} fill={`url(#area-${uid})`} />
      <path d={path} fill="none" stroke={`url(#line-${uid})`} strokeWidth="2.5" strokeLinecap="round" />

      {pts.map(([px, py], i) => (
        <g key={i}>
          {i === pts.length - 1 && (
            <circle className="chart-pulse" cx={px} cy={py} r="6" fill="var(--accent)" />
          )}
          <circle
            cx={px}
            cy={py}
            r={i === pts.length - 1 ? 4.5 : 3}
            fill={i === pts.length - 1 ? 'var(--accent)' : 'var(--card)'}
            stroke="var(--accent)"
            strokeWidth="2"
          />
          <circle cx={px} cy={py} r="14" fill="transparent">
            <title>{`${data[i].label}: ${data[i].value}`}</title>
          </circle>
          {i % 2 === 0 && (
            <text x={px} y={h - 8} textAnchor="middle" fontSize="10" fill="var(--text-2)" fontWeight="500">
              {data[i].label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
