import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface Topic {
  text: string
  size: string
  color: string
}

interface TrendingTopicsProps {
  topics: Topic[]
}

const sizeClasses = {
  sm: "text-sm px-3 py-1",
  md: "text-base px-4 py-2",
  lg: "text-xl px-5 py-2",
  xl: "text-2xl px-6 py-3",
}

const colorClasses = {
  emerald: "from-emerald-500 to-green-400",
  blue: "from-blue-500 to-cyan-400",
  purple: "from-purple-500 to-pink-400",
  yellow: "from-yellow-500 to-orange-400",
  red: "from-red-500 to-pink-500",
  indigo: "from-indigo-500 to-blue-600",
  teal: "from-teal-500 to-green-500",
  violet: "from-violet-500 to-purple-600",
}

const positions = [
  { top: '10%', left: '15%' },
  { top: '25%', right: '20%' },
  { top: '45%', left: '25%' },
  { top: '65%', right: '15%' },
  { bottom: '30%', left: '20%' },
  { bottom: '15%', right: '25%' },
  { top: '35%', left: '50%', transform: 'translateX(-50%)' },
  { bottom: '45%', left: '35%' },
]

export default function TrendingTopics({ topics }: TrendingTopicsProps) {
  return (
    <div className="glass-panel rounded-2xl p-8 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Trending Topics</h3>
        <Button 
          variant="ghost" 
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>
      
      <div className="relative h-80 overflow-hidden">
        {topics.map((topic, index) => {
          const position = positions[index] || positions[0]
          const sizeClass = sizeClasses[topic.size as keyof typeof sizeClasses] || sizeClasses.md
          const colorClass = colorClasses[topic.color as keyof typeof colorClasses] || colorClasses.blue
          
          return (
            <motion.div
              key={index}
              className="absolute tag-cloud-item"
              style={position}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 300 
              }}
              whileHover={{ 
                scale: 1.1, 
                y: -2,
                transition: { type: "spring", stiffness: 400 }
              }}
            >
              <span
                className={`
                  bg-gradient-to-r ${colorClass} text-white rounded-full font-semibold cursor-pointer
                  ${sizeClass}
                  shadow-lg hover:shadow-xl transition-shadow duration-300
                `}
              >
                {topic.text}
              </span>
            </motion.div>
          )
        })}
      </div>
      
      <div className="flex justify-center mt-4">
        <Button 
          variant="ghost" 
          className="text-gray-400 hover:text-white transition-colors"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Show More Topics
          </motion.div>
        </Button>
      </div>
    </div>
  )
}
