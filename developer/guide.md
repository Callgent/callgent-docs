---
sidebar_position: 1
keywords: [callgent architecture explained, how callgent works, callgent system components, how to connect services using callgent, semantic invocation in callgent, diagram of callgent product architecture, how callgent integrates into APIs, understanding callgent’s system flow,Integration Platform as a Service, iPaaS]
description: Explore the innovative architecture of Callgent, where services and users are encapsulated behind callgents to seamlessly connect through web, chat, email, and APIs. Learn how semantic invocations enhance interactions.
---

# Concepts and Architecture

The core of the callgent architecture, is to encapsulate every **service** and **user** behind a `callgent`.  
Then build various endpoints into third-party platforms, so that any users and services are naturally connected anywhere in their native ways: webpages, chatting, email, APIs..  

Above this, we add a layer of semantic invocations, empowered by large language models (LLMs), to make the callgent able to understand and react to any user/system's intents.

## Product Architecture

System components and processing flow are shown in the following diagram:

<figure>
![Product Architecture](/img/callgent-architecture.png "Callgent product architecture")
</figure>

## Core Concepts

### Callgent

Each system service, and every user is encapsulated into a `Callgent`. 

### Calling Anywhere

Requesting a callgent is done through various `Calling Endpoint`, integrated into third-party platforms. So systems and users are naturally connected anywhere in their native ways: Webpages, chatting, email, APIs..

#### User-as-a-Service

Under this perspective, a user or group behind the `callgent` is no different than any normal services, system can invoke users just like an async API.

#### Service-as-a-User

At the same time, the system service behind the `callgent` is also exposed as a user, everyone can chat with it in natural language.  

### Intelligent Invocation

Each invocation is an asynchronous task, maintained by `callgent` intelligently:

- `callgent` is able to understand and react to any user/system's intents.
- `callgent` is responsible for collecting enough information to fulfill the task, progressively.
- `callgent` automatically maps and converts task data into system invocation parameters, or user conversations.

### Orchestration

Put all users and services onto the same platform, we can orchestrate them in a seamless way.
