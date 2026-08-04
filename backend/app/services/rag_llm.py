from __future__ import annotations

import os
from typing import List, Dict, Any

import httpx


GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = "llama-3.3-70b-versatile"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


async def chat_with_context(
    system_prompt: str,
    user_prompt: str,
    context_chunks: List[Dict[str, Any]],
    temperature: float = 0.0,
) -> str:
    context_text = "\n\n---\n\n".join(
        [
            f"Source: {chunk.get('payload', {}).get('document_name', 'Unknown')}\n"
            f"Section: {chunk.get('payload', {}).get('section', 'Unknown')}\n"
            f"Text:\n{chunk.get('text', '')}"
            for chunk in context_chunks
        ]
    )

    full_user_prompt = (
        f"Context (regulatory excerpts):\n{context_text}\n\n"
        f"Question: {user_prompt}\n\n"
        f"Answer based only on the context above. If the context does not contain "
        f"enough information, say so clearly."
    )

    if not GROQ_API_KEY:
        raise RuntimeError(
            "GROQ_API_KEY is not set. Add it to your .env.local or environment variables."
        )

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": full_user_prompt},
        ],
        "temperature": temperature,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            GROQ_API_URL,
            headers=headers,
            json=payload,
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"].strip()


