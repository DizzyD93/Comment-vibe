import { Menu, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="mood-globe w-10 h-10 flex items-center justify-center">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">VibeTube</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Analyze
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Compare
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden glass-panel hover:bg-white/10 transition-all duration-300"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
