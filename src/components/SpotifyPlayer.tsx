import React, { useState, useEffect } from 'react'
import { SpotifyData } from '../types/lanyard'
import { Play, SkipBack, SkipForward } from 'lucide-react'
import styles from './SpotifyPlayer.module.css'

interface SpotifyPlayerProps {
  spotify: SpotifyData | null
  accentColor: string
  noContainer?: boolean
}

export const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ spotify, accentColor, noContainer }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!spotify) return

    const updateProgress = () => {
      const total = spotify.timestamps.end - spotify.timestamps.start
      const current = Date.now() - spotify.timestamps.start
      const percentage = Math.min(Math.max((current / total) * 100, 0), 100)
      setProgress(percentage)
    }

    updateProgress()
    const interval = setInterval(updateProgress, 1000)
    return () => clearInterval(interval)
  }, [spotify])

  if (!spotify) return null

  return (
    <div className={`${noContainer ? styles.containerSimple : styles.container} fade-up`}>
      <div className={styles.content}>
        <img src={spotify.album_art_url} alt={spotify.album} className={styles.albumArt} />
        
        <div className={styles.info}>
          <div className={styles.songName}>{spotify.song}</div>
          <div className={styles.artistName}>{spotify.artist}</div>
          
          <div className={styles.progressBarWrapper}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${progress}%`, backgroundColor: accentColor }} 
            />
          </div>
        </div>

        <div className={styles.controls}>
          <SkipBack size={16} className={styles.icon} />
          <Play size={18} fill="currentColor" className={styles.icon} />
          <SkipForward size={16} className={styles.icon} />
        </div>
      </div>
    </div>
  )
}
