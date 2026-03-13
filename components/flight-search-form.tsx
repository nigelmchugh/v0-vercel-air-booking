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
  { code: "SFO", city: "San Francisco", name: "San Francisco International" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International" },
  { code: "JFK", city: "New York", name: "John F. Kennedy International" },
  { code: "LHR", city: "London", name: "Heathrow Airport" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle" },
  { code: "NRT", city: "Tokyo", name: "Narita International" },
  { code: "SIN", city: "Singapore", name: "Changi Airport" },
  { code: "DXB", city: "Dubai", name: "Dubai International" },
]

interface FlightSearchFormProps {
  onSearch: (searchParams: {
    from: string
    to: string
    departDate: Date
    returnDate?: Date
    passengers: number
    tripType: "roundtrip" | "oneway"
  }) => void
}

export function FlightSearchForm({ onSearch }: FlightSearchFormProps) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [departDate, setDepartDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [passengers, setPassengers] = useState("1")
  const [tripType, setTripType] = useState<"roundtrip" | "oneway">("roundtrip")

  const swapAirports = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  const handleSearch = () => {
    if (from && to && departDate) {
      onSearch({
        from,
        to,
        departDate,
        returnDate: tripType === "roundtrip" ? returnDate : undefined,
        passengers: parseInt(passengers),
        tripType,
      })
    }
  }

  return (
    <div className="w-full rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex gap-4">
        <Button
          variant={tripType === "roundtrip" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setTripType("roundtrip")}
          className={cn(
            "rounded-full",
            tripType === "roundtrip" && "bg-secondary text-secondary-foreground"
          )}
        >
          Round trip
        </Button>
        <Button
          variant={tripType === "oneway" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setTripType("oneway")}
          className={cn(
            "rounded-full",
            tripType === "oneway" && "bg-secondary text-secondary-foreground"
          )}
        >
          One way
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr,auto,1fr,1fr,1fr,auto]">
        {/* From Airport */}
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

        {/* Swap Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={swapAirports}
          className="hidden h-14 w-14 rounded-full border border-border lg:flex"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </Button>

        {/* To Airport */}
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

        {/* Departure Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-14 justify-start bg-input pl-10 text-left font-normal",
                !departDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="absolute left-3 h-4 w-4 text-muted-foreground" />
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

        {/* Return Date */}
        {tripType === "roundtrip" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-14 justify-start bg-input pl-10 text-left font-normal",
                  !returnDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="absolute left-3 h-4 w-4 text-muted-foreground" />
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
              <SelectValue placeholder="Passengers" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Passenger" : "Passengers"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="h-14 gap-2 px-8"
          disabled={!from || !to || !departDate}
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>
    </div>
  )
}
