export interface Social {
  platform: string
  icon: string
  url: string
}

export interface BackgroundConfig {
  type: 'image' | 'video' | 'gradient'
  value: string
  blur: boolean
  overlay_opacity: number
}

export interface ThemeConfig {
  card_blur: number
  card_opacity: number
  accent_color: string
  font_display: string
  font_body: string
}

export interface MusicConfig {
  url: string
  title: string
  artist: string
  enabled: boolean
}

export interface Config {
  discord_id: string
  name: string
  bio: string
  avatar: string
  background: BackgroundConfig
  theme: ThemeConfig
  socials: Social[]
  music: MusicConfig
  show_views: boolean
  show_spotify: boolean
  show_discord_presence: boolean
}
