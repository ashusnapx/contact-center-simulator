# Resume Campaign

> Resume a paused campaign

## Path Parameters

- `campaign_id` (string, required): UUID of the campaign to resume

## Example Request

```bash
curl -X POST "https://api.vaani.ai/api/campaigns/abc-123-xyz/resume" \
  -H "X-API-Key: vaani_abc123..."
```

## Response (200)

```json
{
  "id": "abc-123-xyz",
  "campaign_name": "Summer Promo 2024",
  "campaign_status": "active",
  "updated_at": "2026-07-01T14:40:00Z"
}
```

## Use Cases

- Resume after manual pause
- Resume after editing campaign configuration
- Resume after temporary business hours closure
- Resume after resolving an issue

> After updating a campaign via PUT, you must call `/resume` to restart it.
