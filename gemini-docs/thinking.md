# thinking

Source: https://ai.google.dev/gemini-api/docs/thinking

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





# Gemini thinking















**Note:** This version of the page covers the **Interactions API**. You can use the toggle on this page to switch to the [generateContent API version of this page](/gemini-api/docs/generate-content/thinking).

The [Gemini 3 and 2.5 series models](/gemini-api/docs/models) use a
"thinking process" that significantly improves their reasoning and multi-step
planning abilities, making them highly effective for complex tasks such as
coding, advanced mathematics, and data analysis.

When you use a thinking model, Gemini reasons internally before responding. The Interactions API surfaces this reasoning via `thought` steps, dedicated steps that appear chronologically alongside function calls, user inputs or model outputs in the `steps` array.

Every thought step contains two fields:

|

Field
| Required
| Description
|

| `signature`
| ✅ Yes
| An encrypted representation of the model's internal reasoning state. Always present, even when the model performs minimal reasoning.
|

| `summary`
| ❌ No
| An array of content (text and/or images) summarizing the reasoning. May be empty depending on the [`thinking_summaries`](/api/interactions-api) config, whether the model performed enough reasoning, or the content type (for example, image latents may not have text summaries).
|

**Note:** The Interactions API handles thoughts and signatures differently than the `generateContent` API:

- In the `generateContent` API, there are no dedicated thought blocks. Because of this, signatures are metadata that can be attached to any part, such as living inside `functionCall` parts or the final part of a response.

- In the Interactions API, thoughts are a first-class representation as dedicated `thought` steps. Because of this signatures are limited exclusively to two known locations, `thought` steps, or built-in tool steps (like `google_search_call`/ `google_search_result`). They never appear on user inputs, model outputs, or standard function calls.

## Interactions with thinking

Initiating an interaction with a thinking model is similar to any other interaction request. Specify one of the [models with thinking support](#thinking-levels) in the `model` field:

### Python

```
from google import genai

client = genai.Client()

interaction = client.interactions.create(
 model="gemini-3.5-flash",
 input="Explain the concept of Occam's Razor and provide a simple, everyday example."
)
print(interaction.output_text)

```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({});

const interaction = await client.interactions.create({
 model: "gemini-3.5-flash",
 input: "Explain the concept of Occam's Razor and provide a simple, everyday example."
});
console.log(interaction.output_text);

```

### REST

```
curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
 -H "x-goog-api-key: $GEMINI_API_KEY" \
 -H 'Content-Type: application/json' \
 -d '{
 "model": "gemini-3.5-flash",
 "input": "Explain the concept of Occam'\''s Razor and provide a simple example."
 }'

```

## Thought summaries

Thought summaries provide insights into the model's internal reasoning process.
By default, only the final output is returned. You can enable thought summaries
with `thinking_summaries`:

### Python

```
from google import genai

client = genai.Client()

interaction = client.interactions.create(
 model="gemini-3.5-flash",
 input="What is the sum of the first 50 prime numbers?",
 generation_config={
 "thinking_summaries": "auto"
 }
)

for step in interaction.steps:
 if step.type == "thought":
 print("Thought summary:")
 if step.summary:
 for content_block in step.summary:
 if content_block.type == "text":
 print(content_block.text)
 print()
 elif step.type == "model_output":
 for content_block in step.content:
 if content_block.type == "text":
 print("Answer:")
 print(content_block.text)
 print()

```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({});

const interaction = await client.interactions.create({
 model: "gemini-3.5-flash",
 input: "What is the sum of the first 50 prime numbers?",
 generation_config: {
 thinking_summaries: "auto"
 }
});

for (const step of interaction.steps) {
 if (step.type === "thought") {
 console.log("Thought summary:");
 if (step.summary) {
 for (const contentBlock of step.summary) {
 if (contentBlock.type === "text") console.log(contentBlock.text);
 }
 }
 } else if (step.type === "model_output") {
 for (const contentBlock of step.content) {
 if (contentBlock.type === "text") {
 console.log("Answer:");
 console.log(contentBlock.text);
 }
 }
 }
}

```

### REST

```
curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
 -H "x-goog-api-key: $GEMINI_API_KEY" \
 -H 'Content-Type: application/json' \
 -d '{
 "model": "gemini-3.5-flash",
 "input": "What is the sum of the first 50 prime numbers?",
 "generation_config": {
 "thinking_summaries": "auto"
 }
 }'

```

A thought block may contain **only a signature with no summary** in these cases:

- Simple requests, where the model didn't reason enough to generate a summary
- `thinking_summaries: "none"`, where summaries are explicitly disabled
- Certain thought content types, such as images, may not have text summaries

Your code should always handle thought blocks where `summary` is empty or absent.

## Streaming with thinking

Use streaming to receive incremental thought summaries during generation.
Thought blocks are delivered using Server-Sent Events (SSE) with two distinct
delta types:

|

Delta type
| Contains
| When sent
|

| `thought_summary`
| Text or image summary content
| One or more deltas with incremental summary
|

| `thought_signature`
| The cryptographic signature
| the last delta before `step.stop`
|

### Python

```
from google import genai

client = genai.Client()

prompt = """
Alice, Bob, and Carol each live in a different house on the same street: red, green, and blue.
Alice does not live in the red house.
Bob does not live in the green house.
Carol does not live in the red or green house.
Which house does each person live in?
"""

thoughts = ""
answer = ""

stream = client.interactions.create(
 model="gemini-3.5-flash",
 input=prompt,
 generation_config={
 "thinking_summaries": "auto"
 },
 stream=True
)

for event in stream:
 if event.event_type == "step.delta":
 if event.delta.type == "thought_summary":
 if not thoughts:
 print("Thinking...")
 summary_text = event.delta.content.text
 print(f"[Thought] {summary_text}", end="")
 thoughts += summary_text
 elif event.delta.type == "text" and event.delta.text:
 if not answer:
 print("\nAnswer:")
 print(event.delta.text, end="")
 answer += event.delta.text

```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({});

const prompt = `Alice, Bob, and Carol each live in a different house on the same
street: red, green, and blue. Alice does not live in the red house.
Bob does not live in the green house.
Carol does not live in the red or green house.
Which house does each person live in?`;

let thoughts = "";
let answer = "";

const stream = await client.interactions.create({
 model: "gemini-3.5-flash",
 input: prompt,
 generation_config: {
 thinking_summaries: "auto"
 },
 stream: true
});

for await (const event of stream) {
 if (event.event_type === "step.delta") {
 if (event.delta.type === "thought_summary") {
 if (!thoughts) console.log("Thinking...");
 const text = event.delta.content?.text || "";
 process.stdout.write(`[Thought] ${text}`);
 thoughts += text;
 } else if (event.delta.type === "text" && event.delta.text) {
 if (!answer) console.log("\nAnswer:");
 process.stdout.write(event.delta.text);
 answer += event.delta.text;
 }
 }
}

```

### REST

```
curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
 -H "x-goog-api-key: $GEMINI_API_KEY" \
 -H 'Content-Type: application/json' \
 --no-buffer \
 -d '{
 "model": "gemini-3.5-flash",
 "input": "Alice, Bob, and Carol each live in a different house on the same street: red, green, and blue. Alice does not live in the red house. Bob does not live in the green house. Carol does not live in the red or green house. Which house does each person live in?",
 "generation_config": {
 "thinking_summaries": "auto"
 },
 "stream": true
 }'

```

The streaming response uses Server-Sent Events (SSE) and is composed of steps
and events, for example:

```
event: interaction.created
data: {&#34;interaction&#34;:{&#34;id&#34;:&#34;v1_xxx&#34;,&#34;status&#34;:&#34;in_progress&#34;,&#34;object&#34;:&#34;interaction&#34;,&#34;model&#34;:&#34;gemini-3.5-flash&#34;},&#34;event_type&#34;:&#34;interaction.created&#34;}

event: step.start
data: {&#34;index&#34;:0,&#34;step&#34;:{&#34;signature&#34;:&#34;&#34;,&#34;summary&#34;:[{&#34;text&#34;:&#34;**Evaluating the clues**\n\nI'm considering...&#34;,&#34;type&#34;:&#34;text&#34;}],&#34;type&#34;:&#34;thought&#34;},&#34;event_type&#34;:&#34;step.start&#34;}

event: step.delta
data: {&#34;index&#34;:0,&#34;delta&#34;:{&#34;signature&#34;:&#34;EpoGCpcGAXLI2nx/...&#34;,&#34;type&#34;:&#34;thought_signature&#34;},&#34;event_type&#34;:&#34;step.delta&#34;}

event: step.stop
data: {&#34;index&#34;:0,&#34;event_type&#34;:&#34;step.stop&#34;}

event: step.start
data: {&#34;index&#34;:1,&#34;step&#34;:{&#34;content&#34;:[{&#34;text&#34;:&#34;Based on the clues provided, here&#34;,&#34;type&#34;:&#34;text&#34;}],&#34;type&#34;:&#34;model_output&#34;},&#34;event_type&#34;:&#34;step.start&#34;}

event: step.delta
data: {&#34;index&#34;:1,&#34;delta&#34;:{&#34;text&#34;:&#34; is the answer to your question...&#34;,&#34;type&#34;:&#34;text&#34;},&#34;event_type&#34;:&#34;step.delta&#34;}

event: step.stop
data: {&#34;index&#34;:1,&#34;event_type&#34;:&#34;step.stop&#34;}

event: interaction.completed
data: {&#34;interaction&#34;:{&#34;id&#34;:&#34;v1_xxx&#34;,&#34;status&#34;:&#34;completed&#34;,&#34;usage&#34;:{&#34;total_tokens&#34;:530,&#34;total_input_tokens&#34;:62,&#34;total_output_tokens&#34;:171,&#34;total_thought_tokens&#34;:297}},&#34;event_type&#34;:&#34;interaction.completed&#34;}

event: done
data: [DONE]

```

## Controlling thinking

Gemini models engage in dynamic thinking by default, automatically adjusting
the amount of reasoning effort based on the complexity of the request. You can control this behavior using the `thinking_level` parameter.

|

Model
| Default Thinking
| Levels Supported
|

| gemini-3.1-pro-preview
| On (high)
| low, medium, high
|

| gemini-3.1-flash-lite-image
| On (minimal)
| minimal, high
|

| gemini-3-flash-preview
| On (high)
| minimal, low, medium, high
|

| gemini-3-pro-preview
| On (high)
| low, high
|

| gemini-3.5-flash
| On (medium)
| minimal, low, medium, high
|

| gemini-2.5-pro
| On
| low, medium, high
|

| gemini-2.5-flash
| On
| low, medium, high
|

| gemini-2.5-flash-lite
| Off
| low, medium, high
|

### Python

```
from google import genai

client = genai.Client()

interaction = client.interactions.create(
 model="gemini-3.5-flash",
 input="Provide a list of 3 famous physicists and their key contributions",
 generation_config={
 "thinking_level": "low"
 }
)
print(interaction.output_text)

```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({});

const interaction = await client.interactions.create({
 model: "gemini-3.5-flash",
 input: "Provide a list of 3 famous physicists and their key contributions",
 generation_config: {
 thinking_level: "low"
 }
});
console.log(interaction.output_text);

```

### REST

```
curl -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
 -H "x-goog-api-key: $GEMINI_API_KEY" \
 -H 'Content-Type: application/json' \
 -d '{
 "model": "gemini-3.5-flash",
 "input": "Provide a list of 3 famous physicists and their key contributions",
 "generation_config": {
 "thinking_level": "low"
 }
 }'

```

## Thought signatures

Thought signatures are encrypted representations of the model's internal reasoning. They are required to maintain reasoning continuity across multi-turn interactions.

The Interactions API makes handling thought signatures much simpler than the `generateContent` API.

### Stateful mode (Recommended)

By default, when you use the Interactions API in stateful mode (by setting `store: true` and passing the `previous_interaction_id` in subsequent turns), the server automatically manages the conversation state, including all thought blocks and signatures. In this mode, you do not need to do anything regarding signatures. They are handled entirely on the server side.

### Stateless mode

If you are managing the conversation state yourself (stateless mode) and passing the full history of inputs and outputs in each request:

- You **MUST** always resend all `thought` blocks exactly as they were received from the model.
- You should **NOT** remove or modify thought blocks from the history, as they contain the signatures required for the model to continue its reasoning.
- When switching models within a session, you should still resend the previous model's thought blocks. The backend manages compatibility.

**Note:** Built-in tools such as Google Search can carry their own distinct signatures on the call/result blocks. In stateless mode, you must also resend these tool result signatures in subsequent turns.

## Pricing

When thinking is turned on, response pricing is the sum of output
tokens and thinking tokens. You can get the total number of generated thinking
tokens from the `total_thought_tokens` field.

### Python

```
print("Thoughts tokens:", interaction.usage.total_thought_tokens)
print("Output tokens:", interaction.usage.total_output_tokens)

```

### JavaScript

```
console.log(`Thoughts tokens: ${interaction.usage.total_thought_tokens}`);
console.log(`Output tokens: ${interaction.usage.total_output_tokens}`);

```

Thinking models generate full thoughts to improve the quality of the final
response, and then output [summaries](#summaries) to provide insight into the
thought process. Pricing is based on the full thought tokens the model needs to
generate, despite only the summary being output from the API.

You can learn more about tokens in the [Token counting](/gemini-api/docs/tokens) guide.

## Best practices

Use thinking models efficiently by following these guidelines.

- **Review reasoning**: Analyze thought summaries to understand failures and improve prompts.
- **Control thinking budget**: Prompt the model to think less for lengthy outputs to save tokens.
- **Simple tasks**: Use minimal or low thinking for fact retrieval or classification (e.g., "Where was DeepMind founded?").
- **Moderate tasks**: Use default thinking for comparing concepts or creative reasoning (e.g., Compare electric and hybrid cars).
- **Complex tasks**: Use maximum thinking for advanced coding, math, or multi-step planning (e.g., Solve AIME math problems).

## What's next

- [Text generation](/gemini-api/docs/text-generation): Basic text responses
- [Function calling](/gemini-api/docs/function-calling): Connect to tools
- [Gemini 3 guide](/gemini-api/docs/gemini-3): Model-specific features


















 Send feedback











Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.


Last updated 2026-07-06 UTC.











 Need to tell us more?







 [[["Easy to understand","easyToUnderstand","thumb-up"],["Solved my problem","solvedMyProblem","thumb-up"],["Other","otherUp","thumb-up"]],[["Missing the information I need","missingTheInformationINeed","thumb-down"],["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"],["Out of date","outOfDate","thumb-down"],["Samples / code issue","samplesCodeIssue","thumb-down"],["Other","otherDown","thumb-down"]],["Last updated 2026-07-06 UTC."],[],[]]
