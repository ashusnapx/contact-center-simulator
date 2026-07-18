# Start a Campaign

> Run bulk outbound calls to a list of contacts

## What is a Campaign?

A campaign lets you dispatch outbound calls to multiple contacts using the same agent, without triggering each call individually via the API.

## Steps

1. Go to Campaigns → Create Campaign in the dashboard.
2. Select an Agent — choose the agent that will handle calls.
3. Upload Contact List — CSV with at minimum `contact_number` and `name` columns. Additional columns map to your agent's `metadata` variables.

```csv
contact_number,name,property_name
+919876543210,Rahul Sharma,Prateek Laurel
+919876543211,Priya Singh,Prateek Edenia
```

4. Start the Campaign — set concurrency limits and start. Vaani manages the dialing queue automatically.
