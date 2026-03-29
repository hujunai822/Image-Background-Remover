import asyncio
from rembg import remove
from PIL import Image
import io


async def remove_background(image_bytes: bytes) -> bytes:
    """Remove background from image bytes, return PNG bytes."""
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, _process, image_bytes)
    return result


def _process(image_bytes: bytes) -> bytes:
    input_image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    output_image = remove(input_image)
    buf = io.BytesIO()
    output_image.save(buf, format="PNG")
    return buf.getvalue()
