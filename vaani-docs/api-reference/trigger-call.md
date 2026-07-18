# Create Dispatch

> Trigger an outbound telephony call or an in-browser WebRTC session

## Overview

Use the `medium` parameter to choose the delivery channel:

| `medium`                | What happens                                                           |
| ----------------------- | ---------------------------------------------------------------------- |
| `"telephony"` (default) | Outbound SIP/PSTN call to `contact_number`                             |
| `"webrtc"`              | In-browser WebRTC session — returns a LiveKit token and connection URL |

## Required Fields

- `agent_id`: Agent UUID from the Agent Config page
- `medium`: `"telephony"` (default) or `"webrtc"`

### Required for `medium="telephony"` only

- `contact_number`: Contact number with country code (e.g., +919876543210)
- `name`: Customer name

### Optional Telephony Fields

- `outbound_number`: Specific outbound caller ID to use (E.164 format)
- `dnd_check_skipped`: Set to `true` to skip the Do Not Disturb (DND) check

### Optional WebRTC Fields

- `voice_gender`: `"male"` | `"female"` (default: `"female"`)
- `primary_language`: Primary language code, e.g. `"en"`, `"hi"` (default: `"hi"`)
- `secondary_language`: Fallback language code (default: `"en"`)
- `welcome_message`: Custom greeting the agent speaks on connect
- `welcome_interruptible`: Whether the welcome message can be interrupted (default: `true`)
- `bg_noise_enabled`: Enable background noise (default: `false`)
- `bg_noise_volume`: Background noise volume 0-100 (default: `60`)
- `voice_speed`: Speech speed multiplier 0.6-1.4 (default: `1.0`)

### Runtime Config Override

- `modify_agent`: Agent config sections to override at call time (supported for both mediums). Accepted top-level keys: `persona`, `training`, `experience`, `analysis`. Each key must contain the complete JSON structure for that section. Values are deep-merged with the base agent config.

## Request Body

### Telephony

```json
{
  "agent_id": "string (uuid)",
  "medium": "telephony",
  "contact_number": "string",
  "name": "string",
  "voice": "string",
  "metadata": {},
  "outbound_number": "string",
  "dnd_check_skipped": false,
  "modify_agent": {
    "persona": {},
    "training": {},
    "experience": {},
    "analysis": {}
  }
}
```

### WebRTC

```json
{
  "agent_id": "string (uuid)",
  "medium": "webrtc",
  "metadata": {},
  "voice_gender": "female",
  "primary_language": "en",
  "secondary_language": "en",
  "welcome_message": "Hello! How can I help you?",
  "welcome_interruptible": true,
  "bg_noise_enabled": false,
  "bg_noise_volume": 60,
  "voice_speed": 1.0,
  "modify_agent": {
    "persona": {},
    "training": {},
    "experience": {},
    "analysis": {}
  }
}
```

## Request Examples

### Telephony

```bash
curl -X POST -H "X-API-Key: vaani_<your_key>" -H "Content-Type: application/json" \
 -d '{
   "agent_id": "uuid-or-agent-name",
   "medium": "telephony",
   "contact_number": "+1234567890",
   "name": "John",
   "metadata": {},
   "dnd_check_skipped": true
 }' \
 https://api.vaanivoice.ai/api/trigger-call/
```

```python
import requests

response = requests.post(
    "https://api.vaanivoice.ai/api/trigger-call/",
    headers={"X-API-Key": "YOUR_API_KEY", "Content-Type": "application/json"},
    json={
        "agent_id": "8cf3373e-eb6f-4b4c-9f3c-324a56a91147",
        "medium": "telephony",
        "contact_number": "+919873446506",
        "name": "Nishank",
        "metadata": {},
        "dnd_check_skipped": True,
    }
)
print(response.json())
```

### WebRTC

```bash
curl -X POST -H "X-API-Key: vaani_<your_key>" -H "Content-Type: application/json" \
 -d '{
   "agent_id": "uuid-or-agent-name",
   "medium": "webrtc",
   "primary_language": "en",
   "welcome_message": "Hello! How can I help you today?"
 }' \
 https://api.vaanivoice.ai/api/trigger-call/
```

```python
import requests

response = requests.post(
    "https://api.vaanivoice.ai/api/trigger-call/",
    headers={"X-API-Key": "YOUR_API_KEY", "Content-Type": "application/json"},
    json={
        "agent_id": "8cf3373e-eb6f-4b4c-9f3c-324a56a91147",
        "medium": "webrtc",
        "primary_language": "en",
    }
)
data = response.json()
token = data["token"]
connection_url = data["connection_url"]
```

## Response

### Telephony Success (200)

```json
{
  "success": true,
  "message": "Call initiated successfully",
  "output": {
    "agent_name": "vaani321talha",
    "call_id": "outbound-1776774443-863aa698",
    "live_captions_url": "wss://api.vaanivoice.ai/api/live-transcripts/ws/outbound-1776774443-863aa698"
  },
  "error": null
}
```

### WebRTC Success (200)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "room_name": "room_d083374a_c167_4bda_b8bc_2a418ca85f35_abc123",
  "agent_name": "d083374a-c167-4bda-b8bc-2a418ca85f35",
  "connection_url": "wss://rtc.vaanivoice.ai",
  "live_captions_url": "wss://api.vaanivoice.ai/api/live-transcripts/ws/room_..."
}
```

## Live Captions

The `live_captions_url` provides a WebSocket endpoint for streaming real-time transcripts:

```javascript
const ws = new WebSocket(live_captions_url);

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  switch (message.type) {
    case "connected":
      console.log("Connected to live captions");
      break;
    case "history":
      console.log("History:", message.segments);
      break;
    case "transcript":
      console.log(`${message.segment.speaker}: ${message.segment.text}`);
      break;
    case "call_ended":
      console.log("Call ended");
      ws.close();
      break;
  }
};
```

### Message Types

| Type             | Description                                      |
| ---------------- | ------------------------------------------------ |
| `connected`      | Connection established                           |
| `history`        | Historical transcript segments (sent on connect) |
| `transcript`     | Real-time speech transcript                      |
| `turn_started`   | Speaker turn started                             |
| `turn_ended`     | Speaker turn ended                               |
| `interrupted`    | Speaker was interrupted                          |
| `call_started`   | Call has started                                 |
| `call_ended`     | Call has ended                                   |
| `agent_thinking` | Agent is processing                              |

### Transcript Segment Structure

```json
{
  "id": "unique-segment-id",
  "call_id": "outbound-1776774443-863aa698",
  "event_type": "transcript",
  "speaker": "agent",
  "text": "Hello, how can I help you today?",
  "timestamp": 1776774443.123,
  "is_final": true,
  "segment_index": 1,
  "was_interrupted": false,
  "confidence": 0.95
}
```
