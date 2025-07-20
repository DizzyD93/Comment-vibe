import { SearchCode, TrendingUp, Download } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: SearchCode,
    title: "Deep Dive",
    description: "Advanced filtering by sentiment, keywords, popularity, and engagement metrics.",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    hoverGradient: "hover:from-purple-500/30 hover:to-pink-500/30",
  },
  {
    icon: TrendingUp,
    title: "Compare Videos",
    description: "Side-by-side sentiment analysis comparison of 2-3 videos with comparative dashboards.",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    hoverGradient: "hover:from-blue-500/30 hover:to-cyan-500/30",
  },
  {
    icon: Download,
    title: "Export Report",
    description: "Download detailed sentiment analysis reports in PDF or CSV format.",
    gradient: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-500/20 to-orange-500/20",
    borderColor: "border-yellow-500/30",
    hoverGradient: "hover:from-yellow-500/30 hover:to-orange-500/30",
  },
]

export default function SmartFeatures() {
  return (
    <div className="glass-panel rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-white mb-6">Smart Features</h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={`
              bg-gradient-to-br ${feature.bgGradient} border ${feature.borderColor} 
              rounded-xl p-6 ${feature.hoverGradient} transition-all duration-300 cursor-pointer
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.02, 
              y: -5,
              transition: { type: "spring", stiffness: 300 }
            }}
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
            <p className="text-gray-300 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
