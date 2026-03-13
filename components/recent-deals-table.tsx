"use client"

import { PlaneTakeoff, PlaneLanding, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PriceObservation } from "@/app/api/ingest-fares/route"

interface RecentDealsTableProps {
  deals: PriceObservation[]
  origin: string
  originCode: string
  destination: string
  destinationCode: string
  currency?: string
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
}

function formatDate(dateString?: string): string {
  if (!dateString) return "Flexible"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" })
}

export function RecentDealsTable({
  deals,
  origin,
  originCode,
  destination,
  destinationCode,
  currency = "€",
}: RecentDealsTableProps) {
  if (deals.length === 0) {
    return null
  }

  // Sort by most recent first
  const sortedDeals = [...deals].sort(
    (a, b) => new Date(b.seenAt).getTime() - new Date(a.seenAt).getTime()
  )

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border p-6">
        <h3 className="text-lg font-semibold">
          Book {origin} to {destination} flight deals
        </h3>
        <p className="text-sm text-muted-foreground">
          Recent prices found by travelers
        </p>
      </div>

      {/* Mobile view */}
      <div className="divide-y divide-border md:hidden">
        {sortedDeals.slice(0, 10).map((deal, index) => (
          <div key={index} className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span>{originCode}</span>
                <PlaneTakeoff className="h-3 w-3 text-muted-foreground" />
                <span>{destinationCode}</span>
              </div>
              <p className="text-xs text-muted-foreground capitalize">
                {deal.fareType} / Economy
              </p>
              <p className="text-xs text-muted-foreground">
                Depart: {formatDate(deal.departDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">
                From {currency}{deal.price}
              </p>
              <p className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Seen: {formatTimeAgo(deal.seenAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/30 text-left text-sm">
            <tr>
              <th className="px-6 py-3 font-medium text-muted-foreground">From</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">To</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Fare Type</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Dates</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Price</th>
              <th className="px-6 py-3 font-medium text-muted-foreground">Last Seen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedDeals.slice(0, 10).map((deal, index) => (
              <tr key={index} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <PlaneTakeoff className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{origin}</p>
                      <p className="text-xs text-muted-foreground">{originCode}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <PlaneLanding className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{destination}</p>
                      <p className="text-xs text-muted-foreground">{destinationCode}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm capitalize">{deal.fareType}</p>
                  <p className="text-xs text-muted-foreground">Economy</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm">Depart: {formatDate(deal.departDate)}</p>
                  {deal.returnDate && (
                    <p className="text-xs text-muted-foreground">
                      Return: {formatDate(deal.returnDate)}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-lg font-bold">
                    {currency}{deal.price}*
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatTimeAgo(deal.seenAt)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">
          * Fares displayed include air transportation charges, taxes and fees. Fares displayed have been collected within the last 24 hours and may no longer be available at time of booking.
        </p>
      </div>
    </div>
  )
}
