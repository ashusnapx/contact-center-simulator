# Stop Campaign

> Stop campaign at end of current day (soft stop)

## Path Parameters

- `campaign_id` (string, required): UUID of the campaign to stop

## Example Request

```bash
curl -X POST "https://api.vaani.ai/api/campaigns/abc-123-xyz/stop" \
  -H "X-API-Key: vaani_abc123..."
```

## Response (200)

```json
{
  "id": "abc-123-xyz",
  "campaign_name": "Summer Promo 2024",
  "campaign_status": "completed",
  "updated_at": "2026-07-01T14:45:00Z"
}
```

## Behavior

- Campaign continues until end of current day's window
- All pending calls for today are completed
- Status transitions to `completed`
- Cannot be resumed after stopping

> Use `/pause` if you need to temporarily stop and resume later. Use `/stop` for graceful completion. Use `/cancel` for immediate termination.
