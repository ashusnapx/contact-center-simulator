# Cancel Campaign

> Immediately cancel a campaign (hard stop)

## Path Parameters

- `campaign_id` (string, required): UUID of the campaign to cancel

## Example Request

```bash
curl -X POST "https://api.vaani.ai/api/campaigns/abc-123-xyz/cancel" \
  -H "X-API-Key: vaani_abc123..."
```

## Response (200)

```json
{
  "id": "abc-123-xyz",
  "campaign_name": "Summer Promo 2024",
  "campaign_status": "cancelled",
  "updated_at": "2026-07-01T14:50:00Z"
}
```

## Behavior

- Immediately stops initiating new calls
- Ongoing calls complete normally
- Status transitions to `cancelled`
- **Cannot be resumed after cancellation**

## Comparison: Stop vs Cancel

| Action     | Timing     | Can Resume? | Use Case              |
| ---------- | ---------- | ----------- | --------------------- |
| **Stop**   | End of day | No          | Graceful completion   |
| **Cancel** | Immediate  | No          | Emergency termination |
| **Pause**  | Immediate  | Yes         | Temporary suspension  |

> Cancellation is permanent. Use `/pause` if you need to temporarily suspend the campaign.
