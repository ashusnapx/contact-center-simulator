# Get Transcript

> Retrieve the transcript for a call

## Parameters

- `call_id` (string, required): The unique call ID (e.g., `outbound-1776774443-863aa698`)

## Request Example

```bash
curl -H "X-API-Key:$API_KEY" "https://api.vaanivoice.ai/api/transcript/$CALL_ID"
```

```python
import requests

response = requests.get(
    f"https://api.vaanivoice.ai/api/transcript/{CALL_ID}",
    headers={"X-API-Key": API_KEY},
)

print(response.json())
```

## Response (200)

```json
{
  "transcript": "AGENT: Hi! You've reached our customer service...\n\n USER: Hello. What are you offering?\n\n AGENT: Namaste! We provide a platform...",
  "status_code": 200,
  "function": "get_transcript"
}
```

### Response Fields

- `transcript` (string): Full conversation transcript with speaker labels (`AGENT:` / `USER:`) and line breaks separating turns
- `status_code` (integer): HTTP status code
- `function` (string): Internal function name — always `"get_transcript"`

### Not Found (404)

```json
{
  "transcript": "Transcript not found in Azure Blob Storage",
  "status_code": 404,
  "function": "get_transcript"
}
```
