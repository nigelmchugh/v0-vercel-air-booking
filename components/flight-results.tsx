"use client"

import { useState } from "react"
import { ArrowUpDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlightCard, type Flight } from "@/components/flight-card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FlightResultsProps {
  flights: Flight[]
  onSelectFlight: (flight: Flight) => void
  selectedFlight?: Flight
}

export function FlightResults({ flights, onSelectFlight, selectedFlight }: FlightResultsProps) {
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">("price")

  const sortedFlights = [...flights].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price
    if (sortBy === "departure") return a.departureTime.localeCompare(b.departureTime)
    return 0
  })

  if (flights.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Available Flights</h2>
          <p className="text-sm text-muted-foreground">
            {flights.length} flight{flights.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort by
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("price")}>
                Price (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("departure")}>
                Departure Time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("duration")}>
                Duration
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedFlights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onSelect={onSelectFlight}
            selected={selectedFlight?.id === flight.id}
          />
        ))}
      </div>
    </div>
  )
}
