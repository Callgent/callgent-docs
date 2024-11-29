---
sidebar_position: 3
description: Discover the innovative principles behind Callgent's one-click webapp generation. This comprehensive guide explores the AI agent's prompt engineering methods, built-in API auto-integration, and optimized workflow for seamless Vue.js development. Perfect for developers seeking automated web development solutions.
keywords: [Callgent, web app generator, Generative UI, Prompt Engineering, Automated Web Development, SaaS Integration]
tags: [Developers, AI Agent, Prompt Engineering]
---

# Webpage Generator

> If you want to try a hands-on example, please see [here](/blog/webpage-client-entry-to-generate-webapp-nocode)

This article delves into the technical aspects of building an AI agent, specifically focusing on the prompt engineering principles and methods behind a Callgent entry that automatically generates a fully functional webapp. The key differentiator of this webapp generator, compared to other excellent products like [v0.dev](https://v0.dev), [bolt.new](https://bolt.new), is its **built-in API auto-integration**, enabling one-click generation of a ready-to-use webapp.

## Introduction to Callgent

Before we go into the details, let's briefly introduce Callgent. In essence, Callgent allows you to quickly build an APP by receiving user requests through several predefined client entries and converting them into server entry calls via an AI call agent.

* **Server Entries**: Easily integrate the rich services of the SaaS world, as all SaaS platforms provide powerful APIs.  
  Most importantly, you don't need any programming skills or the ability to decipher complex API documentation!
* **Client Entries**: Seamlessly connect your APP with users.  
  Today, we'll focus on the webpage client entry, which is one of the most important client entry.

## Webapp Generator

As one of Callgent's client entries, the webapp generator stands out from other web generators like v0.dev, bolt.new due to its built-in API auto-integration, enabling one-click generation of a ready-to-use webapp. Let's go into its generation process.

### Generation Process

The generation process of the webapp agent follows best practices, similar to how humans complete tasks. It adheres to an optimized workflow and corresponding prompts as listed below:

1. genVue1Route
2. genVue2Components
3. genVue3Component
4. genVue4Store
5. genVue5View

 Specific prompts can be found [here](https://github.com/Callgent/callgent-api/blob/main/prisma/seed.ts).

#### genVue1Route

This step takes a user's requirement description and the current list of API endpoints from all Callgent server entries as input. Based on this information, the agent generates a Vue router, defining global page views.

#### genVue2Components

This step iterates through the page views generated in the previous step, defining several Vue components and their associated API endpoints.

#### genVue3Component

This step iterates through all the Vue components generated in the previous step, generating their implementation code and declaring the stores they reference, along with their state/actions/getters.

#### genVue4Store

This step iterates through all store declarations, combining them with the corresponding API endpoints referenced by the components to generate the implementation code for each store.

#### genVue5View

Finally, this step iterates through all page views, generating the complete Vue view code.

### Explanation of Principles

The task of generating a webapp based on given requirements and provided API services follows best practices and an optimized workflow. The task is broken down into subtasks, adhering to the following core principles:

* Subtasks are independent and can be implemented in parallel.
* Subtask inputs are strictly defined to avoid insufficient or redundant information.
* Subtask outputs are strictly defined in JSON format, with automatic format and logic validation. Refer to the `template` method [here](https://github.com/Callgent/callgent-api/blob/main/src/agents/llm.service.ts).

Specifically, for webpage generation, the process starts with the router, generating global page views. Each view is then treated as an independent subtask, defining its components (note that views may share components). Each component is further broken down to generate its implementation code, defining its store and associated API endpoints. Finally, the store implementations and endpoint calls are integrated to generate the complete Vue view code.
