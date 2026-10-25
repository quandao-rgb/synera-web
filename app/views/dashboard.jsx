"use client";
import { useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
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
          icon: "orders",
          to: "/packing",
          hint: "Đóng kiện, đặt giao và bàn giao",
        },
        {
          label: "Đơn đang giao",
          value: data.orders.filter((o) => o.status === "transit").length,
          icon: "shipping",
          to: "/shipments",
          hint: "Theo dõi từng mốc hành trình",
        },
        {
          label: "Mặt hàng cần bổ sung",
          value: low.length,
          icon: "inventory",
          to: "/inventory",
          hint: "Theo nhu cầu và tồn khả dụng",
        },
        {
          label: "Khách đến kỳ mua lại",
          value: repeat.length,
          icon: "customers",
          to: "/repeat",
          hint: "Chủ động liên hệ xác nhận nhu cầu",
        },
      ]
    : [
        {
          label: "Chờ đóng kiện",
          value: data.orders.filter((o) => o.status === "packing").length,
          icon: "products",
          to: "/packing",
          hint: "Kiểm tra và xác nhận từng kiện",
        },
        {
          label: "Chờ bàn giao",
          value: data.orders.filter((o) => o.status === "booked").length,
          icon: "shipping",
          to: "/packing",
          hint: "Chỉ xuất thực khi đã bàn giao",
        },
        {
          label: "Tồn khả dụng",
          value: data.products.reduce((n, p) => n + p.available, 0),
          icon: "inventory",
          to: "/inventory",
          hint: "Đã trừ hàng giữ và cách ly",
        },
        {
          label: "Đơn đang hoàn",
          value: data.orders.filter((o) => o.status === "returning").length,
          icon: "return",
          to: "/returns",
          hint: "Chưa nhập kho khi chưa nhận thực",
        },
      ];
  const tasks = [
    {
      label: "Đơn chờ đóng kiện",
      count: data.orders.filter((o) => o.status === "packing").length,
      to: "/packing/packing",
      icon: "products",
    },
    {
      label: "Đơn chờ đặt giao",
      count: ready.length,
      to: "/packing/ready",
      icon: "shipping",
    },
    {
      label: "Đơn chờ bàn giao",
      count: data.orders.filter((o) => o.status === "booked").length,
      to: "/packing/booked",
      icon: "packing",
    },
    {
      label: "Đơn cần kiểm tra đặt giao",
      count: data.orders.filter((o) => o.status === "verification").length,
      to: "/packing/verification",
      icon: "alert",
    },
  ];
  return (
    <>
      <PageHead
        title="Tổng quan"
        description="Theo dõi kho, khách hàng và giao nhận trong cùng một không gian."
      >
        <span className="date-chip">
          <Icon name="calendar" size={16} />
          25/10/2026 · Dữ liệu minh họa
        </span>
        {owner && (
          <LinkButton to="/orders/new" kind="primary" icon="plus">
            Tạo đơn hàng
          </LinkButton>
        )}
      </PageHead>
      <section className="overview-welcome">
        <span className="overview-mark">
          <Icon name={owner ? "dashboard" : "inventory"} size={25} />
        </span>
        <div>
          <h2>Xin chào, {owner ? "Chủ cơ sở" : "Nhân viên kho"}</h2>
          <p>
            {owner
              ? "Cùng SYNERA chủ động bổ sung hàng, chăm sóc khách và lựa chọn vận chuyển."
              : "Kiểm tra hàng, xác nhận kiện và bàn giao theo công việc của cơ sở."}
          </p>
        </div>
        <LinkButton to="/packing" icon="arrow">
          Xem việc cần xử lý
        </LinkButton>
      </section>
      <div className="overview-grid">
        <div className="overview-main">
          <Panel
            title="Tình hình hoạt động"
            meta="Toàn bộ dữ liệu minh họa của cơ sở"
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
                    <Icon name={m.icon} size={17} />
                  </span>
                  <strong className="metric-value">{num(m.value)}</strong>
                  <span className="metric-hint">{m.hint}</span>
                </a>
              ))}
            </div>
          </Panel>
          <Panel
            title="Đơn hàng cần xử lý"
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
                Cần xử lý <span>{pending.length}</span>
              </button>
              <button
                role="tab"
                aria-selected={tab === "all"}
                className={tab === "all" ? "selected" : ""}
                onClick={() => setTab("all")}
              >
                Tất cả <span>{data.orders.length}</span>
              </button>
            </div>
            <OrderTable
              data={data}
              rows={(tab === "pending" ? pending : data.orders).slice(0, 5)}
              compact
            />
            <div className="panel-foot">
              <Icon name="shield" size={15} />
              Xác nhận đơn chỉ giữ hàng. Bàn giao thực tế mới xuất kho.
            </div>
          </Panel>
          <Panel
            title="Theo dõi tồn kho"
            meta="Khả dụng = tồn thực − hàng cách ly − hàng đang giữ"
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
                      <span className="inventory-product-icon">
                        <Icon name="products" size={19} />
                      </span>
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
          <Panel title="Việc cần làm">
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
              meta="Bạn xem căn cứ và xác nhận quyết định"
              action={<Icon name="sparkles" size={18} />}
            >
              <div className="smart-list">
                <a href="#/inventory">
                  <span className="smart-icon">
                    <Icon name="inventory" size={19} />
                  </span>
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
                  <span className="smart-icon">
                    <Icon name="customers" size={19} />
                  </span>
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
                  <span className="smart-icon">
                    <Icon name="shipping" size={19} />
                  </span>
                  <div>
                    <h3>Lựa chọn vận chuyển</h3>
                    <strong>{ready.length} đơn đã xác nhận kiện</strong>
                    <p>
                      So sánh điều kiện, chi phí và bằng chứng giao nhận cùng
                      nhóm.
                    </p>
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
          <Panel
            title="Hành trình mới nhất"
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
            <div className="journey-bottom">
              <Icon name="pin" size={15} />
              <span>
                Vùng nội thành
                <ArrowRight size={12} />
                {active.zone}
              </span>
            </div>
          </Panel>
        </aside>
      </div>
      <div className="bottom-note">
        <Icon name="shield" size={16} />
        <p>
          Dữ liệu và bảng giá đang được minh họa. Gợi ý hỗ trợ quyết định; không
          tự tạo giao dịch mua, bán hoặc đặt giao.
        </p>
      </div>
    </>
  );
}
export { Dashboard };
