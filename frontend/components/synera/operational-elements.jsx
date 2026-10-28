"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// React Bits Count Up / Spotlight Card inspired, using the GSAP already in SYNERA.
// Finite presentation only: the accessible number always contains the actual value.
export function CountValue({value,className=''}) {
  const ref=useRef(null),previous=useRef(0);
  const formatted=new Intl.NumberFormat('vi-VN').format(value);
  useEffect(()=>{
    const element=ref.current;
    const media=gsap.matchMedia();
    media.add({reduce:'(prefers-reduced-motion: reduce)',all:'all'},({conditions})=>{
      if(conditions.reduce){element.textContent=formatted;return;}
      const count={value:previous.current};
      const tween=gsap.to(count,{value,duration:.38,ease:'power2.out',onUpdate:()=>{element.textContent=new Intl.NumberFormat('vi-VN').format(Math.round(count.value));},onComplete:()=>{element.textContent=formatted;}});
      return()=>{tween.kill();element.textContent=formatted;};
    });
    previous.current=value;
    return()=>media.revert();
  },[value,formatted]);
  return <span className={`count-value ${className}`}><span className="sr-only">{formatted}</span><span ref={ref} aria-hidden="true">{formatted}</span></span>;
}
export function SpotlightSurface({children,className=''}) {
  const ref=useRef(null);
  return <section className={`spotlight-surface ${className}`} ref={ref} onPointerMove={event=>{
    if(event.pointerType==='touch'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const box=event.currentTarget.getBoundingClientRect();
    ref.current.style.setProperty('--spot-x',`${event.clientX-box.left}px`);
    ref.current.style.setProperty('--spot-y',`${event.clientY-box.top}px`);
  }}>{children}</section>;
}
