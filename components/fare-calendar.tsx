"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts"
import type { MonthlyFare } from "@/lib/fare-data"

interface FareCalendarProps {
  fares: MonthlyFare[]
  currency?: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-lg font-bold text-primary">€{payload[0].value}</p>
        <p className="text-xs text-muted-foreground">Lowest fare</p>
      </div>
    )
  }
  return null
}

export function FareCalendar({ fares, currency = "€" }: FareCalendarProps) {
  const minFare = Math.min(...fares.map((f) => f.lowestFare))

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Lowest fares by month</h3>
          <p className="text-sm text-muted-foreground">
            Fares shown are the lowest available. Updated in real time.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block h-3 w-3 rounded-sm bg-primary/30" />
          Standard
          <span className="ml-2 inline-block h-3 w-3 rounded-sm bg-primary" />
          Best value
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={fares} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(v) => `€${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", radius: 4 }} />
          <Bar dataKey="lowestFare" radius={[4, 4, 0, 0]}>
            {fares.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.lowestFare === minFare ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.35)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-12">
        {fares.map((fare) => (
          <div
            key={fare.month}
            className={`cursor-pointer rounded-lg border p-2 text-center transition-all hover:border-primary ${
              fare.lowestFare === minFare
                ? "border-primary bg-primary/10"
                : "border-border bg-background"
            }`}
          >
            <p className="text-xs text-muted-foreground">{fare.month}</p>
            <p className={`text-sm font-bold ${fare.lowestFare === minFare ? "text-primary" : ""}`}>
              €{fare.lowestFare}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
