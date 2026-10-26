"use client";
import { useEffect, useRef, useState } from "react";
import {
  Boxes,
  Search,
  ArrowUpRight,
  ChevronRight,
  ChevronsUpDown,
  CircleCheck,
  X,
  Menu,
  Bell,
} from "lucide-react";
import {
  Icon,
  displayText,
  statuses,
  navGroups,
  titles,
  Button,
  LinkButton,
  Empty,
  Note,
  Modal,
  FormDialog,
  Forbidden,
} from "../components/synera/ui";
import { Dashboard } from "./views/dashboard";
import {
  Orders,
  Processing,
  Products,
  Inventory,
  Customers,
  Suggestions,
} from "./views/operations";
import { OrderForm, OrderDetail } from "./views/order-flow";
import {
  Shipments,
  Carriers,
  Returns,
  Finance,
  Reports,
  SettingsView,
  Tracking,
} from "./views/management";
import { MotionShell, useDialogMotion } from "../components/synera/motion";
export default function Interface() {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [route, setRoute] = useState("/"),
    [routeSearch, setRouteSearch] = useState(""),
    [mobile, setMobile] = useState(false),
    [smallScreen, setSmallScreen] = useState(false),
    [navCollapsed, setNavCollapsed] = useState(false),
    [busy, setBusy] = useState(false),
    [model, setModel] = useState(null),
    [toast, setToast] = useState(""),
    [cmd, setCmd] = useState(false);
  const mainRef = useRef(null),
    sidebarRef = useRef(null),
    firstRoute = useRef(true);
  const read = async () => {
    setError("");
    try {
      const r = await fetch("/api/demo", { cache: "no-store" }),
        j = await r.json();
      if (!r.ok) throw Error(j.error);
      setData(j);
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => {
    const change = () => {
      const [next = "/", query = ""] = (location.hash.slice(1) || "/").split(
        "?",
      );
      setRoute(next);
      setRouteSearch(new URLSearchParams(query).get("search") || "");
      setMobile(false);
      if (!next.startsWith("/track/")) read();
    };
    change();
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    setNavCollapsed(localStorage.getItem("synera-nav-collapsed") === "true");
  }, []);
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    mainRef.current?.focus();
  }, [route, routeSearch]);
  useEffect(() => {
    const media = window.matchMedia("(max-width:767px)");
    const update = () => setSmallScreen(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!mobile || !smallScreen) return;
    const prior = document.activeElement,
      sidebar = sidebarRef.current,
      overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sidebar?.querySelector("a,button")?.focus({ preventScroll: true });
    const trap = (e) => {
      if (e.key !== "Tab") return;
      const controls = [
        ...sidebar.querySelectorAll("a[href],button:not(:disabled)"),
      ].filter((el) => el.getClientRects().length);
      const first = controls[0],
        last = controls.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", trap);
      if (sidebar?.contains(document.activeElement))
        prior?.focus?.({ preventScroll: true });
    };
  }, [mobile, smallScreen]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    const key = (e) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(
        document.activeElement?.tagName,
      );
      if (
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") ||
        (!typing && e.key === "/")
      ) {
        e.preventDefault();
        setCmd(true);
      }
      if (e.key === "Escape") setMobile(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const send = async (action, payload = {}) => {
    const r = await fetch("/api/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload, version: data.version }),
    });
    const j = await r.json();
    if (!r.ok) throw Error(j.error);
    return j;
  };
  const mutate = async (action, payload = {}, message = "Đã lưu thay đổi") => {
    setBusy(true);
    try {
      const next = await send(action, payload);
      setData(next);
      setModel(null);
      setToast(message);
      return next;
    } finally {
      setBusy(false);
    }
  };
  const run = async (...args) => {
    try {
      return await mutate(...args);
    } catch (e) {
      setToast(e.message);
    }
  };
  const form = (title, fields, action, payload = {}, info, label) =>
    setModel({
      title,
      content: (
        <FormDialog
          fields={fields}
          info={info}
          label={label}
          submit={(v) => mutate(action, { ...payload, ...v })}
        />
      ),
    });
  const confirm = (title, text, action, payload = {}, label = "Xác nhận") =>
    setModel({
      title,
      content: (
        <FormDialog
          fields={[]}
          info={text}
          label={label}
          submit={() => mutate(action, payload)}
        />
      ),
    });
  const ctx = {
    data,
    busy,
    send,
    mutate,
    run,
    form,
    confirm,
    setModel,
    setToast,
  };
  if (route.startsWith("/track/")) return <Tracking token={route.slice(7)} />;
  const currentTitle = route.startsWith("/orders/new")
    ? "Tạo đơn hàng"
    : route.startsWith("/packing/")
      ? "Xử lý đơn hàng"
      : route.startsWith("/orders/")
        ? "Chi tiết đơn hàng"
        : titles[route] || "Không tìm thấy trang";
  const owner = data?.role === "owner",
    packing = data?.orders.filter((o) => o.status === "packing").length || 0;
  return (
    <MotionShell
      className={"app" + (navCollapsed ? " nav-collapsed" : "")}
      routeKey={route + "?" + routeSearch}
      role={data?.role}
      collapsed={navCollapsed} mobile={mobile}
    >
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Đến nội dung chính
      </a>
      <button
          className={"sidebar-scrim" + (mobile ? " is-open" : "")}
          disabled={!mobile} aria-hidden={!mobile} tabIndex={-1}
          aria-label="Đóng điều hướng"
          onClick={() => setMobile(false)}
        />
      <aside
        id="synera-sidebar"
        ref={sidebarRef}
        inert={smallScreen && !mobile}
        aria-hidden={smallScreen && !mobile}
        className={"sidebar " + (mobile ? "open" : "")}
        aria-label="Điều hướng chính"
      >
        <div className="brand">
          <a className="brand-link" href="#/">
            <span className="brand-symbol">
              <Boxes size={22} strokeWidth={1.5} />
            </span>
            <span>
              SYNERA<span className="brand-period">.</span>
            </span>
          </a>
          <button
            className="mobile-only icon-button"
            aria-label="Đóng menu"
            onClick={(e) => {
              e.preventDefault();
              setMobile(false);
            }}
          >
            <X size={18} />
          </button>
          <button
            className="sidebar-collapse"
            aria-controls="synera-sidebar" aria-expanded={!navCollapsed}
            aria-label={
              navCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"
            }
            title={navCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            onClick={() => {
              setNavCollapsed((v) => {
                localStorage.setItem("synera-nav-collapsed", String(!v));
                return !v;
              });
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <a
          className="workspace"
          href="#/settings"
          title="Cơ sở Tân Bình"
        >
          <span className="workspace-avatar">TB</span>
          <span className="workspace-label">
            <strong>Cơ sở Tân Bình</strong>

          </span>
          <ChevronsUpDown size={14} aria-hidden="true" />
        </a>
        <nav>
          <div className="nav-indicator" aria-hidden="true" />
          {navGroups
            .filter((g) => g.items.some((i) => i[3] !== "owner" || owner))
            .map((g) => (
              <div className="nav-group" key={g.label}>
                <p>{g.label}</p>
                {g.items
                  .filter((i) => i[3] !== "owner" || owner)
                  .map(([path, label, ic]) => (
                    <a
                      key={path}
                      title={label}
                      href={"#" + path}
                      className={
                        (path === "/" ? route === "/" : route.startsWith(path))
                          ? "active"
                          : ""
                      }
                      aria-current={
                        (path === "/" ? route === "/" : route.startsWith(path))
                          ? "page"
                          : undefined
                      }
                    >
                      <Icon name={ic} />
                      <span>{label}</span>
                      {path === "/packing" && packing > 0 && (
                        <b className="nav-count">{packing}</b>
                      )}
                      {path === "/suggestions" && <span className="nav-new" />}
                    </a>
                  ))}
              </div>
            ))}
        </nav>
        <div className="sidebar-bottom">
          <a
            href="#/settings"
            title="Thiết lập"
            className={route === "/settings" ? "active" : ""}
            aria-current={route === "/settings" ? "page" : undefined}
          >
            <Icon name="settings" />
            <span>Thiết lập</span>
          </a>

        </div>
      </aside>
      <div
        className="workspace-main"
        inert={mobile && smallScreen}
        aria-hidden={mobile && smallScreen}
      >
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-only"
              aria-label="Mở menu"
              aria-controls="synera-sidebar" aria-expanded={mobile}
              onClick={() => setMobile(true)}
            >
              <Menu size={20} />
            </button>
            <strong className="mobile-only">{currentTitle}</strong>
          </div>
          <button
            className="header-search"
            onClick={() => setCmd(true)}
            aria-label="Tìm kiếm toàn bộ Synera"
          >
            <Search size={19} aria-hidden="true" />
            <span>Tìm kiếm đơn hàng, khách hàng, hàng hóa</span>
            <kbd>Ctrl K</kbd>
          </button>
          <div className="topbar-actions">

            <button
              className="icon-button"
              title="Việc cần xử lý"
              aria-label="Xem việc cần xử lý"
              onClick={() => {
                location.hash = "/packing";
              }}
            >
              <Bell size={18} />
              {packing > 0 && <span className="notification-dot" />}
            </button>
            <span className="topbar-divider" />
            {data && <a className="account-link" href="#/settings" aria-label={"Thiết lập · " + (owner ? "Chủ cơ sở" : "Nhân viên kho")}>{owner ? "Chủ cơ sở" : "Nhân viên kho"}</a>}
          </div>
        </header>
        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="main-content"
        >
          {!data ? (
            error ? (
              <Empty
                page
                title="Chưa tải được không gian"
                text={displayText(error)}
                action={
                  error.includes("đăng nhập") ? (
                    <a
                      className="button primary"
                      href="/signin-with-chatgpt?return_to=/"
                      target="_top"
                    >
                      Đăng nhập
                    </a>
                  ) : (
                    <Button onClick={read} icon="refresh">
                      Thử lại
                    </Button>
                  )
                }
              />
            ) : (
              <div className="loading" role="status">
                <h1>{currentTitle}</h1>
                <div className="skeleton kpis" />
                <div className="skeleton content" />
                <span>Đang tải không gian vận hành…</span>
              </div>
            )
          ) : (
            <>
              {error && (
                <Note tone="warning">
                  {displayText(error)} <button onClick={read}>Tải lại</button>
                </Note>
              )}
              {route === "/" ? (
                <Dashboard {...ctx} />
              ) : route === "/orders/new" ? (
                owner ? (
                  <OrderForm {...ctx} />
                ) : (
                  <Forbidden />
                )
              ) : route.startsWith("/orders/") ? (
                <OrderDetail {...ctx} id={route.split("/")[2]} />
              ) : route === "/orders" ? (
                <Orders {...ctx} />
              ) : route === "/packing" || route.startsWith("/packing/") ? (
                <Processing
                  {...ctx}
                  key={route}
                  initialStage={route.split("/")[2] || "packing"}
                />
              ) : route === "/products" ? (
                <Products
                  {...ctx}
                  key={"products" + routeSearch}
                  initialSearch={routeSearch}
                />
              ) : route === "/inventory" ? (
                <Inventory {...ctx} />
              ) : route === "/customers" || route === "/repeat" ? (
                owner ? (
                  <Customers
                    {...ctx}
                    key={"customers" + routeSearch + route}
                    initialSearch={routeSearch}
                    repeat={route === "/repeat"}
                  />
                ) : (
                  <Forbidden />
                )
              ) : route === "/suggestions" ? (
                owner ? (
                  <Suggestions {...ctx} />
                ) : (
                  <Forbidden />
                )
              ) : route === "/shipments" ? (
                <Shipments {...ctx} />
              ) : route === "/carriers" ? (
                owner ? (
                  <Carriers {...ctx} />
                ) : (
                  <Forbidden />
                )
              ) : route === "/returns" ? (
                <Returns {...ctx} />
              ) : route === "/finance" ? (
                owner ? (
                  <Finance {...ctx} />
                ) : (
                  <Forbidden />
                )
              ) : route === "/reports" ? (
                owner ? (
                  <Reports {...ctx} />
                ) : (
                  <Forbidden />
                )
              ) : route === "/settings" ? (
                <SettingsView {...ctx} />
              ) : (
                <Empty
                  page
                  title="Không tìm thấy trang"
                  text="Đường dẫn này không thuộc không gian Synera."
                  action={<LinkButton to="/">Về tổng quan</LinkButton>}
                />
              )}

            </>
          )}
        </main>
      </div>
      <div
        className={"toast " + (toast ? "visible" : "")}
        role="status"
        aria-live="polite"
      >
        {toast && (
          <>
            <CircleCheck size={18} aria-hidden="true" />
            {displayText(toast)}
            <button aria-label="Đóng thông báo" onClick={() => setToast("")}>
              <X size={15} />
            </button>
          </>
        )}
      </div>
      <Modal model={model} onClose={() => setModel(null)} />
      {cmd && <CommandMenu data={data} close={() => setCmd(false)} />}
    </MotionShell>
  );
}
function CommandMenu({ data, close }) {
  const [q, setQ] = useState(""),
    [selected, setSelected] = useState(0),
    ref = useRef(null);
  useDialogMotion(ref, true);
  const owner = data?.role === "owner";
  let items = navGroups
    .flatMap((g) => g.items)
    .filter((i) => i[3] !== "owner" || owner)
    .map(([to, label]) => ({ to, label, meta: "Điều hướng" }));
  if (data)
    items = items.concat(
      data.orders.map((o) => ({
        to: "/orders/" + o.id,
        label: o.id + " · " + o.customerName,
        meta: statuses[o.status]?.[0],
      })),
    );
  if (data) {
    items = items.concat(
      data.products.map((p) => ({
        to: "/products?search=" + encodeURIComponent(p.sku),
        label: p.name + " · " + p.sku,
        meta: "Hàng hóa",
      })),
    );
    if (owner)
      items = items.concat(
        data.customers.map((c) => ({
          to: "/customers?search=" + encodeURIComponent(c.name),
          label: c.name + " · " + c.phone,
          meta: "Khách hàng",
        })),
      );
  }
  items = items
    .filter((i) => i.label.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 10);
  useEffect(() => {
    const prior = document.activeElement;
    ref.current?.showModal();
    return () => {
      ref.current?.close();
      prior?.focus?.();
    };
  }, []);
  useEffect(() => setSelected(0), [q]);
  const go = (i) => {
    if (!i) return;
    location.hash = i.to;
    close();
  };
  return (
    <dialog
      className="command-dialog"
      ref={ref}
      aria-label="Tìm nhanh và điều hướng"
      onCancel={close}
    >
      <div className="command-input">
        <Search size={20} />
        <input
          autoFocus
          placeholder="Tìm trang, mã đơn, khách hàng…"
          aria-label="Tìm kiếm nhanh"
          role="combobox"
          aria-expanded="true"
          aria-controls="command-results"
          aria-activedescendant={items.length ? "cmd-" + selected : undefined}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSelected((i) => (i + 1) % Math.max(1, items.length));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelected(
                (i) => (i - 1 + items.length) % Math.max(1, items.length),
              );
            }
            if (e.key === "Enter") {
              e.preventDefault();
              go(items[selected]);
            }
          }}
        />
        <button
          className="icon-button"
          aria-label="Đóng tìm kiếm"
          onClick={close}
        >
          <X size={18} />
        </button>
      </div>
      <div role="listbox" id="command-results" className="command-results">
        {items.length ? (
          items.map((i, n) => (
            <button
              key={i.to}
              id={"cmd-" + n}
              role="option"
              aria-selected={selected === n}
              className={selected === n ? "selected" : ""}
              onClick={() => go(i)}
            >
              <span>{i.label}</span>
              <small>{i.meta}</small>
              <ArrowUpRight size={15} />
            </button>
          ))
        ) : (
          <p className="empty">Không tìm thấy kết quả.</p>
        )}
      </div>
      <div className="command-footer">
        ↑ ↓ để chọn <span>Enter để mở · Esc để đóng</span>
      </div>
    </dialog>
  );
}
