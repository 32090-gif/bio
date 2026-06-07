import React, { useState, useEffect } from 'react'
import { Background } from '../components/Background'
import { Card } from '../components/Card'
import { useLanyard } from '../hooks/useLanyard'
import { Config } from '../types/config'

function Home() {
  const [config, setConfig] = useState<Config | null>(null)
  const [views, setViews] = useState(0)
  const [loading, setLoading] = useState(true)
  const [hasEntered, setHasEntered] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const configRes = await fetch('/api/config')
        const configData = await configRes.json()
        setConfig(configData)

        // Only get current count, don't increment yet
        const viewsRes = await fetch('/api/views')
        const viewsData = await viewsRes.json()
        setViews(viewsData.views)

        setLoading(false)
      } catch (error) {
        console.error('Failed to initialize:', error)
        setLoading(false)
      }
    }

    init()
  }, [])

  const { data: lanyardData, loading: lanyardLoading } = useLanyard(config?.discord_id)

  const handleEnter = async () => {
    setHasEntered(true)
    try {
      const res = await fetch('/api/views', { method: 'POST' })
      const data = await res.json()
      setViews(data.views)
    } catch (error) {
      console.error('Failed to increment views:', error)
    }
  }

  if (loading || !config) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#000',
        color: '#fff',
        fontFamily: 'sans-serif'
      }}>
        Loading...
      </div>
    )
  }

  if (!hasEntered) {
    return (
      <div 
        onClick={handleEnter}
        className="fade-in"
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          cursor: 'pointer',
          zIndex: 9999,
          position: 'fixed',
          top: 0,
          left: 0,
          transition: 'opacity 0.8s ease'
        }}
      >
        <div style={{
          fontFamily: config.theme.font_display,
          fontSize: '1.5rem',
          color: '#fff',
          letterSpacing: '0.2em',
          animation: 'pulse 2.5s infinite ease-in-out',
          textTransform: 'uppercase'
        }}>
          [ click to enter ]
        </div>
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 0.2; transform: scale(0.95); letter-spacing: 0.2em; }
              50% { opacity: 1; transform: scale(1); letter-spacing: 0.25em; }
              100% { opacity: 0.2; transform: scale(0.95); letter-spacing: 0.2em; }
            }
          `}
        </style>
      </div>
    )
  }

  return (
    <div className="app fade-in">
      <Background config={config.background} />
      
      <main style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}>
        <Card 
          config={config} 
          lanyardData={lanyardData} 
          lanyardLoading={lanyardLoading} 
          views={views}
        />
      </main>
    </div>
  )
}

export default Home
