# models > gemini-3.1-flash-lite

Source: https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite

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

















 **


 Send feedback





# Gemini 3.1 Flash-Lite















Gemini 3.1 Flash-Lite is a low-latency, cost-effective multimodal model
optimized for high-frequency, lightweight tasks. The model supports text, image,
video, audio, and PDF inputs, and is designed for high-volume agentic workflows,
simple data extraction, and applications where latency and API cost are the
primary constraints.

 [Try in Google AI Studio](https://aistudio.google.com/prompts/new_chat?model=gemini-3.1-flash-lite)

## gemini-3.1-flash-lite


 | Property
 | Description
 |


 | id_cardModel code
 | `gemini-3.1-flash-lite`
 |


 | saveSupported data types
 |


Inputs**


Text, Image, Video, Audio, and PDF




**Output**


Text



 |


 | token_autoToken limits[[*]](/gemini-api/docs/tokens)
 |


**Input token limit**


1,048,576




**Output token limit**


65,536



 |


 | handymanCapabilities
 |


**[Audio generation](/gemini-api/docs/speech-generation)**


Not supported




**[Caching](/gemini-api/docs/caching)**


Supported




**[Code execution](/gemini-api/docs/code-execution)**


Supported




**[Computer use](/gemini-api/docs/computer-use)**


Not supported




**[File search](/gemini-api/docs/file-search)**


Supported




**[Function calling](/gemini-api/docs/function-calling)**


Supported




**[Grounding with Google Maps](/gemini-api/docs/maps-grounding)**


Supported




**[Image generation](/gemini-api/docs/image-generation)**


Not supported




**[Live API](/gemini-api/docs/live-api)**


Not supported




**[Search grounding](/gemini-api/docs/google-search)**


Supported




**[Structured outputs](/gemini-api/docs/structured-output)**


Supported




**[Thinking](/gemini-api/docs/thinking)**


Supported




**[URL context](/gemini-api/docs/url-context)**


Supported



 |


 | speedConsumption options
 |


**[Batch API](/gemini-api/docs/batch-api)**


Supported




**[Flex inference](/gemini-api/docs/flex-inference)**


Supported




**[Priority inference](/gemini-api/docs/priority-inference)**


Supported



 |


 | 123Versions
 |

 Read the [model version patterns](/gemini-api/docs/models/gemini#model-versions) for more details.

 - `Stable: gemini-3.1-flash-lite`



 |


 | calendar_monthLatest update
 | May 2026
 |


 | cognition_2Knowledge cutoff
 | January 2025
 |

## Developer guide

Gemini 3.1 Flash-Lite is best at handling straightforward tasks at significant
scale. Here are some use cases best suited for Gemini 3.1 Flash-Lite:

-
**Translation**: Fast, cheap, high-volume translation, such as processing
chat messages, reviews, and support tickets at scale. You can use system
instructions to constrain output to only the translated text with no extra
commentary:

```
from google import genai

client = genai.Client()
text = "Hey, are you down to grab some pizza later? I'm starving!"

response = client.models.generate_content(
 model="gemini-3.1-flash-lite",
 config={
 "system_instruction": "Only output the translated text"
 },
 contents=f"Translate the following text to German: {text}"
)

print(response.text)

```

-
**Transcription**: Process recordings, voice notes, or any audio content
where you need a text transcript without spinning up a separate
speech-to-text pipeline. Supports multimodal inputs, so you can pass audio
files directly for transcription:

```
from google import genai

client = genai.Client()

# URL = "https://storage.googleapis.com/generativeai-downloads/data/State_of_the_Union_Address_30_January_1961.mp3"
# Upload the audio file to the GenAI File API
uploaded_file = client.files.upload(file='sample.mp3')

prompt = 'Generate a transcript of the audio.'

response = client.models.generate_content(
 model="gemini-3.1-flash-lite",
 contents=[prompt, uploaded_file]
)

print(response.text)

```

-
**Lightweight agentic tasks and data extraction**: Entity extraction,
classification, and lightweight data processing pipelines supported with
structured JSON output. For example, extracting structured data from an
e-commerce customer review:

```
from google import genai
from pydantic import BaseModel, Field

client = genai.Client()

prompt = "Analyze the user review and determine the aspect, sentiment score, summary quote, and return risk"
input_text = "The boots look amazing and the leather is high quality, but they run way too small. I'm sending them back."

class ReviewAnalysis(BaseModel):
 aspect: str = Field(description="The feature mentioned (e.g., Price, Comfort, Style, Shipping)")
 summary_quote: str = Field(description="The specific phrase from the review about this aspect")
 sentiment_score: int = Field(description="1 to 5 (1=worst, 5=best)")
 is_return_risk: bool = Field(description="True if the user mentions returning the item")

response = client.models.generate_content(
 model="gemini-3.1-flash-lite",
 contents=[prompt, input_text],
 config={
 "response_mime_type": "application/json",
 "response_json_schema": ReviewAnalysis.model_json_schema(),
 },
)

print(response.text)

```

-
**Document processing and summarization**: Parse PDFs and return concise
summaries, like for building a document processing pipeline or quickly
triaging incoming files:

```
from google import genai
from google.genai import types
import httpx

client = genai.Client()

# Download a sample PDF document
doc_url = "https://storage.googleapis.com/generativeai-downloads/data/med_gemini.pdf"
doc_data = httpx.get(doc_url).content

prompt = "Summarize this document"
response = client.models.generate_content(
 model="gemini-3.1-flash-lite",
 contents=[
 types.Part.from_bytes(
 data=doc_data,
 mime_type='application/pdf',
 ),
 prompt
 ]
)

print(response.text)

```

-
**Model routing**: Use a low-latency and low-cost model as a classifier that
routes queries to the appropriate model based on task complexity. This is a
real pattern in production — the open-source [Gemini CLI](https://geminicli.com/docs/core/#model-fallback) uses Flash-Lite to
classify task complexity and route to Flash or Pro accordingly.

```
from google import genai

client = genai.Client()

FLASH_MODEL = 'flash'
PRO_MODEL = 'pro'

CLASSIFIER_SYSTEM_PROMPT = f"""
You are a specialized Task Routing AI. Your sole function is to analyze the user's request and classify its complexity. Choose between `{FLASH_MODEL}` (SIMPLE) or `{PRO_MODEL}` (COMPLEX).
1. `{FLASH_MODEL}`: A fast, efficient model for simple, well-defined tasks.
2. `{PRO_MODEL}`: A powerful, advanced model for complex, open-ended, or multi-step tasks.

A task is COMPLEX if it meets ONE OR MORE of the following criteria:
1. High Operational Complexity (Est. 4+ Steps/Tool Calls)
2. Strategic Planning and Conceptual Design
3. High Ambiguity or Large Scope
4. Deep Debugging and Root Cause Analysis

A task is SIMPLE if it is highly specific, bounded, and has Low Operational Complexity (Est. 1-3 tool calls).
"""

user_input = "I'm getting an error 'Cannot read property 'map' of undefined' when I click the save button. Can you fix it?"

response_schema = {
 "type": "object",
 "properties": {
 "reasoning": {
 "type": "string",
 "description": "A brief, step-by-step explanation for the model choice, referencing the rubric."
 },
 "model_choice": {
 "type": "string",
 "enum": [FLASH_MODEL, PRO_MODEL]
 }
 },
 "required": ["reasoning", "model_choice"]
}

response = client.models.generate_content(
 model="gemini-3.1-flash-lite",
 contents=user_input,
 config={
 "system_instruction": CLASSIFIER_SYSTEM_PROMPT,
 "response_mime_type": "application/json",
 "response_json_schema": response_schema
 },
)

print(response.text)

```

-
**Thinking**: For better accuracy for tasks that benefit from step-by-step
reasoning, configure thinking so the model spends additional compute on
internal reasoning before producing the final output:

```
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
 model="gemini-3.1-flash-lite",
 contents="How does AI work?",
 config=types.GenerateContentConfig(
 thinking_config=types.ThinkingConfig(thinking_level="high")
 ),
)

print(response.text)

```


















 Send feedback











Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.


Last updated 2026-06-23 UTC.











 Need to tell us more?







 [[["Easy to understand","easyToUnderstand","thumb-up"],["Solved my problem","solvedMyProblem","thumb-up"],["Other","otherUp","thumb-up"]],[["Missing the information I need","missingTheInformationINeed","thumb-down"],["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"],["Out of date","outOfDate","thumb-down"],["Samples / code issue","samplesCodeIssue","thumb-down"],["Other","otherDown","thumb-down"]],["Last updated 2026-06-23 UTC."],[],[]]
