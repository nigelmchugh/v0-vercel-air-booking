import { Plane } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Plane className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">Vercel Air</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Premium airline booking experience. Fly smarter, fly better.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">About Us</Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">Careers</Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">Press</Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">Blog</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">Help Center</Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">Contact Us</Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">FAQ</Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">Accessibility</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">Terms of Service</Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-foreground">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 Vercel Air. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
