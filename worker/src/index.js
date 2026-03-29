export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    const url = new URL(request.url)

    if (url.pathname === '/api/remove-bg' && request.method === 'POST') {
      return handleRemoveBg(request, env)
    }

    if (url.pathname === '/health') {
      return Response.json({ status: 'ok' })
    }

    return new Response('Not Found', { status: 404 })
  },
}

async function handleRemoveBg(request, env) {
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

  // Validate type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return Response.json(
      { error: 'Unsupported file type. Please upload JPG, PNG or WEBP.' },
      { status: 400, headers: corsHeaders }
    )
  }

  // Validate size (12MB)
  const MAX_SIZE = 12 * 1024 * 1024
  const buffer = await file.arrayBuffer()
  if (buffer.byteLength > MAX_SIZE) {
    return Response.json(
      { error: 'File too large. Maximum size is 12MB.' },
      { status: 413, headers: corsHeaders }
    )
  }

  // Forward to Remove.bg
  const removeBgForm = new FormData()
  removeBgForm.append('image_file', new Blob([buffer], { type: file.type }), file.name || 'image')
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

  // Stream result back (no storage)
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
