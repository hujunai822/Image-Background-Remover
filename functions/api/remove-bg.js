export async function onRequestPost({ request, env }) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
  }

  let formData
  try {
    formData = await request.formData()
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400, headers: corsHeaders })
  }

  const file = formData.get('image_file')
  if (!file) {
    return Response.json({ error: 'No image_file field found' }, { status: 400, headers: corsHeaders })
  }

  const MAX_SIZE = 12 * 1024 * 1024
  const buffer = await file.arrayBuffer()
  if (buffer.byteLength > MAX_SIZE) {
    return Response.json(
      { error: 'File too large. Maximum size is 12MB.' },
      { status: 413, headers: corsHeaders }
    )
  }

  // 通过文件头魔数检测真实格式，避免 Pages 运行时 file.type 为空的问题
  function detectMime(buf) {
    const bytes = new Uint8Array(buf.slice(0, 12))
    if (bytes[0] === 0xFF && bytes[1] === 0xD8) return 'image/jpeg'
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return 'image/png'
    if (bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return 'image/webp'
    return null
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  const detectedMime = detectMime(buffer)
  const effectiveMime = detectedMime || (file.type && allowedTypes.includes(file.type) ? file.type : null)

  if (!effectiveMime) {
    return Response.json(
      { error: 'Unsupported file type. Please upload JPG, PNG or WEBP.' },
      { status: 400, headers: corsHeaders }
    )
  }

  // Check API key
  if (!env.REMOVE_BG_API_KEY) {
    return Response.json({ error: 'Server misconfiguration: missing API key' }, { status: 500, headers: corsHeaders })
  }

  const ext = effectiveMime.split('/')[1]
  const filename = (file.name && file.name !== 'blob') ? file.name : `image.${ext}`

  const removeBgForm = new FormData()
  removeBgForm.append('image_file', new File([buffer], filename, { type: effectiveMime }))
  removeBgForm.append('size', 'auto')

  let removeBgRes
  try {
    removeBgRes = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': env.REMOVE_BG_API_KEY,
      },
      body: removeBgForm,
    })
  } catch (err) {
    return Response.json(
      { error: 'Failed to reach Remove.bg API. Please try again.' },
      { status: 502, headers: corsHeaders }
    )
  }

  if (!removeBgRes.ok) {
    const errText = await removeBgRes.text()
    return Response.json(
      { error: `Remove.bg error: ${removeBgRes.status} - ${errText}` },
      { status: 502, headers: corsHeaders }
    )
  }

  const resultBuffer = await removeBgRes.arrayBuffer()
  return new Response(resultBuffer, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename="removed-background.png"',
      'Cache-Control': 'no-store',
    },
  })
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
