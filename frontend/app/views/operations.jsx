"use client";
import GlideSelect from "../../components/synera/glide-select";
import { useState } from "react";
import { Search, ArrowUpRight, X } from "lucide-react";
import { money, Badge, LinkButton, Panel, Note, Table, OrderTable, PageHead } from "../../components/synera/ui";
function Orders(ctx) {
  const { data } = ctx;
  const [q, setQ] = useState(""),
    [tab, setTab] = useState("all");
  const filters = [
    ["all", "Tất cả"],
    ["packing", "Chờ đóng kiện"],
    ["ready", "Chờ đặt giao"],
    ["booked", "Chờ bàn giao"],
    ["verification", "Cần kiểm tra"],
  ];
  const rows = data.orders.filter(
    (o) =>
      (tab === "all" || o.status === tab) &&
      (o.id + " " + o.customerName).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHead

        title="Đơn hàng"

      >
        {data.role === "owner" && (
          <LinkButton to="/orders/new" kind="primary" icon="plus">
            Tạo đơn hàng
          </LinkButton>
        )}
      </PageHead>
      <Panel>
        <div className="tabs" role="tablist" aria-label="Trạng thái đơn">
          {filters.map(([k, v]) => (
            <button
              role="tab"
              aria-selected={tab === k}
              className={tab === k ? "selected" : ""}
              key={k}
              onClick={() => setTab(k)}
            >
              {v}
              <span>
                {k === "all"
                  ? data.orders.length
                  : data.orders.filter((o) => o.status === k).length}
              </span>
            </button>
          ))}
        </div>
        <div className="toolbar">
          <label className="search-input">
            <Search size={16} />
            <span className="sr-only">Tìm đơn hàng</span>
            <input
              placeholder="Tìm mã đơn, khách hàng…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <span className="muted small">{rows.length} đơn hàng</span>
        </div>
        <OrderTable data={data} rows={rows} />
      </Panel>
    </>
  );
}

function Products({ data, initialSearch = "" }) {
  const [q, setQ] = useState(initialSearch);
  const rows = data.products.filter((p) =>
    (p.name + " " + p.sku).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHead

        title="Hàng hóa"

      />
      <Panel>
        <div className="toolbar">
          <label className="search-input">
            <Search size={16} />
            <span className="sr-only">Tìm hàng hóa</span>
            <input
              placeholder="Tìm tên hàng, mã SKU…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <span className="muted small">{rows.length} mặt hàng</span>
        </div>
        <Table
          rows={rows}
          columns={[
            {
              key: "name",
              label: "Mặt hàng",
              sort: true,
              render: (p) => (
                <div className="product-cell">
                  <div>
                    <strong>{p.name}</strong>
                    <small className="cell-sub">
                      {p.sku} · {p.category}
                    </small>
                  </div>
                </div>
              ),
            },
            { key: "unit", label: "Đơn vị", render: (p) => p.unit },
            {
              key: "weight",
              label: "Quy cách / kiện",
              render: (p) => (
                <div>
                  {p.length} × {p.width} × {p.height} cm
                  <small className="cell-sub">
                    {p.weight} kg · 1 thùng / kiện
                  </small>
                </div>
              ),
            },
            {
              key: "available",
              label: "Khả dụng",
              sort: true,
              render: (p) => <strong>{p.available} thùng</strong>,
            },
            ...(data.role === "owner"
              ? [
                  {
                    key: "price",
                    label: "Giá bán / thùng",
                    sort: true,
                    render: (p) => money(p.price),
                  },
                ]
              : []),
            {
              key: "liquid",
              label: "Đặc tính",
              render: (p) => (
                <Badge tone="neutral">
                  {p.liquid ? "Chất lỏng đóng chai" : "Hàng khô đóng gói"}
                </Badge>
              ),
            },
          ]}
        />
      </Panel>

    </>
  );
}

function Inventory(ctx) {
  const { data, form, mutate } = ctx,
    [tab, setTab] = useState("stock"),
    [q, setQ] = useState("");
  const owner = data.role === "owner";
  const rows = data.products.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()),
  );
  const purchase = (p) =>
    form(
      "Lập kế hoạch bổ sung",
      [
        {
          name: "qty",
          label: "Số thùng dự kiến nhận",
          type: "number",
          min: 1,
          max: 10000,
          value: Math.max(1, p.suggested),
          hint: "Chỉ tăng hàng dự kiến về; chưa tăng tồn thực.",
        },
      ],
      "purchase",
      { id: p.id },
      p.name,
      "Xác nhận kế hoạch",
    );
  const inventory = (p) =>
    form(
      "Gửi yêu cầu kiểm kê",
      [
        {
          name: "count",
          label: "Số thùng đếm thực tế",
          type: "number",
          min: p.quarantine + p.reserved,
          value: p.physical,
        },
        {
          name: "reason",
          label: "Lý do / ghi nhận",
          type: "textarea",
          minLength: 5,
        },
      ],
      "adjustment-request",
      { id: p.id },
      "Yêu cầu chỉ có hiệu lực khi chủ cơ sở duyệt.",
    );
  return (
    <>
      <PageHead

        title="Quản lý kho"

      />
      <div className="mini-metrics">
        {[
          ["Tồn thực", data.products.reduce((s, p) => s + p.physical, 0)],
          ["Đang giữ", data.products.reduce((s, p) => s + p.reserved, 0)],
          ["Cách ly", data.products.reduce((s, p) => s + p.quarantine, 0)],
          ["Khả dụng", data.products.reduce((s, p) => s + p.available, 0)],
        ].map(([k, v]) => (
          <div key={k}>
            <span>{k}</span>
            <strong>
              {v} <small>thùng</small>
            </strong>
          </div>
        ))}
      </div>
      <Panel>
        <div className="tabs" role="tablist" aria-label="Phân hệ kho">
          {[
            ["stock", "Tồn kho"],
            ...(owner ? [["incoming", "Hàng đang về"]] : []),
            ["adjustments", "Kiểm kê & điều chỉnh"],
          ].map(([k, v]) => (
            <button
              role="tab"
              aria-selected={tab === k}
              className={tab === k ? "selected" : ""}
              key={k}
              onClick={() => setTab(k)}
            >
              {v}
            </button>
          ))}
        </div>
        {tab === "stock" ? (
          <>
            <div className="toolbar">
              <label className="search-input">
                <Search size={16} />
                <span className="sr-only">Tìm hàng trong kho</span>
                <input
                  placeholder="Tìm tên hàng…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </label>
              <span className="muted small">
                Khả dụng = thực − cách ly − giữ
              </span>
            </div>
            <Table
              rows={rows}
              columns={[
                {
                  key: "name",
                  label: "Mặt hàng",
                  sort: true,
                  render: (p) => (
                    <div>
                      <strong>{p.name}</strong>
                      <small className="cell-sub">{p.sku} · thùng</small>
                    </div>
                  ),
                },
                { key: "physical", label: "Tồn thực", sort: true },
                { key: "reserved", label: "Đang giữ", sort: true },
                { key: "quarantine", label: "Cách ly", sort: true },
                {
                  key: "available",
                  label: "Khả dụng",
                  sort: true,
                  render: (p) => (
                    <strong className={p.available < 15 ? "text-warning" : ""}>
                      {p.available}
                    </strong>
                  ),
                },
                { key: "incoming", label: "Đang về", sort: true },
                ...(owner
                  ? [
                      {
                        key: "suggested",
                        label: "Gợi ý bổ sung",
                        render: (p) =>
                          p.suggested > 0 ? (
                            <button
                              className="text-link"
                              onClick={() => purchase(p)}
                            >
                              +{p.suggested} thùng <ArrowUpRight size={14} />
                            </button>
                          ) : (
                            <span className="muted">Chưa cần bổ sung</span>
                          ),
                      },
                    ]
                  : []),
                {
                  key: "action",
                  label: "Kiểm kê",
                  render: (p) => (
                    <button className="text-link" onClick={() => inventory(p)}>
                      Gửi yêu cầu
                    </button>
                  ),
                },
              ]}
            />
          </>
        ) : tab === "incoming" ? (
          <Table
            rows={data.purchases}
            empty="Chưa có kế hoạch bổ sung hàng."
            columns={[
              { key: "id", label: "Kế hoạch" },
              {
                key: "productId",
                label: "Mặt hàng",
                render: (po) =>
                  data.products.find((p) => p.id === po.productId)?.name,
              },
              { key: "qty", label: "Dự kiến" },
              { key: "remaining", label: "Còn chờ" },
              {
                key: "action",
                label: "Nhận hàng",
                render: (po) =>
                  po.remaining > 0 ? (
                    <button
                      className="text-link"
                      onClick={() =>
                        form(
                          "Nhận hàng thực tế",
                          [
                            {
                              name: "good",
                              label: "Thùng tốt",
                              type: "number",
                              min: 0,
                              max: po.remaining,
                              value: po.remaining,
                            },
                            {
                              name: "bad",
                              label: "Thùng cách ly",
                              type: "number",
                              min: 0,
                              max: po.remaining,
                              value: 0,
                            },
                          ],
                          "receive",
                          { id: po.id },
                          "Nhận một phần giữ nguyên số còn chờ. Hàng lỗi vào cách ly.",
                        )
                      }
                    >
                      Ghi nhận
                    </button>
                  ) : (
                    <Badge tone="success">Đã nhận đủ</Badge>
                  ),
              },
            ]}
          />
        ) : (
          <Table
            rows={data.adjustments}
            empty="Chưa có yêu cầu kiểm kê."
            columns={[
              {
                key: "productId",
                label: "Mặt hàng",
                render: (a) =>
                  data.products.find((p) => p.id === a.productId)?.name,
              },
              { key: "count", label: "Số đếm" },
              { key: "reason", label: "Lý do" },
              {
                key: "status",
                label: "Trạng thái",
                render: (a) => (
                  <Badge tone={a.status === "approved" ? "success" : "warning"}>
                    {a.status === "approved" ? "Đã duyệt" : "Chờ chủ duyệt"}
                  </Badge>
                ),
              },
              {
                key: "action",
                label: "Xử lý",
                render: (a) =>
                  owner && a.status === "pending" ? (
                    <button
                      className="text-link"
                      onClick={() =>
                        ctx.confirm(
                          "Duyệt điều chỉnh kho",
                          "Tồn thực sẽ đổi theo số đếm. Hàng giữ hiện tại được kiểm tra lại.",
                          "approve-adjustment",
                          { id: a.id },
                          "Duyệt điều chỉnh",
                        )
                      }
                    >
                      Duyệt
                    </button>
                  ) : (
                    <span className="muted">—</span>
                  ),
              },
            ]}
          />
        )}
      </Panel>

    </>
  );
}

function Customers(ctx) {
  const { data, form } = ctx,
    [q, setQ] = useState(ctx.initialSearch || ""),
    [filter, setFilter] = useState("all");
  const rows = data.customers.filter(
    (c) =>
      (!ctx.repeat || (c.cycle && c.lastDays >= c.cycle)) &&
      (filter !== "pending" || !c.outcome) &&
      (c.name + " " + c.phone).toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHead

        title={ctx.repeat ? "Nhắc mua lại" : "Khách hàng"}

      />
      <Panel>
        <div className="toolbar">
          <label className="search-input">
            <Search size={16} />
            <span className="sr-only">Tìm khách hàng</span>
            <input
              value={q}
              placeholder="Tên hoặc số điện thoại…"
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <label className="inline-field">
            <span className="sr-only">Lọc kết quả liên hệ</span>
            <GlideSelect value={filter} onChange={(next) => setFilter(next)} ariaLabel="Lọc kết quả liên hệ" options={[
              { value: "all", label: "Tất cả kết quả" },
              { value: "pending", label: "Chưa liên hệ" },
            ]} />
          </label>
        </div>
        <Table
          rows={rows}
          columns={[
            {
              key: "name",
              label: "Khách hàng",
              sort: true,
              render: (c) => (
                <div className="customer-cell">
                  <span className="customer-avatar">
                    {c.name
                      .split(" ")
                      .slice(-2)
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <div>
                    <strong>{c.name}</strong>
                    <small className="cell-sub">
                      {c.contact} · {c.phone}
                    </small>
                  </div>
                </div>
              ),
            },
            {
              key: "cycle",
              label: "Căn cứ nhắc mua",
              render: (c) => (
                <div>
                  {c.cycle ? `Chu kỳ ${c.cycle} ngày` : "Chưa đủ lịch sử"}
                  <small className="cell-sub">
                    {c.purchases} đơn mua riêng biệt · lần gần nhất {c.lastDays}{" "}
                    ngày trước
                  </small>
                </div>
              ),
            },
            { key: "zone", label: "Vùng giao" },
            {
              key: "outcome",
              label: "Kết quả liên hệ",
              render: (c) =>
                c.outcome ? (
                  <Badge tone="success">{c.outcome}</Badge>
                ) : (
                  <Badge
                    tone={
                      c.cycle && c.lastDays >= c.cycle ? "warning" : "neutral"
                    }
                  >
                    {c.cycle && c.lastDays >= c.cycle
                      ? "Đến kỳ liên hệ"
                      : "Theo dõi thêm"}
                  </Badge>
                ),
            },
            {
              key: "action",
              label: "Thao tác",
              render: (c) => (
                <button
                  className="text-link"
                  onClick={() =>
                    form(
                      "Ghi nhận liên hệ",
                      [
                        {
                          name: "outcome",
                          label: "Kết quả trao đổi",
                          options: [
                            "Đã liên hệ · chưa có nhu cầu",
                            "Hẹn liên hệ sau 3 ngày",
                            "Muốn đặt hàng",
                          ],
                        },
                      ],
                      "contact",
                      { id: c.id },
                      `${c.name} · ${c.phone}. Ghi nhận nhu cầu không tự tạo đơn.`,
                    )
                  }
                >
                  Ghi kết quả <ArrowUpRight size={14} />
                </button>
              ),
            },
          ]}
        />
      </Panel>

    </>
  );
}

function Suggestions(ctx) {
  return (
    <>
      <PageHead

        title="Gợi ý hôm nay"

      />
      <div className="decision-list">
        {[
          {
            title: "Bổ sung hàng",
            to: "/inventory",

            body: ctx.data.products
              .filter((p) => p.suggested > 0)
              .map((p) => `${p.name}: +${p.suggested} thùng`)
              .join(" · "),
          },
          {
            title: "Liên hệ mua lại",
            to: "/repeat",

            body:
              ctx.data.customers
                .filter((c) => c.cycle && c.lastDays >= c.cycle && !c.outcome)
                .map((c) => c.name)
                .join(" · ") || "Đã ghi nhận các lượt liên hệ đến kỳ.",
          },
          {
            title: "Chọn vận chuyển",
            to: "/orders",

            body: `${ctx.data.orders.filter((o) => o.status === "ready").length} đơn đã xác nhận kiện, chờ chọn giao.`,
          },
        ].map((v) => (
          <Panel key={v.to}>
            <div className="decision">

              <div>
                <h2>{v.title}</h2>

                <p>{v.body}</p>
              </div>
              <LinkButton to={v.to} icon="arrow">
                Xem căn cứ
              </LinkButton>
            </div>
          </Panel>
        ))}
      </div>

    </>
  );
}

function Processing(ctx) {
  const { data } = ctx,
    [stage, setStage] = useState(
      ["packing", "ready", "booked", "verification"].includes(ctx.initialStage)
        ? ctx.initialStage
        : "packing",
    ),
    [q, setQ] = useState("");
  const stages = [
    ["packing", "Chờ đóng kiện"],
    ["ready", "Chờ đặt giao"],
    ["booked", "Chờ bàn giao"],
    ["verification", "Cần kiểm tra"],
  ];
  const rows = data.orders.filter(
    (o) =>
      o.status === stage &&
      (o.id + " " + o.customerName).toLowerCase().includes(q.toLowerCase()),
  );
  const owner = data.role === "owner";
  return (
    <>
      <PageHead

        title="Xử lý đơn hàng"

      />
      <div className="processing-stages">
        {stages.map(([key, label]) => (
          <button
            key={key}
            className={stage === key ? "selected" : ""}
            onClick={() => {
              setStage(key);
              location.hash = "/packing/" + key;
            }}
            aria-pressed={stage === key}
          >

            <span>
              {label}
              <strong>
                {data.orders.filter((o) => o.status === key).length}
              </strong>
            </span>

          </button>
        ))}
      </div>
      <Panel>
        <div className="toolbar">
          <label className="search-input">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Tìm đơn cần xử lý</span>
            <input
              placeholder="Tìm mã đơn hoặc khách hàng"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <span className="muted small">
            {rows.length} đơn · {stages.find((s) => s[0] === stage)[1]}
          </span>
        </div>
        <OrderTable data={data} rows={rows} />
      </Panel>
      {stage === "verification" && <Note tone="warning">Kết quả đặt giao chưa rõ. Kiểm tra vận đơn hiện có trước khi gửi lại yêu cầu.</Note>}
    </>
  );
}
export { Orders, Products, Inventory, Customers, Suggestions, Processing };
