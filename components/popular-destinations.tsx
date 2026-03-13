"use client"

import { ArrowRight, PlaneTakeoff, PlaneLanding } from "lucide-react"
import Link from "next/link"

const destinations = [
  {
    city: "London",
    cityCode: "london",
    country: "United Kingdom",
    priceFrom: 49,
    priceTo: 49,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop",
  },
  {
    city: "New York",
    cityCode: "new-york",
    country: "United States",
    priceFrom: 279,
    priceTo: 299,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
  },
  {
    city: "Amsterdam",
    cityCode: "amsterdam",
    country: "Netherlands",
    priceFrom: 79,
    priceTo: 79,
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop",
  },
  {
    city: "Barcelona",
    cityCode: "barcelona",
    country: "Spain",
    priceFrom: 89,
    priceTo: 89,
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop",
  },
]

function DestinationCard({ destination }: { destination: typeof destinations[0] }) {
  const fromDublinSlug = `flights-from-dublin-to-${destination.cityCode}`
  const toDublinSlug = `flights-from-${destination.cityCode}-to-dublin`

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative h-40 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.city}
          className="h-full w-full object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <p className="text-lg font-semibold">{destination.city}</p>
          <p className="text-sm text-muted-foreground">{destination.country}</p>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <Link
          href={`/flights/${fromDublinSlug}`}
          className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-3 py-2 transition-colors hover:bg-secondary"
        >
          <div className="flex items-center gap-2">
            <PlaneTakeoff className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Dublin to {destination.city}</span>
          </div>
          <span className="text-sm font-semibold">from €{destination.priceFrom}</span>
        </Link>
        <Link
          href={`/flights/${toDublinSlug}`}
          className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-3 py-2 transition-colors hover:bg-secondary"
        >
          <div className="flex items-center gap-2">
            <PlaneLanding className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{destination.city} to Dublin</span>
          </div>
          <span className="text-sm font-semibold">from €{destination.priceTo}</span>
        </Link>
      </div>
    </div>
  )
}

export function PopularDestinations() {
  return (
    <section className="py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Popular Destinations</h2>
          <p className="text-muted-foreground">Flights to and from Dublin</p>
        </div>
        <button className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
          View all routes
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {destinations.map((destination) => (
          <DestinationCard key={destination.cityCode} destination={destination} />
        ))}
      </div>
    </section>
  )
}
