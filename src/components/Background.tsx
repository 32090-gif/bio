import React from 'react'
import { BackgroundConfig } from '../types/config'
import styles from './Background.module.css'

interface BackgroundProps {
  config: BackgroundConfig
}

export const Background: React.FC<BackgroundProps> = ({ config }) => {
  const overlayStyle = {
    backgroundColor: `rgba(0, 0, 0, ${config.overlay_opacity})`
  }

  return (
    <div className={styles.container}>
      {config.type === 'image' && (
        <img 
          src={config.value} 
          alt="background" 
          className={`${styles.background} ${config.blur ? styles.blur : ''}`} 
        />
      )}
      
      {config.type === 'video' && (
        <video 
          src={config.value} 
          autoPlay 
          muted 
          loop 
          playsInline 
          className={`${styles.background} ${config.blur ? styles.blur : ''}`}
        />
      )}

      {config.type === 'gradient' && (
        <div 
          className={styles.background} 
          style={{ background: config.value }} 
        />
      )}

      <div className={styles.overlay} style={overlayStyle} />
    </div>
  )
}
