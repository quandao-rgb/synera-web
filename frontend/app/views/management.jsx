"use client";
import SyneraLogo from "../../components/brand/SyneraLogo";
import { AccountDetails, CarrierLogo, WorkspacePhoto } from "../../components/synera/visual-assets";
import { useEffect, useState } from "react";
import GlideSelect from "../../components/synera/glide-select";
import { ReturnProgress } from "../../components/synera/workflow-progress";
import { CountValue, SpotlightSurface } from "../../components/synera/operational-elements";
import { Boxes, ArrowRight, X, ShieldCheck } from "lucide-react";
import {
  money,
  displayText,
  statuses,
  Badge,
  Button,
  Panel,
  Empty,
  Table,
  Evidence,
  Timeline,
  OrderTable,
  PageHead,
} from "../../components/synera/ui";
function Shipments(ctx) {
  const rows = ctx.data.orders.filter((o) =>
    ["booked", "transit", "verification", "delivered"].includes(o.status),
  );
  return (
    <>
      <PageHead

        title="Giao hàng"

      />
      <Panel title="Các đơn giao">
        <OrderTable data={ctx.data} rows={rows} />
      </Panel>

    </>
  );
}

function Carriers({ data }) {
  return (
    <>
      <PageHead

        title="Đơn vị vận chuyển"

      />
      <div className="carrier-grid">
        {data.carriers.map((c) => (
          <Panel key={c.id}>
            <div className="panel-body">
              <div className="carrier-title">
                <CarrierLogo name={c.name} />
                <div>
                  <h2>{c.name}</h2>
                  <p className="muted">
                    {c.service} · {c.days}
                  </p>
                </div>
              </div>
              <Badge tone={c.liquid ? "success" : "neutral"}>
                {c.liquid
                  ? "Nhận chất lỏng"
                  : "Chưa nhận chất lỏng"}
              </Badge>
              <hr />
              <Evidence e={c.evidence} />
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}

function Returns(ctx) {
  const { data, form } = ctx;
  const rows = data.orders.filter((o) =>
    ["returning", "returned"].includes(o.status),
  );
  return (
    <>
      <PageHead

        title="Hàng hoàn"

      />
      <Panel>
        <Table
          rows={rows}
          columns={[
            {
              key: "id",
              label: "Đơn hàng",
              render: (o) => (
                <a className="text-link" href={"#/orders/" + o.id}>
                  {o.id}
                </a>
              ),
            },
            { key: "customerName", label: "Khách hàng" },
            {
              key: "parcels",
              label: "Số kiện",
              render: (o) => o.parcels.length,
            },
            {
              key: "status",
              label: "Trạng thái",
              width: 250,
              render: (o) => <div className="return-progress-cell"><Badge status={o.status} /><ReturnProgress order={o} /></div>,
            },
            {
              key: "action",
              label: "Nhận thực tế",
              width: 164,
              render: (o) =>
                o.status === "returning" && data.role === "owner" ? (
                  <button
                    className="text-link"
                    onClick={() =>
                      form(
                        "Nhận và kiểm tra hàng hoàn",
                        [
                          {
                            name: "condition",
                            label: "Kết quả kiểm tra toàn bộ lần hoàn",
                            options: [
                              {
                                value: "good",
                                label: "Hàng tốt · tăng tồn khả dụng",
                              },
                              {
                                value: "quarantine",
                                label: "Cần kiểm tra thêm · cách ly",
                              },
                            ],
                          },
                        ],
                        "receive-return",
                        { id: o.id },
                        "Chỉ xác nhận sau khi đã nhận và kiểm tra toàn bộ hàng hoàn.",
                      )
                    }
                  >
                    Ghi nhận đã nhận
                  </button>
                ) : (
                  <span className="muted">
                    {o.status === "returned"
                      ? "Đã ghi nhận"
                      : "Chờ chủ cơ sở ghi nhận"}
                  </span>
                ),
            },
          ]}
        />
      </Panel>
    </>
  );
}

function Finance({ data }) {
  const debt = data.customers.reduce((s, c) => s + c.debt, 0),
    holding = data.orders.reduce((s, o) => s + o.finance.carrierHolding, 0),
    received = data.orders.reduce((s, o) => s + o.finance.received, 0);
  return (
    <>
      <PageHead

        title="Công nợ & đối soát"

      />
      <div className="mini-metrics three">
        {[
          ["Phải thu tiền hàng", money(debt)],
          ["COD hãng đang giữ", money(holding)],
          ["Đã về cơ sở", money(received)],
        ].map(([k, v]) => (
          <div key={k}>
            <span>{k}</span>
            <strong>{v}</strong>
          </div>
        ))}
      </div>
      <Panel
        title="Công nợ tiền hàng"

      >
        <Table
          rows={data.customers.filter((c) => c.debt > 0)}
          columns={[
            { key: "name", label: "Khách hàng", sort: true },
            { key: "contact", label: "Người liên hệ" },
            {
              key: "debt",
              label: "Phải thu",
              sort: true,
              render: (c) => money(c.debt),
            },
            {
              key: "source",
              label: "Nguồn",
              render: () => (
                <span className="muted">Chưa đối soát</span>
              ),
            },
          ]}
        />
      </Panel>

    </>
  );
}

function Reports({ data }) {
  return (
    <>
      <PageHead

        title="Báo cáo vận hành"

      />
      <div className="reports-layout">
        <Panel
          title="Trạng thái đơn hàng"
          meta={`${data.orders.length} đơn hàng`}
        >
          <div className="status-chart">
            {Object.entries(statuses).map(([key, [label, tone]]) => {
              const count = data.orders.filter((o) => o.status === key).length;
              return (
                count > 0 && (
                  <div className="bar-row" key={key}>
                    <span>{label}</span>
                    <div className="bar-track">
                      <span
                        className={"bar " + tone}
                        style={{
                          width: (count / data.orders.length) * 100 + "%",
                        }}
                      />
                    </div>
                    <strong><CountValue value={count}/></strong>
                  </div>
                )
              );
            })}
          </div>
        </Panel>
        <div className="reports-context">
          <SpotlightSurface className="panel report-evidence"><div className="panel-head"><h2>Giao đúng hẹn theo nhóm</h2></div><div className="panel-body"><Evidence e={data.carriers[0].evidence}/></div></SpotlightSurface>
          <figure className="report-photo"><img src="/assets/photos/workspace-tan-binh.png" alt="Kho hàng do chủ cơ sở cung cấp" width="1672" height="941" loading="lazy"/><figcaption>Kho & giao nhận</figcaption></figure>
        </div>
      </div>
      <Panel
        title="Nhật ký thao tác gần đây"

        className="spaced"
      >
        <Table
          rows={data.audit}
          columns={[
            { key: "at", label: "Thời điểm" },
            { key: "actor", label: "Người thao tác", render: (row) => displayText(row.actor) },
            { key: "text", label: "Nội dung", render: (row) => displayText(row.text) },
          ]}
        />
      </Panel>
    </>
  );
}

function SettingsView(ctx) {
  const { data, confirm } = ctx;
  return (
    <>
      <PageHead

        title="Thiết lập"

      />
      <div className="settings-layout">
        <Panel title="Cơ sở Tân Bình" className="workspace-details"><WorkspacePhoto /></Panel>
        <AccountDetails account={ctx.account} owner={data.role === "owner"} />
        <Panel title="Vai trò" className="settings-role">
          <div className="panel-body">
            <label className="field">
              <span>Vai trò hiện tại</span>
              <GlideSelect ariaLabel="Chuyển vai trò" value={data.role} disabled={ctx.busy}
                onChange={(role) => ctx.run("role", { role }, "Đã chuyển vai trò")}
                options={[{ value: "owner", label: "Chủ cơ sở" }, { value: "warehouse", label: "Nhân viên kho" }]} />
            </label>
          </div>
        </Panel>
        <Panel title="Phân quyền kho" className="settings-permissions">
          <div className="panel-body">
            <div className="permission-row">
              <div>
                <strong>Chọn và đặt giao</strong>
              </div>
              <button
                className={"switch " + (data.warehouseShipping ? "on" : "")}
                role="switch"
                aria-checked={data.warehouseShipping}
                aria-label="Quyền chọn và đặt giao của kho"
                disabled={data.role !== "owner" || ctx.busy}
                onClick={() =>
                  confirm(
                    data.warehouseShipping
                      ? "Thu hồi quyền đặt giao"
                      : "Cấp quyền đặt giao",
                    "Thay đổi quyền đặt giao của kho. Dữ liệu tiền hàng, COD và công nợ vẫn không được gửi cho kho.",
                    "permission",
                    { enabled: !data.warehouseShipping },
                    "Xác nhận thay đổi",
                  )
                }
              >
                <span />
              </button>
            </div>

          </div>
        </Panel>

        <Panel title="Đặt lại dữ liệu" className="settings-reset">
          <div className="panel-body">
            <Button
              disabled={data.role !== "owner"}
              icon="return"
              onClick={() =>
                confirm(
                  "Đặt lại dữ liệu",
                  "Các đơn và thay đổi bạn đã tạo trong không gian hiện tại sẽ bị xóa. Bạn có chắc muốn đặt lại dữ liệu?",
                  "reset",
                  {},
                  "Đặt lại dữ liệu",
                )
              }
            >
              Đặt lại dữ liệu
            </Button>
          </div>
        </Panel>
      </div>
    </>
  );
}

function Tracking({ token }) {
  const [data, setData] = useState(null),
    [error, setError] = useState(""),
    [reload, setReload] = useState(0);
  useEffect(() => {
    let active = true;
    setData(null);
    fetch("/api/demo?tracking=" + encodeURIComponent(token), {
      cache: "no-store",
    })
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw Error(j.error);
        if (active) {
          setData(j);
          setError("");
        }
      })
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [token, reload]);
  return (
    <div className="tracking-page">
      <header>
        <a className="brand" href="#/" aria-label="SYNERA — Tổng quan"><SyneraLogo decorative /></a>

      </header>
      <main>

        <h1>Hành trình đơn hàng</h1>

        {error ? (
          <Empty
            title="Không mở được hành trình"
            text={displayText(error)}
            action={
              <Button onClick={() => setReload((n) => n + 1)}>Thử lại</Button>
            }
          />
        ) : !data ? (
          <div
            className="skeleton content"
            role="status"
            aria-label="Đang tải hành trình"
          />
        ) : (
          <>
            <Panel>
              <div className="tracking-order">
                <div>
                  <span className="muted small">MÃ ĐƠN HÀNG</span>
                  <h2>{data.id}</h2>
                </div>
                <Badge status={data.status} />
              </div>
              <div className="tracking-recipient">
                <div>
                  <small>Người nhận</small>
                  <strong>{data.recipient}</strong>
                  <span>{data.phone}</span>
                </div>
                <div>
                  <small>Vùng giao</small>
                  <strong>{data.destination}</strong>
                  <span>{data.parcelCount} kiện</span>
                </div>
              </div>
              <Timeline events={data.events} />
            </Panel>
            <p className="tracking-source">
              <ShieldCheck size={16} /> {data.carrier}
            </p>
          </>
        )}
        <a className="back-link" href="#/">
          Về tổng quan <ArrowRight size={14} />
        </a>
      </main>

    </div>
  );
}

export {
  Shipments,
  Carriers,
  Returns,
  Finance,
  Reports,
  SettingsView,
  Tracking,
};
