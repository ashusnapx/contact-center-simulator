# Update Deployment

> Partially update the deployment section of an agent

## Path Parameters

- `agent_id` (string, required): UUID of the agent to update

## Body Parameters

### deployment.phone.call_type

- `Inbound` (string): Phone number (E.164) to receive inbound calls. Pass `""` to clear.
- `Outbound` (array): List of phone numbers (E.164) the agent may dial from.

## Request Example

```bash
curl -X PATCH https://api.vaanivoice.ai/api/agent/7ec4155e-0e62-440a-b983-5974f7697854/deployment \
  -H "X-API-Key: vaani_<your_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "deployment": {
      "phone": {
        "call_type": {
          "Inbound": "+911234567890",
          "Outbound": ["+911234567890", "+919876543210"]
        }
      }
    }
  }'
```

## Response (200)

```json
{
  "success": true,
  "message": "Deployment section updated successfully"
}
```

> Phone numbers must be in E.164 format (e.g. `+911234567890`). Pass an empty string `""` for `Inbound` to remove inbound routing.
