import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { MapPin, Clock, Calendar, Zap, Globe, Database } from "lucide-react"
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
  type FeaturedFlight,
  type MonthlyFare,
} from "@/lib/fare-data"
import type { RouteData } from "@/app/api/ingest-fares/route"

// ISR — revalidates every 60 seconds from Vercel Edge
// Fare data from KV is always fresh. No 24-hour Sputnik lag.
export const revalidate = 60

// Pre-render all known routes at build time
export async function generateStaticParams() {
  return ROUTES.map((route) => ({ slug: route.slug }))
}

// Try to load live fare data from Vercel KV
// Falls back gracefully to mock data if KV isn't configured or route isn't populated yet
async function getLiveFares(slug: string): Promise<{
  flights: FeaturedFlight[]
  monthlyFares: MonthlyFare[]
  fromKv: boolean
  updatedAt?: string
}> {
  // Derive the KV key from the SEO slug
  // e.g. "flights-from-dublin-to-london" → "DUB-LHR"
  const route = getRouteBySlug(slug)
  if (!route) {
    return { flights: getFeaturedFlights(slug), monthlyFares: getMonthlyFares(slug), fromKv: false }
  }

  try {
    // Only attempt Redis read if env vars are present
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { Redis } = await import("@upstash/redis")
      const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      })
      const kvKey = `route:${route.originCode}-${route.destinationCode}`.toLowerCase()
      const raw = await redis.get<string>(kvKey)

      if (raw) {
        const data: RouteData = typeof raw === "string" ? JSON.parse(raw) : raw

        // Map KV stored flights → FeaturedFlight shape
        const kvFlights: FeaturedFlight[] = data.flights.map((f) => ({
          id: f.id,
          departureTime: f.departureTime,
          arrivalTime: f.arrivalTime,
          duration: f.duration,
          stops: f.stops,
          price: f.price,
          flightNumber: f.flightNumber,
        }))

        // Build monthly fares from KV lowestFare as baseline
        const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
        const seasonality = [1.0, 1.1, 1.4, 1.7, 1.8, 1.5, 1.1, 0.9, 0.95, 0.85, 0.8, 0.9]
        const kvMonthlyFares: MonthlyFare[] = months.map((month, i) => ({
          month,
          lowestFare: Math.round(data.lowestFare * seasonality[i] * (0.92 + Math.random() * 0.16)),
          available: true,
        }))

        return {
          flights: kvFlights,
          monthlyFares: kvMonthlyFares,
          fromKv: true,
          updatedAt: data.updatedAt,
        }
      }
    }
  } catch (err) {
    console.warn("[route-page] Redis read failed, using mock data:", err)
  }

  // Fallback: mock data
  return {
    flights: getFeaturedFlights(slug),
    monthlyFares: getMonthlyFares(slug),
    fromKv: false,
  }
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

  const { flights, monthlyFares, fromKv, updatedAt } = await getLiveFares(slug)
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
              {fromKv && (
                <span className="flex items-center gap-1 rounded-full bg-green-600/80 px-3 py-0.5 text-white">
                  <Database className="h-3 w-3" />
                  Live from KV
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Search widget */}
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
                  {fromKv && updatedAt && (
                    <span className="ml-2 text-green-600">
                      · Updated {new Date(updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </p>
              </div>
              {fromKv && (
                <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                  <Database className="h-3 w-3" />
                  Live fares from Vercel KV
                </span>
              )}
            </div>
            <div className="space-y-3">
              {flights.map((flight) => (
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

          {/* Performance callout */}
          <div className="mb-10 rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Zap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">This page is served from Vercel Edge ISR</p>
                  <p className="text-sm text-muted-foreground">
                    Pre-rendered HTML delivered from the nearest edge node. TTFB ~100ms globally.
                    {fromKv
                      ? " Fares populated from Vercel KV — updated every time someone searches this route."
                      : " Fares revalidate every 60 seconds — not 24 hours."}
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
