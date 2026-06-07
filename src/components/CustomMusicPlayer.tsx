import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { MusicConfig } from '../types/config'
import styles from './CustomMusicPlayer.module.css'

interface CustomMusicPlayerProps {
  config: MusicConfig
  accentColor: string
}

export const CustomMusicPlayer: React.FC<CustomMusicPlayerProps> = ({ config, accentColor }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current && config.enabled && config.url) {
        try {
          audioRef.current.volume = volume
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (err) {
          console.warn("Autoplay was prevented or failed:", err)
          setIsPlaying(false)
        }
      }
    }

    const timeout = setTimeout(playAudio, 100)
    return () => clearTimeout(timeout)
  }, [config.url, config.enabled])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    const newMuted = !isMuted
    audioRef.current.muted = newMuted
    setIsMuted(newMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      audioRef.current.muted = newVolume === 0
      setIsMuted(newVolume === 0)
    }
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    const current = audioRef.current.currentTime
    const total = audioRef.current.duration
    if (total > 0) {
      setProgress((current / total) * 100)
    }
  }

  if (!config.enabled || !config.url) return null

  return (
    <div className={styles.container} style={{ '--accent': accentColor } as React.CSSProperties}>
      <audio 
        ref={audioRef} 
        src={config.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        loop
      />
      
      <div className={styles.content}>
        <div className={styles.controls}>
          <button onClick={togglePlay} className={styles.playButton}>
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
        </div>

        <div className={styles.info}>
          <div className={styles.title}>{config.title}</div>
          <div className={styles.artist}>{config.artist}</div>
          <div className={styles.progressWrapper}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div 
          className={styles.volumeWrapper}
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          {showVolumeSlider && (
            <div className={styles.volumeSliderContainer}>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={isMuted ? 0 : volume} 
                onChange={handleVolumeChange}
                className={styles.volumeSlider}
              />
            </div>
          )}
          <button onClick={toggleMute} className={styles.muteButton}>
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  )
}
