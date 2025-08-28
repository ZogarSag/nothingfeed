import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t-4 border-black mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <div className="text-black">
            © 2024 NOTHINGFEED. All rights reserved.
          </div>
          <nav className="flex space-x-6">
            <Link href="/privacy" className="text-black hover:underline">
              Privacy
            </Link>
            <Link href="/imprint" className="text-black hover:underline">
              Imprint
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}