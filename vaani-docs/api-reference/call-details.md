# Get Call Details

> Get detailed call information including transcript, entities, and evaluation

## Parameters

- `call_id` (string, required): The unique call ID (e.g., `outbound-1776774443-863aa698`)

## Request Example

```bash
curl -H "X-API-Key:$API_KEY" "https://api.vaanivoice.ai/api/call_details/$CALL_ID"
```

```python
import requests

CALL_ID = "outbound-1776774443-863aa698"
API_KEY = "your_api_key"

response = requests.get(
    f"https://api.vaanivoice.ai/api/call_details/{CALL_ID}",
    headers={"X-API-Key": API_KEY}
)

print(response.json())
```

## Response (200)

```json
{
  "transcription": "AGENT: Hi! You've reached our customer service...\n\n USER: Hello. What are you offering?\n\n AGENT: Namaste! We provide a platform...",
  "entity": {
    "Call_back": "No",
    "Callback_time": null,
    "issue_raised_unresolved_bool": "NO",
    "issue_type_extraction": "N/A"
  },
  "conversation_eval": {},
  "summary": "The agent opened the call with a friendly greeting...",
  "call_eval_tag": "not enough data"
}
```

### Response Fields

- `transcription` (string): Full conversation transcript with speaker labels (`AGENT:` / `USER:`)
- `entity` (object): Extracted entities from the call (varies by agent config)
- `conversation_eval` (object): Conversation evaluation metrics
- `summary` (string): AI-generated summary of the call
- `call_eval_tag` (string | null): Evaluation tag assigned to the call

### Not Yet Processed

```json
{
  "transcription": "Transcript is not available for further evaluations.",
  "entity": "Transcript is not available for further evaluations.",
  "conversation_eval": "Transcript is not available for further evaluations.",
  "summary": "Transcript is not available for further evaluations.",
  "call_eval_tag": null
}
```
