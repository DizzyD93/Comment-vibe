import { motion } from "framer-motion"

interface MoodGlobeProps {
  sentimentData: {
    positivePercentage: number
    neutralPercentage: number
    negativePercentage: number
    totalComments: number
  }
}

export default function MoodGlobe({ sentimentData }: MoodGlobeProps) {
  return (
    <div className="glass-panel rounded-2xl p-8 h-full">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">Sentiment Globe</h3>
      
      <motion.div
        className="relative mx-auto w-64 h-64 mood-globe cursor-pointer"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Globe rings */}
        <div className="absolute inset-4 rounded-full border-2 border-white/30"></div>
        <div className="absolute inset-8 rounded-full border border-white/20"></div>
        
        {/* Sentiment indicators positioned based on percentages */}
        <motion.div
          className="absolute w-8 h-8 bg-emerald-500 rounded-full opacity-80"
          style={{
            top: `${20 + (sentimentData.positivePercentage / 100) * 30}%`,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          title={`Positive: ${sentimentData.positivePercentage}%`}
        />
        
        <motion.div
          className="absolute w-6 h-6 bg-red-500 rounded-full opacity-80"
          style={{
            bottom: `${20 + (sentimentData.negativePercentage / 100) * 30}%`,
            right: '20%',
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          title={`Negative: ${sentimentData.negativePercentage}%`}
        />
        
        <motion.div
          className="absolute w-7 h-7 bg-yellow-500 rounded-full opacity-80"
          style={{
            left: '20%',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          title={`Neutral: ${sentimentData.neutralPercentage}%`}
        />
        
        {/* Center pulse */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
      
      <div className="mt-6 space-y-3">
        <motion.div
          className="flex items-center justify-between"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-300">Positive</span>
          </div>
          <span className="font-bold text-emerald-400">{sentimentData.positivePercentage}%</span>
        </motion.div>
        
        <motion.div
          className="flex items-center justify-between"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-300">Neutral</span>
          </div>
          <span className="font-bold text-yellow-400">{sentimentData.neutralPercentage}%</span>
        </motion.div>
        
        <motion.div
          className="flex items-center justify-between"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-300">Negative</span>
          </div>
          <span className="font-bold text-red-400">{sentimentData.negativePercentage}%</span>
        </motion.div>
      </div>
    </div>
  )
}
