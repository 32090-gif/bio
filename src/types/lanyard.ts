export interface SpotifyData {
  track_id: string
  timestamps: { start: number; end: number }
  song: string
  artist: string
  album_art_url: string
  album: string
}

export interface DiscordUser {
  username: string
  public_flags: number
  id: string
  discriminator: string
  avatar: string
}

export interface Activity {
  type: number
  name: string
  details?: string
  state?: string
  timestamps?: { start: number; end?: number }
  assets?: {
    large_image?: string
    large_text?: string
    small_image?: string
    small_text?: string
  }
  application_id?: string
}

export interface LanyardData {
  active_on_discord_mobile: boolean
  active_on_discord_desktop: boolean
  listening_to_spotify: boolean
  kv: Record<string, string>
  spotify: SpotifyData | null
  discord_user: DiscordUser
  discord_status: 'online' | 'idle' | 'dnd' | 'offline'
  activities: Activity[]
}

export interface LanyardResponse {
  data: LanyardData
  success: boolean
}
