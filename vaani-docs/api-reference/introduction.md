# API Reference

> Vaani Backend API — Agent Builder, Call Management, and WebRTC

## Overview

The Vaani Backend API provides endpoints for building and configuring voice agents, triggering and managing calls, and connecting in-browser sessions via WebRTC.

## Authentication

All endpoints require API key authentication:

```
X-API-Key: vaani_<your_key>
```

## Base URL

```
https://api.vaanivoice.ai
```

## API Version: **2.0.0**

## Agent Builder

| Method  | Endpoint                           | Description                                     |
| ------- | ---------------------------------- | ----------------------------------------------- |
| `POST`  | `/api/create-agent`                | Create a new agent                              |
| `PATCH` | `/api/agent/{agent_id}/persona`    | Update identity, AI providers                   |
| `PATCH` | `/api/agent/{agent_id}/training`   | Update knowledge base, FAQ, guardrails          |
| `PATCH` | `/api/agent/{agent_id}/experience` | Update conversational feel and call settings    |
| `PATCH` | `/api/agent/{agent_id}/analysis`   | Update post-call evaluation and data extraction |
| `PATCH` | `/api/agent/{agent_id}/deployment` | Update phone number routing                     |

All PATCH endpoints perform a **partial merge** — only the fields you send are updated.

## Call Management

| Method | Endpoint                      | Description                                |
| ------ | ----------------------------- | ------------------------------------------ |
| `POST` | `/api/trigger-call/`          | Trigger an outbound call                   |
| `POST` | `/api/webrtc/token`           | Generate a LiveKit WebRTC token            |
| `GET`  | `/api/call-history`           | Paginated call history                     |
| `GET`  | `/api/transcript/{call_id}`   | Get call transcript                        |
| `GET`  | `/api/call_details/{call_id}` | Get call details, summary, and extractions |
| `GET`  | `/api/stream/{call_id}`       | Stream audio recording                     |
