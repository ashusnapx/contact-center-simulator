# Update Campaign

> Update campaign configuration (auto-pauses campaign)

## Path Parameters

- `campaign_id` (string, required): UUID of the campaign to update

## Request Parameters

All fields are optional. Only provided fields are updated.

- `campaign_name` (string): Updated campaign name
- `concurrency` (integer): Updated concurrency (<= org max)
- `max_retries` (integer): Updated max retries (1-10)
- `retry_delay_mins` (integer): Updated retry delay (0-1440 minutes)
- `start_time` (string): Updated start time, UTC HH:MM
- `end_time` (string): Updated end time, UTC HH:MM
- `days_of_week` (string): Comma-separated weekdays
- `from_date` (string): Updated from_date YYYY-MM-DD
- `to_date` (string): Updated to_date YYYY-MM-DD
- `notification_emails` (string): Comma-separated emails (max 5)
- `campaign_webhook_url` (string): Updated campaign webhook URL
- `per_call_webhook_url` (string): Updated per-call webhook URL

## Example Request

```bash
curl -X PUT "https://api.vaani.ai/api/campaigns/abc-123-xyz" \
  -H "X-API-Key: vaani_abc123..." \
  -F "campaign_name=Updated Campaign" \
  -F "concurrency=10" \
  -F "start_time=05:00" \
  -F "end_time=12:00" \
  -F "days_of_week=monday,wednesday,friday"
```

## Response (200)

```json
{
  "id": "abc-123-xyz",
  "campaign_name": "Updated Campaign",
  "campaign_status": "paused",
  "call_concurrency": 10,
  "days_of_week": "monday,wednesday,friday",
  "time_range_from": "05:00:00Z",
  "time_range_to": "12:00:00Z",
  "updated_at": "2026-07-01T14:22:15Z"
}
```

> **Warning:** Campaign is automatically paused when edited. You must call `POST /campaigns/{id}/resume` to restart.
