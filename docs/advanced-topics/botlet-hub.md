---
sidebar_position: 2
---

# Botlet Hub

There are many products already encapsulated as botlet templates on the [Botlet Hub](https://botlet.io/hub).  
You can directly create your botlet from the hub to access the existing product services.

Let's start by example.

## Create a botlet to access canny.io product

> [canny.io](https://canny.io/) is a SaaS product that helps businesses collect user feedback to build better products.

Suppose you want to integrate canny.io into your botlet platform.

### Get your own canny.io account

Firstly, you need to register an account on canny.io, then get your API key from the settings page.

> something like `e30c7519-41c2-c7a7-3454-c437a56112a8`

### Create a canny botlet

Then go back to [Botlet Hub](https://botlet.io/hub), find the canny.io botlet, click the `Create` button.

> TODO list the canny.io botlet card here, or screenshot here.

Follow the instructions to fill in the API key, then confirm the creation.

### Set webhook on canny.io as event trigger

On successful creation, you will see a webhook URL on the botlet card. You must set this webhook URL on your canny.io > Settings > API > Webhooks.

:::info
The webhook URL is a event endpoint for canny.io to receive notification events to your botlet.
:::

## Using your canny.io botlet

### Client endpoint

Every user interactions on canny.io will go directly into your botlet task queue.

### Server endpoint

You can add any server endpoint to your botlet. So that you can respond to these tasks anywhere, e.g.

- send to your Slack channels
- as a github issue
- into you system workflow, or database
- ...

Your responses are automatically sent back to canny.io, to add comments or change status for the original interactions.

拆分实现

1. hub list/search
2. pre-created botlet template
3. creation/config process
4. usage 跑通
