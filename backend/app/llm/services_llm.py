import logging
from typing import Callable
import backoff
from fastapi import HTTPException
from langchain.callbacks.base import AsyncCallbackHandler
from app.llm.chains import get_llm_chain
from app.db.models import PlanSectionType

logger = logging.getLogger(__name__)

class SSEStreamer(AsyncCallbackHandler):
    async def on_llm_new_token(self, token: str, **kwargs):
        # Envoie chaque token vers le client SSE
        await kwargs["send_event"](data=token)

@backoff.on_exception(
    backoff.expo,
    Exception,
    max_time=30,
    on_backoff=lambda details: logger.warning(f"Retrying LLM call: {details}")
)
async def _call_chain(chain, inputs: dict, send_event: Callable):
    """
    Tente une génération en streaming (SSE), ou retourne en fallback.
    """
    try:
        return await chain.apredict_and_stream(
            callbacks=[SSEStreamer()],
            send_event=send_event,
            **inputs
        )
    except AttributeError:
        # Fallback sans streaming natif
        result = await chain.apredict(**inputs)
        await send_event(data=result)
        return result

async def generate_plan_sse(
    plan_id: str,
    inputs: dict,
    send_event: Callable
) -> None:
    """
    Génère toutes les sections en SSE pour un plan donné.  
    send_event: coroutine pour pousser les événements SSE.
    """
    try:
        for section in PlanSectionType:
            chain = get_llm_chain(section)
            await _call_chain(chain, inputs, send_event)
    except Exception as e:
        logger.error(f"Erreur génération SSE plan {plan_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Erreur interne LLM")
