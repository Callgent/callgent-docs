---
sidebar_position: 2
keywords: [composite callgent, group callgent, Nested Callgents]
description: Learn how to create and manage a Composite Callgent. Discover how to handle complex call requests, utilize nested callgents, and perform map/reduce operations. Simplify your call process with a single call endpoint and efficient callgent orchestration..
---

# Group of Callgents

Multiple callgents can naturally be combined to form a new composite callgent, working together to handle a complex call request.

## Creating a Composite Callgent

Similar to a regular callgent, which maintains a list of `function entries` to automatically map each request to a function entry, call it, and return the result, a composite callgent maintains a list of callgents. This allows each request to be automatically mapped to a `callgent entry`, called, and the result returned.

:::tip
Callgent entries come in two types: `function entries` and `callgent entries`. These two types of entries can be mixed together.

A callgent that contains `callgent entries` is typically referred to as a composite callgent.
:::

## Composite Callgent Invocation Process

When a request reaches a composite callgent, the composite callgent automatically selects a `callgent entry` based on the semantic information in the request and invokes that callgent entry.

The callgent entry can be a regular callgent or another composite callgent. If the `callgent entry` is another composite callgent, that composite callgent will recursively process the request until it is fully handled.

:::tip
Composite callgents can be nested, forming a call tree. Each node in the call tree is a callgent, and each node can call other nodes.
:::

## Multiple Internal Invocations

A callgent automatically maps a single request to an entry for processing and retrieves the response result. Based on the original request, the callgent decides whether to return the response to the caller or continue calling the next entry. This process repeats until the final result is returned to the caller.

### Request with Collection Data

If the request contains collection data, the callgent may automatically perform map/reduce operations on the collection and map it to entry calls as needed.

## Advantages of Composite Callgent

Composite Callgent allows multiple callgents to work together while maintaining a single call endpoint, enabling the handling of complex call requests.

:::info
Composite Callgent allows you to interact with a single callgent to invoke multiple callgents, simplifying the call process.
:::

:::tip
If you prefer to decide which callgents handle each task, i.e., you manually orchestrate multiple callgents, you can choose not to rely on Composite Callgent.
:::
