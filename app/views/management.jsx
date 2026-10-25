"use client";
import { useEffect, useState } from "react";
import { Boxes, ArrowRight, X, ShieldCheck } from "lucide-react";
import {
  money,
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
        eyebrow="GIAO NHẬN"
        title="Giao hàng"
        description="Theo dõi trạng thái đặt giao và mốc bàn giao, tách riêng trạng thái tiền."
      />
      <Panel title="Các đơn giao">
        <OrderTable data={ctx.data} rows={rows} />
      </Panel>
      <Note>
        Bản minh họa hỗ trợ một lần giao cho mỗi đơn. Hàng chỉ được xuất kho khi
        đã bàn giao thực tế; trạng thái giao hàng và trạng thái tiền được theo
        dõi riêng.
      </Note>
    </>
  );
}

function Carriers({ data }) {
  return (
    <>
      <PageHead
        eyebrow="BẰNG CHỨNG GIAO NHẬN"
        title="Đơn vị vận chuyển"
        description="Hãng và dịch vụ minh họa. Chưa có hợp đồng đối tác hay kết nối API thật."
      />
      <div className="carrier-grid">
        {data.carriers.map((c) => (
          <Panel key={c.id}>
            <div className="panel-body">
              <div className="carrier-title">
                <span className="carrier-avatar">{c.id}</span>
                <div>
                  <h2>{c.name}</h2>
                  <p className="muted">
                    {c.service} · {c.days}
                  </p>
                </div>
              </div>
              <Badge tone={c.liquid ? "success" : "neutral"}>
                {c.liquid
                  ? "Nhận chất lỏng theo giả định"
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
        eyebrow="GIAO NHẬN / CHIỀU VỀ"
        title="Hàng hoàn"
        description="Hãng báo hoàn chưa làm tăng kho. Chỉ ghi nhận khi hàng đã về và được kiểm tra."
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
                        "Chỉ xác nhận sau khi nhận thực tế. Prototype kiểm tra toàn bộ lần hoàn; phân loại từng phần cần bổ sung.",
                      )
                    }
                  >
                    Ghi nhận đã nhận
                  </button>
                ) : (
                  <span className="muted">
                    {o.status === "returned"
                      ? "Đã ghi nhận"
                      : "Chờ chủ ghi nhận trong demo"}
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
        eyebrow="CHỦ CƠ SỞ / TÀI CHÍNH"
        title="Công nợ & đối soát"
        description="Tách tiền hàng, tiền hãng giữ, phí giao và dòng tiền thực về cơ sở."
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
        meta="Số dư mẫu nhập riêng, không suy ra từ trạng thái giao"
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
                <span className="muted">Số dư minh họa · chưa đối soát</span>
              ),
            },
          ]}
        />
      </Panel>
      <div className="two-column spaced">
        <Panel title="Phí giao">
          <div className="panel-body">
            <p>Giá sơ bộ → giá theo kiện đã xác nhận → phí thực thu.</p>
            <p className="muted">
              Prototype giữ báo giá khi đặt giao; chưa có sao kê phí thực tế từ
              hãng. Chênh lệch cần căn cứ trước khi kết luận.
            </p>
          </div>
        </Panel>
        <Panel title="Gói & hoa hồng">
          <div className="panel-body">
            <Badge tone="warning">D08 / D09 chưa chốt</Badge>
            <p className="muted">
              Chưa xác nhận giá Pro, ranh giới Free/Pro hay tỷ lệ hoa hồng. Đơn
              dùng hợp đồng riêng không mặc định có hoa hồng.
            </p>
          </div>
        </Panel>
      </div>
      <Note>
        Đây là màn hình trình bày phân tách nghiệp vụ, chưa có hạch toán, thu
        tiền, chi tiền hay thanh toán thật.
      </Note>
    </>
  );
}

function Reports({ data }) {
  return (
    <>
      <PageHead
        eyebrow="DỮ LIỆU & BẰNG CHỨNG"
        title="Báo cáo vận hành"
        description="Đọc chỉ số cùng mẫu số, kỳ dữ liệu và nguồn. Chưa đủ mẫu thì nói rõ."
      />
      <div className="two-column">
        <Panel
          title="Trạng thái đơn hàng"
          meta={`Bộ dữ liệu demo · ${data.orders.length} đơn`}
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
          meta="Không phải điểm đánh giá chung của hãng"
        >
          <div className="panel-body">
            <div className="report-number">
              80<span>%</span>
              <Badge tone="warning">Mẫu minh họa</Badge>
            </div>
            <Evidence e={data.carriers[0].evidence} />
            <p className="muted small">
              Dịch vụ: Giao tiêu chuẩn · Hãng A. Hai đơn quá hạn chưa kết thúc
              nằm trong mẫu số 10.
            </p>
          </div>
        </Panel>
      </div>
      <Panel
        title="Nhật ký thao tác gần đây"
        meta="Mốc tạo dữ liệu và quyết định của người thao tác"
        className="spaced"
      >
        <Table
          rows={data.audit}
          columns={[
            { key: "at", label: "Thời điểm" },
            { key: "actor", label: "Người thao tác" },
            { key: "text", label: "Nội dung" },
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
        eyebrow="KHÔNG GIAN LÀM VIỆC"
        title="Thiết lập"
        description="Quyền vận hành, phạm vi demo và các điểm cần chốt trước pilot."
      />
      <div className="settings-layout">
        <Panel title="Cơ sở minh họa">
          <dl className="settings-list">
            <div>
              <dt>Tên không gian</dt>
              <dd>Cơ sở Tân Bình</dd>
            </div>
            <div>
              <dt>Trạng thái dữ liệu</dt>
              <dd>
                <Badge tone="warning">Dữ liệu giả lập</Badge>
              </dd>
            </div>
            <div>
              <dt>Vai trò hiện tại</dt>
              <dd>{data.role === "owner" ? "Chủ cơ sở" : "Nhân viên kho"}</dd>
            </div>
            <div>
              <dt>Phạm vi địa bàn</dt>
              <dd>Chỉ minh họa · D01 chưa chốt pilot</dd>
            </div>
          </dl>
        </Panel>
        <Panel title="Phân quyền kho" meta="D24 theo SRS v0.2">
          <div className="panel-body">
            <div className="permission-row">
              <div>
                <strong>Chọn và đặt giao</strong>
                <p className="muted small">
                  Mặc định tắt. Không mở quyền tài chính hay duyệt điều chỉnh
                  kho.
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
                    "Thay đổi quyền của tài khoản kho minh họa. Dữ liệu tiền hàng, COD và công nợ vẫn không được gửi cho kho.",
                    "permission",
                    { enabled: !data.warehouseShipping },
                    "Xác nhận thay đổi",
                  )
                }
              >
                <span />
              </button>
            </div>
            <Note>
              Chuyển vai trò ở góc phải chỉ để xem demo. Triển khai thật cần tài
              khoản nhân viên và membership phía máy chủ.
            </Note>
          </div>
        </Panel>
        <Panel title="Các quyết định chưa chốt">
          <div className="panel-body">
            <ul className="plain-list">
              <li>D01 · Địa bàn và nhóm hàng pilot</li>
              <li>D02 / D09 · Đối tác, API, điều khoản và bảng giá</li>
              <li>D03–D05 · Logic gợi ý và ngưỡng bằng chứng</li>
              <li>D08 · Ranh giới Free/Pro và giá gói</li>
              <li>D27 · Kiến trúc triển khai sản phẩm</li>
              <li>BG01 / BG02 · Ngoại lệ COD và gộp thao tác chưa duyệt</li>
            </ul>
          </div>
        </Panel>
        <Panel title="Dữ liệu thử nghiệm">
          <div className="panel-body">
            <p className="muted">
              Lưu riêng theo người dùng Sites. Đặt lại sẽ xóa các thao tác trong
              demo này và khôi phục bộ mẫu.
            </p>
            <Button
              disabled={data.role !== "owner"}
              icon="return"
              onClick={() =>
                confirm(
                  "Đặt lại toàn bộ demo",
                  "Các đơn và thay đổi bạn đã tạo trong prototype sẽ bị xóa. Chỉ ảnh hưởng không gian minh họa này.",
                  "reset",
                  {},
                  "Đặt lại demo",
                )
              }
            >
              Đặt lại dữ liệu demo
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
        <span className="demo-label">Trang người nhận · minh họa</span>
      </header>
      <main>
        <p className="eyebrow">CÙNG BẠN THEO SÁT TỪNG CHẶNG</p>
        <h1>Hành trình đơn hàng</h1>
        <p className="muted">Cập nhật theo các mốc giao nhận được ghi nhận.</p>
        {error ? (
          <Empty
            title="Không mở được hành trình"
            text={error}
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
              <ShieldCheck size={16} /> {data.carrier} · Sự kiện minh họa, không
              phải GPS trực tiếp.
            </p>
          </>
        )}
        <a className="back-link" href="#/">
          Về không gian demo <ArrowRight size={14} />
        </a>
      </main>
      <footer>SYNERA · Cùng nhịp vận hành.</footer>
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
