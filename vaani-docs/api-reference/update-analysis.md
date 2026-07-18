# Update Analysis

> Partially update the analysis section of an agent

## Path Parameters

- `agent_id` (string, required): UUID of the agent to update

## Body Parameters

### evaluations

- `dispositions` (object):
  - `enabled` (boolean): Enable disposition tagging
  - `prompt_based` (array): List of prompt-driven disposition items, each with:
    - `name` (string, required): Disposition name (max 30 chars)
    - `type` (string, required): `"bool"` | `"string"` | `"number"`
    - `prompt` (string, required): Prompt instruction for LLM evaluation
    - `list_of_tags` (object): Optional tag-to-description map
  - `system_based` (array): System-defined dispositions
- `conversation_evaluation` (object):
  - `enabled` (boolean): Enable conversation evaluation
  - `prompt` (string): Custom evaluation prompt for the LLM

### extraction

- `data_collection` (object):
  - `enabled` (boolean): Enable data extraction
  - `data_points` (array): List of data-point definitions, each with:
    - `name` (string, required): Data point name (max 30 chars)
    - `prompt` (string, required): Instruction for extraction
    - `values` (array): Optional allowed values (enum-style)
    - `nullable` (boolean): Whether field may be null
- `collect_concerns` (object):
  - `enabled` (boolean): Enable concern collection
  - `prompt` (string): Custom prompt for concern detection

## Request Example

```bash
curl -X PATCH https://api.vaanivoice.ai/api/agent/7ec4155e-0e62-440a-b983-5974f7697854/analysis \
  -H "X-API-Key: vaani_<your_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "evaluations": {
      "dispositions": {
        "enabled": true,
        "prompt_based": [
          {
            "name": "purchase_intent",
            "type": "bool",
            "prompt": "Did the user express interest in purchasing?",
            "list_of_tags": {"Yes": "user showed clear buying intent", "No": "no purchase intent detected"}
          }
        ]
      },
      "conversation_evaluation": {
        "enabled": true,
        "prompt": "Rate the quality of this customer service call on a scale of 1-10 and explain why."
      }
    },
    "extraction": {
      "data_collection": {
        "enabled": true,
        "data_points": [
          {
            "name": "customer_name",
            "prompt": "Extract the customer name from the transcript.",
            "nullable": true
          }
        ]
      }
    }
  }'
```

## Response (200)

```json
{
  "success": true,
  "message": "Analysis section updated successfully"
}
```
