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
  { code: "DUB", city: "Dublin",          name: "Dublin Airport" },
  { code: "LHR", city: "London",          name: "Heathrow Airport" },
  { code: "LGW", city: "London Gatwick",  name: "Gatwick Airport" },
  { code: "JFK", city: "New York",        name: "John F. Kennedy International" },
  { code: "BOS", city: "Boston",          name: "Logan International" },
  { code: "AMS", city: "Amsterdam",       name: "Amsterdam Schiphol" },
  { code: "BCN", city: "Barcelona",       name: "Barcelona El Prat" },
  { code: "CDG", city: "Paris",           name: "Charles de Gaulle" },
  { code: "MAD", city: "Madrid",          name: "Adolfo Suárez Madrid–Barajas" },
  { code: "FCO", city: "Rome",            name: "Leonardo da Vinci–Fiumicino" },
  { code: "MXP", city: "Milan",           name: "Milan Malpensa" },
  { code: "LIS", city: "Lisbon",          name: "Humberto Delgado Airport" },
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
    console.log("[v0] handleSearch called", { from, to, departDate, tripType, passengers })
    if (from && to && departDate) {
      console.log("[v0] Calling onSearch with params")
      onSearch({
        from,
        to,
        departDate,
        returnDate: tripType === "roundtrip" ? returnDate : undefined,
        passengers: parseInt(passengers),
        tripType,
      })
    } else {
      console.log("[v0] Search blocked - missing fields", { from: !!from, to: !!to, departDate: !!departDate })
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

      <div className="flex flex-col gap-4">
        {/* Row 1: From and To */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
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

          <Button
            variant="ghost"
            size="icon"
            onClick={swapAirports}
            className="h-14 w-14 shrink-0 rounded-full border border-border"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <div className="relative flex-1">
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
        </div>

        {/* Row 2: Depart and Return */}
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-14 flex-1 justify-start bg-input pl-10 text-left font-normal",
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

          {tripType === "roundtrip" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-14 flex-1 justify-start bg-input pl-10 text-left font-normal",
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
        </div>

        {/* Row 3: Passengers and Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
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

          <Button
            onClick={handleSearch}
            className="h-14 gap-2 px-8"
            disabled={!from || !to || !departDate}
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
