"use client";
import { useEffect, useRef, useState } from "react";
import { useDialogMotion } from "./motion";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Users,
  ClipboardList,
  ListChecks,
  Truck,
  ChartNoAxesCombined,
  Settings,
  Search,
  Plus,
  ArrowUpRight,
  ArrowRight,
  ChevronRight,
  ChevronsUpDown,
  ChevronDown,
  Check,
  Clock3,
  CircleAlert,
  ArrowDownToLine,
  RotateCcw,
  X,
  Menu,
  SlidersHorizontal,
  CalendarDays,
  Sparkles,
  Bell,
  HelpCircle,
  ShieldCheck,
  MapPin,
  Phone,
  ExternalLink,
  History,
  Wallet,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
const icons = {
  dashboard: LayoutDashboard,
  products: Package,
  inventory: Boxes,
  customers: Users,
  orders: ClipboardList,
  packing: ListChecks,
  shipping: Truck,
  reports: ChartNoAxesCombined,
  settings: Settings,
  search: Search,
  plus: Plus,
  arrow: ArrowRight,
  up: ArrowUpRight,
  down: ChevronDown,
  check: Check,
  clock: Clock3,
  alert: CircleAlert,
  download: ArrowDownToLine,
  return: RotateCcw,
  close: X,
  menu: Menu,
  filter: SlidersHorizontal,
  calendar: CalendarDays,
  sparkles: Sparkles,
  bell: Bell,
  help: HelpCircle,
  shield: ShieldCheck,
  pin: MapPin,
  phone: Phone,
  external: ExternalLink,
  history: History,
  wallet: Wallet,
  back: ArrowLeft,
  refresh: RefreshCw,
};
function Icon({ name, ...props }) {
  const C = icons[name] || Package;
  return <C size={18} strokeWidth={1.7} aria-hidden="true" {...props} />;
}
const money = (n) => new Intl.NumberFormat("vi-VN").format(n || 0) + " ₫";
const num = (n) => new Intl.NumberFormat("vi-VN").format(n || 0);
const statuses = {
  packing: ["Chờ đóng kiện", "warning"],
  ready: ["Chờ đặt giao", "info"],
  booked: ["Chờ bàn giao", "neutral"],
  verification: ["Cần kiểm tra", "danger"],
  transit: ["Đang giao", "info"],
  delivered: ["Đã giao", "success"],
  returning: ["Đang hoàn", "danger"],
  returned: ["Đã nhận hoàn", "neutral"],
  cancelled: ["Đã hủy", "neutral"],
};
const navGroups = [
  {
    label: "QUẢN LÝ CƠ SỞ",
    items: [
      ["/", "Tổng quan", "dashboard"],
      ["/orders", "Đơn hàng", "orders"],
      ["/packing", "Xử lý đơn hàng", "packing"],
      ["/shipments", "Vận chuyển", "shipping"],
      ["/products", "Hàng hóa", "products"],
      ["/inventory", "Quản lý kho", "inventory"],
      ["/customers", "Khách hàng", "customers", "owner"],
      ["/returns", "Hàng hoàn", "return"],
      ["/finance", "Công nợ & đối soát", "wallet", "owner"],
      ["/reports", "Báo cáo", "reports", "owner"],
    ],
  },
  {
    label: "GỢI Ý SYNERA",
    items: [
      ["/suggestions", "Tổng hợp gợi ý", "sparkles", "owner"],
      ["/repeat", "Nhắc mua lại", "history", "owner"],
      ["/carriers", "Đơn vị vận chuyển", "shipping", "owner"],
    ],
  },
];
const titles = {
  "/": "Tổng quan",
  "/suggestions": "Gợi ý hôm nay",
  "/orders": "Đơn hàng",
  "/packing": "Xử lý đơn hàng",
  "/products": "Hàng hóa",
  "/inventory": "Quản lý kho",
  "/customers": "Khách hàng",
  "/repeat": "Nhắc mua lại",
  "/shipments": "Giao hàng",
  "/carriers": "Đơn vị vận chuyển",
  "/returns": "Hàng hoàn",
  "/finance": "Công nợ & đối soát",
  "/reports": "Báo cáo",
  "/settings": "Thiết lập",
};
function Badge({ status, children, tone = "neutral" }) {
  const s = statuses[status];
  return (
    <span
      className={"badge " + (s ? s[1] : tone)}
      title={
        typeof (children || s?.[0]) === "string"
          ? children || s?.[0]
          : undefined
      }
    >
      <span className="status-dot" />
      <span className="badge-label">{children || s?.[0]}</span>
    </span>
  );
}
function Button({ children, icon, kind = "", type = "button", ...props }) {
  return (
    <button type={type} className={"button " + kind} {...props}>
      {icon && <Icon name={icon} />} {children}
    </button>
  );
}
function LinkButton({ to, children, icon, kind = "" }) {
  return (
    <a className={"button " + kind} href={"#" + to}>
      {icon && <Icon name={icon} />} {children}
    </a>
  );
}
function Panel({ title, meta, action, children, className = "" }) {
  return (
    <section className={"panel " + className}>
      {title && (
        <div className="panel-head">
          <div>
            <h2>{title}</h2>
            {meta && <p className="muted small">{meta}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
function Empty({ title = "Chưa có dữ liệu", text, action }) {
  return (
    <div className="empty">
      <span className="empty-icon">
        <Icon name="products" size={28} />
      </span>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
      {action}
    </div>
  );
}
function Note({ children, tone = "info" }) {
  return (
    <div className={"note " + tone}>
      <Icon name={tone === "warning" ? "alert" : "shield"} />
      <div>{children}</div>
    </div>
  );
}
function Table({
  columns,
  rows,
  keyField = "id",
  empty = "Chưa có dữ liệu phù hợp.",
}) {
  const [sort, setSort] = useState({ key: "", asc: true });
  const sorted = [...rows].sort((a, b) => {
    if (!sort.key) return 0;
    const av = a[sort.key],
      bv = b[sort.key];
    return (
      (typeof av === "number"
        ? av - bv
        : String(av ?? "").localeCompare(String(bv ?? ""), "vi")) *
      (sort.asc ? 1 : -1)
    );
  });
  if (!rows.length) return <Empty text={empty} />;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                aria-sort={
                  sort.key === c.key
                    ? sort.asc
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                {c.sort ? (
                  <button
                    className="sort"
                    onClick={() =>
                      setSort({
                        key: c.key,
                        asc: sort.key === c.key ? !sort.asc : true,
                      })
                    }
                  >
                    {c.label}
                    <ChevronsUpDown size={13} aria-hidden="true" />
                  </button>
                ) : (
                  c.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r, i) => (
            <tr key={r[keyField] ?? i}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  data-label={c.label}
                  className={c.className || ""}
                >
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Modal({ model, onClose, busy }) {
  const ref = useRef(null),
    prior = useRef(null);
  useDialogMotion(ref, Boolean(model));
  useEffect(() => {
    if (model) {
      prior.current = document.activeElement;
      ref.current?.showModal();
    }
    return () => {
      if (ref.current?.open) ref.current.close();
      prior.current?.focus?.();
    };
  }, [model]);
  if (!model) return null;
  return (
    <dialog
      ref={ref}
      aria-labelledby="dialog-title"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-head">
        <div>
          <p className="eyebrow">SYNERA / {model.tag || "THAO TÁC"}</p>
          <h2 id="dialog-title">{model.title}</h2>
        </div>
        <button
          className="icon-button"
          aria-label="Đóng hộp thoại"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <div className="dialog-body">{model.content}</div>
    </dialog>
  );
}
function FormDialog({ fields, submit, label = "Xác nhận", info }) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setBusy(true);
        try {
          await submit(Object.fromEntries(new FormData(e.currentTarget)));
        } catch (err) {
          setError(err.message);
        } finally {
          setBusy(false);
        }
      }}
    >
      {info && <p className="muted form-info">{info}</p>}
      {fields.map((f) => (
        <label className="field" key={f.name}>
          <span>{f.label}</span>
          {f.options ? (
            <select name={f.name} defaultValue={f.value}>
              {f.options.map((o) => (
                <option key={o.value ?? o} value={o.value ?? o}>
                  {o.label ?? o}
                </option>
              ))}
            </select>
          ) : f.type === "textarea" ? (
            <textarea
              name={f.name}
              required={f.required !== false}
              minLength={f.minLength}
              defaultValue={f.value}
            />
          ) : (
            <input
              name={f.name}
              type={f.type || "text"}
              defaultValue={f.value}
              min={f.min}
              max={f.max}
              step={f.step || "1"}
              required={f.required !== false}
              autoFocus={f.autoFocus}
              aria-describedby={f.hint ? f.name + "-hint" : undefined}
            />
          )}{" "}
          {f.hint && <small id={f.name + "-hint"}>{f.hint}</small>}
        </label>
      ))}
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
      <div className="form-actions">
        <Button kind="primary" disabled={busy} type="submit" icon="check">
          {busy ? "Đang lưu…" : label}
        </Button>
      </div>
    </form>
  );
}
function Evidence({ e, compact = false }) {
  if (!e)
    return <span className="muted small">Chưa đủ bằng chứng cùng nhóm</span>;
  return (
    <div className="evidence">
      <strong>
        {Math.round((e.onTime / e.total) * 100)}%{" "}
        <span className="muted normal">đúng hẹn</span>
      </strong>
      <span className="small muted">
        {e.onTime}/{e.total} đơn · gồm {e.overdueOpen} đơn quá hạn chưa kết thúc
      </span>
      <span className="small muted">{e.group}</span>
      <span className="small muted">
        {e.window} · {e.source} · chưa xác minh
      </span>
    </div>
  );
}
function Timeline({ events }) {
  return (
    <ol className="timeline">
      {[...events].reverse().map((e, i) => (
        <li key={i} className={i === 0 ? "current" : ""}>
          <span className="timeline-dot">
            {i === 0 ? (
              <Icon name="shipping" size={15} />
            ) : (
              <Check size={12} aria-hidden="true" />
            )}
          </span>
          <div>
            <strong>{e.label}</strong>
            <p>{e.at}</p>
            <small>{e.source}</small>
            <small>Ghi nhận: {e.receivedAt}</small>
          </div>
        </li>
      ))}
    </ol>
  );
}
function OrderTable({ data, rows = data.orders, compact = false }) {
  const owner = data.role === "owner";
  return (
    <Table
      rows={rows}
      columns={[
        {
          key: "id",
          label: "Đơn hàng",
          sort: true,
          render: (o) => (
            <div>
              <a className="text-link strong" href={"#/orders/" + o.id}>
                {o.id}
              </a>
              <small className="cell-sub">{o.created}</small>
            </div>
          ),
        },
        {
          key: "customerName",
          label: "Khách hàng",
          sort: true,
          render: (o) => (
            <div className="cell-name" title={o.customerName}>
              <strong>{o.customerName}</strong>
              <small className="cell-sub">{o.zone}</small>
            </div>
          ),
        },
        ...(!compact
          ? [
              {
                key: "parcels",
                label: "Số kiện",
                render: (o) => <span>{o.parcels.length} kiện</span>,
              },
            ]
          : []),
        ...(owner
          ? [
              {
                key: "total",
                label: "Tiền hàng",
                sort: true,
                className: "number",
                render: (o) => money(o.total),
              },
            ]
          : []),
        {
          key: "status",
          label: "Trạng thái",
          sort: true,
          render: (o) => <Badge status={o.status} />,
        },
        {
          key: "action",
          label: "Xử lý",
          render: (o) => (
            <a className="row-action" href={"#/orders/" + o.id}>
              {o.status === "packing"
                ? "Đóng kiện"
                : o.status === "ready"
                  ? "Chọn giao"
                  : "Chi tiết"}
              <ChevronRight size={14} aria-hidden="true" />
            </a>
          ),
        },
      ]}
    />
  );
}

function Forbidden() {
  return (
    <Empty
      title="Chức năng dành cho chủ cơ sở"
      text="Vai trò kho chỉ truy cập dữ liệu phục vụ chuẩn bị và giao nhận hàng."
      action={<LinkButton to="/">Về tổng quan</LinkButton>}
    />
  );
}
function PageHead({ eyebrow, title, description, children }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      <div className="heading-actions">{children}</div>
    </div>
  );
}

export {
  Icon,
  money,
  num,
  statuses,
  navGroups,
  titles,
  Badge,
  Button,
  LinkButton,
  Panel,
  Empty,
  Note,
  Table,
  Modal,
  FormDialog,
  Evidence,
  Timeline,
  OrderTable,
  Forbidden,
  PageHead,
};
