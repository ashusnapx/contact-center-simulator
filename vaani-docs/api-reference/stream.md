# Stream Audio

> Stream the audio recording of a call

## Parameters

- `call_id` (string, required): The unique call ID (e.g., `outbound-1776774443-863aa698`)

## Request Example

```bash
# Download the audio file
curl -H "X-API-Key:$API_KEY" "https://api.vaanivoice.ai/api/stream/$CALL_ID" -o recording.ogg

# Check headers only (no download)
curl -sI -H "X-API-Key:$API_KEY" "https://api.vaanivoice.ai/api/stream/$CALL_ID"
```

```python
import requests

response = requests.get(
    f"https://api.vaanivoice.ai/api/stream/{CALL_ID}",
    headers={"X-API-Key": API_KEY},
    stream=True
)

with open("recording.ogg", "wb") as f:
    for chunk in response.iter_content(chunk_size=8192):
        f.write(chunk)
```

## Response

Returns a binary audio stream (not JSON).

```
HTTP/1.1 200 OK
content-type: audio/ogg
content-length: 1083518
```

- `Content-Type`: Audio format — typically `audio/ogg` or `audio/mpeg`
- `Content-Length`: Size of the audio file in bytes

### Not Found (404)

```json
{
  "status_code": 404,
  "error": "Not Found",
  "message": "Audio file not found",
  "code": "NOT_FOUND"
}
```
