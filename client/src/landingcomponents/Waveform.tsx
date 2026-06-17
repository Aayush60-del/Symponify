interface WaveformProps {
  barCount?: number
  height?: number
  color?: string
  playing?: boolean
}

export default function Waveform({ barCount = 32, height = 64, color = 'var(--accent)', playing = true }: WaveformProps) {
  const bars = Array.from({ length: barCount }, (_, i) => i)

  return (
    <div
      className="flex items-end gap-[2px]"
      style={{ height: `${height}px` }}
      aria-hidden="true"
    >
      {bars.map((i) => {
        const minH = 10 + Math.random() * 10
        const maxH = 30 + Math.random() * 70
        const dur = 0.6 + Math.random() * 0.9
        const delay = (i / barCount) * 0.6

        return (
          <div
            key={i}
            className="waveform-bar rounded-full flex-1"
            style={{
              background: color,
              height: `${maxH}%`,
              minHeight: `${minH}%`,
              '--dur': playing ? `${dur}s` : '99s',
              '--delay': `${delay}s`,
              opacity: playing ? 0.75 + (i % 5) * 0.05 : 0.3,
            } as React.CSSProperties}
          />
        )
      })}
    </div>
  )
}