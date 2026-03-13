import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Database, Search, CheckCircle, BarChart3, Clock, Plane } from "lucide-react"

export const metadata = {
  title: "FAQ - How Vercel Air Works",
  description: "Learn how the Vercel Air booking system works with real-time pricing data",
}

export default function FAQPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold">How Vercel Air Works</h1>
          <p className="mb-12 text-lg text-muted-foreground">
            Understanding our real-time pricing system powered by Redis and ISR
          </p>

          {/* Flow Section */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-semibold">Booking Flow</h2>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4 rounded-xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Search className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">1. Search for Flights</h3>
                  <p className="text-muted-foreground">
                    User searches for flights on the homepage (e.g., Dublin to London). Flight results 
                    are generated and displayed. Nothing is stored in Redis at this point.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 rounded-xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Plane className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">2. Select Flights</h3>
                  <p className="text-muted-foreground">
                    User selects an outbound flight (and return flight if round trip). The booking 
                    summary shows the selected flight(s) with pricing details.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 rounded-xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">3. Confirm Booking</h3>
                  <p className="text-muted-foreground">
                    When the user clicks &quot;Confirm Booking&quot;, a booking reference is generated. The booked 
                    flight data is sent to <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/api/ingest-fares</code> which 
                    stores the booking in Redis with price history (timestamp, price, dates, fare type).
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 rounded-xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">4. ISR Revalidation</h3>
                  <p className="text-muted-foreground">
                    The API calls <code className="rounded bg-muted px-1.5 py-0.5 text-sm">revalidatePath</code> to 
                    trigger ISR revalidation for the corresponding route page. This ensures the page is 
                    regenerated with fresh data on the next request.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Route Pages Section */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-semibold">Route Pages</h2>
            
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="mb-4 text-muted-foreground">
                Route pages like <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/flights/flights-from-dublin-to-london</code> pull 
                real data from Redis only - no mock or dummy data is used.
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">No Data State:</strong> Shows &quot;No fare data available&quot; 
                    if no bookings exist for that route
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Price Histogram:</strong> Visual distribution of 
                    booked prices when data exists
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Recent Deals Table:</strong> List of bookings with 
                    &quot;Last Seen: X ago&quot; timestamps
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">ISR Caching:</strong> Pages are cached with 60s 
                    revalidation and on-demand revalidated when new bookings come in
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How to Test Section */}
          <section className="mb-16">
            <h2 className="mb-8 text-2xl font-semibold">How to Test</h2>
            
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">1</span>
                  <span>Go to the homepage</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">2</span>
                  <span>Search Dublin to London, pick dates</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">3</span>
                  <span>Select a flight (and return flight if round trip)</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">4</span>
                  <span>Click &quot;Confirm Booking&quot;</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">5</span>
                  <span>Visit <code className="rounded bg-muted px-1.5 py-0.5 text-sm">/flights/flights-from-dublin-to-london</code></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">6</span>
                  <span>You should see your booking in the deals table with &quot;Last Seen: just now&quot;</span>
                </li>
              </ol>
            </div>
          </section>

          {/* Tech Stack Section */}
          <section>
            <h2 className="mb-8 text-2xl font-semibold">Technology Stack</h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Upstash Redis</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Serverless Redis for storing booking data with 24-hour TTL
                </p>
              </div>
              
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-2 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Next.js ISR</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Incremental Static Regeneration for fast, cached pages
                </p>
              </div>
              
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">On-Demand Revalidation</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pages update instantly when new bookings are confirmed
                </p>
              </div>
              
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Plane className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Real Data Only</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  No mock data - all prices come from actual bookings
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
