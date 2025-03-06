## demo

Please check the following URL:

[https://ip-test-next.vercel.app/](https://ip-test-next.vercel.app/)

---

## Request

I want to ensure that the correct IP address is obtained when executing fetch from a Server Function.

---

## Why

I understand that the correct IP can be obtained when accessing the site or executing fetch from the client side.

However, when using an IP-based guard for the endpoint, executing from a Server Function results in retrieving an incorrect IP, even though the access should be valid.
As a result, the guard does not function correctly.

Therefore, I want to ensure that the correct IP address is obtained when executing fetch from a Server Function.

Additionally, my app prioritizes executing processes via Server Functions whenever possible. The Next.js API serves as an intermediary API, forwarding requests to external APIs.

For this reason, obtaining the correct IP address at this stage is a must.
