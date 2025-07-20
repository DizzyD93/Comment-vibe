import { useState, useCallback } from "react"

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported] = useState(() => 'speechSynthesis' in window)

  const speak = useCallback((text: string) => {
    if (!isSupported) return

    // Stop any current speech
    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesis.speak(utterance)
  }, [isSupported])

  const stop = useCallback(() => {
    speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
  }
}
