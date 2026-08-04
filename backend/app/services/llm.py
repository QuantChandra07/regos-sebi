from typing import List, Dict, Any
import os
import httpx

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = "gpt-4o-mini"


async def chat_with_context(
    system_prompt: str,
    user_prompt: str,
    context_chunks: List[Dict[str, Any]],
    temperature: float = 0.0,
) -> str:
    """
    Call OpenAI with system prompt, user question, and retrieved
    regulatory context chunks. Returns the answer text.
    """
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

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": OPENAI_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": full_user_prompt},
        ],
        "temperature": temperature,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"].strip()


