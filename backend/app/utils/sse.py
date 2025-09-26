# app/utils/sse.py
from starlette.responses import StreamingResponse
from typing import Callable, Any
import asyncio


def format_sse(data: str, event: str = None) -> str:
    msg = f"data: {data}\n"
    if event:
        msg = f"event: {event}\n{msg}"
    return msg + "\n"


def sse_stream(generator: Callable[..., Any]):
    async def event_generator():
        async for chunk in generator():
            yield format_sse(chunk)
    return StreamingResponse(event_generator(), media_type="text/event-stream")
