---
sidebar_position: 2
keywords: [组合式Callgent, 复杂调用请求, 嵌套Callgent, Callgent编排]
description: 了解如何创建和管理组合式Callgent。发现如何处理复杂调用请求，利用嵌套Callgent和Map/Reduce操作。通过单一调用端点和高效的Callgent编排简化您的调用流程。
---

# Group of Callgents

多个callgents可以自然地组合起来，形成一个新的组合式callgent，共同处理一个复杂的调用请求。

## 创建一个Group Callgent

类比一下普通callgent，其内部会维护一个function entries列表，从而使得每个请求可以自动映射到一个function entry上，调用并返回结果。

同理，创建一个group callgent，其内部会维护一个callgents列表，从而使得每个请求可以自动映射到一个callgent entry上，调用并返回结果。

:::tip
callgent内部的entry有2个类型：function entry和callgent entry。两种entries可以混合一起。

具有callgent entry的的callgent，我们通常称之为group callgent。
:::

## Group Callgent的调用流程

当请求到达group callgent时，group callgent会根据请求中的语义信息，自动选择一个callgent entry，并调用该callgent entry。

callgent entry可以是普通的callgent，也可以是另一个group callgent。如果callgent entry是另一个group callgent，那么该group callgent会递归地处理请求，直到请求被处理完毕。

:::tip
group callgent可以嵌套调用，从而形成一个调用树。调用树中的每个节点都是一个callgent，每个节点都可以调用其他节点。
:::

## Multiple Internal Invocations

Callgent会自动将单个请求，映射到一个entry上处理并拿到响应结果，基于原始的请求，Callgent会决定是否返回响应给调用者，还是继续调用下一个entry；如此循环，直至最终返回结果给调用者。

### Request with Collection Data

如果请求中包含集合数据，那么callgent可能会根据需求，自动将集合做map/reduce，并映射到entry调用上。

## Group Callgent的优势

Group Callgent在保持单一调用端点的前提下，可以使得多个callgent协同工作，从而处理复杂的调用请求。

:::info
Group Callgent使得你只需与单个callgent交互，就可以调用多个callgent，从而简化了调用流程。
:::

:::tip
如果你希望自行决定每个任务希望由哪些callgent处理，也就是说你自行编排多个Callgents，则你也可以不依赖Group Callgent。
:::
