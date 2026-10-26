"use client";
import { useEffect, useState } from "react";
import GlideSelect from "../../components/synera/glide-select";
import ShippingRecommendation from "../../components/synera/shipping-recommendation";
import { OrderProcessingProgress, ShipmentProgress } from "../../components/synera/workflow-progress";
import { Package, Check, CircleAlert, X, ShieldCheck, MapPin, Phone, Trash2, ArrowLeft } from "lucide-react";
import {
  Icon,
  money,
  displayText,
  Badge,
  Button,
  LinkButton,
  Panel,
  Empty,
  Note,
  Table,
  Evidence,
  Timeline,
  PageHead,
} from "../../components/synera/ui";
function useQuotes(send, key, payload, enabled = true) {
  const [result, setResult] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setResult(null);
    setError("");
    if (!enabled) return;
    setLoading(true);
    const t = setTimeout(
      () =>
        send("quote", payload)
          .then((j) => {
            if (active) {
              setResult({ ...j, quotedAt: Date.now() });
              setLoading(false);
            }
          })
          .catch((e) => {
            if (active) {
              setError(e.message);
              setLoading(false);
            }
          }),
      280,
    );
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [key, revision, enabled]);
  return { result, error, loading, reload: () => setRevision((n) => n + 1) };
}

function QuoteList({ q, selected, onSelect, preliminary = false }) {
  return (
    <>
      {q.loading ? (
        <div className="quote-loading" role="status">
          <div className="skeleton" />
          <p>Đang kiểm tra loại hàng và vùng giao…</p>
        </div>
      ) : q.error ? (
        <div className="empty">
          <p role="alert" className="field-error">
            {displayText(q.error)}
          </p>
          <Button onClick={q.reload} icon="refresh">
            Lấy lại gợi ý
          </Button>
        </div>
      ) : q.result ? (
        <>
          <div className="quote-summary">
            <span>
              <Icon name="products" size={16} />
              {q.result.quotes[0]?.parcelCount} kiện riêng
            </span>
            <span>{q.result.quotes[0]?.weight} kg</span>
            <Badge tone={preliminary ? "warning" : "success"}>
              {preliminary ? "Giá sơ bộ" : "Kiện đã xác nhận"}
            </Badge>
          </div>
          <div className="quote-list">
            {q.result.quotes.map((c, i) => (
              <div
                key={c.id}
                className={
                  "quote " +
                  (!c.eligible ? "unavailable " : "") +
                  (selected === c.id ? "chosen" : "")
                }
              >
                <div className="quote-header">

                  <div className="grow">
                    <h3>{c.name}</h3>
                    <small>
                      {c.service} · {c.days}
                    </small>
                  </div>
                  {c.eligible ? (
                    <strong>{money(c.fee)}</strong>
                  ) : (
                    <Badge tone="neutral">Không phù hợp</Badge>
                  )}
                </div>
                <p className="quote-reason">
                  {c.eligible ? <Check size={14} /> : <CircleAlert size={14} />}{" "}
                  {displayText(c.reason)}
                </p>
                {c.eligible && (
                  <>
                    <div className="quote-evidence">
                      <Evidence e={c.evidence} />
                    </div>
                    {onSelect && (
                      <Button
                        kind={selected === c.id ? "primary" : "full"}
                        icon={selected === c.id ? "check" : "plus"}
                        onClick={() => onSelect(c.id)}
                      >
                        {selected === c.id ? "Đang chọn" : "Chọn dịch vụ này"}
                      </Button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <p className="quote-source">
            Hiệu lực đến{" "}
            {new Date(q.result.quotes[0]?.validUntil).toLocaleTimeString(
              "vi-VN",
              { hour: "2-digit", minute: "2-digit" },
            )}
            . Chưa xác minh đối tác.
            <button className="text-link" type="button" onClick={q.reload}>
              Lấy lại báo giá
            </button>
          </p>
        </>
      ) : (
        <Empty
          title="Gợi ý sẽ hiện tại đây"
          text="Chọn khách, mặt hàng và số lượng để xem ngay kiện dự kiến và dịch vụ phù hợp."
        />
      )}
    </>
  );
}

function OrderForm(ctx) {
  const { data, send, mutate } = ctx,
    [customerId, setCustomer] = useState(""),
    [lines, setLines] = useState([{ productId: "SP01", qty: 1 }]),
    [error, setError] = useState(""),
    [submitting, setSubmitting] = useState(false),
    [cod, setCod] = useState("");
  const total = lines.reduce(
    (s, l) =>
      s + (data.products.find((p) => p.id === l.productId)?.price || 0) * l.qty,
    0,
  );
  const c = data.customers.find((c) => c.id === customerId),
    key = JSON.stringify({ customerId, lines, version: data.version }),
    q = useQuotes(
      send,
      key,
      { customerId, lines },
      !!customerId && lines.length > 0 && lines.every((l) => l.qty > 0),
    );
  const update = (i, patch) =>
    setLines((ls) => ls.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const next = await mutate(
        "order",
        { customerId, lines, cod: cod === "" ? total : Number(cod) },
        "Đã xác nhận đơn và giữ hàng",
      );
      location.hash = "/orders/" + next.orders[0].id;
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <a className="back-link" href="#/orders">
        <ArrowLeft size={15} /> Danh sách đơn hàng
      </a>
      <PageHead

        title="Tạo đơn hàng"

      />
      <form className="order-layout" onSubmit={submit}>
        <div className="form-stack">
          <Panel title="Khách hàng & nơi nhận" >
            <div className="panel-body">
              <label className="field">
                <span>
                  Khách hàng <b className="required">*</b>
                </span>
                <GlideSelect required value={customerId} onChange={(next) => setCustomer(next)} ariaLabel="Khách hàng"
                  options={[{ value: "", label: "Chọn khách hàng…" }, ...data.customers.map((c) => ({ value: c.id, label: `${c.name} — ${c.contact}` }))]} />
              </label>
              {c && (
                <div className="recipient">
                  <span className="customer-avatar">
                    {c.contact.split(" ").pop()?.[0]}
                  </span>
                  <div>
                    <strong>
                      {c.contact} · {c.phone}
                    </strong>
                    <p>{c.address}</p>
                    <small>
                      {c.zone} · {c.note || "Chưa có lưu ý nhận hàng"}
                    </small>
                  </div>
                </div>
              )}
            </div>
          </Panel>
          <Panel
            title="Hàng hóa"

          >
            <div className="order-lines">
              {lines.map((l, i) => {
                const p = data.products.find((p) => p.id === l.productId);
                return (
                  <div className="order-line" key={i}>
                    <label className="field grow">
                      <span>Mặt hàng {i + 1}</span>
                      <GlideSelect value={l.productId} onChange={(next) => update(i, { productId: next })} ariaLabel={`Mặt hàng ${i + 1}`}
                        options={data.products.map((p) => ({ value: p.id, label: p.name,
                          disabled: lines.some((v, j) => j !== i && v.productId === p.id),
                        }))} />
                      <small>
                        Khả dụng {p.available} thùng · {money(p.price)} / thùng
                      </small>
                    </label>
                    <label className="field qty-field">
                      <span>Số thùng</span>
                      <input
                        type="number"
                        min="1"
                        max={Math.min(200, p.available)}
                        required
                        value={l.qty}
                        onChange={(e) =>
                          update(i, {
                            qty:
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value),
                          })
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className="icon-button remove-line"
                      aria-label={"Xóa mặt hàng " + (i + 1)}
                      disabled={lines.length === 1}
                      onClick={() =>
                        setLines((ls) => ls.filter((_, j) => j !== i))
                      }
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
              <Button
                type="button"
                icon="plus"
                disabled={lines.length >= data.products.length}
                onClick={() => {
                  const p = data.products.find(
                    (p) => !lines.some((l) => l.productId === p.id),
                  );
                  if (p) setLines((ls) => [...ls, { productId: p.id, qty: 1 }]);
                }}
              >
                Thêm mặt hàng
              </Button>
            </div>
          </Panel>
          <Panel title="Tiền hàng & thu hộ" >
            <div className="panel-body finance-fields">
              <div className="total-display">
                <span>Tổng tiền hàng</span>
                <strong>{money(total)}</strong>
                <small>Chưa gồm phí giao</small>
              </div>
              <label className="field">
                <span>Số tiền COD (₫)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max={total}
                  step="1000"
                  value={cod}
                  placeholder={String(total)}
                  onChange={(e) => setCod(e.target.value)}
                />
                <small>Để trống = tiền hàng. Không hiển thị cho kho.</small>
              </label>
            </div>
          </Panel>
          {error && (
            <p className="field-error error-box" role="alert">
              {displayText(error)}
            </p>
          )}
          <div className="order-submit">
            <p>
              <ShieldCheck size={16} /> Xác nhận chỉ giữ hàng, chưa đặt giao.
            </p>
            <Button
              type="submit"
              kind="primary"
              disabled={submitting || !customerId}
              icon="check"
            >
              {submitting ? "Đang xác nhận…" : "Xác nhận đơn & giữ hàng"}
            </Button>
          </div>
        </div>
        <aside className="quote-panel">
          <Panel
            title="Gợi ý vận chuyển"

          >
            <div className="panel-body">
              <QuoteList q={q} preliminary />
              <Note tone="warning">
                Đây là giá sơ bộ. Kho cần xác nhận từng kiện trước khi lấy giá
                hợp lệ và đặt giao chính thức.
              </Note>
            </div>
          </Panel>
        </aside>
      </form>
    </>
  );
}

function OrderDetail(ctx) {
  const { data, id, send, run, confirm, setModel, mutate } = ctx,
    o = data.orders.find((o) => o.id === id),
    owner = data.role === "owner";
  const canQuote =
    !!o && (owner || data.warehouseShipping) && o.status === "ready";
  const q = useQuotes(
    send,
    JSON.stringify({ id, version: data.version }),
    { orderId: id },
    canQuote,
  );
  const [selected, setSelected] = useState(""),
    [timeout, setTimeoutDemo] = useState(false);
  useEffect(() => setSelected(""), [id, data.version]);
  if (!o)
    return (
      <Empty
        page
        title="Không tìm thấy đơn"
        text="Kiểm tra lại mã đơn hoặc mở danh sách."
        action={<LinkButton to="/orders">Danh sách đơn</LinkButton>}
      />
    );
  const pack = () =>
    confirm(
      "Xác nhận kiện chuẩn",
      `Đã kiểm tra ${o.parcels.length} kiện theo quy cách từng thùng? Thao tác này xác nhận kiện, chưa đặt giao và chưa xuất tồn thực.`,
      "packing",
      { id: o.id },
      "Đã kiểm tra · Xác nhận",
    );
  const selectedQuote = (q.result?.serviceQuotes || q.result?.quotes)?.find((quote) => quote.id === selected && quote.eligible === true);
  const custom = () =>
    setModel({
      title: "Chỉnh kiện khác chuẩn",
      content: (
        <ParcelEditor
          order={o}
          submit={(v) =>
            mutate(
              "packing",
              { id: o.id, ...v },
              "Đã xác nhận kiện thực tế. Báo giá cũ không còn dùng được.",
            )
          }
        />
      ),
    });
  return (
    <>
      <a className="back-link" href="#/orders">
        <ArrowLeft size={15} /> Danh sách đơn hàng
      </a>
      <PageHead

        title={o.id}
        description={`${o.customerName} · ${o.created}`}
      >
        <Badge status={o.status} />
        {owner && ["packing", "ready"].includes(o.status) && (
          <Button
            onClick={() =>
              confirm(
                "Hủy đơn và giải phóng hàng",
                "Thao tác chỉ áp dụng trước đặt giao. Hàng giữ được giải phóng; tồn thực chưa thay đổi.",
                "cancel",
                { id: o.id },
                "Hủy đơn",
              )
            }
          >
            Hủy đơn
          </Button>
        )}
      </PageHead>
      <OrderProcessingProgress order={o} />
      {o.status === "ready" &&
        (canQuote ? (
          <ShippingRecommendation
            key={o.id}
            q={q}
            selected={selected}
            onSelect={setSelected}
            disabled={ctx.busy}
            packageContext={{
              parcelCount: o.parcels.length,
              weight: Math.round(o.parcels.reduce((sum, parcel) => sum + parcel.weight, 0) * 10) / 10,
            }}
          >
            <details className="booking-options">
              <summary>Tùy chọn kiểm tra đặt giao</summary>
              <label className="checkbox-field">
                <input type="checkbox" checked={timeout} onChange={(e) => setTimeoutDemo(e.target.checked)} />
                Kiểm tra trường hợp hết thời gian chờ
              </label>
            </details>
            <Button
              kind="primary"
              icon="shipping"
              disabled={!selectedQuote || q.loading || ctx.busy}
              onClick={() => {
                const chosen = selectedQuote;
                confirm(
                  "Xác nhận đặt giao",
                  `${chosen.name} · ${chosen.service}: ${money(chosen.fee)} theo kiện đã xác nhận. Kho chỉ bàn giao sau khi đặt giao thành công.`,
                  "book",
                  {
                    id: o.id,
                    carrierId: selected,
                    fingerprint: q.result.fingerprint,
                    quotedAt: q.result.quotedAt,
                    simulateTimeout: timeout,
                  },
                  "Đặt giao",
                );
              }}
            >
              Xác nhận đặt giao
            </Button>
          </ShippingRecommendation>
        ) : (
          <Note tone="warning">
            Kiện đã sẵn sàng. Chờ chủ cơ sở hoặc nhân viên được cấp quyền chọn và đặt giao.
          </Note>
        ))}
      <div className="detail-layout">
        <div className="form-stack">
          <Panel
            title="Hàng hóa & phân bổ"
            action={
              <span className="muted small">{o.parcels.length} kiện riêng</span>
            }
          >
            <Table
              rows={o.lines}
              keyField="productId"
              columns={[
                {
                  key: "productId",
                  label: "Mặt hàng",
                  render: (l) => (
                    <div>
                      <strong>
                        {data.products.find((p) => p.id === l.productId)?.name}
                      </strong>
                      <small className="cell-sub">
                        {data.products.find((p) => p.id === l.productId)?.sku}
                      </small>
                    </div>
                  ),
                },
                { key: "qty", label: "Số thùng" },
                {
                  key: "allocation",
                  label: "Phân bổ lần giao",
                  render: (l) => `${l.qty}/${l.qty} thùng`,
                },
                ...(owner
                  ? [
                      {
                        key: "price",
                        label: "Tiền hàng",
                        render: (l) =>
                          money(
                            data.products.find((p) => p.id === l.productId)
                              ?.price * l.qty,
                          ),
                      },
                    ]
                  : []),
              ]}
            />
            <div className="panel-foot">
              <Icon name="inventory" size={15} />
              {o.handedOver
                ? "Đã xuất kho khi bàn giao thực tế."
                : o.status === "cancelled"
                  ? "Đã giải phóng hàng giữ."
                  : "Đã giữ hàng. Tồn thực chưa giảm."}
            </div>
          </Panel>
          <Panel
            title="Kiện hàng"

          >
            <div className="parcel-group">
              {[...new Set(o.parcels.map((p) => p.productId))].map((pid) => {
                const ps = o.parcels.filter((p) => p.productId === pid),
                  p = ps[0];
                return (
                  <div className="parcel-row" key={pid}>
                    <span className="parcel-icon">
                      <Package size={24} />
                    </span>
                    <div>
                      <strong>
                        {ps.length} kiện ·{" "}
                        {data.products.find((p) => p.id === pid)?.name}
                      </strong>
                      <p>
                        {p.length} × {p.width} × {p.height} cm · {p.weight} kg /
                        kiện đầu
                      </p>
                      <small>
                        Khối lượng nhóm:{" "}
                        {Math.round(ps.reduce((s, p) => s + p.weight, 0) * 10) /
                          10}{" "}
                        kg
                      </small>
                    </div>
                    <Badge
                      tone={o.status === "packing" ? "warning" : "success"}
                    >
                      {o.status === "packing" ? "Chờ kiểm tra" : "Đã xác nhận"}
                    </Badge>
                  </div>
                );
              })}
              {o.packingNote && <Note>Khác chuẩn: {o.packingNote}</Note>}
              {["packing", "ready"].includes(o.status) && (
                <div className="parcel-actions">
                  <Button kind="primary" icon="check" onClick={pack}>
                    Xác nhận kiện chuẩn
                  </Button>
                  <Button onClick={custom}>Kiện khác chuẩn</Button>
                </div>
              )}
            </div>
          </Panel>
          {o.status === "packing" && (
            <Note>
              Kiểm tra kiện trước khi xác nhận. Gợi ý sơ bộ khi lên đơn chưa
              phải giá đặt giao.
            </Note>
          )}
          {o.status === "verification" && (
            <Note tone="warning">
              <strong>Kết quả đặt giao chưa rõ.</strong>
              <p>
                Không gửi lại yêu cầu để tránh trùng vận đơn. Chủ cơ sở kiểm tra
                kết quả trước khi xử lý tiếp.
              </p>
              {owner && (
                <Button
                  onClick={() =>
                    run(
                      "verify-booking",
                      { id: o.id },
                      "Đã tìm thấy vận đơn cũ, không tạo thêm",
                    )
                  }
                  icon="search"
                >
                  Kiểm tra kết quả đặt giao
                </Button>
              )}
            </Note>
          )}
          {o.status === "booked" && (
            <Panel title="Sẵn sàng bàn giao">
              <div className="panel-body">
                <p>
                  Xác nhận khi {o.parcels.length} kiện đã được bàn giao cho{" "}
                  {o.carrierName || (o.carrierId ? `Vận chuyển ${o.carrierId}` : "hãng")}.
                </p>
                <Button
                  kind="primary"
                  icon="shipping"
                  onClick={() =>
                    confirm(
                      "Xác nhận đã bàn giao",
                      "Tồn thực sẽ giảm một lần theo số hàng của đơn, đồng thời giải phóng hàng giữ.",
                      "handover",
                      { id: o.id },
                      "Đã bàn giao thực tế",
                    )
                  }
                >
                  Đã bàn giao cho hãng
                </Button>
              </div>
            </Panel>
          )}
          <Panel
            title="Mốc hành trình"

          >
            {["verification", "booked", "transit", "delivered", "returning", "returned"].includes(o.status) ? <>
              <ShipmentProgress order={o} />
              <details className="shipment-event-details">
                <summary>Nhật ký hành trình và nguồn ghi nhận</summary>
                <Timeline events={o.events} />
              </details>
            </> : <Timeline events={o.events} />}
          </Panel>
        </div>
        <aside className="form-stack">
          <Panel title="Thông tin nhận hàng">
            <div className="panel-body recipient-detail">
              <strong>{o.recipient}</strong>
              <a href={"tel:" + o.phone}>
                <Phone size={14} />
                {o.phone}
              </a>
              <p>
                <MapPin size={16} />
                {o.address}
              </p>
              <span className="muted small">{o.zone}</span>
              {o.note && <div className="recipient-note">{o.note}</div>}
            </div>
          </Panel>
          {owner && (
            <>
              <Panel title="Thông tin tài chính">
                <dl className="money-list">
                  <div>
                    <dt>Tiền hàng</dt>
                    <dd>{money(o.total)}</dd>
                  </div>
                  <div>
                    <dt>Thu hộ COD</dt>
                    <dd>{money(o.cod)}</dd>
                  </div>
                  <div>
                    <dt>Giá giao theo kiện</dt>
                    <dd>
                      {o.freight ? money(o.freight.fee) : "Chưa đặt giao"}
                    </dd>
                  </div>
                  <div>
                    <dt>Hãng đang giữ</dt>
                    <dd>{money(o.finance.carrierHolding)}</dd>
                  </div>
                  <div>
                    <dt>Đã về cơ sở</dt>
                    <dd>{money(o.finance.received)}</dd>
                  </div>
                </dl>
                <p className="panel-foot">
                  Giao thành công không đồng nghĩa tiền đã về.
                </p>
              </Panel>
              <Panel title="Trang người nhận">
                <div className="panel-body">

                  {o.trackingRevoked ? (
                    <Badge tone="neutral">Link đã thu hồi</Badge>
                  ) : (
                    <>
                      <LinkButton
                        to={"/track/" + o.trackingToken}
                        icon="external"
                      >
                        Mở trang theo dõi
                      </LinkButton>
                      <button
                        className="text-link danger-link spaced"
                        onClick={() =>
                          confirm(
                            "Thu hồi liên kết theo dõi",
                            "Người có liên kết này sẽ không còn xem được trang theo dõi.",
                            "revoke-tracking",
                            { id: o.id },
                            "Thu hồi liên kết",
                          )
                        }
                      >
                        Thu hồi liên kết
                      </button>
                    </>
                  )}
                </div>
              </Panel>
            </>
          )}
          {!owner && (
            <Note>
              Chế độ kho: chỉ dữ liệu giao nhận cần thiết. Quyền đặt giao{" "}
              {data.warehouseShipping ? "đang được cấp" : "đang tắt"}.
            </Note>
          )}
        </aside>
      </div>
    </>
  );
}

function ParcelEditor({ order, submit }) {
  const [ps, setPs] = useState(order.parcels.map((p) => ({ ...p }))),
    [reason, setReason] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          await submit({ custom: true, parcels: ps, reason });
        } catch (e) {
          setError(e.message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <p className="muted">
        Sửa từng kiện đo thực tế. Báo giá cũ phải được lấy lại; không thay đổi
        số hàng trong bước này.
      </p>
      <div className="parcel-editor">
        {ps.map((p, i) => (
          <fieldset key={i}>
            <legend>
              Kiện {i + 1} · {p.productId}
            </legend>
            <div className="parcel-inputs">
              {[
                ["weight", "kg"],
                ["length", "Dài (cm)"],
                ["width", "Rộng (cm)"],
                ["height", "Cao (cm)"],
              ].map(([k, label]) => (
                <label key={k} className="field">
                  <span>{label}</span>
                  <input
                    type="number"
                    min="0.1"
                    max="500"
                    step="0.1"
                    required
                    value={p[k]}
                    onChange={(e) =>
                      setPs((ls) =>
                        ls.map((v, j) =>
                          i === j ? { ...v, [k]: Number(e.target.value) } : v,
                        ),
                      )
                    }
                  />
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <label className="field">
        <span>Lý do khác chuẩn *</span>
        <textarea
          minLength="5"
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ví dụ: thay vỏ thùng sau kiểm tra…"
        />
      </label>
      {error && (
        <p role="alert" className="field-error">
          {displayText(error)}
        </p>
      )}
      <div className="form-actions">
        <Button type="submit" kind="primary" disabled={busy} icon="check">
          {busy ? "Đang lưu…" : "Xác nhận kiện thực tế"}
        </Button>
      </div>
    </form>
  );
}

export { OrderForm, OrderDetail };
