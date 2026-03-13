"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"

const destinations = [
  {
    city: "London",
    country: "United Kingdom",
    price: 49,
    slug: "flights-from-dublin-to-london",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop",
  },
  {
    city: "New York",
    country: "United States",
    price: 279,
    slug: "flights-from-dublin-to-new-york",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop",
  },
  {
    city: "Amsterdam",
    country: "Netherlands",
    price: 79,
    slug: "flights-from-dublin-to-amsterdam",
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop",
  },
  {
    city: "Barcelona",
    country: "Spain",
    price: 89,
    slug: "flights-from-dublin-to-barcelona",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop",
  },
]

export function PopularDestinations() {
  return (
    <section className="py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Popular Routes from Dublin</h2>
          <p className="text-muted-foreground">Our most booked destinations from DUB</p>
        </div>
        <button className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
          View all
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {destinations.map((destination) => (
          <Link
            key={destination.city}
            href={`/flights/${destination.slug}`}
            className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={destination.image}
                alt={destination.city}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-lg font-semibold">{destination.city}</p>
                <p className="text-sm text-muted-foreground">{destination.country}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">From</span>
                <span className="text-xl font-bold">€{destination.price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
