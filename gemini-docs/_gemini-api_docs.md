#  > gemini-api > docs

Source: https://ai.google.dev/gemini-api/docs

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











# Gemini API















The Gemini API is the fastest path from prompt to production with Gemini, Veo,
Nano Banana, and more. It lets you integrate these generative models into your
applications to generate text and images, analyze multimodal inputs, and build
conversational agents.

The **Interactions API** is the best way to build with Gemini API and Gemini
models and agents. Learn more in the [Interactions API
Overview](/gemini-api/docs/interactions-overview).

### Python

```
from google import genai

client = genai.Client()

interaction = client.interactions.create(
 model="gemini-3.5-flash",
 input="Explain how AI works in a few words"
)

print(interaction.output_text)

```

### JavaScript

```
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

const interaction = await ai.interactions.create({
 model: "gemini-3.5-flash",
 input: "Explain how AI works in a few words",
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
 "input": "Explain how AI works in a few words"
 }'

```

 [Start building](/gemini-api/docs/quickstart)


Follow our getting started guide to get an API key and make your first API call in minutes.





## Meet the models

 [View all](/gemini-api/docs/models)


 [


 auto_awesome
 Gemini 3.1 Pro
 New




 Our most intelligent model, the best in the world for multimodal understanding, all built on state-of-the-art reasoning.


 ](/gemini-api/docs/models/gemini-3.1-pro-preview)
 [


 spark
 Gemini 3.5 Flash
 New




 Frontier-class performance rivaling larger models at a fraction of the cost.


 ](/gemini-api/docs/models/gemini-3.5-flash)
 [


 spark
 Gemini 3.1 Flash-Lite
 New




 High-volume, cost-sensitive model with the performance and quality of the Gemini 3 series.


 ](/gemini-api/docs/models/gemini-3.1-flash-lite)
 [


 spark
 Gemini 3 Flash




 Frontier-class performance rivaling larger models at a fraction of the cost.


 ](/gemini-api/docs/models/gemini-3-flash-preview)
 [


 🍌
 Nano Banana 2 and Nano Banana Pro




 State-of-the-art image generation and editing models.


 ](/gemini-api/docs/image-generation)
 [


 video_library
 Veo 3.1




 Our state-of-the-art video generation model, with native audio.


 ](/gemini-api/docs/video)
 [


 spark
 Gemini Robotics




 A vision-language model (VLM) that brings Gemini's agentic capabilities to robotics and enables advanced reasoning in the physical world.


 ](/gemini-api/docs/robotics-overview)


## Explore Capabilities


 [


 imagesmode





 Native Image Generation (Nano Banana)




 Generate and edit highly contextual images natively with Gemini 2.5 Flash Image.



 ](/gemini-api/docs/image-generation)
 [


 article





 Long Context




 Input millions of tokens to Gemini models and derive understanding from unstructured images, videos, and documents.



 ](/gemini-api/docs/long-context)
 [


 code





 Structured Outputs




 Constrain Gemini to respond with JSON, a structured data format suitable for automated processing.



 ](/gemini-api/docs/structured-output)
 [


 functions





 Function Calling




 Build agentic workflows by connecting Gemini to external APIs and tools.



 ](/gemini-api/docs/function-calling)
 [


 videocam





 Video Generation with Veo 3.1




 Create high-quality video content from text or image prompts with our state-of-the-art model.



 ](/gemini-api/docs/video)
 [


 android_recorder





 Voice Agents with Live API




 Build real-time voice applications and agents with the Live API.



 ](/gemini-api/docs/live)
 [


 build





 Tools




 Connect Gemini to the world through built-in tools like Google Search, URL Context, Google Maps, Code Execution and Computer Use.



 ](/gemini-api/docs/tools)
 [


 stacks





 Document Understanding




 Process up to 1000 pages of PDF files with full multimodal understanding or other text-based file types.



 ](/gemini-api/docs/document-processing)
 [


 cognition_2





 Thinking




 Explore how thinking capabilities improve reasoning for complex tasks and agents.



 ](/gemini-api/docs/thinking)


 [





 Google AI Studio



 Test prompts, manage your API keys, monitor usage, and build prototypes.


 ](https://aistudio.google.com)
 [

 group


 Developer Community



 Ask questions and find solutions from other developers and Google engineers.


 ](https://discuss.ai.google.dev/c/gemini-api/4)
 [

 menu_book


 API Reference



 Find detailed information about the Gemini API in the official reference documentation.


 ](/api)
 [

 sensors


 Status



 Check the status of Gemini API, Google AI Studio, and our model services.


 ](https://aistudio.google.com/status)















Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.


Last updated 2026-07-13 UTC.






 [[["Easy to understand","easyToUnderstand","thumb-up"],["Solved my problem","solvedMyProblem","thumb-up"],["Other","otherUp","thumb-up"]],[["Missing the information I need","missingTheInformationINeed","thumb-down"],["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"],["Out of date","outOfDate","thumb-down"],["Samples / code issue","samplesCodeIssue","thumb-down"],["Other","otherDown","thumb-down"]],["Last updated 2026-07-13 UTC."],[],[]]
