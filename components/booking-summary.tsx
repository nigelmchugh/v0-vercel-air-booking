"use client"

import { PlaneTakeoff, PlaneLanding, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Flight } from "@/components/flight-card"

interface BookingSummaryProps {
  outboundFlight: Flight
  returnFlight?: Flight
  passengers: number
  isRoundTrip: boolean
  onConfirm: () => void
}

export function BookingSummary({
  outboundFlight,
  returnFlight,
  passengers,
  isRoundTrip,
  onConfirm,
}: BookingSummaryProps) {
  const outboundTotal = outboundFlight.price * passengers
  const returnTotal = returnFlight ? returnFlight.price * passengers : 0
  const subtotal = outboundTotal + returnTotal
  const taxes = Math.round(subtotal * 0.1)
  const total = subtotal + taxes

  const canConfirm = isRoundTrip ? !!outboundFlight && !!returnFlight : !!outboundFlight

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-6 text-lg font-semibold">Booking Summary</h3>

      {/* Outbound Flight */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <PlaneTakeoff className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Outbound</p>
            <p className="font-medium">{outboundFlight.flightNumber}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Route</span>
          <span className="font-medium">
            {outboundFlight.from} → {outboundFlight.to}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Time</span>
          <span className="font-medium">
            {outboundFlight.departureTime} - {outboundFlight.arrivalTime}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Duration</span>
          <span className="font-medium">{outboundFlight.duration}</span>
        </div>
      </div>

      {/* Return Flight */}
      {isRoundTrip && (
        <>
          <Separator className="my-4" />
          {returnFlight ? (
            <div className="mb-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <PlaneLanding className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Return</p>
                  <p className="font-medium">{returnFlight.flightNumber}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Route</span>
                <span className="font-medium">
                  {returnFlight.from} → {returnFlight.to}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">
                  {returnFlight.departureTime} - {returnFlight.arrivalTime}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{returnFlight.duration}</span>
              </div>
            </div>
          ) : (
            <div className="mb-4 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
              <PlaneLanding className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-1 text-xs text-muted-foreground">Select a return flight</p>
            </div>
          )}
        </>
      )}

      <Separator className="my-4" />

      {/* Passengers */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Passengers</span>
        <span className="font-medium">{passengers}</span>
      </div>

      <Separator className="my-4" />

      {/* Price Breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Outbound (${outboundFlight.price} x {passengers})
          </span>
          <span>${outboundTotal}</span>
        </div>
        {isRoundTrip && returnFlight && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Return (${returnFlight.price} x {passengers})
            </span>
            <span>${returnTotal}</span>
          </div>
        )}
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

      <Button
        onClick={onConfirm}
        className="w-full gap-2"
        size="lg"
        disabled={!canConfirm}
      >
        <Check className="h-4 w-4" />
        {canConfirm ? "Confirm Booking" : isRoundTrip ? "Select both flights" : "Select a flight"}
      </Button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Free cancellation within 24 hours of booking
      </p>
    </div>
  )
}
