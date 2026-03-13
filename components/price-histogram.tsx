"use client"

import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, ReferenceLine } from "recharts"
import type { PriceObservation } from "@/app/api/ingest-fares/route"

interface PriceHistogramProps {
  priceHistory: PriceObservation[]
  currency?: string
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-lg font-bold text-primary">€{data.range}</p>
        <p className="text-sm text-muted-foreground">{data.count} search{data.count !== 1 ? "es" : ""}</p>
      </div>
    )
  }
  return null
}

export function PriceHistogram({ priceHistory, currency = "€" }: PriceHistogramProps) {
  const histogramData = useMemo(() => {
    if (priceHistory.length === 0) return []

    const prices = priceHistory.map(p => p.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    // Create 10 buckets
    const bucketCount = 10
    const bucketSize = Math.ceil((maxPrice - minPrice + 1) / bucketCount)
    
    const buckets: { range: string; min: number; max: number; count: number }[] = []
    
    for (let i = 0; i < bucketCount; i++) {
      const min = minPrice + i * bucketSize
      const max = min + bucketSize - 1
      buckets.push({
        range: `${min}-${max}`,
        min,
        max,
        count: prices.filter(p => p >= min && p <= max).length,
      })
    }
    
    return buckets.filter(b => b.count > 0)
  }, [priceHistory])

  const stats = useMemo(() => {
    if (priceHistory.length === 0) return null
    const prices = priceHistory.map(p => p.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    return { min, max, avg }
  }, [priceHistory])

  if (priceHistory.length === 0 || histogramData.length === 0) {
    return null
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Price Distribution</h3>
          <p className="text-sm text-muted-foreground">
            Based on {priceHistory.length} recent searches
          </p>
        </div>
        {stats && (
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Lowest</p>
              <p className="font-bold text-green-600">{currency}{stats.min}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="font-bold">{currency}{stats.avg}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Highest</p>
              <p className="font-bold text-red-600">{currency}{stats.max}</p>
            </div>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={histogramData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <XAxis
            dataKey="range"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            angle={-45}
            textAnchor="end"
            height={50}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", radius: 4 }} />
          {stats && (
            <ReferenceLine
              x={histogramData.find(d => d.min <= stats.avg && d.max >= stats.avg)?.range}
              stroke="hsl(var(--primary))"
              strokeDasharray="3 3"
              label={{ value: "Avg", position: "top", fontSize: 10 }}
            />
          )}
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {histogramData.map((entry, index) => {
              const isLowest = stats && entry.min <= stats.min && entry.max >= stats.min
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={isLowest ? "hsl(142.1 76.2% 36.3%)" : "hsl(var(--primary) / 0.5)"}
                />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
