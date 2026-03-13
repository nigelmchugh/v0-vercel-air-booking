"use client"

import { Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FeaturedFlight } from "@/lib/fare-data"

interface RouteFlightCardProps {
  flight: FeaturedFlight
  origin: string
  originCode: string
  destination: string
  destinationCode: string
}

export function RouteFlightCard({
  flight,
  origin,
  originCode,
  destination,
  destinationCode,
}: RouteFlightCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-6">
        {/* Airline */}
        <div className="w-20 shrink-0">
          <p className="text-xs text-muted-foreground">Vercel Air</p>
          <p className="text-sm font-semibold">{flight.flightNumber}</p>
        </div>

        {/* Times */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xl font-bold">{flight.departureTime}</p>
            <p className="text-xs text-muted-foreground">{originCode}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs text-muted-foreground">{flight.duration}</p>
            <div className="flex items-center gap-1">
              <div className="h-px w-12 bg-border" />
              <Plane className="h-3 w-3 rotate-90 text-muted-foreground" />
              <div className="h-px w-12 bg-border" />
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">Direct</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{flight.arrivalTime}</p>
            <p className="text-xs text-muted-foreground">{destinationCode}</p>
          </div>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="text-right">
          <p className="text-2xl font-bold">€{flight.price}</p>
          <p className="text-xs text-muted-foreground">per person</p>
        </div>
        <Button size="sm" className="shrink-0">
          Select
        </Button>
      </div>
    </div>
  )
}
