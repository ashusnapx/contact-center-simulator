# Set Up Telephony

> Connect a phone number to your Vaani agent so it can make and receive real calls

## How Telephony Works in Vaani

When your agent makes a call, the recipient sees a phone number on their caller ID. Vaani handles all the voice infrastructure behind the scenes (WebRTC, media servers, call routing).

* Each agent needs at least one phone number assigned to it
* You can assign different numbers to different agents, or share one number across multiple agents
* You can override the caller ID on a per-call basis through the API

## Setup Methods

### Direct Provisioning (Recommended)

Vaani provisions a phone number for you directly. No external telephony provider needed.

1. Go to Settings → Telephony
2. Click **Provision a Number**. Select your country and preferred area code.
3. Link the provisioned number to your agent.

### Bring Your Own SIP Trunk

Connect your existing telephony provider (Twilio, Telnyx, Vonage) via a SIP trunk.

1. Go to Settings → Telephony
2. Click **Connect SIP Trunk** and enter your provider's SIP credentials:
   - **SIP Host** — your provider's SIP server address
   - **Username** — your SIP authentication username
   - **Password** — your SIP authentication password
   - **Port** — the SIP port (usually `5060` for UDP or `5061` for TLS)
3. Enter the phone number you want to use as the caller ID (E.164 format)
4. Link the SIP trunk number to your agent.

## Phone Number Formats

All phone numbers must use **E.164 format**:

```
+[country code][number]
```

| Country        | Format          | Example         |
| -------------- | --------------- | --------------- |
| United States  | `+1XXXXXXXXXX`  | `+14155551234`  |
| India          | `+91XXXXXXXXXX` | `+919876543210` |
| United Kingdom | `+44XXXXXXXXXX` | `+442071234567` |

> **Warning:** Don't include spaces, dashes, or parentheses. `+1 (415) 555-1234` won't work — use `+14155551234`.

## Overriding the Default Number Per Call

```json
{
  "agent_id": "your-agent-id",
  "contact_number": "+919876543210",
  "outbound_number": "+14155559999"
}
```

The `outbound_number` must be a number that's configured in your telephony settings.
