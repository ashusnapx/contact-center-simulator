# Pause Campaign

> Temporarily pause an active campaign

## Path Parameters

- `campaign_id` (string, required): UUID of the campaign to pause

## Example Request

```bash
curl -X POST "https://api.vaani.ai/api/campaigns/abc-123-xyz/pause" \
  -H "X-API-Key: vaani_abc123..."
```

## Response (200)

```json
{
  "id": "abc-123-xyz",
  "campaign_name": "Summer Promo 2024",
  "campaign_status": "paused",
  "updated_at": "2026-07-01T14:35:00Z"
}
```

## Behavior

- Ongoing calls complete normally
- No new calls are initiated
- Campaign can be resumed with `/resume`
- All progress is preserved
