"use client";
import { useId, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { SHIPPING_STRATEGIES } from "./shipping/recommendation/strategies.mjs";
import { rankShippingServices } from "./shipping/recommendation/ranking.mjs";
import { money, displayText, Button, Evidence } from "./ui";

// Built from the user's screenshot, using existing SYNERA primitives and tokens.
// No React Bits Pro source, dependency, license or network install is required.
export default function ShippingRecommendation({ q, selected, onSelect, disabled = false, children, packageContext }) {
  const [strategy, setStrategy] = useState("standard");
  const id = useId();
  const quotes = q.result?.serviceQuotes || q.result?.quotes || [];
  const { ranked, unavailable, dimensions } = useMemo(() => rankShippingServices(quotes, strategy), [q.result, strategy]);
  const chosen = ranked.find((item) => item.quote.id === selected);
  const preview = chosen || ranked[0];
  const strategyInfo = SHIPPING_STRATEGIES.find((item) => item.id === strategy);
  const context = quotes[0] || packageContext;
  const currentStep = chosen ? 2 : 1;
  return <section className="shipping-workspace" aria-labelledby={`${id}-title`}>
    <header className="shipping-workspace__header">
      <div><h2 id={`${id}-title`}>Chọn dịch vụ & đặt giao</h2>
        {context && <p>{context.parcelCount} kiện riêng · {context.weight.toLocaleString("vi-VN")} kg · Kiện đã xác nhận</p>}
      </div>
    </header>
    <ol className="shipping-workspace__steps" aria-label="Các bước chọn dịch vụ">
      {["Chọn ưu tiên", "Chọn dịch vụ", "Xác nhận đặt giao"].map((label, index) => <li key={label} data-state={index < currentStep ? "complete" : index === currentStep ? "current" : "upcoming"} aria-current={index === currentStep ? "step" : undefined}>
        <span aria-hidden="true">{index < currentStep ? <Check size={12} /> : index + 1}</span><span>{label}</span>
      </li>)}
    </ol>
    <div className="shipping-workspace__main">
      <div className="shipping-workspace__options">
        <fieldset className="shipping-strategies" disabled={disabled}>
          <legend>Ưu tiên giao hàng</legend>
          {SHIPPING_STRATEGIES.map((item) => <label key={item.id} className="shipping-strategy" data-selected={strategy === item.id ? "true" : undefined}>
            <input type="radio" name={`${id}-strategy`} value={item.id} checked={strategy === item.id} onChange={() => {
              setStrategy(item.id);
              if (selected && quotes.some((quote) => quote.serviceTier) && !quotes.some((quote) => quote.id === selected && quote.serviceTier === item.id)) onSelect("");
            }} />
            <span><strong>{item.label}{item.recommended && <small>Đề xuất</small>}</strong><span>{item.description}</span></span>
          </label>)}
        </fieldset>
        {q.loading ? <p className="shipping-workspace__message" role="status">Đang kiểm tra loại hàng và vùng giao…</p> : q.error ? <div className="shipping-workspace__message">
          <p className="field-error" role="alert">{displayText(q.error)}</p><Button onClick={q.reload} icon="refresh">Lấy lại báo giá</Button>
        </div> : q.result ? <>
          <div className="shipping-workspace__list-title"><h3>{strategyInfo.label}</h3><span>{ranked.length} phù hợp</span></div>
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{strategyInfo.label}. {ranked.length} dịch vụ phù hợp. {ranked[0] ? `Đề xuất đầu: ${ranked[0].quote.name}.` : ""}</p>
          {!dimensions.includes("speed") && ranked.length > 0 && <p className="shipping-workspace__message">Chưa đủ dữ liệu để so sánh thời gian giao.</p>}
          {!ranked.length && <p className="shipping-workspace__message" role="status">Chưa có dịch vụ đáp ứng điều kiện kiện hàng và vùng giao.</p>}
          <fieldset className="shipping-services" disabled={disabled}>
            <legend className="sr-only">Chọn dịch vụ giao hàng</legend>
            {ranked.map(({ quote, rank, reasons }) => <label key={quote.id} className="shipping-service" data-selected={selected === quote.id ? "true" : undefined}>
              <span className="shipping-service__rank" aria-hidden="true">{rank}</span>
              <span className="shipping-service__body"><strong>{quote.name}{rank === 1 && <small>Đề xuất</small>}</strong>
                <span>{quote.service} · {quote.days}</span><span>{reasons.slice(0, 2).join(" · ")}</span>
              </span>
              <span className="shipping-service__choice"><strong>{money(quote.fee)}</strong><input type="radio" name={`${id}-service`} value={quote.id} aria-label={`Chọn ${quote.name} · ${quote.service}`} checked={selected === quote.id} onChange={() => onSelect(quote.id)} /></span>
            </label>)}
          </fieldset>
          {unavailable.length > 0 && <div className="shipping-unavailable"><h3>Không phù hợp với kiện hàng</h3>{unavailable.map((quote) => <div key={quote.id} aria-disabled="true"><strong>{quote.name}</strong><span>{quote.service} · {quote.days}</span><span>{displayText(quote.reason)}</span></div>)}</div>}
        </> : <p className="shipping-workspace__message">Đang chuẩn bị báo giá.</p>}
      </div>
      <aside className="shipping-preview" aria-label="Tóm tắt lựa chọn giao hàng">
        <div className="shipping-preview__heading"><h3>Đề xuất hiện tại</h3>{chosen && <span>Đã chọn</span>}</div>
        <div className="shipping-preview__surface">
          <div className="shipping-preview__lead"><span>{strategyInfo.label}</span>
            <strong>{preview ? money(preview.quote.fee) : "Chưa có báo giá"}</strong>
            {preview && <span>{preview.quote.name} · {preview.quote.service}</span>}
          </div>
          <dl>
            <div><dt>Dịch vụ</dt><dd>{preview?.quote.name || "Chưa chọn"}</dd></div>
            <div><dt>Thời gian</dt><dd>{preview?.quote.days || "—"}</dd></div>
            <div><dt>Phí vận chuyển</dt><dd>{preview ? money(preview.quote.fee) : "—"}</dd></div>
            {context && <div><dt>Kiện hàng</dt><dd>{context.parcelCount} kiện · {context.weight.toLocaleString("vi-VN")} kg</dd></div>}
          </dl>
          {preview && <div className="shipping-preview__reasons"><h4>Lý do đề xuất</h4><ul>{preview.reasons.slice(0, 2).map((reason) => <li key={reason}>{reason}</li>)}</ul></div>}
          {preview && <details className="shipping-preview__evidence"><summary>Căn cứ báo giá</summary><p>{displayText(preview.quote.source)}</p><p>{displayText(preview.quote.reason)}</p>{preview.quote.evidence && <Evidence e={preview.quote.evidence} />}</details>}
        </div>
        {quotes[0]?.validUntil && <div className="shipping-preview__validity"><span>Hiệu lực đến {new Date(quotes[0].validUntil).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span><button type="button" className="text-link" onClick={q.reload} disabled={disabled}>Lấy lại báo giá</button></div>}
      </aside>
    </div>
    <footer className="shipping-workspace__footer">{children}</footer>
  </section>;
}
