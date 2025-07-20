import { useState } from "react"
import { Youtube, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { apiRequest } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"

interface VideoInputProps {
  videoUrl: string
  setVideoUrl: (url: string) => void
  onAnalysis: (data: any) => void
  isAnalyzing: boolean
  setIsAnalyzing: (analyzing: boolean) => void
}

export default function VideoInput({ 
  videoUrl, 
  setVideoUrl, 
  onAnalysis, 
  isAnalyzing, 
  setIsAnalyzing 
}: VideoInputProps) {
  const [isValid, setIsValid] = useState(false)
  const { toast } = useToast()

  const validateUrl = (url: string) => {
    const isYouTubeUrl = url.includes('youtube.com') || url.includes('youtu.be')
    const isLongEnough = url.length > 10
    setIsValid(isYouTubeUrl && isLongEnough)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setVideoUrl(url)
    validateUrl(url)
  }

  const handleLoadVideo = async () => {
    if (!isValid || isAnalyzing) return

    setIsAnalyzing(true)
    try {
      const response = await apiRequest('POST', '/api/videos/analyze', { url: videoUrl })
      const data = await response.json()
      onAnalysis(data)
      
      toast({
        title: "Video loaded successfully!",
        description: "Ready to scan the vibe of this video.",
      })
    } catch (error) {
      console.error('Error loading video:', error)
      toast({
        title: "Error loading video",
        description: "Please check the URL and try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto mb-16">
      <div className="glass-panel rounded-2xl p-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Youtube className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500 w-6 h-6" />
            <Input
              type="url"
              placeholder="Paste YouTube video URL here..."
              value={videoUrl}
              onChange={handleInputChange}
              className="pl-14 pr-4 py-4 bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-300"
            />
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-full origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isValid ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <Button
            onClick={handleLoadVideo}
            disabled={!isValid || isAnalyzing}
            className="px-8 py-4 bg-gradient-to-r from-primary to-blue-500 text-white font-semibold hover:from-primary/90 hover:to-blue-500/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isAnalyzing ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Loading...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Load Video
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
