import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { Resend } from 'resend'

const app = express()
const upload = multer({ storage: multer.memoryStorage() })
const resend = new Resend(process.env.RESEND_API_KEY)

app.use(cors())
app.use(express.json())

app.post('/send', upload.single('html'), async (req, res) => {
  const { to, subject } = req.body

  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo HTML enviado.' })
  }

  if (!to) {
    return res.status(400).json({ error: 'Email do destinatário é obrigatório.' })
  }

  const html = req.file.buffer.toString('utf-8')

  const { data, error } = await resend.emails.send({
    from: process.env.FROM_EMAIL,
    to,
    subject: subject || 'Email enviado via html-to-email',
    html,
  })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ success: true, id: data.id })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Backend rodando em http://localhost:${PORT}`))
