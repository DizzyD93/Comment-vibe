import { ChevronLeft, ChevronRight, ThumbsUp, MessageCircle, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"

interface Comment {
  username: string
  avatar: string
  text: string
  likes: number
  replies: number
  sentiment: string
  timestamp: string
  youtubeUrl: string
}

interface CommentCarouselProps {
  comments: Comment[]
}

const sentimentColors = {
  positive: "bg-emerald-500",
  neutral: "bg-yellow-500",
  negative: "bg-red-500",
}

export default function CommentCarousel({ comments }: CommentCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextComment = () => {
    setCurrentIndex((prev) => (prev + 1) % comments.length)
  }

  const prevComment = () => {
    setCurrentIndex((prev) => (prev - 1 + comments.length) % comments.length)
  }

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-white">Top Comments</h3>
        <div className="flex space-x-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={prevComment}
            className="bg-gray-600 hover:bg-gray-500"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={nextComment}
            className="bg-gray-600 hover:bg-gray-500"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <motion.div
          className="flex space-x-6 pb-4"
          animate={{ x: -currentIndex * 336 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {comments.map((comment, index) => (
            <motion.div
              key={index}
              className="flex-none w-80 glass-panel rounded-xl p-6"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={comment.avatar}
                  alt={comment.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-white">{comment.username}</div>
                  <div className="text-sm text-gray-400">{comment.timestamp}</div>
                </div>
              </div>
              
              <p className="text-gray-200 mb-4 leading-relaxed line-clamp-4">
                {comment.text}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="w-4 h-4 text-blue-400" />
                    <span>{comment.likes >= 1000 ? `${(comment.likes / 1000).toFixed(1)}K` : comment.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <span>{comment.replies}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${sentimentColors[comment.sentiment as keyof typeof sentimentColors]}`}></div>
                    <span className="capitalize">{comment.sentiment}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-primary hover:text-primary/80"
                  onClick={() => window.open(comment.youtubeUrl, '_blank')}
                >
                  <Youtube className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {comments.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-primary' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
