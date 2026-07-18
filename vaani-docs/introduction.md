# Introduction

> Welcome to Vaani Backend API Documentation

## Welcome

Welcome to the Vaani Backend API documentation. This API provides endpoints for managing outbound calls, retrieving call history, transcripts, and call details.

## What is Vaani Backend API?

The Vaani Backend API is a comprehensive call management system that enables you to:

* **Create Outbound Calls** - Trigger calls with customizable agent names and voice preferences
* **Retrieve Call History** - Access call history for clients
* **Get Transcripts** - Access detailed call transcripts
* **Stream Audio** - Stream audio files from calls stored in Azure Blob Storage
* **Get Call Details** - Access comprehensive call information including transcripts, entities, and evaluations

## Authentication

All API endpoints require authentication using the `X-API-Key` header. Make sure to include your API key in all requests:

```
X-API-Key: your-api-key-here
```

> **Warning:** Keep your API key secure and never expose it in client-side code or public repositories.

## Base URL

All endpoints are prefixed with `/api/`. The base URL is:

```
https://api.vaanivoice.ai
```

## API Version

Current API version: **2.0.0**
