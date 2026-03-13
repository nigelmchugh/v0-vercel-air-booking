"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { FlightSearchForm } from "@/components/flight-search-form"
import { FlightResults } from "@/components/flight-results"
import { BookingSummary } from "@/components/booking-summary"
import { BookingConfirmation } from "@/components/booking-confirmation"
import { PopularDestinations } from "@/components/popular-destinations"
import { Stats } from "@/components/stats"
import { Footer } from "@/components/footer"
import type { Flight } from "@/components/flight-card"

// Sample flight data
const generateFlights = (from: string, to: string): Flight[] => {
  const airlines = ["Vercel Air", "Sky Express", "Global Airways", "Pacific Lines"]
  const flights: Flight[] = []

  const fromCities: Record<string, string> = {
    SFO: "San Francisco",
    LAX: "Los Angeles",
    JFK: "New York",
    LHR: "London",
    CDG: "Paris",
    NRT: "Tokyo",
    SIN: "Singapore",
    DXB: "Dubai",
  }

  for (let i = 0; i < 6; i++) {
    const departHour = 6 + i * 3
    const duration = 2 + Math.floor(Math.random() * 10)
    const arriveHour = (departHour + duration) % 24

    flights.push({
      id: `flight-${i}`,
      airline: airlines[i % airlines.length],
      flightNumber: `VA${100 + i * 23}`,
      from,
      fromCity: fromCities[from] || from,
      to,
      toCity: fromCities[to] || to,
      departureTime: `${departHour.toString().padStart(2, "0")}:${(i * 15) % 60 === 0 ? "00" : ((i * 15) % 60).toString().padStart(2, "0")}`,
      arrivalTime: `${arriveHour.toString().padStart(2, "0")}:${(30 + i * 10) % 60 === 0 ? "00" : ((30 + i * 10) % 60).toString().padStart(2, "0")}`,
      duration: `${duration}h ${(i * 15) % 60}m`,
      stops: i % 3,
      price: 299 + Math.floor(Math.random() * 500) + i * 50,
      class: i % 4 === 0 ? "business" : i % 6 === 0 ? "first" : "economy",
      amenities: i % 2 === 0 ? ["wifi", "luggage"] : ["wifi"],
    })
  }

  return flights
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
    setSearchParams({
      from: params.from,
      to: params.to,
      passengers: params.passengers,
    })
    setFlights(generateFlights(params.from, params.to))
    setSelectedFlight(null)
    setStage("results")
  }

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight)
  }

  const handleConfirmBooking = () => {
    // Generate random booking reference
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
            {/* Hero Section */}
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

            {/* Results Section */}
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

            {/* Popular Destinations */}
            {stage === "search" && (
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <PopularDestinations />
              </div>
            )}

            {/* Stats */}
            {stage === "search" && <Stats />}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
