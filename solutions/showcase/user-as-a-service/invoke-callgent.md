---
sidebar_position: 3
title: Invoke Callgent
description: .
keywords: [user as a service]
---
After we created a callgent in this recruit example, we can use email and restapi to invoke it to show how to fullfill all recuit tasks.

In the above callgent, we connect a two client endpoints with it, one is email type client endpoint, another is restapi type client endpoint. First we try to use email to invoke the callgent to show how to fullfill all recuit tasks.

:::info
As we mentioned in the previous section, we have three cases in this recruit example.
1. publish a position
2. apply a position
3. reply the application
:::

## invoke Callgent by Email
### publish a position
1. **Publish a position.** HR user send an email to the callgent email type client endpoint which have a unique email address just like 'callgent-```{uinique-id}```@callgent.com';
2. Callgent will reply to the user with an email indicating whether the request is successful or has failed, and meanwhile the successful email contains a link to the position detail page.
3. **Apply a position.** Applicant user can visit that page via the link. On that position detail page, user can see the position detail and apply for the position. After click the apply button, it calls a email sending service to send an email to the user，in fact it use a 'mailto' protocol on that page.
4. **Reply the application.** After the applicant user apply for the position, the callgent will redirect the application to the HR user. And hr can reply the application by email, then the applicant user will receive the email which is replied by the HR user.

## invoke Callgent by REST API
1. **Publish a position.** HR user send an email to the callgent email type client endpoint which have a unique email address just like 'callgent-```{uinique-id}```@callgent.com';
2. Callgent will reply to the user with an email indicating whether the request is successful or has failed, and meanwhile the successful email contains a link to the position detail page.
3. **Apply a position.** Applicant user can visit that page via the link. On that position detail page, user can see the position detail and apply for the position. After click the apply button, it calls a email sending service to send an email to the user，in fact it use a 'mailto' protocol on that page.
4. **Reply the application.** After the applicant user apply for the position, the callgent will redirect the application to the HR user. And hr can reply the application by email, then the applicant user will receive the email which is replied by the HR user.
