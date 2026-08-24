---
'@thewfa/api-client': patch
---

Fixed array query parameters (e.g. `id`, `teamId`, `status`, `role`, `type`, `card`, `position`) being silently dropped by the API. They were serialized as `key[0]=1&key[1]=2`, which the server's query parser treats as literal, unrelated keys rather than an array — the filter was ignored with no error. Arrays are now serialized as repeated keys (`key=1&key=2`), which the server parses correctly.
