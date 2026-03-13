"use client"

import { Plane, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Flight } from "@/components/flight-card"

interface BookingSummaryProps {
  flight: Flight
  passengers: number
  onConfirm: () => void
}

export function BookingSummary({ flight, passengers, onConfirm }: BookingSummaryProps) {
  const subtotal = flight.price * passengers
  const taxes = Math.round(subtotal * 0.1)
  const total = subtotal + taxes

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6 text-lg font-semibold">Booking Summary</h3>

      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <Plane className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">{flight.airline}</p>
            <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Route</span>
          <span className="font-medium">
            {flight.from} → {flight.to}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Departure</span>
          <span className="font-medium">{flight.departureTime}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Arrival</span>
          <span className="font-medium">{flight.arrivalTime}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Duration</span>
          <span className="font-medium">{flight.duration}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Class</span>
          <span className="font-medium capitalize">{flight.class}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Passengers</span>
          <span className="font-medium">{passengers}</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            ${flight.price} × {passengers} passenger{passengers > 1 ? "s" : ""}
          </span>
          <span>${subtotal}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Taxes & fees</span>
          <span>${taxes}</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="mb-6 flex items-center justify-between">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-bold">${total}</span>
      </div>

      <Button onClick={onConfirm} className="w-full gap-2" size="lg">
        <Check className="h-4 w-4" />
        Confirm Booking
      </Button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Free cancellation within 24 hours of booking
      </p>
    </div>
  )
}
