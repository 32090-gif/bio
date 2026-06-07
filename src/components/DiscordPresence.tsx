import React from 'react'
import { LanyardData } from '../types/lanyard'
import styles from './DiscordPresence.module.css'

interface DiscordPresenceProps {
  data: LanyardData | null
  loading: boolean
  noContainer?: boolean
}

export const DiscordPresence: React.FC<DiscordPresenceProps> = ({ data, loading, noContainer }) => {
  if (loading || !data) {
    return (
      <div className={noContainer ? styles.skeletonSimple : styles.skeleton}>
        <div className={styles.skeletonAvatar} />
        <div className={styles.skeletonText} />
      </div>
    )
  }

  const { discord_user, discord_status, kv, activities } = data
  const avatarUrl = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`
  
  const statusColors = {
    online: 'var(--status-online)',
    idle: 'var(--status-idle)',
    dnd: 'var(--status-dnd)',
    offline: 'var(--status-offline)'
  }

  const getStatusText = () => {
    if (discord_status === 'offline') {
      return 'last seen recently'
    }
    return 'Active now'
  }

  return (
    <div className={noContainer ? styles.containerSimple : styles.container}>
      <div className={styles.userSection}>
        <div className={styles.avatarWrapper}>
          <img src={avatarUrl} alt={discord_user.username} className={styles.avatar} />
          <div 
            className={`${styles.statusDot} ${discord_status !== 'offline' ? styles.pulse : ''}`} 
            style={{ backgroundColor: statusColors[discord_status] }}
          />
        </div>
        <div className={styles.info}>
          <div className={styles.header}>
            <span className={styles.username}>{discord_user.username}</span>
            {kv.location && <span className={styles.location}>{kv.location}</span>}
          </div>
          <div className={styles.statusText}>{getStatusText()}</div>
        </div>
      </div>
    </div>
  )
}
