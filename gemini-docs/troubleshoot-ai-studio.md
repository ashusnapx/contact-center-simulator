# troubleshoot-ai-studio

Source: https://ai.google.dev/gemini-api/docs/troubleshoot-ai-studio

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





# Troubleshoot Google AI Studio















This page provides suggestions for troubleshooting Google AI Studio if you
encounter issues.

## Understand 403 Access Restricted errors

If you see a 403 Access Restricted error, you are using Google AI Studio in a
way that does not follow the [Terms of Service](/terms). One common reason is
you are not located in a [supported region](/available_regions).

## Resolve No Content responses on Google AI Studio

A warning **No Content** message appears on
Google AI Studio if the content is blocked for any reason. To see more details,
hold the pointer over **No Content** and click
warning **Safety**.

If the response was blocked due to [safety settings](/docs/safety_setting) and
you considered the [safety risks](/docs/safety_guidance) for your use case, you
can modify the
[safety settings](/docs/safety_setting#safety_settings_in_makersuite)
to influence the returned response.

If the response was blocked but not due to the safety settings, the query or
response may violate the [Terms of Service](/terms) or be otherwise unsupported.

## Check token usage and limits

When you have a prompt open, the **Text Preview** button at the bottom of the
screen shows the current tokens used for the content of your prompt and the
maximum token count for the model being used.

## Google Cloud IAM permissions for AI Studio

Members of a Google Cloud project need specific Identity and Access Management (IAM) permissions to perform actions in Google AI Studio. For more information about these identities, see the [IAM principals overview](https://cloud.google.com/iam/docs/principals).

Users with the **Editor** or **Owner** roles in the associated Google Cloud project have full permissions to view dashboards and manage Gemini API keys. Users with the **Viewer** role can view dashboards and API keys, but cannot create, update, or delete them.

For more granular control, refer to the following table for the specific permissions required for each AI Studio feature. For instructions on how to grant these permissions, see [Granting, changing, and revoking access to resources](https://cloud.google.com/iam/docs/granting-changing-revoking-access) in the Google Cloud documentation.

|

AI Studio feature
| Required IAM permissions
| Additional requirements
|

| **Search project** (import projects)
| `resourcemanager.projects.get`
|
|

| **Rename project**
| `resourcemanager.projects.update`
|
|

| **Display quota tier**
| N/A
|
|

| **Create API key**
| Have **Search project** permissions, and:

`apikeys.keys.create`
`serviceusage.services.enable`
`iam.serviceAccountApiKeyBindings.create`
`iam.serviceAccounts.create`
|
|

| **List API keys**
| Have **Search project** permissions, and:

`apikeys.keys.list`
`serviceusage.services.get`
| The Google Cloud project must have the [Generative Language API](https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com) enabled.
|

| **Rename API keys**
| `apikeys.keys.update`
|
|

| **Delete API keys**
| `apikeys.keys.delete`
|
|

| **Usage dashboard**
| Have **Search project** permissions, and:

`monitoring.timeSeries.list`
|
|

| **Rate limit dashboard**
| Have **Usage dashboard** permissions, and:

`cloudquotas.quotas.get`
|
|

| **Spend (Billing cap)**
| `billing.resourceCosts.get` (to view spend)
`billing.resourcebudgets.read` (to view cap)
`billing.resourcebudgets.write` (to set cap)
|
|

| **Billing dashboard**
| `billing.accounts.get`
|
|

### Other access checks

In addition to Google Cloud IAM permissions, AI Studio also performs security and compliance checks. You might encounter a `PERMISSION_DENIED` or access restriction error in the AI Studio interface or in API responses if you do not meet the following requirements:

- **Security checks:** Your request must pass automated security checks.
- **Terms of Service:** You must accept the Google Terms of Service and Generative AI Additional Terms of Service.
- **Supported region:** You must be located in a [supported region](/gemini-api/docs/available-regions).
- **Trust & Safety:** The Google Cloud project must not be flagged for abuse.


















 Send feedback











Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.


Last updated 2026-05-29 UTC.











 Need to tell us more?







 [[["Easy to understand","easyToUnderstand","thumb-up"],["Solved my problem","solvedMyProblem","thumb-up"],["Other","otherUp","thumb-up"]],[["Missing the information I need","missingTheInformationINeed","thumb-down"],["Too complicated / too many steps","tooComplicatedTooManySteps","thumb-down"],["Out of date","outOfDate","thumb-down"],["Samples / code issue","samplesCodeIssue","thumb-down"],["Other","otherDown","thumb-down"]],["Last updated 2026-05-29 UTC."],[],[]]
