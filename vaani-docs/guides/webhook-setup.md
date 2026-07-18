# Webhook Setup

> Receive real-time call events from Vaani

## What is a Webhook?

A webhook lets Vaani push call events to your server in real time — no polling required. You'll receive an HTTP POST request whenever a call lifecycle event occurs.

## Event Types

| Event                       | Outbound | Inbound | Description                                            |
| --------------------------- | -------- | ------- | ------------------------------------------------------ |
| `call_started`              | Yes      | Yes     | Call initiated / inbound participant connected         |
| `call_ringing`              | Yes      | No      | Phone is actively ringing                              |
| `user_picked_up_at`         | Yes      | Yes     | User answered the call                                 |
| `call_rejected`             | Yes      | No      | User rejected or line was busy                         |
| `call_no_answer`            | Yes      | No      | No answer after ~45s timeout                           |
| `call_failed`               | Yes      | No      | SIP error or abrupt abort                              |
| `human_transfer_initiated`  | Yes      | Yes     | Call transfer to human agent triggered                 |
| `human_transfer_successful` | Yes      | Yes     | Warm transfer connected to specialist                  |
| `human_transfer_failed`     | Yes      | Yes     | Warm transfer failed                                   |
| `call_ended`                | Yes      | Yes     | Session terminated — `call_duration` in **seconds**    |
| `call_postprocessing`       | Yes      | Yes     | Summary, transcript & entities ready — `call_duration` in **milliseconds** |

## Setup

1. Create a webhook endpoint that accepts POST requests and returns 200 OK.
2. Register the webhook in the dashboard at Settings → Webhooks.

```python
from flask import Flask, request

app = Flask(__name__)

@app.route("/vaani/webhook", methods=["POST"])
def handle_webhook():
    payload = request.json
    event = payload.get("event")

    if event == "call_ended":
        print(f"Call {payload['room_name']} ended after {payload['call_duration']}s")
    elif event == "call_postprocessing":
        print(f"Transcript: {payload['transcript']}")
        print(f"Summary:    {payload['summary']}")
    elif event == "human_transfer_initiated":
        print(f"Transferring to {payload['phone_number']}")

    return {"status": "ok"}, 200
```

> Your webhook endpoint must be publicly accessible. For local development, use ngrok.

## Payload Reference

### call_started

```json
{
  "event": "call_started",
  "room_name": "room_123abc",
  "status": "dialing",
  "phone_number": "+1234567890"
}
```

### call_ringing

```json
{
  "event": "call_ringing",
  "room_name": "room_123abc",
  "status": "ringing"
}
```

### user_picked_up_at

```json
{
  "event": "user_picked_up_at",
  "room_name": "room_123abc",
  "status": "active"
}
```

### call_rejected

```json
{
  "event": "call_rejected",
  "room_name": "room_123abc",
  "status": "rejected"
}
```

### call_no_answer

```json
{
  "event": "call_no_answer",
  "room_name": "room_123abc",
  "status": "no_answer"
}
```

### call_failed

```json
{
  "event": "call_failed",
  "room_name": "room_123abc",
  "status": "failed",
  "error": "SIP_404_NOT_FOUND"
}
```

### human_transfer_initiated

```json
{
  "event": "human_transfer_initiated",
  "room_name": "room_123abc",
  "transfer_type": "warm",
  "phone_number": "+919876543210"
}
```

### human_transfer_successful

```json
{
  "event": "human_transfer_successful",
  "room_name": "room_123abc",
  "transfer_type": "warm",
  "phone_number": "+919876543210",
  "agent_identity": "human_agent_1712485300"
}
```

### human_transfer_failed

```json
{
  "event": "human_transfer_failed",
  "room_name": "room_123abc",
  "transfer_type": "warm",
  "phone_number": "+919876543210",
  "reason": "busy",
  "sip_status": "busy"
}
```

### call_ended

> **Warning:** `call_duration` in this event is in **seconds**.

```json
{
  "event": "call_ended",
  "room_name": "room_123abc",
  "call_duration": 42.5,
  "end_reason": "AGENT_REQUESTED_DISCONNECT"
}
```

### call_postprocessing

> **Warning:** `call_duration` in this event is in **milliseconds**.

```json
{
  "event": "call_postprocessing",
  "room_name": "room_123abc",
  "call_duration": 42500,
  "transcript": "User: Hello. Agent: Hi, how can I help you? ...",
  "summary": "Customer called to inquire about service availability in Mumbai.",
  "entities": {
    "location": "Mumbai",
    "intent": "service_inquiry"
  },
  "recording_url": "https://storage.vaani.ai/recordings/call_123.mp3"
}
```
