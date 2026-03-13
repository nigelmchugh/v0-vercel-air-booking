"use client"

import { Plane, Clock, Luggage, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface Flight {
  id: string
  airline: string
  flightNumber: string
  from: string
  fromCity: string
  to: string
  toCity: string
  departureTime: string
  arrivalTime: string
  duration: string
  stops: number
  price: number
  class: "economy" | "business" | "first"
  amenities: string[]
}

interface FlightCardProps {
  flight: Flight
  onSelect: (flight: Flight) => void
  selected?: boolean
}

export function FlightCard({ flight, onSelect, selected }: FlightCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 transition-all hover:border-muted-foreground/50",
        selected && "border-primary ring-1 ring-primary"
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
            <Plane className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">{flight.airline}</p>
            <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between gap-4 lg:justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold">{flight.departureTime}</p>
            <p className="text-sm text-muted-foreground">{flight.from}</p>
            <p className="text-xs text-muted-foreground">{flight.fromCity}</p>
          </div>

          <div className="flex flex-1 flex-col items-center gap-1 px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{flight.duration}</span>
            </div>
            <div className="relative flex w-full items-center">
              <div className="h-px flex-1 bg-border" />
              <Plane className="mx-2 h-4 w-4 rotate-90 text-muted-foreground" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="text-xs text-muted-foreground">
              {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold">{flight.arrivalTime}</p>
            <p className="text-sm text-muted-foreground">{flight.to}</p>
            <p className="text-xs text-muted-foreground">{flight.toCity}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {flight.amenities.includes("wifi") && (
              <Badge variant="secondary" className="gap-1">
                <Wifi className="h-3 w-3" />
                WiFi
              </Badge>
            )}
            {flight.amenities.includes("luggage") && (
              <Badge variant="secondary" className="gap-1">
                <Luggage className="h-3 w-3" />
                Bags
              </Badge>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">${flight.price}</p>
            <p className="text-sm capitalize text-muted-foreground">{flight.class}</p>
          </div>
          <Button onClick={() => onSelect(flight)} variant={selected ? "secondary" : "default"}>
            {selected ? "Selected" : "Select"}
          </Button>
        </div>
      </div>
    </div>
  )
}
