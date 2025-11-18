const express = require('express')
const axios = require('axios')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5175

app.use(cors())
app.use(express.json())

app.post('/api/generate', async (req, res) => {
  try {
    console.log('📨 Received request body:', JSON.stringify(req.body, null, 2))
    const { prompt } = req.body
    if(!prompt) {
      console.log('❌ Missing prompt in request')
      return res.status(400).json({ error: 'missing prompt' })
    }

    const endpoint = process.env.VITE_AI_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
    const apiKey = process.env.VITE_AI_API_KEY
    if(!apiKey) {
      console.log('❌ Missing API key')
      return res.status(500).json({ error: 'server: VITE_AI_API_KEY not configured' })
    }

    // Build payload for Gemini API (new format)
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    }

    const url = `${endpoint}?key=${apiKey}`
    console.log(`📤 Forwarding to Gemini API...`)
    const response = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } })
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || response.data?.output || JSON.stringify(response.data)
    console.log('✅ Got response from Gemini')
    return res.status(200).json({ text })
  } catch (err) {
    console.error('❌ Proxy error:', err?.response?.data || err.message)
    const status = err?.response?.status || 500
    const data = err?.response?.data || { error: err.message }
    return res.status(status).json(data)
  }
})

app.listen(port, () => console.log(`✅ Proxy server listening at http://localhost:${port}\n`))

