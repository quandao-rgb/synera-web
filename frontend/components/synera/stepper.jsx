"use client";
import { Children, isValidElement } from "react";
import { Check, CircleAlert, Minus } from "lucide-react";

// Adapted from the supplied React Bits Stepper (JavaScript + CSS): Step slots,
// controlled selection, numbered/check indicators and horizontal/vertical rails.
// SYNERA owns every state. No internal progression, Next/Back or status writes.
export function Step({ children }) {
  return children ? <div className="synera-stepper__content">{children}</div> : null;
}

const stateLabels = {
  complete: "Đã xong", current: "Hiện tại", upcoming: "Chưa đến",
  blocked: "Cần kiểm tra", stopped: "Đã dừng",
};

export default function Stepper({ children, step, orientation = "horizontal", label, compact = false }) {
  const steps = Children.toArray(children).filter((entry) => isValidElement(entry) && entry.type === Step);
  if (!steps.length) return null;
  return (
    <ol className={`synera-stepper synera-stepper--${orientation}${compact ? " synera-stepper--compact" : ""}`} aria-label={label}>
      {steps.map((entry, index) => {
        const status = entry.props.status || (index + 1 < step ? "complete" : index + 1 === step ? "current" : "upcoming");
        const current = status === "current" || status === "blocked";
        return (
          <li key={entry.key ?? index} className="synera-stepper__item" data-status={status} data-tone={entry.props.tone} aria-current={current ? "step" : undefined}>
            <span className="synera-stepper__badge" aria-hidden="true">
              {status === "complete" ? <Check size={13} /> : status === "blocked" ? <CircleAlert size={14} /> : status === "stopped" ? <Minus size={13} /> : index + 1}
            </span>
            <div className="synera-stepper__body">
              <span className="synera-stepper__title">{entry.props.title}</span>
              <span className="synera-stepper__state">{stateLabels[status]}</span>
              {entry.props.description && <p className="synera-stepper__description">{entry.props.description}</p>}
              {entry}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
