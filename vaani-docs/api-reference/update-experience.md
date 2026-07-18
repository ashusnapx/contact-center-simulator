# Update Experience

> Partially update the experience section of an agent

## Path Parameters

- `agent_id` (string, required): UUID of the agent to update

## Body Parameters

### conversational_experience

- `bg_noise` (object):
  - `enabled` (boolean): Turn background noise on/off
  - `volume` (number): Volume level (0-1)
  - `sound` (string): Sound preset (e.g. `"office"`, `"cafe"`)
- `filler_words` (object):
  - `filler_words_frequency` (number): How often to insert filler words (0-1)
  - `filler_words_list` (array): Custom list of filler words
- `eagerness_to_speak` (string): `"slow"` | `"balanced"` | `"fast"`
- `breathing_sound` (object): Breathing sound config
- `patience_with_user_entries` (object): Config for waiting on incomplete user input
- `mood_mapping` (object): Map of detected moods to behavioral adjustments

### settings

- `idle_conversation_settings` (object):
  - `pulse_check` (boolean): Send a prompt to check if user is still there
  - `end_conversation_on_idle` (boolean): Hang up after idle timeout
  - `idle_call_hangup_timeout` (integer): Seconds before hanging up (5-60)
  - `idle_call_warning_timeout` (integer): Seconds before warning user (5-60)
  - `idle_call_hangup_message` (string): Message played before hanging up
  - `idle_call_warning_message` (string): Message played as idle warning
- `end_call` (object):
  - `enabled` (boolean): Enable phrase-based call ending
  - `end_call_phrase` (string): Phrase that triggers hang-up (e.g. `"goodbye"`)
  - `hangup_timeout` (integer): Seconds to wait after phrase before hanging up
- `call_settings` (object):
  - `max_call_duration` (integer): Maximum call duration in minutes (1-60)
  - `max_duration_enabled` (boolean): Enforce the max duration limit
  - `enable_voicemail_detection` (boolean): Enable voicemail detection
  - `action` (string): `"hang_up"` | `"leave_message"`
  - `end_call_message` (string): Message to leave if action is `"leave_message"`

## Request Example

```bash
curl -X PATCH https://api.vaanivoice.ai/api/agent/7ec4155e-0e62-440a-b983-5974f7697854/experience \
  -H "X-API-Key: vaani_<your_key>" \
  -H "Content-Type: application/json" \
  -d '{
    "conversational_experience": {
      "eagerness_to_speak": "fast",
      "bg_noise": { "enabled": true, "volume": 0.2, "sound": "office" }
    },
    "settings": {
      "call_settings": {
        "max_call_duration": 30,
        "max_duration_enabled": true,
        "enable_voicemail_detection": true,
        "action": "leave_message",
        "end_call_message": "Sorry we missed you, please call back during business hours."
      }
    }
  }'
```

## Response (200)

```json
{
  "success": true,
  "message": "Experience section updated successfully"
}
```
