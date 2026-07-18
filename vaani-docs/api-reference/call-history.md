# Get Call History

> Get call history for a client

## Parameters

- `page` (integer, optional, default: `1`): Page number (1-indexed)
- `page_size` (integer, optional, default: `50`, max: `200`): Number of records per page

## Request Example

```bash
curl -H "X-API-Key:$API_KEY" "https://api.vaanivoice.ai/api/call-history?page=1&page_size=50"
```

```python
import requests

response = requests.get(
    "https://api.vaanivoice.ai/api/call-history",
    headers={"X-API-Key": API_KEY},
    params={"page": 1, "page_size": 50},
)

print(response.json())
```

## Response (200)

```json
{
  "data": [
    {
      "call_id": "outbound-1776774443-863aa698",
      "call_type": "Outbound",
      "call_status": "User disconnected",
      "direction": "Outbound",
      "agent_name": "vaani321talha",
      "agent_id": "7ec4155e-0e62-440a-b983-5974f7697854",
      "client_name": "vaani321",
      "client_id": "9abf5eff-e978-4e87-954d-7ff6ba570796",
      "from_number": "+918037565218",
      "to_number": "+917893209830",
      "Start_time": "2026-04-21T12:27:23.335803",
      "End_time": "2026-04-21T12:27:57.453173",
      "duration_ms": 742.269,
      "call_cost": 2.3,
      "call_summary": "The agent opened the call with a friendly greeting...",
      "call_entity": {},
      "call_eval_tag": "not enough data",
      "call_conversation_quality": {},
      "post_processing_status": "completed",
      "call_dialing_at": "2026-04-21T12:27:41.474651",
      "call_ringing_at": "2026-04-21T12:27:43.395994",
      "user_picked_up_at": "2026-04-21T12:27:53.431057",
      "recording_api": "https://api.vaanivoice.ai/api/stream/outbound-1776774443-863aa698",
      "call_transcription": "https://api.vaanivoice.ai/api/transcript/outbound-1776774443-863aa698",
      "call_metadata": {
        "name": "John",
        "phone": "+917893209830",
        "agent_name": "vaani321talha",
        "agent_id": "7ec4155e-0e62-440a-b983-5974f7697854",
        "client_id": "9abf5eff-e978-4e87-954d-7ff6ba570796"
      },
      "chat_history": [],
      "callback_requested": false,
      "callback_id": null,
      "callback_status": null
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 50,
    "total_count": 1028,
    "total_pages": 21,
    "has_next": true,
    "has_previous": false
  }
}
```

### Response Fields

**Call Object:**
- `call_id` (string): Unique call identifier
- `call_type` (string): `Outbound` or `Inbound`
- `call_status` (string): Final call status
- `direction` (string): `Outbound` or `Incoming`
- `agent_name` (string): Name of the agent
- `agent_id` (string): UUID of the agent
- `from_number` (string): Caller number (E.164)
- `to_number` (string): Destination number (E.164)
- `Start_time` (string): Call start timestamp (ISO 8601)
- `End_time` (string): Call end timestamp (ISO 8601)
- `duration_ms` (number): Call duration in milliseconds
- `call_cost` (number): Call cost in credits
- `call_summary` (string | null): AI-generated summary
- `call_eval_tag` (string | null): Evaluation tag
- `post_processing_status` (string): `completed`, `not_processed`, or `processing`
- `recording_api` (string): URL to stream the recording
- `call_transcription` (string): URL to fetch the transcript
- `call_metadata` (object): Metadata passed when triggering the call
- `chat_history` (array): Structured chat history
- `callback_requested` (boolean): Whether a callback was requested

**Pagination:**
- `page` (integer): Current page number
- `page_size` (integer): Records per page
- `total_count` (integer): Total records
- `total_pages` (integer): Total pages
- `has_next` (boolean): Whether there is a next page
- `has_previous` (boolean): Whether there is a previous page
