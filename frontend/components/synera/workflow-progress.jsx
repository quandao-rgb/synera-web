"use client";
import Stepper, { Step } from "./stepper";
import { orderProcessingSteps, shipmentSteps, returnSteps } from "./workflow-steps.mjs";
import { displayText } from "./ui";

function Progress({ steps, label, orientation = "horizontal", compact = false }) {
  if (!steps.length) return null;
  const current = steps.findIndex((item) => ["current", "blocked"].includes(item.status));
  return (
    <Stepper label={label} step={current < 0 ? steps.length + 1 : current + 1} orientation={orientation} compact={compact}>
      {steps.map(({ id, title, status, tone, description, event }) => (
        <Step key={id} title={title} status={status} tone={tone} description={description}>
          {event && <div className="workflow-event-meta">
            {event.at && <span>{event.at}</span>}
            {orientation === "vertical" && !compact && event.source && <span>{displayText(event.source)}</span>}
            {orientation === "vertical" && !compact && event.receivedAt && <span>Ghi nhận: {event.receivedAt}</span>}
          </div>}
        </Step>
      ))}
    </Stepper>
  );
}

export function OrderProcessingProgress({ order }) {
  return <Progress steps={orderProcessingSteps(order)} label="Các bước xử lý đơn hàng" />;
}
export function ShipmentProgress({ order }) {
  return <Progress steps={shipmentSteps(order)} label="Tiến độ giao hàng" orientation="vertical" />;
}
export function ReturnProgress({ order }) {
  return <Progress steps={returnSteps(order)} label={`Tiến độ hàng hoàn ${order.id}`} orientation="vertical" compact />;
}
