// Fare data library
// ISR landing pages read from Vercel KV first — this is the fallback for
// routes not yet populated by user searches via /api/ingest-fares.

export interface Route {
  slug: string
  origin: string
  originCode: string
  destination: string
  destinationCode: string
  duration: string
  frequency: string
  description: string
  image: string
}

export interface FeaturedFlight {
  id: string
  departureTime: string
  arrivalTime: string
  duration: string
  stops: number
  price: number
  flightNumber: string
}

export interface PriceObservation {
  price: number
  seenAt: string
  departDate?: string
  returnDate?: string
  fareType: "one-way" | "round-trip"
}

// All SEO-indexed routes — outbound from Dublin + inbound TO Dublin
export const ROUTES: Route[] = [
  // ── Outbound from Dublin ────────────────────────────────────────────────
  {
    slug: "flights-from-dublin-to-london",
    origin: "Dublin",
    originCode: "DUB",
    destination: "London",
    destinationCode: "LHR",
    duration: "1h 20m",
    frequency: "Up to 14 flights daily",
    description: "Fast, frequent service on Ireland's most popular route. Up to 14 flights daily between Dublin and London.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=600&fit=crop",
  },
  {
    slug: "flights-from-dublin-to-new-york",
    origin: "Dublin",
    originCode: "DUB",
    destination: "New York",
    destinationCode: "JFK",
    duration: "7h 30m",
    frequency: "Daily flights",
    description: "Non-stop flights from Dublin to New York JFK. Pre-clear US customs in Dublin and arrive as a domestic passenger.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&h=600&fit=crop",
  },
  {
    slug: "flights-from-dublin-to-amsterdam",
    origin: "Dublin",
    originCode: "DUB",
    destination: "Amsterdam",
    destinationCode: "AMS",
    duration: "2h 05m",
    frequency: "Up to 4 flights daily",
    description: "Explore the Dutch capital direct from Dublin. Up to 4 daily flights with great connections onward.",
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&h=600&fit=crop",
  },
  {
    slug: "flights-from-dublin-to-barcelona",
    origin: "Dublin",
    originCode: "DUB",
    destination: "Barcelona",
    destinationCode: "BCN",
    duration: "2h 35m",
    frequency: "Up to 3 flights daily",
    description: "Sun, culture and cuisine await. Direct flights from Dublin to Barcelona all year round.",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&h=600&fit=crop",
  },
  // ── Inbound to Dublin ───────────────────────────────────────────────────
  {
    slug: "flights-from-london-to-dublin",
    origin: "London",
    originCode: "LHR",
    destination: "Dublin",
    destinationCode: "DUB",
    duration: "1h 20m",
    frequency: "Up to 14 flights daily",
    description: "The fastest way between London and Dublin. Multiple daily departures from Heathrow with seamless connections.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=600&fit=crop",
  },
  {
    slug: "flights-from-new-york-to-dublin",
    origin: "New York",
    originCode: "JFK",
    destination: "Dublin",
    destinationCode: "DUB",
    duration: "6h 30m",
    frequency: "Daily flights",
    description: "Fly non-stop from New York JFK to Dublin. Arrive refreshed and ready to explore Ireland.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&h=600&fit=crop",
  },
  {
    slug: "flights-from-amsterdam-to-dublin",
    origin: "Amsterdam",
    originCode: "AMS",
    destination: "Dublin",
    destinationCode: "DUB",
    duration: "2h 05m",
    frequency: "Up to 4 flights daily",
    description: "Quick hop from Amsterdam Schiphol to Dublin. Great connections through Amsterdam from across Europe.",
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&h=600&fit=crop",
  },
  {
    slug: "flights-from-barcelona-to-dublin",
    origin: "Barcelona",
    originCode: "BCN",
    destination: "Dublin",
    destinationCode: "DUB",
    duration: "2h 35m",
    frequency: "Up to 3 flights daily",
    description: "Direct from Barcelona El Prat to Dublin. Year-round service with up to 3 daily departures.",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&h=600&fit=crop",
  },
]

export function getRouteBySlug(slug: string): Route | undefined {
  return ROUTES.find((r) => r.slug === slug)
}
