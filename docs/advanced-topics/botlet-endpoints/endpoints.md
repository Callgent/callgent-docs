# Botlet Endpoints

Botlets endpoints are adaptors to collect botlet to external systems or users.

There are three types of endpoints:

- [Server Endpoint](./server-endpoint)
  Responsible for converting task into the encapsulated target system / user invocation, and updating task from invocation result.
- [Client Endpoint](./client-endpoint)
  Responsible for receiving requests into botlet task queue, and responding back to task owner when task has any progress.
- [Event Endpoint](./event-endpoint)
  Responsible for listening to events from the encapsulated target system / user, and notifying registered event observers on botlet.

## Add a new endpoint to botlet

When you want to collect your botlet to a new external system / user, you need to integrate them by adding a new endpoint.  
You can add any number of endpoints to your botlet.

### choose a botlet

FIXME: list your botlets

### Step 1, choose a type of endpoint

Client endpoint to accept tasks from external system, and server endpoint to send tasks to external system / user.

### Step 2, choose an adaptor to the external system

You can also develop your own adaptor to the external system, if needed.

### Step 3, configure the endpoint

### Step 4, initialize the endpoint
