// Mock fare data for demo routes
// In production this would come from Vercel KV (Edge Database)
// revalidated in seconds — not 24 hours like airTrfx/Sputnik

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

export interface MonthlyFare {
  month: string
  lowestFare: number
  available: boolean
}

export interface DailyFare {
  date: string
  price: number
  available: boolean
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

export const ROUTES: Route[] = [
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
]

// Generate realistic monthly fare data for a route
export function getMonthlyFares(slug: string): MonthlyFare[] {
  const basePrices: Record<string, number> = {
    "flights-from-dublin-to-london": 49,
    "flights-from-dublin-to-new-york": 279,
    "flights-from-dublin-to-amsterdam": 79,
    "flights-from-dublin-to-barcelona": 89,
  }

  const base = basePrices[slug] || 99
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
  const seasonality = [1.0, 1.1, 1.4, 1.7, 1.8, 1.5, 1.1, 0.9, 0.95, 0.85, 0.8, 0.9]

  return months.map((month, i) => ({
    month,
    lowestFare: Math.round(base * seasonality[i] * (0.9 + Math.random() * 0.2)),
    available: true,
  }))
}

// Generate featured flights for a route
export function getFeaturedFlights(slug: string): FeaturedFlight[] {
  const routeData: Record<string, { base: number; duration: string; times: string[][] }> = {
    "flights-from-dublin-to-london": {
      base: 49,
      duration: "1h 20m",
      times: [["06:30", "07:50"], ["09:15", "10:35"], ["12:40", "14:00"], ["16:25", "17:45"], ["19:10", "20:30"]],
    },
    "flights-from-dublin-to-new-york": {
      base: 279,
      duration: "7h 30m",
      times: [["09:00", "11:30"], ["13:30", "16:00"], ["19:15", "21:45"]],
    },
    "flights-from-dublin-to-amsterdam": {
      base: 79,
      duration: "2h 05m",
      times: [["07:15", "09:20"], ["11:30", "13:35"], ["15:45", "17:50"], ["18:20", "20:25"]],
    },
    "flights-from-dublin-to-barcelona": {
      base: 89,
      duration: "2h 35m",
      times: [["07:00", "09:35"], ["12:10", "14:45"], ["17:30", "20:05"]],
    },
  }

  const route = routeData[slug] || routeData["flights-from-dublin-to-london"]
  const flightNumbers = ["EI152", "EI154", "EI156", "EI158", "EI160"]

  return route.times.map((times, i) => ({
    id: `${slug}-${i}`,
    departureTime: times[0],
    arrivalTime: times[1],
    duration: route.duration,
    stops: 0,
    price: route.base + i * 20 + Math.floor(Math.random() * 30),
    flightNumber: flightNumbers[i],
  }))
}

export function getRouteBySlug(slug: string): Route | undefined {
  return ROUTES.find((r) => r.slug === slug)
}
