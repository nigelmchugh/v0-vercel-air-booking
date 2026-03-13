"use client"

import { useState } from "react"
import { CalendarIcon, MapPin, Users, ArrowRightLeft, Search } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const airports = [
  { code: "DUB", city: "Dublin", name: "Dublin Airport" },
  { code: "LHR", city: "London", name: "Heathrow Airport" },
  { code: "LGW", city: "London", name: "Gatwick Airport" },
  { code: "JFK", city: "New York", name: "John F. Kennedy International" },
  { code: "BOS", city: "Boston", name: "Logan International" },
  { code: "AMS", city: "Amsterdam", name: "Schiphol Airport" },
  { code: "BCN", city: "Barcelona", name: "El Prat Airport" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle" },
  { code: "MAD", city: "Madrid", name: "Adolfo Suárez Madrid–Barajas" },
  { code: "FCO", city: "Rome", name: "Fiumicino Airport" },
  { code: "MXP", city: "Milan", name: "Malpensa Airport" },
  { code: "LIS", city: "Lisbon", name: "Humberto Delgado Airport" },
]

interface RouteSearchFormProps {
  defaultFrom?: string
  defaultTo?: string
}

export function RouteSearchForm({ defaultFrom = "DUB", defaultTo }: RouteSearchFormProps) {
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo || "")
  const [departDate, setDepartDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [passengers, setPassengers] = useState("1")
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip")

  const swapAirports = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  return (
    <div className="w-full rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex gap-4">
        <Button
          variant={tripType === "roundtrip" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setTripType("roundtrip")}
          className="rounded-full"
        >
          Round trip
        </Button>
        <Button
          variant={tripType === "oneway" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setTripType("oneway")}
          className="rounded-full"
        >
          One way
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr,auto,1fr,1fr,1fr,auto]">
        {/* From */}
        <div className="relative">
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger className="h-14 bg-input pl-10">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent>
              {airports.map((airport) => (
                <SelectItem key={airport.code} value={airport.code}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{airport.code}</span>
                    <span className="text-muted-foreground">{airport.city}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Swap */}
        <Button
          variant="ghost"
          size="icon"
          onClick={swapAirports}
          className="hidden h-14 w-14 rounded-full border border-border lg:flex"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </Button>

        {/* To */}
        <div className="relative">
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger className="h-14 bg-input pl-10">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
              {airports.map((airport) => (
                <SelectItem key={airport.code} value={airport.code}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{airport.code}</span>
                    <span className="text-muted-foreground">{airport.city}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Depart */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "relative h-14 justify-start bg-input pl-10 text-left font-normal",
                !departDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              {departDate ? format(departDate, "MMM d, yyyy") : "Depart"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={departDate}
              onSelect={setDepartDate}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>

        {/* Return */}
        {tripType === "roundtrip" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "relative h-14 justify-start bg-input pl-10 text-left font-normal",
                  !returnDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                {returnDate ? format(returnDate, "MMM d, yyyy") : "Return"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={setReturnDate}
                initialFocus
                disabled={(date) => date < (departDate || new Date())}
              />
            </PopoverContent>
          </Popover>
        )}

        {/* Passengers */}
        <div className="relative">
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger className="h-14 bg-input pl-10">
              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n} {n === 1 ? "Passenger" : "Passengers"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <Button className="h-14 gap-2 px-8" disabled={!from || !to || !departDate}>
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>
    </div>
  )
}
