# Update Training

> Partially update the training section of an agent

## Path Parameters

- `agent_id` (string, required): UUID of the agent to update

## Body Parameters

### knowledge

- `use_rag` (boolean): Enable RAG for this agent
- `rag_knowledge_base_dict` (object): Knowledge base config passed to RAG provider

### know_how

- `faq` (object): Map of question to answer pairs (e.g. `{"What are your hours?": "9 AM - 5 PM"}`)
- `pain_points` (object): Map of pain-point labels to resolution guidance
- `guardrails` (object):
  - `level` (string): `"basic"` | `"medium"` | `"strict"`
  - `sexual` (boolean): Block sexual content
  - `violence` (boolean): Block violent content
  - `threatning` (boolean): Block threatening content
  - `custom_rules` (array): Array of custom guardrail rule objects

## Request Example

```bash
curl -X PATCH https://api.vaanivoice.ai/api/agent/7ec4155e-0e62-440a-b983-5974f7697854/training \
  -H "X-API-Key: vaani_<your_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "knowledge": {
      "use_rag": true
    },
    "know_how": {
      "faq": {
        "What are your hours?": "We are open 9 AM to 5 PM, Monday to Friday.",
        "How do I reset my password?": "Visit the login page and click Forgot Password."
      },
      "guardrails": {
        "level": "medium",
        "violence": true
      }
    }
  }'
```

## Response (200)

```json
{
  "success": true,
  "message": "Training section updated successfully"
}
```
