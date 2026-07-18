# Quickstart

> Trigger your first outbound call and verify it works end-to-end

## Prerequisites

* A Vaani account
* Your `agent_id` (UUID)
* A connected phone number
* Your API key

## Trigger a Call

```bash
curl -X POST 'https://api.vaanivoice.ai/api/trigger-call/' \
  -H 'X-API-Key: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "agent_id": "YOUR_AGENT_ID",
    "contact_number": "+919876543210",
    "name": "Test Call",
    "metadata": {}
  }'
```

```python
import os
import requests

response = requests.post(
    "https://api.vaanivoice.ai/api/trigger-call/",
    headers={
        "X-API-Key": os.getenv("VAANI_API_KEY"),
        "Content-Type": "application/json"
    },
    json={
        "agent_id": "YOUR_AGENT_ID",
        "contact_number": "+919876543210",
        "name": "Test Call",
        "metadata": {}
    }
)

print(response.json())
```

## Request Fields

| Field             | Type          | Required | Description                                                                                         |
| ----------------- | ------------- | -------- | --------------------------------------------------------------------------------------------------- |
| `agent_id`        | string (UUID) | Yes      | The agent to handle this call                                                                       |
| `contact_number`  | string        | Yes      | The phone number to call, in E.164 format (e.g. `+919876543210`)                                    |
| `name`            | string        | No       | A display name for the contact                                                                      |
| `metadata`        | object        | No       | Key-value pairs that get injected into your agent's prompt                                          |
| `voice`           | string        | No       | Override the agent's default voice for this specific call                                           |
| `outbound_number` | string        | No       | Override the caller ID for this specific call                                                       |

## Success Response

```json
{
  "success": true,
  "message": "Call initiated successfully",
  "output": {
    "agent_name": "my-sales-agent",
    "call_id": "room-f5237622"
  },
  "error": null
}
```

## Common Error Responses

| Status Code                | Meaning                                                | How to Fix                                                                                     |
| -------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `401 Unauthorized`         | Your API key is missing or invalid                     | Check the `X-API-Key` header                                                                  |
| `400 Bad Request`          | A required field is missing or malformed               | Verify `agent_id` and `contact_number` are present and correctly formatted                     |
| `404 Not Found`            | The `agent_id` doesn't exist in your workspace         | Double-check the UUID from Agent Config                                                        |
| `422 Unprocessable Entity` | A field value is invalid (e.g. phone number not E.164) | Check `contact_number` uses E.164 format: `+[country code][number]`                            |
