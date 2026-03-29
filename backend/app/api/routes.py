from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from app.core.remover import remove_background
import io

router = APIRouter()

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE_MB = 10


@router.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use JPG, PNG or WebP.")

    content = await file.read()
    if len(content) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"File too large. Max size is {MAX_SIZE_MB}MB.")

    try:
        result_bytes = await remove_background(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

    return StreamingResponse(
        io.BytesIO(result_bytes),
        media_type="image/png",
        headers={"Content-Disposition": "attachment; filename=result.png"},
    )
