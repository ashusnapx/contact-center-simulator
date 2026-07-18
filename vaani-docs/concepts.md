# Concepts

> Key terms and concepts in the Vaani platform

## Agent

A configured voice AI that handles calls. Each agent has a prompt, language, voice, and optional metadata variables. When you create an agent in the dashboard, you get an `agent_id` (UUID) which is used in every API call.

## Agent ID

A UUID that uniquely identifies an agent (e.g. `8cf3373e-eb6f-4b4c-9f3c-324a56a91147`). This is the primary reference to your agent in the API — not the agent's display name.

## Call ID

A unique identifier for a specific call instance, returned when you trigger a call (e.g. `room-f5237622`). Use it to fetch the transcript, audio, and details for that call.

## Campaign

A batch of outbound calls dispatched to a list of contacts using the same agent. Useful for high-volume dialing scenarios.

## Dispatch

A single outbound call triggered via the API. Each dispatch creates one call to one contact number using one agent.

## Metadata

A key-value object passed at call time that injects dynamic variables into the agent's prompt. The keys must match the variable names defined in the agent's prompt template.

```json
"metadata": {
  "customer_name": "Rahul Sharma",
  "property_name": "Prateek Laurel"
}
```

## Telephony

The phone network layer that allows your agent to make and receive real calls. You must configure a phone number before triggering calls.

## Transcript

A text record of the full conversation between the agent and the contact, accessible via the transcript API after a call completes.

## Webhook

An HTTP endpoint you configure to receive real-time events from Vaani — such as call started, call completed, or call failed. See the Webhook Setup guide.
