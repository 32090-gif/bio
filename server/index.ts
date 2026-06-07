import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001
const CONFIG_PATH = path.join(__dirname, 'config.json')
const VIEWS_PATH = path.join(__dirname, 'views.json')
const UPLOADS_PATH = path.join(__dirname, 'uploads')

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_PATH)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(UPLOADS_PATH))

// Serve static files from Vite build in production
const DIST_PATH = path.join(__dirname, '../dist')
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH))
}

// Serve config to frontend
app.get('/api/config', (req, res) => {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
    res.json(config)
  } catch (error) {
    res.status(500).json({ error: 'Failed to read config' })
  }
})

// Update config (admin use)
app.post('/api/config', (req, res) => {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(req.body, null, 2))
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update config' })
  }
})

// Upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    const fileUrl = `/uploads/${req.file.filename}`
    res.json({ url: fileUrl })
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' })
  }
})

// Proxy Lanyard to avoid CORS issues
app.get('/api/presence/:user_id', async (req, res) => {
  try {
    const r = await fetch(`https://api.lanyard.rest/v1/users/${req.params.user_id}`)
    const data = await r.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch presence' })
  }
})

// View counter - Get current count
app.get('/api/views', (req, res) => {
  try {
    let data = { views: 0 }
    if (fs.existsSync(VIEWS_PATH)) {
      data = JSON.parse(fs.readFileSync(VIEWS_PATH, 'utf-8'))
    }
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get views' })
  }
})

// View counter - Increment count
app.post('/api/views', (req, res) => {
  try {
    let data = { views: 0 }
    if (fs.existsSync(VIEWS_PATH)) {
      data = JSON.parse(fs.readFileSync(VIEWS_PATH, 'utf-8'))
    }
    
    data.views += 1

    fs.writeFileSync(VIEWS_PATH, JSON.stringify(data, null, 2))
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update views' })
  }
})

// Handle client-side routing in production (Always serve index.html for unknown routes)
if (fs.existsSync(DIST_PATH)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_PATH, 'index.html'))
  })
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
