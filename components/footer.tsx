import { Github, Instagram, Linkedin, Mic } from "lucide-react"
import Link from "next/link"

export const Footer = () => {
  return (
    <footer 
      className="mt-auto bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white" 
      aria-label="Site Footer"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mic className="w-6 h-6" aria-hidden="true" />
              <h2 className="text-xl font-bold">Podcastr</h2>
            </div>
            <p className="text-sm text-gray-200">
              Create professional podcasts with AI-powered voices. Transform your ideas into engaging audio content.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick Links">
            <h2 className="font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/create-podcast" className="text-gray-200 hover:text-white transition-colors">
                  Create Podcast
                </Link>
              </li>
              <li>
                <Link href="/user" className="text-gray-200 hover:text-white transition-colors">
                  My Podcasts
                </Link>
              </li>
            </ul>
          </nav>

          {/* Features */}
          <div>
            <h2 className="font-semibold mb-4">Features</h2>
            <ul className="space-y-2 text-sm text-gray-200">
              <li>AI Voice Generation</li>
              <li>PDF Summaries</li>
              <li>Image Generation</li>
              <li>Audio Export</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h2 className="font-semibold mb-4">Connect</h2>
            <div className="flex gap-4">
              <a 
                href="https://github.com/mohamedelsayed002" 
                className="text-gray-200 hover:text-white transition-colors" 
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">GitHub</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/mohamedelsayed2002" 
                className="text-gray-200 hover:text-white transition-colors" 
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a 
                href="https://www.instagram.com/mosayed002" 
                className="text-gray-200 hover:text-white transition-colors" 
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          <small>
            © {new Date().getFullYear()} Podcastr. Built with Next.js & OpenAI.
          </small>
        </div>
      </div>
    </footer>
  )
}
