# Create an Agent

> Configure a voice agent with a prompt, voice, and metadata variables, then copy your agent_id

An agent is your configured voice AI — it has a personality (defined by its prompt), a voice, and optional dynamic variables that get filled in at call time.

## What is an Agent?

Think of an agent as a recipe for how your AI handles phone calls:

* **Prompt** — the instructions that define what the agent says and how it behaves
* **Language & Voice** — which language it speaks and what it sounds like
* **Metadata Variables** — dynamic placeholders in the prompt (like `{customer_name}`) that get filled in with real data at call time

You can create multiple agents for different use cases. Each agent can handle many calls simultaneously.

## Create Your Agent

1. Navigate to Agent Config → Create Agent
2. Set a Name — internal name for your reference only
3. Write Your Prompt — the most important part; defines personality, goals, and behavior
4. Choose Language and Voice
5. Define Metadata Variables (Optional) — dynamic placeholders like `{customer_name}`
6. Save and Copy the Agent ID — the UUID you'll use in every API call

> **Warning:** The `agent_id` is a UUID (e.g. `8cf3373e-eb6f-4b4c-9f3c-324a56a91147`). Do not confuse it with the agent's display name.

## Writing a Good Prompt

* **Start with the role and personality.** ("You are a friendly sales representative for {company_name}.")
* **Give clear instructions.** Describe what the agent should do on the call.
* **Use `{variable_name}` for anything that changes per call.**
* **Keep it focused.** Start simple, test with real calls, and iterate.

Example prompt:

```text
You are a friendly sales representative for {company_name}.
You are calling {customer_name} to follow up on their interest in {property_name}.
Be polite, answer questions about the property, and try to schedule a site visit.
If they're not interested, thank them and end the call gracefully.
```

## Understanding Metadata Variables

1. Define placeholders in your prompt using curly braces: `Hello {customer_name}...`
2. Pass the values via the API when you trigger a call
3. Vaani replaces the placeholders before the call starts

> **Warning:** Variable names in your `metadata` must **exactly match** the `{placeholders}` in your prompt — including capitalization.
