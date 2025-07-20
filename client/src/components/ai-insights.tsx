import { Bot, Play, Pause, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useSpeech } from "@/hooks/use-speech"

interface AIInsightsProps {
  summary: string
  keyInsights: string[]
}

export default function AIInsights({ summary, keyInsights }: AIInsightsProps) {
  const { speak, stop, isSpeaking, isSupported } = useSpeech()

  const handleReadAloud = () => {
    if (isSpeaking) {
      stop()
    } else {
      speak(summary)
    }
  }

  const audioSummaryText = `This performance has generated an incredibly positive response, with 68% positive sentiment across over 12,000 comments. Viewers are particularly impressed by the technical skill and emotional delivery, with many describing the experience as 'magical' and 'world-class'.`

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-16">
      <motion.div
        className="glass-panel rounded-2xl p-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">AI Summary</h3>
        </div>
        
        <div className="space-y-4 text-gray-200">
          <p>{summary}</p>
          <div className="pt-4 border-t border-gray-700">
            <h4 className="font-semibold text-white mb-2">Key Insights:</h4>
            <ul className="space-y-2 text-sm">
              {keyInsights.map((insight, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  • {insight}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="glass-panel rounded-2xl p-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Audio Summary</h3>
          </div>
          <Button
            onClick={handleReadAloud}
            disabled={!isSupported}
            className={`
              ${isSpeaking 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-emerald-500 hover:bg-emerald-600'
              } text-white transition-colors
            `}
          >
            {isSpeaking ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Read Aloud
              </>
            )}
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-lg p-4">
            <p className="text-gray-200 text-sm leading-relaxed">
              {audioSummaryText}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Duration: 45s</span>
            <span>•</span>
            <span>Language: English</span>
            <span>•</span>
            <span>Voice: Neural</span>
          </div>
          
          {!isSupported && (
            <p className="text-yellow-400 text-sm">
              Speech synthesis is not supported in this browser.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
