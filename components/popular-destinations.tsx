"use client"

import { ArrowRight } from "lucide-react"

const destinations = [
  {
    city: "Tokyo",
    country: "Japan",
    price: 899,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
  },
  {
    city: "Paris",
    country: "France",
    price: 649,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
  },
  {
    city: "Dubai",
    country: "UAE",
    price: 749,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
  },
  {
    city: "Singapore",
    country: "Singapore",
    price: 799,
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop",
  },
]

export function PopularDestinations() {
  return (
    <section className="py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Popular Destinations</h2>
          <p className="text-muted-foreground">Discover our most booked routes</p>
        </div>
        <button className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
          View all
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {destinations.map((destination) => (
          <div
            key={destination.city}
            className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-muted-foreground/50"
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
                <span className="text-xl font-bold">${destination.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
