import React, { useState, useEffect } from 'react'
import { Config } from '../types/config'
import styles from './Admin.module.css'

function Admin() {
  const [config, setConfig] = useState<Config | null>(null)
  const [views, setViews] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data)
      })

    fetch('/api/views')
      .then(res => res.json())
      .then(data => {
        setViews(data.views)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    if (!config) return
    setSaving(true)
    setMessage('')
    try {
      // Save config
      const configRes = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      // Save views
      const viewsRes = await fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ views })
      })

      if (configRes.ok && viewsRes.ok) {
        setMessage('Settings saved successfully!')
      } else {
        setMessage('Failed to save settings.')
      }
    } catch (error) {
      setMessage('Error saving settings.')
    } finally {
      setSaving(false)
    }
  }

  const updateBackground = (field: string, value: any) => {
    if (!config) return
    setConfig({
      ...config,
      background: { ...config.background, [field]: value }
    })
  }

  const updateTheme = (field: string, value: any) => {
    if (!config) return
    setConfig({
      ...config,
      theme: { ...config.theme, [field]: value }
    })
  }

  const updateMusic = (field: string, value: any) => {
    if (!config) return
    setConfig({
      ...config,
      music: { ...config.music, [field]: value }
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'background' | 'music') => {
    const file = e.target.files?.[0]
    if (!file || !config) return

    setUploading(true)
    setMessage('')
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.url) {
        if (type === 'background') {
          updateBackground('value', data.url)
        } else {
          updateMusic('url', data.url)
        }
        setMessage('File uploaded successfully!')
      } else {
        setMessage('Upload failed.')
      }
    } catch (error) {
      setMessage('Error uploading file.')
    } finally {
      setUploading(false)
    }
  }

  if (loading || !config) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>Dashboard Settings</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className={styles.saveButton}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </header>

      {message && <div className={styles.message}>{message}</div>}

      <div className={styles.grid}>
        {/* Profile Section */}
        <section className={styles.section}>
          <h2>Profile Info</h2>
          <div className={styles.inputGroup}>
            <label>Name</label>
            <input 
              type="text" 
              value={config.name} 
              onChange={e => setConfig({...config, name: e.target.value})} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Bio</label>
            <textarea 
              value={config.bio} 
              onChange={e => setConfig({...config, bio: e.target.value})} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Avatar URL</label>
            <input 
              type="text" 
              value={config.avatar} 
              onChange={e => setConfig({...config, avatar: e.target.value})} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Discord User ID</label>
            <input 
              type="text" 
              value={config.discord_id} 
              onChange={e => setConfig({...config, discord_id: e.target.value})} 
            />
          </div>
        </section>

        {/* Background Section */}
        <section className={styles.section}>
          <h2>Background</h2>
          <div className={styles.inputGroup}>
            <label>Type</label>
            <select 
              value={config.background.type} 
              onChange={e => updateBackground('type', e.target.value)}
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="gradient">Gradient</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Value (URL or Uploaded File)</label>
            <div className={styles.uploadRow}>
              <input 
                type="text" 
                value={config.background.value} 
                onChange={e => updateBackground('value', e.target.value)} 
                className={styles.urlInput}
              />
              <label className={styles.uploadButton}>
                {uploading ? '...' : 'Upload'}
                <input 
                  type="file" 
                  onChange={(e) => handleFileUpload(e, 'background')} 
                  accept={config.background.type === 'video' ? 'video/*' : 'image/*'} 
                  hidden 
                />
              </label>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Overlay Opacity ({config.background.overlay_opacity})</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={config.background.overlay_opacity} 
              onChange={e => updateBackground('overlay_opacity', parseFloat(e.target.value))} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>
              <input 
                type="checkbox" 
                checked={config.background.blur} 
                onChange={e => updateBackground('blur', e.target.checked)} 
              />
              Enable Blur
            </label>
          </div>
        </section>

        {/* Music Section */}
        <section className={styles.section}>
          <h2>Custom Music</h2>
          <div className={styles.inputGroup}>
            <label>Song Title</label>
            <input 
              type="text" 
              value={config.music.title} 
              onChange={e => updateMusic('title', e.target.value)} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Artist</label>
            <input 
              type="text" 
              value={config.music.artist} 
              onChange={e => updateMusic('artist', e.target.value)} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Audio File</label>
            <div className={styles.uploadRow}>
              <input 
                type="text" 
                value={config.music.url} 
                onChange={e => updateMusic('url', e.target.value)} 
                className={styles.urlInput}
                placeholder="/uploads/music.mp3"
              />
              <label className={styles.uploadButton}>
                {uploading ? '...' : 'Upload'}
                <input 
                  type="file" 
                  onChange={(e) => handleFileUpload(e, 'music')} 
                  accept="audio/*" 
                  hidden 
                />
              </label>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>
              <input 
                type="checkbox" 
                checked={config.music.enabled} 
                onChange={e => updateMusic('enabled', e.target.checked)} 
              />
              Enable Music
            </label>
          </div>
        </section>

        {/* Theme Section */}
        <section className={styles.section}>
          <h2>Theme</h2>
          <div className={styles.inputGroup}>
            <label>Accent Color</label>
            <input 
              type="color" 
              value={config.theme.accent_color} 
              onChange={e => updateTheme('accent_color', e.target.value)} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Card Opacity ({config.theme.card_opacity})</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={config.theme.card_opacity} 
              onChange={e => updateTheme('card_opacity', parseFloat(e.target.value))} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Card Blur ({config.theme.card_blur}px)</label>
            <input 
              type="number" 
              value={config.theme.card_blur} 
              onChange={e => updateTheme('card_blur', parseInt(e.target.value))} 
            />
          </div>
        </section>

        {/* Visibility Section */}
        <section className={styles.section}>
          <h2>Visibility</h2>
          <div className={styles.checkboxGroup}>
            <label>
              <input 
                type="checkbox" 
                checked={config.show_views} 
                onChange={e => setConfig({...config, show_views: e.target.checked})} 
              />
              Show Views
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={config.show_spotify} 
                onChange={e => setConfig({...config, show_spotify: e.target.checked})} 
              />
              Show Spotify
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={config.show_discord_presence} 
                onChange={e => setConfig({...config, show_discord_presence: e.target.checked})} 
              />
              Show Discord Presence
            </label>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Admin
