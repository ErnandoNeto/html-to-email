const API_URL = 'https://html-to-email.onrender.com'

const translations = {
  'pt-BR': {
    subtitle: 'Anexe um arquivo HTML e envie como email',
    labelTo: 'Destinatário',
    placeholderTo: 'destinatario@email.com',
    labelSubject: 'Assunto',
    placeholderSubject: 'Assunto do email',
    labelFile: 'Arquivo HTML',
    fileLabel: 'Clique ou arraste um arquivo .html aqui',
    preview: 'Preview',
    sendBtn: 'Enviar email',
    sending: 'Enviando...',
    successMsg: 'Email enviado com sucesso!',
    errorNoFile: 'Selecione um arquivo HTML.',
    errorOnly: 'Apenas arquivos .html são aceitos.',
  },
  'en': {
    subtitle: 'Attach an HTML file and send it as an email',
    labelTo: 'Recipient',
    placeholderTo: 'recipient@email.com',
    labelSubject: 'Subject',
    placeholderSubject: 'Email subject',
    labelFile: 'HTML File',
    fileLabel: 'Click or drag an .html file here',
    preview: 'Preview',
    sendBtn: 'Send email',
    sending: 'Sending...',
    successMsg: 'Email sent successfully!',
    errorNoFile: 'Please select an HTML file.',
    errorOnly: 'Only .html files are accepted.',
  },
}

let currentLang = 'pt-BR'

function applyLang(lang) {
  const t = translations[lang]
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (t[key]) el.textContent = t[key]
  })
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder')
    if (t[key]) el.placeholder = t[key]
  })
  document.documentElement.lang = lang
}

const langToggle = document.getElementById('langToggle')
langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'pt-BR' ? 'en' : 'pt-BR'
  langToggle.textContent = currentLang === 'pt-BR' ? 'EN' : 'PT'
  applyLang(currentLang)
})

const form = document.getElementById('emailForm')
const htmlFile = document.getElementById('htmlFile')
const fileLabel = document.getElementById('fileLabel')
const fileDrop = document.getElementById('fileDrop')
const preview = document.getElementById('preview')
const previewFrame = document.getElementById('previewFrame')
const clearPreview = document.getElementById('clearPreview')
const sendBtn = document.getElementById('sendBtn')
const toast = document.getElementById('toast')

htmlFile.addEventListener('change', () => {
  const file = htmlFile.files[0]
  if (!file) return

  fileLabel.textContent = file.name

  const reader = new FileReader()
  reader.onload = (e) => {
    previewFrame.srcdoc = e.target.result
    preview.classList.remove('hidden')
  }
  reader.readAsText(file)
})

fileDrop.addEventListener('dragover', (e) => {
  e.preventDefault()
  fileDrop.classList.add('dragover')
})

fileDrop.addEventListener('dragleave', () => {
  fileDrop.classList.remove('dragover')
})

fileDrop.addEventListener('drop', (e) => {
  e.preventDefault()
  fileDrop.classList.remove('dragover')

  const file = e.dataTransfer.files[0]
  if (!file || !file.name.endsWith('.html')) {
    showToast(translations[currentLang].errorOnly, 'error')
    return
  }

  const dt = new DataTransfer()
  dt.items.add(file)
  htmlFile.files = dt.files
  htmlFile.dispatchEvent(new Event('change'))
})

clearPreview.addEventListener('click', () => {
  htmlFile.value = ''
  fileLabel.textContent = translations[currentLang].fileLabel
  preview.classList.add('hidden')
  previewFrame.srcdoc = ''
})

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const to = document.getElementById('to').value.trim()
  const subject = document.getElementById('subject').value.trim()
  const file = htmlFile.files[0]

  if (!file) {
    showToast(translations[currentLang].errorNoFile, 'error')
    return
  }

  const formData = new FormData()
  formData.append('to', to)
  formData.append('subject', subject)
  formData.append('html', file)

  sendBtn.disabled = true
  sendBtn.textContent = translations[currentLang].sending
  hideToast()

  try {
    const res = await fetch(`${API_URL}/send`, {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Erro ao enviar email.')
    }

    showToast(translations[currentLang].successMsg, 'success')
    form.reset()
    fileLabel.textContent = translations[currentLang].fileLabel
    preview.classList.add('hidden')
    previewFrame.srcdoc = ''
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    sendBtn.disabled = false
    sendBtn.textContent = translations[currentLang].sendBtn
  }
})

function showToast(message, type) {
  toast.textContent = message
  toast.className = `toast ${type}`
}

function hideToast() {
  toast.className = 'toast hidden'
}
