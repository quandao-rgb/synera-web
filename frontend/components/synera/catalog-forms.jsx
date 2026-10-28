"use client";
import { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import GlideSelect from './glide-select';
import { Button, displayText } from './ui';

async function readProductImage(file) {
  if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) throw Error('Chọn ảnh JPG, PNG hoặc WebP dưới 8 MB.');
  const source = await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(Error('Không đọc được ảnh.'));reader.readAsDataURL(file);});
  const image = await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Ảnh bị lỗi hoặc không đúng định dạng.'));img.src=source;});
  const canvas=document.createElement('canvas');
  const scale=Math.min(1,320/image.width,320/image.height);
  canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
  canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
  for(const quality of [.85,.7,.5,.3]){const result=canvas.toDataURL('image/webp',quality);if(result.length<=70000)return result;}
  throw Error('Ảnh có quá nhiều chi tiết. Chọn ảnh nhỏ hơn.');
}
function EntryForm({children, submit, transform, label, className='', blocked=false}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  return <form className={`catalog-form ${className}`} aria-busy={busy} onSubmit={async event=>{
    event.preventDefault();const values=Object.fromEntries(new FormData(event.currentTarget));setError('');setBusy(true);
    try{await submit(transform?transform(values):values);}catch(error){setError(error.message);}finally{setBusy(false);}
  }}>
    <fieldset disabled={busy} className="catalog-form__fields">{children}</fieldset>
    {error&&<p role="alert" className="field-error">{displayText(error)}</p>}
    <div className="form-actions"><Button type="submit" kind="primary" icon="plus" disabled={busy||blocked}>{busy?'Đang lưu…':label}</Button></div>
  </form>;
}
function Field({label,name,type='text',...props}){return <label className="field"><span>{label}</span><input name={name} type={type} required {...props}/></label>;}

export function ProductForm({submit}) {
  const [image,setImage]=useState(''),[imageError,setImageError]=useState(''),[reading,setReading]=useState(false);
  return <EntryForm submit={submit} label="Thêm mặt hàng" blocked={reading} transform={v=>({...v,image,
    physical:Number(v.physical),price:Number(v.price),weight:Number(v.weight),length:Number(v.length),width:Number(v.width),height:Number(v.height),liquid:v.liquid==='on'})}>
    <div className="product-image-field">
      {image?<img src={image} width="80" height="80" alt="Ảnh mặt hàng chuẩn bị thêm"/>:<span className="product-image-placeholder"><ImagePlus size={28} aria-hidden="true"/></span>}
      <div><label className="image-upload"><input type="file" accept="image/png,image/jpeg,image/webp" disabled={reading} onChange={async event=>{
        const file=event.target.files?.[0];if(!file)return;setReading(true);setImageError('');
        try{setImage(await readProductImage(file));}catch(error){setImageError(error.message);}finally{setReading(false);event.target.value='';}
      }}/><span>{reading?'Đang xử lý ảnh…':'Chọn ảnh mặt hàng'}</span></label><small>JPG, PNG, WebP · tối đa 8 MB</small>{image&&<button type="button" className="text-link" onClick={()=>setImage('')}><X size={13} aria-hidden="true"/>Bỏ ảnh</button>}</div>
    </div>
    {imageError&&<p className="field-error" role="alert">{imageError}</p>}
    <Field label="Tên mặt hàng" name="name" minLength={2} maxLength={120} autoFocus/>
    <div className="catalog-form__row"><Field label="Mã SKU" name="sku" minLength={2} maxLength={40} pattern="[A-Za-z0-9][A-Za-z0-9._\-]+"/><label className="field"><span>Nhóm hàng</span><GlideSelect name="category" ariaLabel="Nhóm hàng" options={['Đồ uống','Thực phẩm khô','Hàng tiêu dùng','Khác']}/></label></div>
    <div className="catalog-form__row"><Field label="Tồn đầu kỳ (thùng)" name="physical" type="number" defaultValue={0} min={0} max={1000000} step={1}/><Field label="Giá bán / thùng (₫)" name="price" type="number" min={1} max={1000000000} step={1}/></div>
    <div className="catalog-form__section"><h3>Quy cách một thùng</h3><div className="catalog-form__row"><Field label="Khối lượng (kg)" name="weight" type="number" min={.01} max={1000} step={.01}/><Field label="Chiều dài (cm)" name="length" type="number" min={1} max={300} step={.1}/></div><div className="catalog-form__row"><Field label="Chiều rộng (cm)" name="width" type="number" min={1} max={300} step={.1}/><Field label="Chiều cao (cm)" name="height" type="number" min={1} max={300} step={.1}/></div><label className="checkbox-field"><input type="checkbox" name="liquid"/>Chất lỏng đóng chai</label></div>
  </EntryForm>;
}
export function CustomerForm({submit}) {
  return <EntryForm submit={submit} label="Thêm khách hàng">
    <Field label="Tên khách hàng / cửa hàng" name="name" minLength={2} maxLength={120} autoFocus/>
    <div className="catalog-form__row"><Field label="Người liên hệ" name="contact" minLength={2} maxLength={80}/><Field label="Số điện thoại" name="phone" type="tel" minLength={10} maxLength={24} autoComplete="tel"/></div>
    <Field label="Địa chỉ nhận hàng" name="address" minLength={5} maxLength={240} autoComplete="street-address"/>
    <label className="field"><span>Vùng giao</span><GlideSelect name="zone" ariaLabel="Vùng giao" options={['Vùng nội thành','Vùng lân cận']}/></label>
    <label className="field"><span>Ghi chú <small>(tùy chọn)</small></span><textarea name="note" rows={2} maxLength={300}/></label>
  </EntryForm>;
}
export function openProductForm(ctx){ctx.setModel({title:'Thêm mặt hàng',content:<ProductForm submit={values=>ctx.mutate('product-create',values,'Đã thêm mặt hàng')}/>});}
export function openCustomerForm(ctx,onCreated){
  const existing=new Set(ctx.data.customers.map(c=>c.id));
  ctx.setModel({title:'Thêm khách hàng',content:<CustomerForm submit={async values=>{
    const next=await ctx.mutate('customer-create',values,'Đã thêm khách hàng');
    const created=next.customers.find(c=>!existing.has(c.id));if(created)onCreated?.(created);
  }}/>});
}
