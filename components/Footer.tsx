import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white dark:bg-dark-bg border-t-4 border-black dark:border-dark-border mt-16 transition-colors">
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center">
          <div className="text-black dark:text-dark-text">
            © {currentYear} NOTHINGFEED. All rights reserved.
          </div>
          <nav className="flex space-x-6">
            <Link href="/privacy" className="text-black dark:text-dark-text hover:underline">
              Privacy
            </Link>
            <Link href="/imprint" className="text-black dark:text-dark-text hover:underline">
              Imprint
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}