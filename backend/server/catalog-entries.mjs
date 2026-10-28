// Additive catalog actions. Validation is supplied by the domain so HTTP errors
// retain the existing status/session/version contract in every runtime.
const text = (value, label, min, max, check, multiline = false) => {
  check(typeof value === 'string', `${label} không hợp lệ.`);
  const result = value.trim();
  const invalidControl = multiline ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/;
  check(result.length >= min && result.length <= max && !invalidControl.test(result), `${label} cần từ ${min} đến ${max} ký tự.`);
  return result;
};
const number = (value, label, min, max, check, integer = false) => {
  check(typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max && (!integer || Number.isSafeInteger(value)), `${label} không hợp lệ${integer ? ' (cần số nguyên)' : ''}.`);
  return value;
};
const nextId = (rows, prefix) => prefix + String(Math.max(0, ...rows.map(row => new RegExp(`^${prefix}\\d+$`).test(row.id) ? Number(row.id.slice(prefix.length)) : 0)) + 1).padStart(2, '0');
function productImage(value, check) {
  if (value === undefined || value === '') return '';
  check(typeof value === 'string' && value.length <= 70000 && /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value), 'Ảnh cần là PNG, JPG hoặc WebP dưới 50 KB sau tối ưu.');
  let binary = '';
  try { binary = atob(value.split(',')[1]); } catch { check(false, 'Ảnh không hợp lệ.'); }
  const valid = value.startsWith('data:image/png;') ? binary.startsWith('\x89PNG\r\n\x1a\n')
    : value.startsWith('data:image/jpeg;') ? binary.startsWith('\xff\xd8\xff')
    : binary.startsWith('RIFF') && binary.slice(8,12) === 'WEBP';
  check(valid, 'Nội dung ảnh không đúng định dạng.');
  return value;
}
export function addProduct(state, input, check) {
  check(input && typeof input === 'object' && !Array.isArray(input), 'Thông tin mặt hàng không hợp lệ.');
  const name = text(input.name, 'Tên mặt hàng', 2, 120, check);
  const sku = text(input.sku, 'Mã SKU', 2, 40, check).toUpperCase();
  check(/^[A-Z0-9][A-Z0-9._-]+$/.test(sku), 'SKU chỉ gồm chữ không dấu, số, dấu chấm, gạch ngang hoặc gạch dưới.');
  check(!state.products.some(p => p.sku.toUpperCase() === sku), 'Mã SKU đã tồn tại.', 409);
  const category = text(input.category, 'Nhóm hàng', 2, 60, check);
  const physical = number(input.physical, 'Tồn đầu kỳ', 0, 1000000, check, true);
  const price = number(input.price, 'Giá bán', 1, 1000000000, check, true);
  const weight = number(input.weight, 'Khối lượng', 0.01, 1000, check);
  const length = number(input.length, 'Chiều dài', 1, 300, check);
  const width = number(input.width, 'Chiều rộng', 1, 300, check);
  const height = number(input.height, 'Chiều cao', 1, 300, check);
  check(typeof input.liquid === 'boolean', 'Đặc tính hàng hóa không hợp lệ.');
  const image = productImage(input.image, check);
  const product = { id:nextId(state.products,'SP'), name, sku, category, unit:'thùng', physical,
    quarantine:0, incoming:0, demand:0, safety:0, price, weight, length, width, height,
    liquid:input.liquid, color:'custom', ...(image ? { image } : {}) };
  state.products.push(product);
  return product;
}
export function addCustomer(state, input, check) {
  check(input && typeof input === 'object' && !Array.isArray(input), 'Thông tin khách hàng không hợp lệ.');
  const name = text(input.name, 'Tên khách hàng', 2, 120, check);
  const contact = text(input.contact, 'Người liên hệ', 2, 80, check);
  const rawPhone = text(input.phone, 'Số điện thoại', 10, 24, check).replace(/[\s().-]/g,'');
  check(/^(?:0\d{9}|\+84\d{9})$/.test(rawPhone), 'Nhập số điện thoại Việt Nam 10 chữ số hoặc +84.');
  const phone = rawPhone.replace(/^\+84/,'0');
  check(!state.customers.some(c => c.phone === phone), 'Số điện thoại đã thuộc một khách hàng.', 409);
  const address = text(input.address, 'Địa chỉ nhận hàng', 5, 240, check);
  check(['Vùng nội thành','Vùng lân cận'].includes(input.zone), 'Chọn vùng giao hàng hợp lệ.');
  const note = input.note === undefined || input.note === '' ? '' : text(input.note, 'Ghi chú', 0, 300, check, true);
  const customer = {id:nextId(state.customers,'KH'), name, contact, phone, address, zone:input.zone,
    cycle:null, lastDays:null, purchases:0, debt:0, note, outcome:''};
  state.customers.push(customer);
  return customer;
}
