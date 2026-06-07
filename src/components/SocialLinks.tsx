import React from 'react'
import * as SimpleIcons from 'simple-icons'
import { Social } from '../types/config'
import styles from './SocialLinks.module.css'

interface SocialLinksProps {
  socials: Social[]
  accentColor: string
}

export const SocialLinks: React.FC<SocialLinksProps> = ({ socials, accentColor }) => {
  return (
    <div className={styles.container}>
      {socials.map((social, index) => {
        // Try to find the icon in simple-icons
        const iconKey = `si${social.icon.charAt(0).toUpperCase()}${social.icon.slice(1)}` as keyof typeof SimpleIcons
        const iconData = (SimpleIcons as any)[iconKey] || (SimpleIcons as any).get(social.icon)

        return (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconButton}
            style={{ '--accent': accentColor } as React.CSSProperties}
          >
            {iconData ? (
              <svg
                role="img"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="currentColor"
                dangerouslySetInnerHTML={{ __html: `<path d="${iconData.path}" />` }}
              />
            ) : (
              <span className={styles.fallback}>{social.platform[0]}</span>
            )}
          </a>
        )
      })}
    </div>
  )
}
