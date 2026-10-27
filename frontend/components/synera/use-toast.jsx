"use client";
import { useCallback, useRef, useState } from "react";
import { normalizeToast } from "./toast-feedback.mjs";
export function useToast() {
  const [queue, setQueue] = useState([]);
  const sequence = useRef(0);
  const notify = useCallback((value) => {
    const item = normalizeToast(value, ++sequence.current);
    if (!item) { setQueue([]); return; }
    setQueue((items) => items.length ? [items[0], ...items.slice(1).slice(-3), item] : [item]);
  }, []);
  const dismiss = useCallback((id) => setQueue((items) => items.filter((item) => item.id !== id)), []);
  return { toast: queue[0] || null, notify, dismiss };
}
