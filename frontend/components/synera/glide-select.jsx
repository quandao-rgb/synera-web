"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Select } from "radix-ui";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

// React Bits GlideSelect pattern on the existing Radix select primitive.
// Radix retains keyboard/typeahead, native form serialization and disabled items;
// only the measured, finite 150 ms highlight and SYNERA presentation are custom.
export default function GlideSelect({ options, value, defaultValue, onChange, name, disabled = false, required = false, ariaLabel, id, describedBy, invalid, className = "" }) {
  const items = options.map((item) => typeof item === "string" ? { value: item, label: item } : item);
  const initial = defaultValue ?? items.find((item) => !item.disabled)?.value ?? "";
  const [inner, setInner] = useState(initial), [open, setOpen] = useState(false), [active, setActive] = useState(null);
  const [container, setContainer] = useState(null), [pill, setPill] = useState(null), [viewportNode, setViewportNode] = useState(null);
  const current = value === undefined ? inner : value;
  const trigger = useRef(null);
  const emptyKey = useId();
  const [validation, setValidation] = useState("");
  const nativeField = useRef(null);
  const internalValue = (actual) => actual === "" ? emptyKey : actual;
  const selected = items.findIndex((item) => item.value === current);
  // Large lists retain the native control; short lists share the gliding menu.
  const native = items.length > 30;
  useEffect(() => { if (current !== "") setValidation(""); }, [current]);
  useEffect(() => { setContainer(trigger.current?.closest("dialog") || document.body); }, []);
  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  useLayoutEffect(() => {
    if (!open || native) { setPill(null); return; }
    const index = active ?? selected;
    const row = viewportNode?.querySelectorAll('[role="option"]')[index];
    if (!row || !row.isConnected) return;
    const measure = () => setPill({ y: row.offsetTop, height: row.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    observer.observe(viewportNode);
    return () => observer.disconnect();
  }, [open, active, selected, native, viewportNode]);
  const changed = (next) => { if (value === undefined) setInner(next); onChange?.(next, items.find((item) => item.value === next)); };
  if (native) return <select className={`glide-select__native ${className}`} id={id} name={name} aria-label={ariaLabel} aria-describedby={describedBy} aria-invalid={invalid} disabled={disabled} required={required} value={current} onChange={(e) => changed(e.target.value)}>
    {items.map((item) => <option key={item.value} value={item.value} disabled={item.disabled}>{item.label}</option>)}
  </select>;
  return <>
    {/* Real option values, required validation, autofill and FormData remain native.
        The empty-option sentinel is private to the presentation primitive only. */}
    <select ref={nativeField} className="glide-select__form-value" name={name} value={current} disabled={disabled} required={required} aria-hidden="true" tabIndex={-1}
      onChange={(e) => changed(e.target.value)} onInvalid={(e) => {
        e.preventDefault(); setValidation(`Vui lòng chọn ${ariaLabel?.toLowerCase() || "một giá trị"}.`);
        trigger.current?.focus({ preventScroll: false });
      }}>
      {items.map((item) => <option key={item.value} value={item.value} disabled={item.disabled}>{item.label}</option>)}
    </select>
    <Select.Root value={internalValue(current)} onValueChange={(next) => changed(next === emptyKey ? "" : next)} disabled={disabled} open={open} onOpenChange={(next) => { setActive(selected >= 0 ? selected : null); setOpen(next); }}>
    <Select.Trigger ref={trigger} id={id} className={`glide-select__trigger ${className}`} aria-label={ariaLabel} aria-required={required || undefined} aria-describedby={validation ? `${emptyKey}-error` : describedBy} aria-invalid={invalid || !!validation || undefined}>
      <Select.Value /><Select.Icon asChild><ChevronDown size={15} aria-hidden="true" /></Select.Icon>
    </Select.Trigger>
    <Select.Portal container={container}>
      <Select.Content className="glide-select__menu" aria-label={ariaLabel} position="popper" sideOffset={5} collisionPadding={12} align="start" onEscapeKeyDown={(event) => event.stopPropagation()}>
        <Select.ScrollUpButton className="glide-select__scroll"><ChevronUp size={14} aria-hidden="true" /></Select.ScrollUpButton>
        <Select.Viewport ref={setViewportNode} className="glide-select__list" data-gliding={pill ? "true" : undefined}>
          <span className="glide-select__pill" aria-hidden="true" style={{ height: pill?.height || 0, transform: `translateY(${pill?.y || 0}px)`, opacity: pill ? 1 : 0 }} />
          {items.map((item, index) => <Select.Item key={item.value} value={internalValue(item.value)} disabled={item.disabled} textValue={String(item.label)} className="glide-select__option" onFocus={() => setActive(index)}>
            <Select.ItemText>{item.label}</Select.ItemText>
            <Select.ItemIndicator className="glide-select__check"><Check size={14} aria-hidden="true" /></Select.ItemIndicator>
          </Select.Item>)}
        </Select.Viewport>
        <Select.ScrollDownButton className="glide-select__scroll"><ChevronDown size={14} aria-hidden="true" /></Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
    </Select.Root>
    {validation && <span id={`${emptyKey}-error`} className="glide-select__error" role="alert">{validation}</span>}
  </>;
}
