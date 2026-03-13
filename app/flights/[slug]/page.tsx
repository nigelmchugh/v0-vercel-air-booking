import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { MapPin, Zap, Database, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RouteFlightCard } from "@/components/route-flight-card"
import { PriceHistogram } from "@/components/price-histogram"
import { RecentDealsTable } from "@/components/recent-deals-table"
import {
  ROUTES,
  getRouteBySlug,
  type FeaturedFlight,
  type PriceObservation,
} from "@/lib/fare-data"
import type { RouteData } from "@/app/api/ingest-fares/route"

// ISR — revalidates every 60 seconds from Vercel Edge
// Fare data from KV is always fresh. No 24-hour Sputnik lag.
export const revalidate = 60

// Pre-render all known routes at build time
export async function generateStaticParams() {
  return ROUTES.map((route) => ({ slug: route.slug }))
}

// Try to load live fare data from Redis
// Returns null if no real data exists - we only show real data from Redis
async function fetchLiveFares(slug: string): Promise<{
  flights: FeaturedFlight[]
  priceHistory: PriceObservation[]
  lowestFare: number
  updatedAt: string
} | null> {
  // Derive the KV key from the SEO slug
  // e.g. "flights-from-dublin-to-london" → "DUB-LHR"
  const route = getRouteBySlug(slug)
  if (!route) {
    return null
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

        return {
          flights: kvFlights,
          priceHistory: data.priceHistory || [],
          lowestFare: data.lowestFare,
          updatedAt: data.updatedAt,
        }
      }
    }
  } catch (err) {
    console.warn("[route-page] Redis read failed:", err)
  }

  // No data in Redis
  return null
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

  // Fetch live fare data directly from Redis
  // ISR revalidation is handled by revalidatePath in the ingest-fares API
  const fareData = await fetchLiveFares(slug)
  
  // Only show real data from Redis - no mock/dummy data
  const hasData = fareData !== null

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Banner with Destination Image */}
        <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${route.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
              <div className="mb-4 flex items-center gap-2 text-sm text-white/80">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span>Flights to {route.destination}</span>
              </div>
              <h1 className="mb-4 text-balance text-4xl font-bold text-white drop-shadow-lg md:text-5xl lg:text-6xl">
                {route.destination}
              </h1>
              <p className="mb-6 max-w-xl text-pretty text-lg text-white/90 drop-shadow">
                {route.description}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                  <MapPin className="h-4 w-4" />
                  {route.originCode} → {route.destinationCode}
                </div>
                {hasData && (
                  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-foreground">
                    From €{fareData.lowestFare}
                  </div>
                )}
                {hasData && (
                  <div className="flex items-center gap-1.5 rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white">
                    <Database className="h-4 w-4" />
                    Live Prices
                  </div>
                )}
                <Link
                  href="/"
                  className="flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Book Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* Show content only if we have real data from Redis */}
          {hasData ? (
            <>
              {/* Price histogram - only show if we have price history */}
              {fareData.priceHistory.length > 0 && (
                <div className="mb-10">
                  <PriceHistogram priceHistory={fareData.priceHistory} />
                </div>
              )}

              {/* Recent deals table - only show if we have price history */}
              {fareData.priceHistory.length > 0 && (
                <div className="mb-10">
                  <RecentDealsTable
                    deals={fareData.priceHistory}
                    origin={route.origin}
                    originCode={route.originCode}
                    destination={route.destination}
                    destinationCode={route.destinationCode}
                  />
                </div>
              )}

              {/* Booked flights from Redis */}
              <div className="mb-10">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {route.origin} to {route.destination} - Recent Bookings
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      From €{fareData.lowestFare}
                      <span className="ml-2 text-green-600">
                        · Updated {new Date(fareData.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400">
                    <Database className="h-3 w-3" />
                    Live data from Redis
                  </span>
                </div>
                <div className="space-y-3">
                  {fareData.flights.map((flight) => (
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
            </>
          ) : (
            /* No data state */
            <div className="mb-10 rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
              <Database className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">No fare data available yet</h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                This route hasn&apos;t been searched yet. Search for flights from {route.origin} to {route.destination} on the homepage to populate live fare data.
              </p>
              <a
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Search flights
              </a>
            </div>
          )}

          {/* Performance callout - only show if we have data */}
          {hasData && (
            <div className="mb-10 rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Zap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">This page is served from Vercel Edge ISR</p>
                    <p className="text-sm text-muted-foreground">
                      Pre-rendered HTML delivered from the nearest edge node. TTFB ~100ms globally.
                      Fares populated from Redis — updated every time someone searches this route.
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
          )}

          
        </div>
      </main>

      <Footer />
    </div>
  )
}
