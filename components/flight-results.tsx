"use client"

import { useState } from "react"
import { ArrowUpDown, Filter, PlaneTakeoff, PlaneLanding, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlightCard, type Flight } from "@/components/flight-card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FlightResultsProps {
  outboundFlights: Flight[]
  returnFlights?: Flight[]
  onSelectOutbound: (flight: Flight) => void
  onSelectReturn?: (flight: Flight) => void
  selectedOutbound?: Flight
  selectedReturn?: Flight
  isRoundTrip: boolean
  from: string
  to: string
}

export function FlightResults({
  outboundFlights,
  returnFlights,
  onSelectOutbound,
  onSelectReturn,
  selectedOutbound,
  selectedReturn,
  isRoundTrip,
  from,
  to,
}: FlightResultsProps) {
  const [outboundSortBy, setOutboundSortBy] = useState<"price" | "duration" | "departure">("price")
  const [returnSortBy, setReturnSortBy] = useState<"price" | "duration" | "departure">("price")

  const sortFlights = (flights: Flight[], sortBy: "price" | "duration" | "departure") => {
    return [...flights].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "departure") return a.departureTime.localeCompare(b.departureTime)
      return 0
    })
  }

  const sortedOutbound = sortFlights(outboundFlights, outboundSortBy)
  const sortedReturn = returnFlights ? sortFlights(returnFlights, returnSortBy) : []

  if (outboundFlights.length === 0) {
    return null
  }

  const showReturnSection = isRoundTrip && selectedOutbound && returnFlights && returnFlights.length > 0

  return (
    <div className="space-y-8">
      {/* Outbound Flights Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <PlaneTakeoff className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Outbound Flight</h2>
                {selectedOutbound && (
                  <Badge variant="secondary" className="gap-1">
                    <Check className="h-3 w-3" />
                    Selected
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {from} to {to} · {outboundFlights.length} flight{outboundFlights.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setOutboundSortBy("price")}>
                  Price (Low to High)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOutboundSortBy("departure")}>
                  Departure Time
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOutboundSortBy("duration")}>
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
          {sortedOutbound.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              onSelect={onSelectOutbound}
              selected={selectedOutbound?.id === flight.id}
            />
          ))}
        </div>
      </div>

      {/* Return Flights Section */}
      {isRoundTrip && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <PlaneLanding className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Return Flight</h2>
                  {selectedReturn && (
                    <Badge variant="secondary" className="gap-1">
                      <Check className="h-3 w-3" />
                      Selected
                    </Badge>
                  )}
                </div>
                {showReturnSection ? (
                  <p className="text-sm text-muted-foreground">
                    {to} to {from} · {returnFlights.length} flight{returnFlights.length !== 1 ? "s" : ""} available
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select an outbound flight first
                  </p>
                )}
              </div>
            </div>
            {showReturnSection && (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setReturnSortBy("price")}>
                      Price (Low to High)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setReturnSortBy("departure")}>
                      Departure Time
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setReturnSortBy("duration")}>
                      Duration
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            )}
          </div>

          {showReturnSection ? (
            <div className="space-y-4">
              {sortedReturn.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  onSelect={onSelectReturn!}
                  selected={selectedReturn?.id === flight.id}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
              <PlaneLanding className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Return flights will appear here after you select an outbound flight
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
