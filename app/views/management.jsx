"use client";
import { useEffect, useState } from "react";
import { Boxes, ArrowRight, X, ShieldCheck } from "lucide-react";
import {
  money,
  displayText,
  statuses,
  Badge,
  Button,
  Panel,
  Empty,
  Note,
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
      <Note tone="warning">
        Tỷ lệ không đại diện toàn hãng: chỉ áp dụng nhóm hàng, dịch vụ, cặp vùng
        và thời kỳ đã nêu. Mẫu gồm các đơn quá hạn chưa kết thúc. Dữ liệu nhập
        tay chưa được xác minh.
      </Note>
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
              render: (o) => <Badge status={o.status} />,
            },
            {
              key: "action",
              label: "Nhận thực tế",
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
      <Note tone="warning">
        Nhận hoàn không tự hoàn tiền hay xóa công nợ. Các giao dịch tài chính
        phải được đối soát riêng.
      </Note>
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
      <div className="two-column">
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
                    <strong>{count}</strong>
                  </div>
                )
              );
            })}
          </div>
        </Panel>
        <Panel
          title="Giao đúng hẹn theo nhóm"

        >
          <div className="panel-body">

            <Evidence e={data.carriers[0].evidence} />

          </div>
        </Panel>
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
        <Panel title="Vai trò">
          <div className="panel-body">
            <label className="field">
              <span>Vai trò hiện tại</span>
              <select aria-label="Chuyển vai trò" value={data.role} disabled={ctx.busy}
                onChange={(e) => ctx.run("role", { role: e.target.value }, "Đã chuyển vai trò")}>
                <option value="owner">Chủ cơ sở</option>
                <option value="warehouse">Nhân viên kho</option>
              </select>
            </label>
          </div>
        </Panel>
        <Panel title="Cơ sở">
          <dl className="settings-list">
            <div>
              <dt>Tên không gian</dt>
              <dd>Cơ sở Tân Bình</dd>
            </div>

          </dl>
        </Panel>
        <Panel title="Phân quyền kho" >
          <div className="panel-body">
            <div className="permission-row">
              <div>
                <strong>Chọn và đặt giao</strong>
                <p className="muted small">
                  Không cấp quyền tài chính hoặc duyệt điều chỉnh kho.
                </p>
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

        <Panel title="Đặt lại dữ liệu">
          <div className="panel-body">
            <p className="muted">
              Đặt lại sẽ xóa các thay đổi trong không gian hiện tại và khôi phục dữ liệu ban đầu.
            </p>
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
        <a className="brand" href="#/">
          <span className="brand-symbol">
            <Boxes size={22} />
          </span>
          <span>
            synera<span className="brand-period">.</span>
          </span>
        </a>

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
