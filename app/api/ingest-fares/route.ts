import { NextRequest, NextResponse } from "next/server"

// Vercel KV — only imported if env vars are present
let kv: typeof import("@vercel/kv").kv | null = null

async function getKv() {
  if (
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  ) {
    const mod = await import("@vercel/kv")
    return mod.kv
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

export interface RouteData {
  slug: string
  origin: string
  destination: string
  originCity: string
  destinationCity: string
  flights: StoredFlight[]
  lowestFare: number
  updatedAt: string
}

// POST /api/ingest-fares
// Called client-side after a search completes — captures route + fare data
// and writes to Vercel KV so ISR landing pages can read real data.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { origin, destination, originCity, destinationCity, flights } = body

    if (!origin || !destination || !flights?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const slug = `${origin}-${destination}`.toLowerCase()
    const lowestFare = Math.min(...flights.map((f: StoredFlight) => f.price))

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
      updatedAt: new Date().toISOString(),
    }

    const client = await getKv()

    if (client) {
      // Write to KV with 24hr TTL — real data stays fresh
      await client.set(`route:${slug}`, JSON.stringify(routeData), { ex: 86400 })

      // Also maintain an index of all known routes
      await client.sadd("routes:index", slug)

      console.log(`[ingest-fares] Stored route:${slug} → KV (${flights.length} flights, lowest €${lowestFare})`)
    } else {
      // KV not configured — log to console (still works as demo without KV)
      console.log(`[ingest-fares] KV not configured. Would store route:${slug}`, {
        flights: flights.length,
        lowestFare,
      })
    }

    return NextResponse.json({
      ok: true,
      slug,
      stored: !!client,
      lowestFare,
      message: client
        ? `Stored ${flights.length} flights for ${origin}→${destination} in KV`
        : `KV not configured — data captured but not persisted`,
    })
  } catch (err) {
    console.error("[ingest-fares] Error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET /api/ingest-fares?slug=dub-lhr
// Lets the ISR page (and debugging) read a route from KV
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug")

  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 })
  }

  const client = await getKv()

  if (!client) {
    return NextResponse.json({ error: "KV not configured", slug }, { status: 503 })
  }

  const raw = await client.get<string>(`route:${slug}`)

  if (!raw) {
    return NextResponse.json({ error: "Route not found in KV", slug }, { status: 404 })
  }

  const data: RouteData = typeof raw === "string" ? JSON.parse(raw) : raw
  return NextResponse.json(data)
}
