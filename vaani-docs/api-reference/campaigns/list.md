# List Campaigns

> Get a paginated list of campaigns for your organization

## Query Parameters

- `page` (integer, default: 1): Page number (1-indexed)
- `page_size` (integer, default: 20): Items per page (max 100)
- `status` (string): Filter by status: `active`, `paused`, `completed`, `cancelled`, `scheduled`

## Example Request

```bash
curl "https://api.vaani.ai/api/campaigns/?page=1&page_size=20&status=active" \
  -H "X-API-Key: vaani_abc123..."
```

## Response (200)

```json
{
  "campaigns": [
    {
      "id": "57fbcf93-a809-4038-8ea9-d676cf7d7fd4",
      "campaign_name": "Summer Promo 2024",
      "campaign_status": "active",
      "agent_id": "5e737076-fea2-4157-8343-a8e49e5f0990",
      "call_concurrency": 3,
      "total_leads": 1000,
      "completed_calls": 523,
      "created_at": "2026-07-01T10:30:00Z",
      "updated_at": "2026-07-01T14:22:15Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

## Campaign Status Values

| Status                | Description                              |
| --------------------- | ---------------------------------------- |
| `scheduled`           | Campaign created, not yet started        |
| `active`              | Campaign is running, dialling contacts   |
| `paused`              | Campaign temporarily paused              |
| `paused_out_of_range` | Campaign paused (outside calling window) |
| `completed`           | Campaign finished all contacts           |
| `cancelled`           | Campaign permanently cancelled           |
