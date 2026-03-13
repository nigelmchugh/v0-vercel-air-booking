const stats = [
  { value: "50M+", label: "Passengers flown" },
  { value: "200+", label: "Destinations" },
  { value: "99.2%", label: "On-time rate" },
  { value: "4.9/5", label: "Customer rating" },
]

export function Stats() {
  return (
    <section className="border-y border-border bg-card/50 py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
