"use client"

import { CheckCircle, Plane, Download, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Flight } from "@/components/flight-card"

interface BookingConfirmationProps {
  flight: Flight
  passengers: number
  bookingRef: string
  onNewBooking: () => void
}

export function BookingConfirmation({
  flight,
  passengers,
  bookingRef,
  onNewBooking,
}: BookingConfirmationProps) {
  const total = Math.round(flight.price * passengers * 1.1)

  return (
    <div className="mx-auto max-w-2xl py-12 text-center">
      <div className="mb-8 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
      </div>

      <h1 className="mb-2 text-3xl font-bold">Booking Confirmed!</h1>
      <p className="mb-8 text-muted-foreground">
        Your flight has been successfully booked. A confirmation email has been sent.
      </p>

      <div className="mb-8 rounded-xl border border-border bg-card p-8">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Booking Reference</span>
          <span className="rounded-md bg-secondary px-3 py-1 font-mono text-lg font-bold">
            {bookingRef}
          </span>
        </div>

        <Separator className="my-6" />

        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold">{flight.from}</p>
            <p className="text-sm text-muted-foreground">{flight.fromCity}</p>
            <p className="mt-1 text-lg font-medium">{flight.departureTime}</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
              <Plane className="h-5 w-5 rotate-90" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{flight.duration}</p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold">{flight.to}</p>
            <p className="text-sm text-muted-foreground">{flight.toCity}</p>
            <p className="mt-1 text-lg font-medium">{flight.arrivalTime}</p>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Airline</p>
            <p className="font-medium">{flight.airline}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Flight</p>
            <p className="font-medium">{flight.flightNumber}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Class</p>
            <p className="font-medium capitalize">{flight.class}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Passengers</p>
            <p className="font-medium">{passengers}</p>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex items-center justify-center gap-4">
          <span className="text-muted-foreground">Total Paid</span>
          <span className="text-3xl font-bold">${total}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download Ticket
        </Button>
        <Button variant="outline" className="gap-2">
          <Mail className="h-4 w-4" />
          Email Itinerary
        </Button>
        <Button onClick={onNewBooking} className="gap-2">
          <Plane className="h-4 w-4" />
          Book Another Flight
        </Button>
      </div>
    </div>
  )
}
