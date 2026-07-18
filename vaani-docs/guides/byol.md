# Bring Your Own LLM (BYOL)

> Connect your own LLM to a Vaani agent via a streaming WebSocket server

## Overview

BYOL lets you replace the default platform LLM with any inference engine you control — an on-premise model, a fine-tuned model, a Google ADK agent, a LangGraph workflow, or anything else that can speak the Vaani WebSocket protocol.

When BYOL is enabled, every response turn is routed to your WebSocket server instead of the built-in provider. The rest of the pipeline — STT, TTS, telephony, transcripts, Langfuse tracing — stays the same.

## How to Enable BYOL

1. Open your agent in the dashboard.
2. Go to Brain → Reasoning Language Model (LLM).
3. Switch to the Bring your Own LLM (BYOL) tab.
4. Paste your WebSocket URL (e.g. `wss://your-server.example.com/chat/stream`).
5. (Optional) Enter an Auth Token. When set, Vaani sends `Authorization: Bearer <token>` during the WebSocket upgrade handshake.
6. Click Test Connection to verify, then Save URL.
7. Choose a Fallback LLM — either *No fallback* or *Use platform LLM*.

The URL is stored under `agent_config.persona.senses_capabilities.brain.llm.extra_params.llm_websocket_url`.

## WebSocket Protocol

### Connection Handshake

Immediately after WebSocket accept, your server must send two JSON frames:

```json
{ "interaction_type": "config",    "content": "Server ready" }
{ "interaction_type": "greeting",  "content": "Hello" }
```

### Agent → Your Server (Request)

For every agent turn, Vaani sends:

```json
{
  "interaction_type": "response_required",
  "response_id": 2,
  "call_id": "outbound-1782291018-65b6af82",
  "transcript": [
    {
      "role": "system",
      "content": "You are speaking with {{customer_name}}..."
    },
    { "role": "assistant", "content": "I am at your service, how can I help?" },
    { "role": "user", "content": "What is this call regarding?" }
  ],
  "req_body": {
    "agent_id": "535d0c34-8086-419e-b39d-ee549fc28e93",
    "medium": "telephony",
    "contact_number": "+917893209830",
    "modify_agent": {
      "persona": {
        "metadata": {
          "customer_name": "John Doe",
          "account_type": "Premium"
        }
      }
    }
  }
}
```

| Field                 | Type                  | Description                                                       |
| --------------------- | --------------------- | ----------------------------------------------------------------- |
| `interaction_type`    | `"response_required"` | Always this value for a normal turn                               |
| `response_id`         | integer               | Monotonically increasing; echoed back in response chunks          |
| `call_id`             | string                | The room/call identifier for this session                         |
| `transcript`          | array                 | Full conversation history including system prompt as first entry  |
| `req_body`            | object or `null`      | Original trigger-call request body; `null` if not via external API |
| `req_body.x_agent_id` | string or `null`      | Value of `X-Agent-Id` header                                      |

### Your Server → Agent (Streaming Response)

Stream back JSON frames:

```json
{
  "response_type": "response",
  "response_id": 1,
  "content": "Yes, we carry ",
  "content_complete": false
}
```

Final frame:

```json
{
  "response_type": "response",
  "response_id": 1,
  "content": "beautiful Pelikan M800 models.",
  "content_complete": true
}
```

| Field              | Type         | Description                                          |
| ------------------ | ------------ | ---------------------------------------------------- |
| `response_type`    | `"response"` | Always this value                                    |
| `response_id`      | integer      | Must match the request's `response_id`               |
| `content`          | string       | Text chunk to speak; may be empty on final frame     |
| `content_complete` | boolean      | `true` on the last frame of a turn                   |

Optionally add `"end_call": true` on the final frame to hang up after speaking.

## Fallback Behaviour

| Setting              | Behaviour                                                    |
| -------------------- | ------------------------------------------------------------ |
| **No fallback**      | Turn fails silently; agent waits for next user utterance     |
| **Use platform LLM** | Falls back to primary provider; if fails, tries fallback     |

## Session Management

Each call opens a new connection at `<ws_url>/<call_id>`. Your server should use the `session_id` or path component to isolate per-call state.

## Reference Implementation

The [vaani-adk-byol-example](https://github.com/mohammad-vaaniresearch/vaani-byol-example) repo contains a complete FastAPI server that implements the full WebSocket protocol with a Google ADK agent.

```bash
cd vaani-adk-byol-example
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp example.env .env   # add your GOOGLE_API_KEY

uvicorn adk_server:app --host 0.0.0.0 --port 8090 --reload
ngrok http 8090
```
