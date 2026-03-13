import { NextRequest, NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

// Initialize Redis client if env vars are present
function getRedis() {
  if (
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  ) {
    return new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  }
  return null
}

export interface StoredFlight {
  id: string
  flightNumber: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  stops: number
  class: string
}

export interface PriceObservation {
  price: number
  seenAt: string
  departDate?: string
  returnDate?: string
  fareType: "one-way" | "round-trip"
}

export interface RouteData {
  slug: string
  origin: string
  destination: string
  originCity: string
  destinationCity: string
  flights: StoredFlight[]
  lowestFare: number
  updatedAt: string
  priceHistory: PriceObservation[]
}

// POST /api/ingest-fares
// Called client-side after a search completes — captures route + fare data
// and writes to Redis so ISR landing pages can read real data.
// Also maintains price history for "seen X ago" display.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { origin, destination, originCity, destinationCity, flights, departDate, returnDate, tripType } = body

    if (!origin || !destination || !flights?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const slug = `${origin}-${destination}`.toLowerCase()
    const lowestFare = Math.min(...flights.map((f: StoredFlight) => f.price))
    const now = new Date().toISOString()

    const redis = getRedis()

    // Create new price observation
    const newObservation: PriceObservation = {
      price: lowestFare,
      seenAt: now,
      departDate,
      returnDate,
      fareType: tripType === "roundtrip" ? "round-trip" : "one-way",
    }

    let existingHistory: PriceObservation[] = []

    if (redis) {
      // Try to get existing route data to preserve price history
      const existing = await redis.get<string>(`route:${slug}`)
      if (existing) {
        const parsed: RouteData = typeof existing === "string" ? JSON.parse(existing) : existing
        existingHistory = parsed.priceHistory || []
      }
    }

    // Add new observation and keep last 50 observations
    const priceHistory = [newObservation, ...existingHistory].slice(0, 50)

    const routeData: RouteData = {
      slug,
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      originCity,
      destinationCity,
      flights: flights.map((f: StoredFlight) => ({
        id: f.id,
        flightNumber: f.flightNumber,
        departureTime: f.departureTime,
        arrivalTime: f.arrivalTime,
        duration: f.duration,
        price: f.price,
        stops: f.stops,
        class: f.class,
      })),
      lowestFare,
      updatedAt: now,
      priceHistory,
    }

    if (redis) {
      // Write to Redis with 24hr TTL — real data stays fresh
      await redis.set(`route:${slug}`, JSON.stringify(routeData), { ex: 86400 })

      // Also maintain an index of all known routes
      await redis.sadd("routes:index", slug)

      console.log(`[ingest-fares] Stored route:${slug} → Redis (${flights.length} flights, lowest €${lowestFare}, ${priceHistory.length} observations)`)
    } else {
      // Redis not configured — log to console (still works as demo without Redis)
      console.log(`[ingest-fares] Redis not configured. Would store route:${slug}`, {
        flights: flights.length,
        lowestFare,
      })
    }

    return NextResponse.json({
      ok: true,
      slug,
      stored: !!redis,
      lowestFare,
      message: redis
        ? `Stored ${flights.length} flights for ${origin}→${destination} in Redis`
        : `Redis not configured — data captured but not persisted`,
    })
  } catch (err) {
    console.error("[ingest-fares] Error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET /api/ingest-fares?slug=dub-lhr
// Lets the ISR page (and debugging) read a route from Redis
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")

  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 })
  }

  const redis = getRedis()

  if (!redis) {
    return NextResponse.json({ error: "Redis not configured", slug }, { status: 503 })
  }

  const raw = await redis.get<string>(`route:${slug}`)

  if (!raw) {
    return NextResponse.json({ error: "Route not found in Redis", slug }, { status: 404 })
  }

  const data: RouteData = typeof raw === "string" ? JSON.parse(raw) : raw
  return NextResponse.json(data)
}
