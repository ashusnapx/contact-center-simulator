# logs-datasets

Source: https://ai.google.dev/gemini-api/docs/logs-datasets

The [Interactions API](/gemini-api/docs/interactions-overview) is now generally available. We recommend using this API for access to all the latest features and models.












 -





 [

 Home

 ](https://ai.google.dev/)





 -








 [

 Gemini API

 ](https://ai.google.dev/gemini-api)





 -








 [

 Docs

 ](https://ai.google.dev/gemini-api/docs)




















 Send feedback





# Logs and datasets















In this guide you'll learn how to
view logs from Gemini API usage in the Google AI Studio dashboard
to better understand model behavior and how users may be interacting with your
applications. Use logging to observe, debug, and *optionally share usage
feedback with Google to help improve Gemini across developer use cases*.[*](/gemini-api/docs/logs-policy)

All `GenerateContent`, `BatchGenerateContent`, `StreamGenerateContent` API
calls, and [Interactions](/gemini-api/docs/interactions) API calls excluding
Managed Agents are supported. This includes calls made through
[OpenAI compatibility](/gemini-api/docs/openai) endpoints.

**Note:** Storage for Gemini API logs are only available for projects on the
Gemini API paid tier.

## Configure project logging

By default, the API stores all interaction objects (`store=true`) in order to
simplify use of server-side state management features. In contrast, the
Generate Content API does not store requests by default, and requires storage
to be enabled per-request or at the project-level from AI Studio.

In Google [AI Studio](https://aistudio.google.com/logs) you can enable or
disable logging for all projects or for specific projects and change these
preferences at any time through the **Settings** panel in the
[Logs and Datasets](https://aistudio.google.com/logs) page. Logging can be toggled on or off
independently for the `generateContent` API and the
[Interactions](/gemini-api/docs/interactions) API
to change the default storage behavior for a project.

**Warning:** Toggling Interactions API logging *off* in the AI Studio
**Settings** panel will prevent
the API from automatically storing and retrieving conversation history unless
explicitly overridden per-request.

### Request-level logging

Storage and logging behavior differs by API:

- **[Interactions API](/gemini-api/docs/interactions):** Stores requests by default (`store=true`) to simplify server-side state management.
- **Generate Content API (`generateContent`):** Does not store requests by default (`store=false`).

Here is how you can set the `store` property:

**`generateContent` API**

### Python

```
from google import genai

client = genai.Client()

response = client.models.generate_content(
 model='gemini-3.5-flash',
 contents='Explain quantum entanglement in simple terms.',
 config={'store': False} # Set to True to enable logging of this request
)

print(response.text)

```

### JavaScript

```
import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({});

const response = await client.models.generateContent({
 model: 'gemini-3.5-flash',
 contents: 'Explain quantum entanglement in simple terms.',
 config: {
 store: false // Set to true to enable logging of this request
 }
});

console.log(response.text);

```

**Interactions API**

### Python

```
from google import genai

client = genai.Client()

interaction = client.interactions.create(
 model="gemini-3.5-flash",
 input="Explain quantum entanglement in simple terms.",
 store=True # Set to False to disable logging of this request
)

print(interaction.outputs[-1].text)

```

### JavaScript

```
import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({});

const interaction = await client.interactions.create({
 model: 'gemini-3.5-flash',
 input: 'Explain quantum entanglement in simple terms.',
 store: true // Set to false to disable logging of this request
});

console.log(interaction.outputs[interaction.outputs.length - 1].text);

```

## View project logs in AI Studio

- Go to the Logs page in [AI Studio](https://aistudio.google.com/logs).
- Select a project from the drop-down.
- Logs will appear in the table in reverse chronological order for the Interactions API, if they exist.
- To observe project logs for the Generate Content API, first enable this in the [settings panel](#configure-logging).

Click an entry for a preview of the payload. You can
inspect the full prompt and response from Gemini, and the context from the
previous turns. For **Interactions API** requests, logs also include a direct
link to the `previous_interaction_id`.

## Configure project storage retention

Logs will expire and be marked for deletion after a default retention window of
55 days (unless [saved to a dataset](#create), which don't expire).
You can configure the retention window of a project's logs to 7, 14, 28, or 55
days max.

## Create and share datasets

You can save logs to datasets to organize and export them more effectively.

- From the [Logs page](https://aistudio.google.com/logs), locate the filter bar
at the top to select a property to filter by.
- From your filtered view, use the checkboxes to select all or individual logs.
- Click the **Create dataset** button that appears at the top of the list.
- Give your new dataset a name and optional description.
- You will see the dataset you just created with the curated set of logs.
- Export your dataset for further analysis as CSV, JSONL files or to Google Sheets.

Datasets can be helpful for a number of different use cases.

- **Curate challenge sets:** Drive future improvements that target areas where you want your AI to improve.
- **Curate sample sets:** For example, a sample from real usage to generate responses from another model, or a collection of edge cases for routine checks before deployment.
- **Evaluation sets:** Sets that are representative of real usage across important capabilities, for comparison across other models or system instruction iterations.

You can contribute to Gemini research and development by choosing to share
your datasets with Google as demonstration examples.

## Limitations

Logging is not currently supported for the following:

- Imagen and Veo models
- Gemini embedding models
- Gemini Robotics model
- Inputs containing videos, GIFs or PDFs
- Public Preview Agents in the Gemini API

## What's next

- **Prototype with session history:** Use [AI Studio Build](https://aistudio.google.com/apps) to vibe code apps and add your API key to enable a history of Gemini API logs for AI features.
- **Re-run logs with the Gemini Batch API:** Use datasets for response sampling
and evaluation of models or application logic by re-running logs with the
[Gemini Batch API](https://github.com/google-gemini/cookbook/blob/main/examples/Datasets.ipynb).


















 Send feedback











Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.


Last updated 2026-07-17 UTC.











 Need to tell us more?







 [[["Easy to understand","easyToUnderstand","thumb-up"],["Solved my problem","solvedMyProblem","thumb-up"],["Other","otherUp","thumb-up"]],[["Missing the information I need","missingTheInformationINeed","thumb-down"],["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"],["Out of date","outOfDate","thumb-down"],["Samples / code issue","samplesCodeIssue","thumb-down"],["Other","otherDown","thumb-down"]],["Last updated 2026-07-17 UTC."],[],[]]
