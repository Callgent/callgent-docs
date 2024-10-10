# Callgent Entries

Callgents entries are adaptors to collect callgent to external systems or users.

There are three types of entries:

- [Server Entry](./server-entry)
  Responsible for converting requests into the encapsulated target system invocation or user chatting, and retrieving invocation response.
- [Client Entry](./client-entry)
  Responsible for receiving requests into callgent task queue, and responding back to caller when task has any progress.
- [Event Entry](./event-entry)
  Responsible for listening to events from the encapsulated target system or user, and notifying registered event observers on callgent.

## Add a new entry to callgent

When you want to connect your callgent to a new external system / user, you need to integrate them by adding a new entry.  
You can add any number of entries to your callgent.

### choose a callgent

FIXME: list your callgents

### Step 1, choose a type of entry

Client entry to accept tasks from external system, and server entry to send tasks to external system / user.

### Step 2, choose an adaptor to the external system

You can also develop your own adaptor to the external system, if needed.

### Step 3, configure the entry

### Step 4, initialize the entry
