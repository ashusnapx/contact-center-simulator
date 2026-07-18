# Create Campaign

> Create a new outbound calling campaign with CSV contacts

## Request Parameters (multipart/form-data)

- `csv_file` (file, required): CSV file with contact data. Required columns: `name`, `phone_number`
- `campaign_name` (string, required): Human-readable name (max 255 chars)
- `agent_id` (string, required): UUID of agent that will handle calls
- `concurrency` (integer, required): Simultaneous calls (>= 1, <= org max)
- `from_date` (string, required): Start date `YYYY-MM-DD`
- `to_date` (string, required): End date `YYYY-MM-DD` (>= from_date)
- `start_time` (string, required): Daily call window open, UTC `HH:MM` 24h format
- `end_time` (string, required): Daily call window close, UTC `HH:MM` 24h format
- `days_of_week` (string, required): Comma-separated weekdays (e.g. `monday,tuesday,friday`)
- `perform_dnd_check` (boolean, default: false): Run DND check before dialing
- `max_retries` (integer, default: 3): Max dial attempts per contact (1-10)
- `retry_delay_mins` (integer, default: 30): Minutes between retries (0-1440)
- `notification_emails` (string): Comma-separated emails for completion notifications (max 5)
- `campaign_webhook_url` (string): URL for campaign status-change events
- `per_call_webhook_url` (string): URL for per-call post-processing events

## Time Window Reference

All times must be in **24-hour HH:MM format in UTC only**.

| Allowed UTC range | Equivalent IST range |
| ----------------- | -------------------- |
| `02:30` - `14:29` | `08:00` - `19:59`    |

TRAI compliance window is 08:00-19:59 IST. Submit the UTC equivalent. To convert: IST - 5:30 = UTC (e.g. 13:00 IST = 07:30 UTC)

## Example Request

```bash
curl -X POST https://api.vaani.ai/api/campaigns/create \
  -H "X-API-Key: vaani_abc123..." \
  -F "csv_file=@contacts.csv" \
  -F "campaign_name=Summer Promo 2024" \
  -F "agent_id=5e737076-fea2-4157-8343-a8e49e5f0990" \
  -F "concurrency=3" \
  -F "from_date=2026-07-10" \
  -F "to_date=2026-07-31" \
  -F "start_time=07:30" \
  -F "end_time=13:30" \
  -F "days_of_week=monday,tuesday,wednesday,thursday,friday" \
  -F "notification_emails=ops@company.com"
```

## Response (201)

```json
{
  "id": "57fbcf93-a809-4038-8ea9-d676cf7d7fd4",
  "client_id": "1b9e0250-d265-4a67-bb03-c40c98978c76",
  "agent_id": "5e737076-fea2-4157-8343-a8e49e5f0990",
  "campaign_name": "Summer Promo 2024",
  "excel_blob_url": "https://vaani-dev-storage.s3.ap-south-1.amazonaws.com/campaigns/...",
  "campaign_status": "active",
  "contact_source_type": "csv",
  "days_of_week": "monday,tuesday,wednesday,thursday,friday",
  "time_range_from": "07:30:00Z",
  "time_range_to": "13:30:00Z",
  "max_retries": 3,
  "retry_after_mins": 30,
  "call_concurrency": 3,
  "start_date": "2026-07-10T02:00:00",
  "end_date": "2026-07-31T04:00:00",
  "notification_emails": ["ops@company.com"],
  "webhook_url": null,
  "perform_dnd_check": false,
  "created_at": "2026-07-01T08:59:33.063483",
  "updated_at": "2026-07-01T08:59:33.063487"
}
```

## CSV File Requirements

### Required Columns

| Column         | Aliases accepted                                                |
| -------------- | --------------------------------------------------------------- |
| `name`         | `contact_name`, `customer_name`, `full_name`                    |
| `phone_number` | `phone`, `mobile`, `contact`, `contact_number`, `mobile_number` |

### Optional Columns

Any extra columns are treated as **dynamic variables** passed to the agent. Column names must exactly match (case-sensitive) the variable names configured on the agent.

### File Limits

| Property | Limit                   |
| -------- | ----------------------- |
| Formats  | `.csv`, `.xlsx`, `.xls` |
| Encoding | UTF-8                   |
| Max rows | 10,000 contacts         |
| Min rows | 1 contact               |

### Phone Number Formats Accepted

- `+91XXXXXXXXXX` (E.164 with country code)
- `91XXXXXXXXXX` (country code without `+`)
- `0XXXXXXXXXX` (leading zero, Indian trunk prefix)
- `XXXXXXXXXX` (bare 10-digit number)

## Error Codes

| Code                   | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `INVALID_TIME_WINDOW`  | Time outside 02:30-14:29 UTC (TRAI compliance)  |
| `CONCURRENCY_EXCEEDED` | Concurrency exceeds organization maximum        |
| `INVALID_DATE_RANGE`   | from_date > to_date                             |
| `NO_DAYS_SELECTED`     | days_of_week is empty                           |
| `INVALID_RETRY_CONFIG` | max_retries or retry_delay_mins out of range    |
| `TOO_MANY_EMAILS`      | More than 5 notification_emails                 |
