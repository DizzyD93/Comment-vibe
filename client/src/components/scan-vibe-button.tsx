import { Brain, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"

interface ScanVibeButtonProps {
  videoUrl: string
  onAnalysis: (data: any) => void
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void
  disabled: boolean
}

export default function ScanVibeButton({ 
  videoUrl, 
  onAnalysis, 
  isAnalyzing, 
  setIsAnalyzing, 
  disabled 
}: ScanVibeButtonProps) {
  const { toast } = useToast()

  const handleScanVibe = async () => {
    if (disabled || isAnalyzing) return

    setIsAnalyzing(true)
    try {
      const response = await apiRequest('POST', '/api/videos/analyze', { url: videoUrl })
      const data = await response.json()
      onAnalysis(data)

      // Smooth scroll to dashboard
      setTimeout(() => {
        const dashboard = document.getElementById('dashboard')
        if (dashboard) {
          dashboard.scrollIntoView({ behavior: 'smooth' })
        }
      }, 500)

      toast({
        title: "Vibe scan complete!",
        description: "Analysis results are ready below.",
      })
    } catch (error) {
      console.error('Error scanning vibe:', error)
      toast({
        title: "Scan failed",
        description: "Please try again or check the video URL.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="text-center">
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <Button
          onClick={handleScanVibe}
          disabled={disabled || isAnalyzing}
          className={`
            bg-gradient-to-r from-primary via-blue-500 to-cyan-500 text-white text-xl font-bold py-6 px-12 rounded-2xl shadow-2xl
            ${!disabled && !isAnalyzing ? 'animate-pulse-glow hover:animate-none' : ''}
            disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none
            transition-all duration-300
          `}
        >
          {isAnalyzing ? (
            <>
              <motion.div
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Scanning Vibe...
              <motion.div
                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full ml-3"
                animate={{ rotate: -360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </>
          ) : (
            <>
              <Brain className="w-6 h-6 mr-3" />
              Scan Vibe
              <Sparkles className="w-6 h-6 ml-3" />
            </>
          )}
        </Button>
      </motion.div>
      <p className="text-gray-400 mt-4 text-lg">
        Click to analyze comment sentiment and discover the video's emotional pulse
      </p>
    </div>
  )
}
