import React from 'react'
import { Config } from '../types/config'
import { LanyardData } from '../types/lanyard'
import { DiscordPresence } from './DiscordPresence'
import { SocialLinks } from './SocialLinks'
import { SpotifyPlayer } from './SpotifyPlayer'
import { CustomMusicPlayer } from './CustomMusicPlayer'
import { Eye } from 'lucide-react'
import styles from './Card.module.css'

interface CardProps {
  config: Config
  lanyardData: LanyardData | null
  lanyardLoading: boolean
  views: number
}

export const Card: React.FC<CardProps> = ({ config, lanyardData, lanyardLoading, views }) => {
  const { theme } = config
  
  const cardStyle = {
    backdropFilter: `blur(${theme.card_blur}px)`,
    WebkitBackdropFilter: `blur(${theme.card_blur}px)`,
    background: `rgba(20, 20, 20, ${theme.card_opacity})`,
    '--accent': theme.accent_color,
    '--font-display': theme.font_display,
    '--font-body': theme.font_body
  } as React.CSSProperties

  return (
    <div className={`${styles.card} fade-up`} style={cardStyle}>
      <div className={`${styles.topSection} fade-in delay-1`}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            <img 
              src={config.avatar || (lanyardData ? `https://cdn.discordapp.com/avatars/${lanyardData.discord_user.id}/${lanyardData.discord_user.avatar}.png` : '')} 
              alt={config.name} 
              className={styles.avatar} 
            />
            <div className={styles.avatarRing} />
          </div>
        </div>

        <div className={styles.content}>
          <h1 className={styles.name}>{config.name}</h1>
          <p className={styles.bio}>{config.bio}</p>
        </div>
      </div>

      <div className={`${styles.middleSection} fade-in delay-2`}>
        {(config.show_discord_presence || (config.show_spotify && lanyardData?.spotify)) && (
          <div className={styles.lanyardGroup}>
            {config.show_discord_presence && (
              <DiscordPresence data={lanyardData} loading={lanyardLoading} noContainer />
            )}

            {config.show_discord_presence && config.show_spotify && lanyardData?.spotify && (
              <div className={styles.lanyardSeparator} />
            )}

            {config.show_spotify && lanyardData?.spotify && (
              <SpotifyPlayer 
                spotify={lanyardData.spotify} 
                accentColor={theme.accent_color} 
                noContainer
              />
            )}
          </div>
        )}

        {config.music && config.music.enabled && (
          <div className="fade-in delay-3">
            <CustomMusicPlayer 
              config={config.music} 
              accentColor={theme.accent_color} 
            />
          </div>
        )}
      </div>

      <div className={`${styles.bottomSection} fade-in delay-4`}>
        {config.show_views && (
          <div className={styles.views}>
            <Eye size={14} />
            <span>{views.toLocaleString()}</span>
          </div>
        )}
        
        <SocialLinks socials={config.socials} accentColor={theme.accent_color} />
      </div>
    </div>
  )
}
