# Create Agent

> Create a new agent and associate it with your account

## Parameters

- `agent_display_name` (string, required): Human-readable name for the agent (e.g. `"support-bot"`)
- `config` (object, optional): Initial configuration for the agent. Can pass any subset of: `persona`, `training`, `experience`, `analysis`, `deployment_config`

## Request Example

```bash
curl -X POST https://api.vaanivoice.ai/api/create-agent \
  -H "X-API-Key: vaani_<your_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_display_name": "support-bot",
    "config": {
      "persona": {
        "identity": {
          "system_prompt": "You are a helpful customer support agent."
        }
      }
    }
  }'
```

```python
import requests

response = requests.post(
    "https://api.vaanivoice.ai/api/create-agent",
    headers={
        "X-API-Key": "vaani_<your_key>",
        "Content-Type": "application/json",
    },
    json={
        "agent_display_name": "support-bot",
        "config": {
            "persona": {
                "identity": {
                    "system_prompt": "You are a helpful customer support agent."
                }
            }
        },
    },
)
print(response.json())
```

## Response (200)

```json
{
  "success": true,
  "agent_id": "7ec4155e-0e62-440a-b983-5974f7697854",
  "agent_name": "support-bot",
  "client_id": "9abf5eff-e978-4e87-954d-7ff6ba570796"
}
```

- `success` (boolean): `true` when agent was created successfully
- `agent_id` (string): UUID of the newly created agent
- `agent_name` (string): Display name of the new agent
- `client_id` (string): Client UUID the agent was associated with (resolved from API key)
