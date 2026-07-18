# Get Campaign Status

> Get current status and progress for a campaign

## Path Parameters

- `campaign_id` (string, required): UUID of the campaign

## Example Request

```bash
curl "https://api.vaani.ai/api/campaigns/abc-123-xyz/status" \
  -H "X-API-Key: vaani_abc123..."
```

## Response (200)

```json
{
  "id": "abc-123-xyz",
  "campaign_name": "Summer Promo 2024",
  "campaign_status": "active",
  "call_concurrency": 3,
  "days_of_week": "monday,tuesday,wednesday,thursday,friday",
  "time_range_from": "07:30:00Z",
  "time_range_to": "13:30:00Z",
  "max_retries": 3,
  "retry_after_mins": 30,
  "agent": {
    "id": "agent-456",
    "name": "Sales Agent"
  },
  "total_leads": 1000,
  "completed_calls": 523,
  "pending_calls": 477,
  "failed_calls": 12,
  "created_at": "2026-07-01T10:30:00Z",
  "updated_at": "2026-07-01T14:22:15Z",
  "stats": {
    "total_calls": 523,
    "completed": 498,
    "pending": 477,
    "in_progress": 3,
    "failed": 12
  }
}
```

### Response Fields

- `campaign_status` (string): `scheduled`, `active`, `paused`, `paused_out_of_range`, `completed`, `cancelled`
- `time_range_from` (string): Daily calling window start (UTC with Z suffix)
- `time_range_to` (string): Daily calling window end (UTC with Z suffix)
- `stats` (object): Real-time call statistics
