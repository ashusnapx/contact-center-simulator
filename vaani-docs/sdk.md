# Python SDK

> Use the vaani-sdk Python package to trigger calls, manage agents, and run WebRTC voice sessions — both synchronous and async

## Installation

```bash
pip install vaani-sdk
```

Or install directly from source:

```bash
git clone https://github.com/your-org/vaani-sdk
cd vaani-sdk
pip install -e .
```

**Requirements:** Python 3.9+, `httpx>=0.24.0`, `pydantic>=2.0.0`

## Authentication

```python
import os
from vaani_sdk import VaaniClient

client = VaaniClient(api_key=os.getenv("VAANI_API_KEY"))
```

| Parameter  | Description                      | Default                     |
| ---------- | -------------------------------- | --------------------------- |
| `api_key`  | Your Vaani API key (`X-API-Key`) | *(required)*                |
| `base_url` | Base URL of the Vaani API        | `https://api.vaanivoice.ai` |
| `timeout`  | Request timeout in seconds       | `120.0`                     |

Use the client as a **context manager**:

```python
with VaaniClient(api_key=os.getenv("VAANI_API_KEY")) as client:
    resp = client.health()
    print(resp.status)  # "healthy"
```

## Outbound Calls

### Trigger a Call

```python
from vaani_sdk import VaaniClient

with VaaniClient(api_key="YOUR_API_KEY") as client:
    result = client.trigger_call(
        agent_id="8cf3373e-eb6f-4b4c-9f3c-324a56a91147",
        contact_number="+919876543210",
        name="Rahul Sharma",
        metadata={
            "customer_name": "Rahul Sharma",
            "property_name": "Prateek Laurel",
        },
    )
    print(result.call_id)  # "outbound-1776774443-863aa698"
```

| Parameter         | Type | Required | Description                                                   |
| ----------------- | ---- | -------- | ------------------------------------------------------------- |
| `agent_id`        | str  | Yes      | Agent UUID from the Agent Config dashboard                    |
| `contact_number`  | str  | Yes      | Phone number in E.164 format (e.g. `+919876543210`)           |
| `name`            | str  | Yes      | Contact display name                                          |
| `voice`           | str  | No       | Override the agent's default voice for this call              |
| `metadata`        | dict | No       | Template variables injected into the agent's prompt           |
| `outbound_number` | str  | No       | Override caller ID (must be configured in Telephony settings) |

### Call History

```python
history = client.get_call_history(page=1, page_size=20)

print(history.pagination.total)       # total records
print(history.pagination.total_pages) # total pages

for call in history.data:
    print(call.call_id, call.raw.get("call_status"), call.raw.get("duration_ms"))
```

### Transcript and Call Details

```python
transcript = client.get_transcript("outbound-1776774443-863aa698")
print(transcript.transcript)

details = client.get_call_details("outbound-1776774443-863aa698")
print(details.raw.get("summary"))
print(details.raw.get("entity"))
```

### Stream Audio

```python
audio = client.stream_audio("outbound-1776774443-863aa698")
with open("recording.ogg", "wb") as f:
    f.write(audio.content)

# For large files, stream in chunks:
with open("recording.ogg", "wb") as f:
    for chunk in client.stream_audio_iter("outbound-1776774443-863aa698"):
        f.write(chunk)
```

## WebRTC Voice Sessions

Use `client.sessions` to create and manage real-time voice sessions powered by LiveKit.

### Flow Overview

1. **Create a session** — Call `client.sessions.create(...)` to get a `session_token` and an embeddable `session_url`.
2. **Connect and get LiveKit credentials** — Call `client.sessions.connect(session_token)` to obtain `lk_url` and `lk_token`.
3. **Join via LiveKit** — Pass `lk_url` and `lk_token` to the LiveKit client SDK.
4. **End the session** — Call `client.sessions.disconnect(session_token)` when the user leaves.

### Quickstart

```python
from vaani_sdk import VaaniClient

with VaaniClient(api_key="YOUR_API_KEY") as client:
    # Create a session
    session = client.sessions.create(
        agent_id="33ac5907-0e44-43c4-934e-08e335cca6ee",
        ui_type="widget",
        grace_period=60,
        session_ttl=1800,
        initial_message="User is asking about order #1234",
        metadata={"user_id": "user_123", "ticket_id": "T-1234"},
    )
    print(session.session_token)  # JWT session token
    print(session.session_url)    # embeddable/shareable URL

    # Exchange token for LiveKit credentials
    creds = client.sessions.connect(session.session_token)
    print(creds.lk_url)    # "wss://livekit.vaanivoice.ai"
    print(creds.lk_token)  # LiveKit participant JWT
    print(creds.room_name) # room name

    # Check status
    status = client.sessions.get(session.session_token)
    print(status.status)   # "created" | "agent_ready" | "active" | "ended"

    # End the session
    client.sessions.disconnect(session.session_token)
```

### `sessions.create()` Parameters

| Parameter         | Type | Default      | Description                                            |
| ----------------- | ---- | ------------ | ------------------------------------------------------ |
| `agent_id`        | str  | required     | Agent UUID or name                                     |
| `ui_type`         | str  | `"fullpage"` | Display mode: `"fullpage"` or `"widget"`               |
| `grace_period`    | int  | None         | Reconnection window in seconds (0–3600)                |
| `session_ttl`     | int  | None         | Session lifetime in seconds (60–86400, default 30 min) |
| `initial_message` | str  | None         | Message injected into agent context at session start   |
| `metadata`        | dict | None         | Arbitrary key-value data forwarded to the agent        |

### Real-Time Session Events

Connect to the WebSocket URL to receive push events:

```python
import asyncio
import json
import websockets
from vaani_sdk import VaaniClient

client = VaaniClient(api_key="YOUR_API_KEY")

async def listen(session_token: str) -> None:
    url = client.sessions.ws_url(session_token)
    async with websockets.connect(url) as ws:
        async for message in ws:
            event = json.loads(message)
            if event["event"] == "agent_ready":
                print("Agent has joined the room")
            elif event["event"] == "agent_timeout":
                print("Agent failed to join:", event.get("reason"))
            elif event["event"] == "session_ended":
                print("Session ended:", event.get("reason"))

asyncio.run(listen("session-token-here"))
```

## Agent Management

### Create an Agent

```python
result = client.create_agent(
    agent_display_name="my-support-bot",
    config={
        "persona": {
            "identity": {
                "system_prompt": "You are a helpful support agent."
            }
        }
    },
)
print(result.agent_id)    # "33ac5907-0e44-43c4-934e-08e335cca6ee"
print(result.agent_name)  # "vaani123my-support-bot"
```

### List and Inspect Agents

```python
agents = client.agents.list()
for agent in agents:
    print(agent.id, agent.agent_name, agent.agent_language)

agent = client.agents.get("33ac5907-0e44-43c4-934e-08e335cca6ee")
print(agent.created_at)
```

### Update Agent Configuration

```python
# Update persona (system prompt, voice, language)
result = client.update_agent_persona(
    agent_id="33ac5907-0e44-43c4-934e-08e335cca6ee",
    persona={
        "identity": {
            "system_prompt": "You are a helpful customer service agent.",
        },
        "senses_capabilities": {
            "language": "English",
        }
    },
)

# Update training (FAQ, guardrails)
client.update_agent_training(
    agent_id="33ac5907-0e44-43c4-934e-08e335cca6ee",
    training={
        "know_how": {
            "faq": {
                "What are your hours?": "We are open 9 AM to 5 PM."
            }
        }
    },
)

# Update experience (call settings, idle behavior, background noise)
client.update_agent_experience(
    agent_id="33ac5907-0e44-43c4-934e-08e335cca6ee",
    experience={
        "settings": {
            "call_settings": {"max_call_duration": 30}
        }
    },
)

# Update analysis (dispositions, data extraction)
client.update_agent_analysis(
    agent_id="33ac5907-0e44-43c4-934e-08e335cca6ee",
    analysis={
        "extraction": {
            "data_collection": {
                "enabled": True,
                "data_points": [
                    {"name": "customer_email", "prompt": "Extract the customer's email address", "nullable": True}
                ]
            }
        }
    },
)

# Update deployment (inbound/outbound phone numbers)
client.update_agent_deployment(
    agent_id="33ac5907-0e44-43c4-934e-08e335cca6ee",
    deployment={
        "deployment": {
            "phone": {
                "call_type": {
                    "Inbound": "",
                    "Outbound": ["+919876543210"]
                }
            }
        }
    },
)
```

## Async Usage

Every method has an exact async equivalent on `AsyncVaaniClient`:

```python
import asyncio
from vaani_sdk import AsyncVaaniClient

async def main():
    async with AsyncVaaniClient(api_key="YOUR_API_KEY") as client:
        result = await client.trigger_call(
            agent_id="8cf3373e-eb6f-4b4c-9f3c-324a56a91147",
            contact_number="+919876543210",
            name="Nishank",
        )
        print(result.call_id)

        session = await client.sessions.create(agent_id="8cf3373e-eb6f-4b4c-9f3c-324a56a91147")
        creds = await client.sessions.connect(session.session_token)
        print(creds.lk_url, creds.lk_token)

        calls = await client.calls.list(page=1, page_size=10)
        agents = await client.agents.list()

asyncio.run(main())
```

## Error Handling

All SDK exceptions inherit from `VaaniError` and carry a `.status_code` attribute.

| Exception                  | HTTP status | Cause                                  |
| -------------------------- | ----------- | -------------------------------------- |
| `AuthenticationError`      | 401         | Invalid or missing API key             |
| `ForbiddenError`           | 403         | Operation not allowed for this API key |
| `NotFoundError`            | 404         | Resource does not exist                |
| `SessionExpiredError`      | 410         | WebRTC session has ended or expired    |
| `InsufficientBalanceError` | 402         | Wallet balance too low                 |
| `ValidationError`          | 422         | Request parameters failed validation   |
| `RateLimitError`           | 429         | Too many requests                      |
| `ServerError`              | 5xx         | Vaani server-side error                |
| `TimeoutError`             | —           | Request timed out                      |
| `ConnectionError`          | —           | Could not reach the API                |

```python
from vaani_sdk import (
    VaaniClient,
    AuthenticationError,
    ForbiddenError,
    InsufficientBalanceError,
    NotFoundError,
    SessionExpiredError,
    VaaniError,
)

with VaaniClient(api_key="YOUR_API_KEY") as client:
    try:
        session = client.sessions.create(agent_id="my-agent")
        creds = client.sessions.connect(session.session_token)
    except AuthenticationError:
        print("Invalid API key")
    except ForbiddenError:
        print("Agent not owned by this API key")
    except InsufficientBalanceError:
        print("Wallet balance is too low")
    except SessionExpiredError:
        print("Session has already ended")
    except NotFoundError:
        print("Agent not found")
    except VaaniError as exc:
        print(f"API error {exc.status_code}: {exc.message}")
```
