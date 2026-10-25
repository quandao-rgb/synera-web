"use client";
import { useState } from "react";
import { Package, Search, ArrowUpRight, X } from "lucide-react";
import {
  Icon,
  money,
  Badge,
  LinkButton,
  Panel,
  Note,
  Table,
  OrderTable,
  PageHead,
} from "../../components/synera/ui";
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
        eyebrow="KINH DOANH & KHO"
        title="Đơn hàng"
        description="Từ xác nhận nhu cầu đến chuẩn bị và bàn giao hàng."
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
        eyebrow="DỮ LIỆU CHUNG"
        title="Hàng hóa"
        description="Thông tin hàng và quy cách đóng chuẩn được dùng xuyên suốt đơn hàng, kho và giao nhận."
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
                  <span className={"product-art " + p.color}>
                    <Package size={23} strokeWidth={1.3} />
                  </span>
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
      <Note>
        Quy cách mẫu: mỗi thùng là một kiện độc lập. Dữ liệu thực tế cần được
        xác nhận theo nhóm hàng pilot; không nhân kích thước thành một kiện lớn.
      </Note>
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
        eyebrow="KINH DOANH & KHO"
        title="Quản lý kho"
        description="Tách rõ hàng thực có, hàng giữ, cách ly và hàng đang về."
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
                            <span className="muted">Đủ theo giả định</span>
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
            empty="Chưa có kế hoạch mới. Chọn gợi ý bổ sung ở tab Tồn kho để thử nhận một phần."
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
            empty="Chưa có yêu cầu kiểm kê. Gửi yêu cầu từ một mặt hàng để thử luồng duyệt."
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
      {owner && (
        <Note tone="warning">
          Công thức minh họa: max(0, nhu cầu mới + an toàn − khả dụng − hàng về
          đủ điều kiện). Trà đào: {data.products[0].demand} +{" "}
          {data.products[0].safety} − {data.products[0].available} −{" "}
          {data.products[0].incoming} →{" "}
          <strong>{data.products[0].suggested} thùng</strong>. Công thức đang
          minh họa; chưa xét đầy đủ số lượng mua tối thiểu và năng lực kho.
        </Note>
      )}
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
        eyebrow="KHÁCH HÀNG & KẾT NỐI"
        title={ctx.repeat ? "Liên hệ đúng thời điểm" : "Khách hàng"}
        description={
          ctx.repeat
            ? "Chu kỳ mua giúp bạn chọn lúc hỏi thăm, không cho biết khách còn bao nhiêu hàng."
            : "Một hồ sơ chung cho đơn hàng, địa chỉ nhận và lịch sử liên hệ."
        }
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
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Tất cả kết quả</option>
              <option value="pending">Chưa liên hệ</option>
            </select>
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
                  {c.cycle ? `Chu kỳ mẫu ${c.cycle} ngày` : "Chưa đủ lịch sử"}
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
      <Note tone="warning">
        Chu kỳ trong demo được nhập giả lập từ các đơn riêng biệt, không đếm số
        lần giao một đơn. Muốn đặt hàng → bạn chủ động tạo đơn mới.
      </Note>
    </>
  );
}

function Suggestions(ctx) {
  return (
    <>
      <PageHead
        eyebrow="HỖ TRỢ QUYẾT ĐỊNH"
        title="Gợi ý hôm nay"
        description="Ba quyết định độc lập trên cùng dữ liệu. Không có giao dịch tự động."
      />
      <div className="decision-list">
        {[
          {
            n: "01",
            title: "Bổ sung hàng",
            to: "/inventory",
            desc: "Xem tồn khả dụng, nhu cầu mới, mức an toàn và hàng về trước khi lập kế hoạch.",
            body: ctx.data.products
              .filter((p) => p.suggested > 0)
              .map((p) => `${p.name}: +${p.suggested} thùng`)
              .join(" · "),
          },
          {
            n: "02",
            title: "Liên hệ mua lại",
            to: "/repeat",
            desc: "Đọc chu kỳ và lịch sử đơn; gọi hoặc ghi nhận kết quả trao đổi.",
            body:
              ctx.data.customers
                .filter((c) => c.cycle && c.lastDays >= c.cycle && !c.outcome)
                .map((c) => c.name)
                .join(" · ") || "Đã ghi nhận các lượt liên hệ đến kỳ.",
          },
          {
            n: "03",
            title: "Chọn vận chuyển",
            to: "/orders",
            desc: "Đủ điều kiện → so sánh phí, thời gian và bằng chứng cùng nhóm → xác nhận.",
            body: `${ctx.data.orders.filter((o) => o.status === "ready").length} đơn đã xác nhận kiện, chờ chọn giao.`,
          },
        ].map((v) => (
          <Panel key={v.n}>
            <div className="decision">
              <span className="decision-number">{v.n}</span>
              <div>
                <h2>{v.title}</h2>
                <p className="muted">{v.desc}</p>
                <p>{v.body}</p>
              </div>
              <LinkButton to={v.to} icon="arrow">
                Xem căn cứ
              </LinkButton>
            </div>
          </Panel>
        ))}
      </div>
      <Note tone="warning">
        Công thức, trọng số và ngưỡng tin cậy cần được xác nhận. Các kết quả ở
        đây chỉ minh họa cách trình bày căn cứ để nhóm đánh giá.
      </Note>
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
        eyebrow="VẬN HÀNH / XỬ LÝ ĐƠN"
        title="Xử lý đơn hàng"
        description={
          owner
            ? "Theo dõi hàng chờ đóng kiện, đặt giao và bàn giao cho đơn vị vận chuyển."
            : "Kiểm tra từng kiện và xác nhận bàn giao hàng theo phân công."
        }
      />
      <div className="processing-stages">
        {stages.map(([key, label], i) => (
          <button
            key={key}
            className={stage === key ? "selected" : ""}
            onClick={() => {
              setStage(key);
              location.hash = "/packing/" + key;
            }}
            aria-pressed={stage === key}
          >
            <span className="stage-number">{i + 1}</span>
            <span>
              {label}
              <strong>
                {data.orders.filter((o) => o.status === key).length}
              </strong>
            </span>
            <Icon name="arrow" size={16} />
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
      <Note>
        {stage === "packing"
          ? "Kiện chuẩn: xác nhận sau kiểm tra. Kiện khác chuẩn: chỉnh từng kiện và ghi lý do."
          : stage === "ready"
            ? owner || data.warehouseShipping
              ? "Lấy lại giá theo kiện đã xác nhận, kiểm tra điều kiện rồi chủ động đặt giao."
              : "Kiện đã sẵn sàng. Chủ cơ sở hoặc người được cấp quyền sẽ chọn và đặt giao."
            : stage === "booked"
              ? "Chỉ xác nhận bàn giao khi hàng đã được giao thực tế cho hãng. Tồn thực sẽ giảm một lần."
              : "Kết quả đặt giao chưa rõ: kiểm tra vận đơn cũ trước, tránh gửi lại gây trùng."}
      </Note>
    </>
  );
}
export { Orders, Products, Inventory, Customers, Suggestions, Processing };
