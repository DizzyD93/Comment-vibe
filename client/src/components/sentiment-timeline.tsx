import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface TimelineData {
  time: string
  positive: number
  neutral: number
  negative: number
}

interface SentimentTimelineProps {
  data: TimelineData[]
}

export default function SentimentTimeline({ data }: SentimentTimelineProps) {
  return (
    <div className="glass-panel rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Sentiment Timeline</h3>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            className="bg-primary text-white"
          >
            1H
          </Button>
          <Button 
            size="sm" 
            variant="secondary"
            className="bg-gray-600 text-gray-300 hover:bg-gray-500"
          >
            6H
          </Button>
          <Button 
            size="sm" 
            variant="secondary"
            className="bg-gray-600 text-gray-300 hover:bg-gray-500"
          >
            24H
          </Button>
        </div>
      </div>
      
      <div className="relative h-64 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-4">
        <div className="absolute inset-0 flex items-end justify-around p-4">
          {data.map((point, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Positive bar */}
              <motion.div
                className="w-3 bg-emerald-500 rounded-t mb-1"
                style={{ height: `${(point.positive / 100) * 160}px` }}
                initial={{ height: 0 }}
                animate={{ height: `${(point.positive / 100) * 160}px` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              />
              
              {/* Neutral bar */}
              <motion.div
                className="w-3 bg-yellow-500 mb-1"
                style={{ height: `${(point.neutral / 100) * 40}px` }}
                initial={{ height: 0 }}
                animate={{ height: `${(point.neutral / 100) * 40}px` }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                whileHover={{ scale: 1.1 }}
              />
              
              {/* Negative bar */}
              <motion.div
                className="w-3 bg-red-500 rounded-b"
                style={{ height: `${(point.negative / 100) * 30}px` }}
                initial={{ height: 0 }}
                animate={{ height: `${(point.negative / 100) * 30}px` }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.4 }}
                whileHover={{ scale: 1.1 }}
              />
              
              <span className="text-xs text-gray-400 mt-2 group-hover:text-white transition-colors">
                {point.time}
              </span>
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black/80 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                P: {point.positive}% | N: {point.neutral}% | N: {point.negative}%
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Peak moment indicator */}
        <motion.div
          className="absolute top-4 right-20 bg-yellow-500/20 border border-yellow-500 rounded-lg px-3 py-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="text-yellow-400 text-sm font-bold">Peak Excitement</div>
          <div className="text-xs text-gray-300">12:34 - Solo Performance</div>
        </motion.div>
      </div>
      
      <div className="flex justify-center mt-4 space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-500 rounded"></div>
          <span className="text-gray-300">Positive Sentiment</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-gray-300">Neutral Sentiment</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-300">Negative Sentiment</span>
        </div>
      </div>
    </div>
  )
}
