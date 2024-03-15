---
sidebar_position: 1
---

# Concepts and Architecture

The core of the botlet architecture, is to encapsulate every **service** and **user** behind a `botlet`.  
Then build various endpoints into third-party platforms, so that any users and services are naturally connected anywhere in their native ways: chatting, mail, APIs..  

Above this, we add a layer of semantic invocations, empowered by large language models (LLMs), to make the botlet able to understand and react to any user/system's intents.

## Product Architecture

System components and processing flow are shown in the following diagram:

<figure>
![Product Architecture](/img/botlet-architecture.png "Botlet.IO product architecture")
</figure>

## Core Concepts

### Botlet

Each system service, and every user is encapsulated into a `Botlet`. 

### Calling Anywhere

Requesting a botlet is done through various `Calling Endpoint`, integrated into third-party platforms. So systems and users are naturally connected anywhere in their native ways: chatting, mail, APIs..

#### User-as-a-Service

Under this perspective, a user or group behind the `botlet` is no different than any normal services, system can invoke users just like an async API.

#### Service-as-a-User

At the same time, the system service behind the `botlet` is also exposed as a user, everyone can chat with it in natural language.  

### Intelligent Invocation

Each invocation is an asynchronous task, maintained by `botlet` intelligently:

- `botlet` is able to understand and react to any user/system's intents.
- `botlet` is responsible for collecting enough information to fulfill the task, progressively.
- `botlet` automatically maps and converts task data into system invocation parameters, or user conversations.

### Orchestration

Put all users and services onto the same platform, we can orchestrate them in a seamless way.
