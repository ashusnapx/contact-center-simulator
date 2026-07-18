# video

Source: https://ai.google.dev/gemini-api/docs/video

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





# Video generation in the Gemini API















The Gemini API offers two models for generating video,
[Gemini Omni Flash](/gemini-api/docs/omni) and [Veo](/gemini-api/docs/veo).
Each are designed for different workflows.

Use Gemini Omni Flash as your default model for video generation. It provides
superior video coherence, multi-input reasoning (supporting text, images, audio,
and video inputs simultaneously), character consistency, factual accuracy, and
multi-turn conversational editing (e.g., element replacement or perspective
changes). Use Veo 3.1 for specific
capabilities like scene extension, last-frame control, or integration with
legacy pipelines are required.

## Gemini Omni Flash

Gemini Omni Flash is a fast, multimodal model for video generation and
conversational video editing. It excels at quickly turning text prompts and
images into short videos, and lets you refine results across multiple turns
using the Interactions API.

[Get started with Gemini Omni Flash →](/gemini-api/docs/omni)

## Veo 3.1

Veo 3.1 is a model for generating video with native audio. It supports
features like video extension, frame-specific generation, and image-based
direction through the `generateContent` API.

[Get started with Veo 3.1 →](/gemini-api/docs/veo)

## Video understanding

If you need to ingest and analyze existing video content rather than generate
new video, see the [Video understanding guide](/gemini-api/docs/video-understanding).


















 Send feedback











Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.


Last updated 2026-06-30 UTC.











 Need to tell us more?







 [[["Easy to understand","easyToUnderstand","thumb-up"],["Solved my problem","solvedMyProblem","thumb-up"],["Other","otherUp","thumb-up"]],[["Missing the information I need","missingTheInformationINeed","thumb-down"],["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"],["Out of date","outOfDate","thumb-down"],["Samples / code issue","samplesCodeIssue","thumb-down"],["Other","otherDown","thumb-down"]],["Last updated 2026-06-30 UTC."],[],[]]
