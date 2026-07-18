# Update Persona

> Partially update the persona section of an agent

## Path Parameters

- `agent_id` (string, required): UUID of the agent to update

## Body Parameters

### identity

- `system_prompt` (string): The main system prompt
- `personality` (object): Key-value map of personality traits
- `greeting_message` (object):
  - `agent_message` (string): Text the agent says at the start
  - `agent_speech_delay` (integer): Delay (seconds, 0-60) before agent speaks
  - `user_speech_delay` (integer): Silence gap (seconds, 0-60) after user stops talking
  - `interruptible` (boolean): Whether greeting can be interrupted
  - `let_user_speak_first` (boolean): If true, agent waits for user to speak first

### senses_capabilities

- `language` (string): Primary language code (e.g. `"en"`, `"hi"`)
- `auto_detect` (boolean): Enable automatic language detection
- `ears` (object): STT configuration
  - `primary.provider` (string): STT provider name
  - `primary.model` (string): STT model identifier
  - `primary.language` (string): Language hint for STT
  - `primary.keywords` (array): Keywords to boost recognition
  - `fallback` (object): Fallback STT provider
- `brain` (object): LLM configuration
  - `primary.provider` (string): LLM provider name (e.g. `"openai"`)
  - `primary.model` (string): Model identifier (e.g. `"gpt-4o"`)
  - `primary.parameters.temperature` (number): Sampling temperature (0-1)
  - `primary.parameters.top_p` (number): Top-p sampling (0-1)
  - `primary.parameters.max_tokens` (integer): Max tokens (50-10000)
  - `auto_detect_llm` (boolean): Auto-select best LLM for detected language
  - `fallback` (object): Fallback LLM provider
- `mouth` (object): TTS configuration
  - `primary.provider` (string): TTS provider name (e.g. `"elevenlabs"`)
  - `primary.model` (string): TTS model identifier
  - `primary.voice_id` (string): Voice ID
  - `primary.voice_name` (string): Voice name
  - `primary.config` (object): Provider-specific config
  - `word_pronunciation_pairs` (object): Word pronunciation map
  - `fallback` (object): Fallback TTS provider

### actions

Custom actions the agent can take during a call (provider-specific shape).

### memories

Memory configuration for the agent (provider-specific shape).

### metadata

Arbitrary metadata key-value pairs attached to the persona.

## Request Example

```bash
curl -X PATCH https://api.vaanivoice.ai/api/agent/7ec4155e-0e62-440a-b983-5974f7697854/persona \
  -H "X-API-Key: vaani_<your_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "identity": {
      "system_prompt": "You are a helpful customer service agent.",
      "greeting_message": {
        "agent_message": "Hi! How can I help you today?",
        "agent_speech_delay": 1,
        "interruptible": true
      }
    },
    "senses_capabilities": {
      "language": "en",
      "brain": {
        "llm": {
          "primary": {
            "provider": "openai",
            "model": "gpt-4o",
            "parameters": { "temperature": 0.7 }
          }
        }
      }
    }
  }'
```

## Response (200)

```json
{
  "success": true,
  "message": "Persona section updated successfully"
}
```
