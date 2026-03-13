import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { MapPin, Clock, Calendar, Zap, Globe } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FareCalendar } from "@/components/fare-calendar"
import { RouteFlightCard } from "@/components/route-flight-card"
import { RouteSearchForm } from "@/components/route-search-form"
import {
  ROUTES,
  getRouteBySlug,
  getMonthlyFares,
  getFeaturedFlights,
} from "@/lib/fare-data"

// ISR — page pre-renders at build, revalidates every 60 seconds
// Fare data is always fresh. No 24-hour Sputnik lag.
export const revalidate = 60

// Pre-render all known routes at build time
export async function generateStaticParams() {
  return ROUTES.map((route) => ({ slug: route.slug }))
}

// SEO metadata per route
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const route = getRouteBySlug(slug)
  if (!route) return {}

  return {
    title: `Cheap Flights from ${route.origin} to ${route.destination} | Vercel Air`,
    description: `Book cheap flights from ${route.origin} (${route.originCode}) to ${route.destination} (${route.destinationCode}). ${route.frequency}. ${route.description}`,
    openGraph: {
      title: `Flights from ${route.origin} to ${route.destination}`,
      description: route.description,
      images: [route.image],
    },
  }
}

export default async function RoutePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const route = getRouteBySlug(slug)

  if (!route) notFound()

  const monthlyFares = getMonthlyFares(slug)
  const featuredFlights = getFeaturedFlights(slug)
  const lowestFare = Math.min(...monthlyFares.map((f) => f.lowestFare))

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${route.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mb-2 flex items-center gap-2 text-sm text-white/70">
              <a href="/" className="hover:text-white">Home</a>
              <span>/</span>
              <span>Flights from {route.origin} to {route.destination}</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
              Flights from {route.origin} to {route.destination}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {route.originCode} → {route.destinationCode}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {route.duration}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {route.frequency}
              </span>
              <span className="flex items-center gap-2 rounded-full bg-primary/80 px-3 py-0.5 text-white">
                From €{lowestFare}
              </span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Search widget — pre-populated with this route */}
          <div className="mb-10">
            <RouteSearchForm
              defaultFrom={route.originCode}
              defaultTo={route.destinationCode}
            />
          </div>

          {/* Fare calendar */}
          <div className="mb-10">
            <FareCalendar fares={monthlyFares} />
          </div>

          {/* Featured flights */}
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {route.origin} to {route.destination} flights
                </h2>
                <p className="text-sm text-muted-foreground">
                  Direct flights · {route.duration} · from €{lowestFare}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {featuredFlights.map((flight) => (
                <RouteFlightCard
                  key={flight.id}
                  flight={flight}
                  origin={route.origin}
                  originCode={route.originCode}
                  destination={route.destination}
                  destinationCode={route.destinationCode}
                />
              ))}
            </div>
          </div>

          {/* Performance callout — demo talking point */}
          <div className="mb-10 rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Zap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">This page is served from Vercel Edge ISR</p>
                  <p className="text-sm text-muted-foreground">
                    Pre-rendered HTML delivered from the nearest edge node. TTFB ~100ms globally.
                    Fare data revalidates every 60 seconds — not 24 hours.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">~100ms</p>
                  <p className="text-xs text-muted-foreground">TTFB (this page)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-destructive">400ms</p>
                  <p className="text-xs text-muted-foreground">TTFB (SSR average)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Route info */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center gap-2 text-primary">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-semibold uppercase tracking-wide">Route</span>
              </div>
              <p className="font-semibold">{route.origin} ({route.originCode}) → {route.destination} ({route.destinationCode})</p>
              <p className="text-sm text-muted-foreground">{route.description}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center gap-2 text-primary">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-semibold uppercase tracking-wide">Flight time</span>
              </div>
              <p className="text-2xl font-bold">{route.duration}</p>
              <p className="text-sm text-muted-foreground">Direct flight, no stops</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center gap-2 text-primary">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-semibold uppercase tracking-wide">Frequency</span>
              </div>
              <p className="text-2xl font-bold">{route.frequency.split(" ")[0]} {route.frequency.split(" ")[1]}</p>
              <p className="text-sm text-muted-foreground">{route.frequency.split(" ").slice(2).join(" ")}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
