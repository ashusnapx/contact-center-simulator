# Campaign Webhooks

> Real-time notifications for campaign events and call completions

## Overview

Vaani provides two types of webhooks for campaign monitoring:

1. **Campaign-Level Webhooks** — Triggered on campaign status changes
2. **Per-Call Webhooks** — Triggered after each call completes post-processing

## Campaign-Level Webhooks

Notifies you when campaign status changes (`active`, `paused`, `completed`, `cancelled`).

### Configuration

Provide `campaign_webhook_url` when creating or updating a campaign:

```bash
curl -X POST "https://api.vaani.ai/api/campaigns/create" \
  -H "X-API-Key: vaani_abc123..." \
  -F "campaign_webhook_url=https://your-domain.com/webhooks/campaign"
```

### Payload

```json
{
  "event": "campaign.status_changed",
  "campaign_id": "abc-123-xyz",
  "campaign_name": "Summer Promo 2024",
  "old_status": "active",
  "new_status": "paused",
  "timestamp": "2026-07-01T14:30:00Z",
  "stats": {
    "total_calls": 523,
    "completed": 498,
    "pending": 477,
    "in_progress": 3,
    "failed": 12
  }
}
```

## Per-Call Webhooks

Notifies you after each call completes and transcript/summary are generated.

### Configuration

Provide `per_call_webhook_url` when creating or updating a campaign:

```bash
curl -X POST "https://api.vaani.ai/api/campaigns/create" \
  -H "X-API-Key: vaani_abc123..." \
  -F "per_call_webhook_url=https://your-domain.com/webhooks/call"
```

### Payload

```json
{
  "event": "call.completed",
  "call_id": "call-789-xyz",
  "campaign_id": "abc-123-xyz",
  "campaign_name": "Summer Promo 2024",
  "contact": {
    "name": "John Doe",
    "phone": "+919876543210"
  },
  "call_status": "completed",
  "call_duration_seconds": 87,
  "call_outcome": "interested",
  "call_tags": ["qualified", "follow_up_needed"],
  "transcript": "Agent: Hello, this is...\nCustomer: Hi...",
  "summary": "Customer expressed interest in the product...",
  "timestamp": "2026-07-01T14:35:22Z"
}
```

## Webhook Retry Logic

| Attempt | Delay                  |
| ------- | ---------------------- |
| 1       | Immediate              |
| 2       | 5 seconds              |
| 3       | 25 seconds             |
| 4       | 125 seconds (~2 min)   |
| 5       | 625 seconds (~10 min)  |

After 5 failed attempts, the webhook is marked as failed and no further retries occur.

## Webhook Security

Vaani signs all webhook payloads with HMAC-SHA256. Verify the signature before processing:

**Request Headers:**
```
X-Vaani-Signature: sha256=abc123...
X-Vaani-Timestamp: 1719842400
```

**Python Verification:**

```python
import hmac
import hashlib
import time

def verify_webhook(payload: bytes, signature: str, secret: str, timestamp: str):
    if abs(int(time.time()) - int(timestamp)) > 300:
        return False
    expected = hmac.new(
        secret.encode(),
        f"{timestamp}.{payload.decode()}".encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

## Webhook Endpoint Requirements

1. Respond quickly (< 5 seconds)
2. Return 2xx status
3. Be publicly accessible over HTTPS
4. Handle duplicate events (use event IDs for idempotency)

## Event Types Reference

### Campaign Events

| Event                     | Description             |
| ------------------------- | ----------------------- |
| `campaign.status_changed` | Campaign status changed |
| `campaign.completed`      | All calls finished      |
| `campaign.cancelled`      | Campaign was cancelled  |

### Call Events

| Event            | Description                 |
| ---------------- | --------------------------- |
| `call.completed` | Call finished and processed |
| `call.failed`    | Call attempt failed         |
| `call.no_answer` | Recipient didn't answer     |
