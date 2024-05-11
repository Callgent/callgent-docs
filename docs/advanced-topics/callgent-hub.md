---
sidebar_position: 2
---

# Callgent Hub

There are many products already encapsulated as callgent templates on the [Callgent Hub](https://callgent.com/hub).  
You can directly create your callgent from the hub to access the existing product services.

Let's start by example.

## Create a callgent to access canny.io product

> [canny.io](https://canny.io/) is a SaaS product that helps businesses collect user feedback to build better products.

Suppose you want to integrate canny.io into your callgent platform.

### Get your own canny.io account

Firstly, you need to register an account on canny.io, then get your API key from the settings page.

> something like `e30c7519-41c2-c7a7-3454-c437a56112a8`

### Create a canny callgent

Then go back to [Callgent Hub](https://callgent.com/hub), find the canny.io callgent, click the `Create` button.

> TODO list the canny.io callgent card here, or screenshot here.

Follow the instructions to fill in the API key, then confirm the creation.

### Set webhook on canny.io as event trigger

On successful creation, you will see a webhook URL on the callgent card. You must set this webhook URL on your canny.io > Settings > API > Webhooks.

:::info
The webhook URL is a event endpoint for canny.io to receive notification events to your callgent.
:::

## Using your canny.io callgent

### Client endpoint

Every user interactions on canny.io will go directly into your callgent task queue.

### Server endpoint

You can add any server endpoint to your callgent. So that you can respond to these tasks anywhere, e.g.

- send to your Slack channels
- as a github issue
- into you system workflow, or database
- ...

Your responses are automatically sent back to canny.io, to add comments or change status for the original interactions.

拆分实现

1. hub list/search
2. pre-created callgent template
3. creation/config process
4. usage 跑通
