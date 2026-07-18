# Getting Started

> Set up Vaani from scratch and make your first outbound voice call in under 20 minutes

This guide walks you through setting up Vaani from scratch. By the end, you'll have a working voice agent that can make real outbound calls. The whole process takes about 15–20 minutes.

## What You'll Set Up

1. **Create Your Account (~2 min)** — Sign up at app.vaanivoice.ai and explore your dashboard.
2. **Create and Configure an Agent (~5 min)** — Set up your voice agent with a prompt, language, voice, and metadata variables. You'll get an `agent_id` (UUID).
3. **Set Up Telephony (~5 min)** — Connect a phone number so your agent can make and receive real calls.
4. **Generate an API Key (~2 min)** — Create an API key to authenticate your requests to the Vaani API.
5. **Make Your First Call (~5 min)** — Use your `agent_id` and API key to trigger an outbound call and hear your agent in action.

## Important Identifiers

| Identifier        | What It Is                                        | Where You Get It                 | Example                                |
| ----------------- | ------------------------------------------------- | -------------------------------- | -------------------------------------- |
| `agent_id`        | UUID that uniquely identifies your voice agent    | Dashboard → Agent Config         | `8cf3373e-eb6f-4b4c-9f3c-324a56a91147` |
| API Key           | Secret token that authenticates your API requests | Dashboard → Settings → API Keys  | `sk-vaani-...`                         |
| `call_id`         | Unique ID for a single call instance              | Returned by the trigger-call API | `room-f5237622`                        |
| `outbound_number` | The phone number shown as caller ID               | Dashboard → Settings → Telephony | `+14155551234`                         |

> **Note:** These identifiers serve different purposes. The most common mistake is confusing `agent_id` (which identifies *your agent*) with `call_id` (which identifies *a specific call*). When in doubt, check the Concepts page.

## What You'll Need

Before you start, make sure you have:

* A web browser — for accessing the Vaani dashboard
* A phone number to call for testing — your personal mobile works great
* A terminal or HTTP client — for making API calls (cURL, Postman, or a Python environment)
* Basic familiarity with REST APIs — helpful but not required
