"use client";
import { useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import "../dashboard-overview.css";
import { ProductImage } from "../../components/synera/visual-assets";
import {
  Icon,
  num,
  Badge,
  LinkButton,
  Panel,
  Timeline,
  OrderTable,
  PageHead,
  Table,
} from "../../components/synera/ui";

function Dashboard({ data }) {
  const owner = data.role === "owner";
  const [tab, setTab] = useState("pending");
  const pending = data.orders.filter((o) =>
    ["packing", "ready", "booked", "verification"].includes(o.status),
  );
  const low = data.products.filter((p) => p.suggested > 0);
  const repeat =
    data.customers?.filter(
      (c) => c.cycle && c.lastDays >= c.cycle && !c.outcome,
    ) || [];
  const active =
    data.orders.find((o) => o.status === "transit") || data.orders[0];
  const ready = data.orders.filter((o) => o.status === "ready");
  const metrics = owner
    ? [
        {
          label: "Đơn cần xử lý",
          value: pending.length,

          to: "/packing",

        },
        {
          label: "Đơn đang giao",
          value: data.orders.filter((o) => o.status === "transit").length,

          to: "/shipments",

        },
        {
          label: "Mặt hàng cần bổ sung",
          value: low.length,

          to: "/inventory",

        },
        {
          label: "Khách đến kỳ mua lại",
          value: repeat.length,

          to: "/repeat",

        },
      ]
    : [
        {
          label: "Chờ đóng kiện",
          value: data.orders.filter((o) => o.status === "packing").length,

          to: "/packing",

        },
        {
          label: "Chờ bàn giao",
          value: data.orders.filter((o) => o.status === "booked").length,

          to: "/packing",

        },
        {
          label: "Tồn khả dụng",
          value: data.products.reduce((n, p) => n + p.available, 0),

          to: "/inventory",

        },
        {
          label: "Đơn đang hoàn",
          value: data.orders.filter((o) => o.status === "returning").length,

          to: "/returns",

        },
      ];
  const tasks = [
    {
      label: "Đơn chờ đóng kiện",
      count: data.orders.filter((o) => o.status === "packing").length,
      to: "/packing/packing",

    },
    {
      label: "Đơn chờ đặt giao",
      count: ready.length,
      to: "/packing/ready",

    },
    {
      label: "Đơn chờ bàn giao",
      count: data.orders.filter((o) => o.status === "booked").length,
      to: "/packing/booked",

    },
    {
      label: "Đơn cần kiểm tra đặt giao",
      count: data.orders.filter((o) => o.status === "verification").length,
      to: "/packing/verification",

    },
  ];
  return (
    <div className="dashboard-overview">
      <PageHead
        title="Tổng quan"
        description="Đơn hàng, tồn kho và công việc cần xử lý."
      >

        {owner && (
          <LinkButton to="/orders/new" kind="primary" icon="plus">
            Tạo đơn hàng
          </LinkButton>
        )}
      </PageHead>

          <Panel
            title="Tình hình hoạt động"
            className="overview-activity"
            action={
              <span className="period-label">
                {data.orders.length} đơn hàng
              </span>
            }
          >
            <div className="metric-grid">
              {metrics.map((m) => (
                <a key={m.label} href={"#" + m.to} className="metric">
                  <span className="metric-label">
                    {m.label}
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                  <strong className="metric-value">{num(m.value)}</strong>

                </a>
              ))}
            </div>
          </Panel>
      <div className="overview-grid">
        <div className="overview-main">
          <Panel
            title="Đơn hàng cần xử lý"
            className="overview-orders"
            action={
              <a href="#/orders" className="text-link">
                Tất cả đơn hàng
                <ArrowRight size={15} />
              </a>
            }
          >
            <div
              className="tabs compact"
              role="tablist"
              aria-label="Lọc đơn tổng quan"
            >
              <button
                role="tab"
                aria-selected={tab === "pending"}
                className={tab === "pending" ? "selected" : ""}
                onClick={() => setTab("pending")}
              >
                Cần xử lý <span className="tab-count">{pending.length}</span>
              </button>
              <button
                role="tab"
                aria-selected={tab === "all"}
                className={tab === "all" ? "selected" : ""}
                onClick={() => setTab("all")}
              >
                Tất cả <span className="tab-count">{data.orders.length}</span>
              </button>
            </div>
            <OrderTable
              data={data}
              rows={(tab === "pending" ? pending : data.orders).slice(0, 5)}
              compact
            />

          </Panel>
          <Panel
            title="Theo dõi tồn kho"
            className="overview-inventory"
            action={
              <a href="#/inventory" className="text-link">
                Quản lý kho
                <ArrowRight size={15} />
              </a>
            }
          >
            <Table
              rows={data.products
                .slice()
                .sort((a, b) => a.available - b.available)
                .slice(0, 4)}
              columns={[
                {
                  key: "name",
                  label: "Mặt hàng",
                  render: (p) => (
                    <div className="inventory-name">
                      <ProductImage id={p.id} image={p.image} />

                      <div>
                        <strong>{p.name}</strong>
                        <small className="cell-sub">{p.sku}</small>
                      </div>
                    </div>
                  ),
                },
                { key: "physical", label: "Tồn thực", sort: true },
                { key: "reserved", label: "Đang giữ", sort: true },
                {
                  key: "available",
                  label: "Khả dụng",
                  sort: true,
                  render: (p) => (
                    <strong className="stock-number">{p.available}</strong>
                  ),
                },
                { key: "incoming", label: "Đang về", sort: true },
                ...(owner
                  ? [
                      {
                        key: "suggested",
                        label: "Gợi ý",
                        render: (p) =>
                          p.suggested > 0 ? (
                            <a className="text-link" href="#/inventory">
                              Bổ sung {p.suggested} thùng
                            </a>
                          ) : (
                            <span className="muted small">Theo dõi thêm</span>
                          ),
                      },
                    ]
                  : []),
              ]}
            />
          </Panel>
        </div>
        <aside className="overview-aside" aria-label="Công việc và gợi ý">
          <Panel title="Việc cần làm" className="overview-work">
            <div className="work-list">
              {tasks.map((t) => (
                <a key={t.label} href={"#" + t.to}>
                  <Icon name={t.icon} size={17} />
                  <span>{t.label}</span>
                  <b>{t.count}</b>
                  <ChevronRight size={14} aria-hidden="true" />
                </a>
              ))}
            </div>
          </Panel>
          {owner && (
            <Panel
              title="Gợi ý SYNERA"
              className="overview-suggestions"
            >
              <div className="smart-list">
                <a href="#/inventory">
                  <Icon name="inventory" size={19} className="smart-symbol" />
                  <div>
                    <h3>Bổ sung hàng</h3>
                    <strong>{low.length} mặt hàng cần xem xét</strong>
                    <p>
                      Trà đào: khả dụng {data.products[0].available} · đề xuất{" "}
                      {data.products[0].suggested} thùng
                    </p>
                    <span className="smart-action">
                      Xem căn cứ
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </a>
                <a href="#/repeat">
                  <Icon name="history" size={19} className="smart-symbol" />
                  <div>
                    <h3>Liên hệ mua lại</h3>
                    <strong>{repeat.length} khách đến kỳ liên hệ</strong>
                    <p>
                      {repeat[0]?.name ||
                        "Đã ghi nhận kết quả các lượt liên hệ"}
                    </p>
                    <span className="smart-action">
                      Xem khách hàng
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </a>
                <a href={ready[0] ? "#/orders/" + ready[0].id : "#/packing"}>
                  <Icon name="shipping" size={19} className="smart-symbol" />
                  <div>
                    <h3>Lựa chọn vận chuyển</h3>
                    <strong>{ready.length} đơn đã xác nhận kiện</strong>

                    <span className="smart-action">
                      Xem phương án giao
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </a>
              </div>
              <a href="#/suggestions" className="panel-bottom-link">
                Tất cả gợi ý<ArrowRight size={14} />
              </a>
            </Panel>
          )}
        </aside>
          <Panel
            title="Hành trình mới nhất"
            className="overview-journey"
            action={
              <a
                className="icon-link"
                href={"#/orders/" + active.id}
                aria-label={"Xem " + active.id}
              >
                <Icon name="up" size={17} />
              </a>
            }
          >
            <div className="overview-journey-body">
            <div className="journey-summary">
              <div>
                <a className="text-link strong" href={"#/orders/" + active.id}>
                  {active.id}
                </a>
                <h3>{active.customerName}</h3>
              </div>
              <Badge status={active.status} />
            </div>
            <Timeline events={active.events.slice(-3)} />
            </div>
          </Panel>
      </div>

    </div>
  );
}
export { Dashboard };
