const API_URL = 'http://localhost:3001'

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
    showToast('Apenas arquivos .html são aceitos.', 'error')
    return
  }

  const dt = new DataTransfer()
  dt.items.add(file)
  htmlFile.files = dt.files
  htmlFile.dispatchEvent(new Event('change'))
})

clearPreview.addEventListener('click', () => {
  htmlFile.value = ''
  fileLabel.textContent = 'Clique ou arraste um arquivo .html aqui'
  preview.classList.add('hidden')
  previewFrame.srcdoc = ''
})

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const to = document.getElementById('to').value.trim()
  const subject = document.getElementById('subject').value.trim()
  const file = htmlFile.files[0]

  if (!file) {
    showToast('Selecione um arquivo HTML.', 'error')
    return
  }

  const formData = new FormData()
  formData.append('to', to)
  formData.append('subject', subject)
  formData.append('html', file)

  sendBtn.disabled = true
  sendBtn.textContent = 'Enviando...'
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

    showToast('Email enviado com sucesso!', 'success')
    form.reset()
    fileLabel.textContent = 'Clique ou arraste um arquivo .html aqui'
    preview.classList.add('hidden')
    previewFrame.srcdoc = ''
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    sendBtn.disabled = false
    sendBtn.textContent = 'Enviar email'
  }
})

function showToast(message, type) {
  toast.textContent = message
  toast.className = `toast ${type}`
}

function hideToast() {
  toast.className = 'toast hidden'
}
