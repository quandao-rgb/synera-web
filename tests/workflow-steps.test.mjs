import test from "node:test";
import assert from "node:assert/strict";
import { createDemo, act, fingerprint } from "../server/domain.mjs";
import { orderProcessingSteps, shipmentSteps, returnSteps } from "../components/synera/workflow-steps.mjs";
const states = (items) => items.map((item) => item.status);
const order = (s, id = "DH1028") => s.orders.find((o) => o.id === id);

test("Stepper follows packing, booking verification and actual handover without mutating the order", () => {
  let s = createDemo();
  const before = JSON.stringify(order(s));
  assert.deepEqual(states(orderProcessingSteps(order(s))), ["complete", "current", "upcoming", "upcoming"]);
  assert.equal(JSON.stringify(order(s)), before);
  s = act(s, "packing", { id: "DH1028" });
  assert.deepEqual(states(orderProcessingSteps(order(s))), ["complete", "complete", "current", "upcoming"]);
  const o = order(s);
  s = act(s, "book", { id: o.id, carrierId: "A", fingerprint: fingerprint(o.customerId, o.lines, o.parcels), quotedAt: Date.now(), simulateTimeout: true });
  assert.deepEqual(states(orderProcessingSteps(order(s))), ["complete", "complete", "blocked", "upcoming"]);
  assert.deepEqual(states(shipmentSteps(order(s))), ["blocked", "upcoming", "upcoming", "upcoming"]);
  s = act(s, "verify-booking", { id: o.id });
  assert.deepEqual(states(orderProcessingSteps(order(s))), ["complete", "complete", "complete", "current"]);
  s = act(s, "handover", { id: o.id });
  assert.deepEqual(states(orderProcessingSteps(order(s))), ["complete", "complete", "complete", "complete"]);
  assert.deepEqual(states(shipmentSteps(order(s))), ["complete", "complete", "current", "upcoming"]);
});

test("Return branch never implies successful delivery or financial settlement", () => {
  let s = createDemo();
  const returning = order(s, "DH1024");
  assert.deepEqual(states(returnSteps(returning)), ["current", "upcoming"]);
  assert.equal(shipmentSteps(returning).some((item) => item.id === "delivered"), false);
  s = act(s, "receive-return", { id: returning.id, condition: "quarantine" });
  const returned = order(s, returning.id);
  assert.deepEqual(states(returnSteps(returned)), ["complete", "complete"]);
  assert.equal(returnSteps(returned).length, 2);
  const latest = returned.events.at(-1);
  assert.equal(returnSteps(returned)[1].event, latest);
  assert.equal(returnSteps(returned)[1].event.receivedAt, latest.receivedAt);
});

test("All real seed statuses map; missing timestamps and unsupported workflows stay missing", () => {
  const s = createDemo();
  for (const o of s.orders) {
    assert.equal(orderProcessingSteps(o).length, 4);
    for (const item of [...orderProcessingSteps(o), ...shipmentSteps(o), ...returnSteps(o)]) {
      if (item.event) assert.ok(o.events.includes(item.event));
    }
  }
  const delivered = s.orders.find((o) => o.status === "delivered");
  assert.ok(shipmentSteps(delivered).every((item) => item.status === "complete"));
  assert.equal(shipmentSteps({ ...delivered, events: [] }).some((item) => item.event), false);
  assert.deepEqual(orderProcessingSteps({ status: "unknown" }), []);
  assert.deepEqual(returnSteps(order(s)), []);
  assert.deepEqual(shipmentSteps(order(s)), []);
});

test("Cancellation stops pending work and retains only evidenced completed milestones", () => {
  let s = act(createDemo(), "cancel", { id: "DH1028" });
  assert.deepEqual(states(orderProcessingSteps(order(s))), ["complete", "stopped", "stopped", "stopped"]);
  assert.deepEqual(shipmentSteps(order(s)), []);
  s = act(createDemo(), "packing", { id: "DH1028" });
  s = act(s, "cancel", { id: "DH1028" });
  assert.deepEqual(states(orderProcessingSteps(order(s))), ["complete", "complete", "stopped", "stopped"]);
});
