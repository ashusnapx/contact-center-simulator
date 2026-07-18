# Get Campaign Results

> Get pre-signed download URL for campaign results CSV

## Path Parameters

- `campaign_id` (string, required): UUID of the campaign

## Example Request

```bash
curl "https://api.vaani.ai/api/campaigns/abc-123-xyz/results" \
  -H "X-API-Key: vaani_abc123..."
```

## Response (200)

```json
{
  "campaign_id": "abc-123-xyz",
  "results_url": "https://vaani-dev-storage.s3.ap-south-1.amazonaws.com/campaigns/.../results.csv?X-Amz-Algorithm=...",
  "generated_at": "2026-07-01T15:30:00Z",
  "expires_at": "2026-07-01T16:30:00Z",
  "post_processing_status": "completed"
}
```

### Response Fields

- `results_url` (string): Pre-signed S3 URL for downloading results CSV (valid for 1 hour)
- `post_processing_status` (string): `not_processed`, `processing`, `completed`, `failed`

## Results CSV Format

| Column            | Description                                             |
| ----------------- | ------------------------------------------------------- |
| `name`            | Contact name                                            |
| `phone_number`    | Contact phone number                                    |
| `call_status`     | `completed`, `failed`, `no_answer`, `busy`, `cancelled` |
| `call_duration`   | Call duration in seconds                                |
| `call_transcript` | Full conversation transcript                            |
| `call_summary`    | AI-generated call summary                               |
| `call_tags`       | Comma-separated outcome tags                            |
| `attempts`        | Number of dial attempts                                 |
| `last_attempt_at` | Timestamp of last attempt                               |

## Error (404)

```json
{
  "status_code": 404,
  "error": "Not Found",
  "message": "Campaign results not yet available. Post-processing status: processing",
  "code": "RESULTS_NOT_READY"
}
```
