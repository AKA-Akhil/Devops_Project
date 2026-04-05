import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { app } from "../src/server.js";

test("GET /api/health returns Devops project health payload", async (t) => {
  const server = app.listen(0);
  t.after(() => server.close());

  await once(server, "listening");
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;

  const response = await fetch(`http://127.0.0.1:${port}/api/health`);
  assert.equal(response.status, 200);

  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.service, "Devops project server");
});
