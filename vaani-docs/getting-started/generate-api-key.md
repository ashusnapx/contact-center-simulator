# Generate an API Key

> Create, use, and manage API keys to authenticate your Vaani API requests

Your API key authenticates every request you make to the Vaani API. Think of it like a password for your application.

## Create an API Key

1. Go to Settings → API Keys in the dashboard
2. Click **Generate API Key**. Give it a descriptive name (e.g. `production`, `staging`, `local-dev`).
3. Copy the key immediately and store it somewhere safe.

> **Warning:** Your API key is shown **only once** at creation time. If you lose it, you'll need to generate a new one.

## Using Your API Key

Include your API key as a header in every request:

```bash
curl -X POST 'https://api.vaanivoice.ai/api/trigger-call/' \
  -H 'X-API-Key: YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{ "agent_id": "YOUR_AGENT_ID", "contact_number": "+919876543210" }'
```

```python
import os
import requests

headers = {
    "X-API-Key": os.getenv("VAANI_API_KEY"),
    "Content-Type": "application/json"
}

response = requests.post(
    "https://api.vaanivoice.ai/api/trigger-call/",
    headers=headers,
    json={
        "agent_id": "YOUR_AGENT_ID",
        "contact_number": "+919876543210"
    }
)
```

> **Note:** Your API key is **workspace-scoped** — it grants access to all agents, call data, and settings within your workspace.

## Storing Your Key Securely

Never hardcode your API key in source code.

**Local development** — use a `.env` file:
```bash
VAANI_API_KEY=your-api-key-here
```

**Production** — use your platform's secrets manager (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault, etc.).

**CI/CD** — use your pipeline's built-in secrets or environment variables.

## Managing Multiple Keys

* Separate keys per environment — `dev`, `staging`, `production`
* Separate keys per integration
* Separate keys per team member

To **rotate a key** safely:
1. Generate a new key
2. Update your application to use the new key
3. Verify everything works
4. Delete the old key
