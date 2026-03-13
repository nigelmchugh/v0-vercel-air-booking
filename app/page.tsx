"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { FlightSearchForm } from "@/components/flight-search-form"
import { FlightResults } from "@/components/flight-results"
import { BookingSummary } from "@/components/booking-summary"
import { BookingConfirmation } from "@/components/booking-confirmation"
import { PopularDestinations } from "@/components/popular-destinations"
import { Stats } from "@/components/stats"
import { Footer } from "@/components/footer"
import type { Flight } from "@/components/flight-card"

// City name lookup — Aer Lingus route network
const CITY_NAMES: Record<string, string> = {
  DUB: "Dublin",
  LHR: "London",
  LGW: "London Gatwick",
  JFK: "New York",
  BOS: "Boston",
  AMS: "Amsterdam",
  BCN: "Barcelona",
  CDG: "Paris",
  MAD: "Madrid",
  FCO: "Rome",
  MXP: "Milan",
  LIS: "Lisbon",
  SFO: "San Francisco",
  LAX: "Los Angeles",
  ORD: "Chicago",
  NRT: "Tokyo",
  SIN: "Singapore",
  DXB: "Dubai",
}

// Realistic flight durations (minutes)
const ROUTE_DURATIONS: Record<string, number> = {
  "DUB-LHR": 80,  "LHR-DUB": 80,
  "DUB-LGW": 85,  "LGW-DUB": 85,
  "DUB-JFK": 430, "JFK-DUB": 390,
  "DUB-BOS": 390, "BOS-DUB": 360,
  "DUB-AMS": 105, "AMS-DUB": 105,
  "DUB-BCN": 155, "BCN-DUB": 155,
  "DUB-CDG": 100, "CDG-DUB": 100,
  "DUB-MAD": 145, "MAD-DUB": 145,
  "DUB-FCO": 170, "FCO-DUB": 170,
  "DUB-LIS": 145, "LIS-DUB": 145,
}

// Base fares per route
const BASE_PRICES: Record<string, number> = {
  "DUB-LHR": 49,  "LHR-DUB": 49,  "DUB-LGW": 45,  "LGW-DUB": 45,
  "DUB-JFK": 279, "JFK-DUB": 299, "DUB-BOS": 259, "BOS-DUB": 279,
  "DUB-AMS": 79,  "AMS-DUB": 79,  "DUB-BCN": 89,  "BCN-DUB": 89,
  "DUB-CDG": 85,  "CDG-DUB": 85,  "DUB-MAD": 99,  "MAD-DUB": 99,
  "DUB-FCO": 119, "FCO-DUB": 119, "DUB-LIS": 95,  "LIS-DUB": 95,
}

// Departure slots throughout the day
const DEPARTURE_SLOTS = ["06:30", "08:15", "10:45", "13:20", "16:00", "18:45", "21:10"]

function generateFlights(from: string, to: string): Flight[] {
  const routeKey = `${from}-${to}`
  const baseDuration = ROUTE_DURATIONS[routeKey] || 120
  const basePrice = BASE_PRICES[routeKey] || 149

  return DEPARTURE_SLOTS.map((dep, i) => {
    const [dh, dm] = dep.split(":").map(Number)
    const arrMins = dh * 60 + dm + baseDuration + Math.floor(Math.random() * 10 - 5)
    const arrHour = Math.floor(arrMins / 60) % 24
    const arrMin = arrMins % 60
    const dH = Math.floor(baseDuration / 60)
    const dM = baseDuration % 60

    return {
      id: `flight-${from}-${to}-${i}`,
      airline: "Vercel Air",
      flightNumber: `VA${200 + i * 17}`,
      from,
      fromCity: CITY_NAMES[from] || from,
      to,
      toCity: CITY_NAMES[to] || to,
      departureTime: dep,
      arrivalTime: `${arrHour.toString().padStart(2, "0")}:${arrMin.toString().padStart(2, "0")}`,
      duration: `${dH}h ${dM}m`,
      stops: 0,
      price: Math.round((basePrice + i * 12 + Math.floor(Math.random() * 25)) / 5) * 5,
      class: i === 0 ? "business" : "economy",
      amenities: i % 2 === 0 ? ["wifi", "luggage"] : ["wifi"],
    }
  })
}

// Fire-and-forget: push search results into Vercel KV via our ingest endpoint.
// This is the "scrape" — every user search auto-populates the SEO landing pages.
async function captureToKv(from: string, to: string, flights: Flight[]) {
  try {
    const res = await fetch("/api/ingest-fares", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: from,
        destination: to,
        originCity: CITY_NAMES[from] || from,
        destinationCity: CITY_NAMES[to] || to,
        flights,
      }),
    })
    const data = await res.json()
    console.log("[captureToKv]", data.message)
  } catch {
    // Non-critical — landing pages fall back to mock data
  }
}

type BookingStage = "search" | "results" | "confirmed"

export default function Home() {
  const [stage, setStage] = useState<BookingStage>("search")
  const [searchParams, setSearchParams] = useState<{
    from: string
    to: string
    passengers: number
  } | null>(null)
  const [flights, setFlights] = useState<Flight[]>([])
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [bookingRef, setBookingRef] = useState("")

  const handleSearch = (params: {
    from: string
    to: string
    departDate: Date
    returnDate?: Date
    passengers: number
    tripType: "roundtrip" | "oneway"
  }) => {
    const generatedFlights = generateFlights(params.from, params.to)

    setSearchParams({ from: params.from, to: params.to, passengers: params.passengers })
    setFlights(generatedFlights)
    setSelectedFlight(null)
    setStage("results")

    // Capture fares to KV in the background — powers SEO landing pages
    captureToKv(params.from, params.to, generatedFlights)
  }

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight)
  }

  const handleConfirmBooking = () => {
    const ref = `VA${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    setBookingRef(ref)
    setStage("confirmed")
  }

  const handleNewBooking = () => {
    setStage("search")
    setFlights([])
    setSelectedFlight(null)
    setSearchParams(null)
    setBookingRef("")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {stage === "confirmed" && selectedFlight && searchParams ? (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <BookingConfirmation
              flight={selectedFlight}
              passengers={searchParams.passengers}
              bookingRef={bookingRef}
              onNewBooking={handleNewBooking}
            />
          </div>
        ) : (
          <>
            {/* Hero */}
            <section className="relative overflow-hidden py-16 lg:py-24">
              <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background" />
              </div>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                  <h1 className="text-balance text-4xl font-bold tracking-tight lg:text-6xl">
                    The premium way
                    <br />
                    to book flights.
                  </h1>
                  <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                    Search hundreds of destinations and book your next adventure with Vercel Air.
                    Premium service, competitive prices.
                  </p>
                </div>

                <FlightSearchForm onSearch={handleSearch} />
              </div>
            </section>

            {/* Results */}
            {stage === "results" && flights.length > 0 && (
              <section className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
                    <FlightResults
                      flights={flights}
                      onSelectFlight={handleSelectFlight}
                      selectedFlight={selectedFlight || undefined}
                    />
                    {selectedFlight && searchParams && (
                      <div className="lg:sticky lg:top-8 lg:self-start">
                        <BookingSummary
                          flight={selectedFlight}
                          passengers={searchParams.passengers}
                          onConfirm={handleConfirmBooking}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {stage === "search" && (
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <PopularDestinations />
              </div>
            )}

            {stage === "search" && <Stats />}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
