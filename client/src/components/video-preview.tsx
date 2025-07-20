import { Play, Eye, ThumbsUp, MessageCircle, Share2, Users } from "lucide-react"
import { motion } from "framer-motion"

interface VideoPreviewProps {
  video: {
    title: string
    channel: string
    thumbnail: string
    duration: string
    viewCount: string
    publishedAt: string
    likes: number
    comments: number
    shares: number
    subscribers: string
  }
}

export default function VideoPreview({ video }: VideoPreviewProps) {
  return (
    <motion.div
      className="max-w-6xl mx-auto mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/5 relative">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-64 lg:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <motion.div
                className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-6 h-6 text-white ml-1" />
              </motion.div>
            </div>
            <div className="absolute bottom-4 right-4 bg-black/70 px-2 py-1 rounded text-sm font-semibold">
              {video.duration}
            </div>
          </div>

          <div className="lg:w-3/5 p-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
              {video.title}
            </h3>

            <div className="flex items-center space-x-4 mb-6 text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-medium">{video.channel}</span>
              </div>
              <span>•</span>
              <span>{video.viewCount}</span>
              <span>•</span>
              <span>{video.publishedAt}</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <ThumbsUp className="w-5 h-5" />
                  {(video.likes / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-400">Likes</div>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-gray-300 flex items-center justify-center gap-1">
                  <MessageCircle className="w-5 h-5" />
                  {(video.comments / 1000).toFixed(1)}K
                </div>
                <div className="text-sm text-gray-400">Comments</div>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-blue-400 flex items-center justify-center gap-1">
                  <Share2 className="w-5 h-5" />
                  {(video.shares / 1000).toFixed(1)}K
                </div>
                <div className="text-sm text-gray-400">Shares</div>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-2xl font-bold text-purple-400 flex items-center justify-center gap-1">
                  <Eye className="w-5 h-5" />
                  {video.subscribers}
                </div>
                <div className="text-sm text-gray-400">Subscribers</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
