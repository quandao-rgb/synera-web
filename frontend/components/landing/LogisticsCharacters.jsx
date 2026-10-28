'use client';
import { useId, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function LogisticsCharacters() {
  const root = useRef(null);
  const gradient = useId().replace(/:/g, '');
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power1.inOut' },
        scrollTrigger: { trigger: root.current, start: 'top 88%', end: 'bottom 38%', scrub: 0.5 },
      });
      timeline.from('.sl-character--warehouse', { x: -16, duration: 1 }, 0)
        .fromTo('.sl-character__parcel', { y: 12 }, { y: -4, duration: 0.7 }, 0)
        .to('.sl-character__packing-arm', { rotation: -7, svgOrigin: '158 111', duration: 0.7 }, 0)
        .from('.sl-character__scanner-arm', { rotation: 12, svgOrigin: '451 115', duration: 0.7 }, 0.2)
        .from('.sl-character__check', { scale: 0.6, opacity: 0, transformOrigin: '50% 50%', duration: 0.35 }, 0.55)
        .from('.sl-character--courier', { x: -32, duration: 1 }, 0.1)
        .to('.sl-character__wheel', { rotation: 160, transformOrigin: '50% 50%', duration: 1 }, 0.1)
        .to('.sl-character__route', { strokeDashoffset: -40, duration: 1.1, ease: 'none' }, 0);
    });
    return () => media.revert();
  }, { scope: root });

  return <figure ref={root} className="sl-logistics-scene" role="img" aria-label="Nhân viên kho chuẩn bị kiện hàng, điều phối kiểm tra thông tin và người giao hàng vận chuyển bằng xe máy.">
    <svg viewBox="0 0 960 300" aria-hidden="true" focusable="false">
      <defs><linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#079bea" stopOpacity=".12" /><stop offset="1" stopColor="#6239df" stopOpacity=".09" /></linearGradient></defs>
      <path d="M20 259C62 152 123 164 190 194S339 219 388 155 527 127 575 180 759 137 826 174 931 204 946 259Z" fill={`url(#${gradient})`} />
      <path className="sl-character__route" d="M245 164C303 112 341 202 389 160M531 163C594 106 626 200 688 156" fill="none" stroke="var(--sl-cyan)" strokeOpacity=".45" strokeWidth="3" strokeDasharray="5 10" strokeLinecap="round" />
      <path d="M28 267H932" className="sl-character__ground" />

      <g className="sl-character--warehouse">
        <ellipse cx="149" cy="267" rx="96" ry="8" fill="var(--sl-blue)" opacity=".08" />
        <path d="M126 169 112 216 85 254M146 171 158 218 177 254" className="sl-character__trousers" />
        <path d="M84 253 73 266H102L104 255M176 254 175 267H204L191 255" className="sl-character__hair" />
        <path d="M105 107Q128 87 153 106L167 172Q134 189 103 170Z" fill="var(--sl-blue)" />
        <path d="M123 107 130 122 140 106" fill="var(--sl-cyan)" />
        <path d="M120 88V105Q131 115 142 102V85" className="sl-character__skin" />
        <ellipse cx="131" cy="70" rx="21" ry="25" className="sl-character__skin" />
        <path d="M110 70Q98 39 126 37 151 31 155 57L145 65 140 51Q126 59 110 55Z" className="sl-character__hair" />
        <path d="M104 111 88 145 121 160" className="sl-character__limb" />
        <g className="sl-character__packing-arm"><path d="M158 111 178 139 201 145" className="sl-character__limb" /><circle cx="203" cy="145" r="9" className="sl-character__skin" /></g>
        <g className="sl-character__parcel"><path d="M171 139 203 126 235 140 204 155Z" className="sl-character__box-top" /><path d="M171 139V180L204 197V155Z" className="sl-character__box" /><path d="M204 155 235 140V181L204 197Z" className="sl-character__box-side" /><path d="M187 133 219 148V164" fill="none" stroke="#fff" strokeOpacity=".8" strokeWidth="6" /></g>
        <path d="M35 225 66 213 98 227 67 241Z" className="sl-character__box-top" /><path d="M35 225V254L67 267V241Z" className="sl-character__box" /><path d="M67 241 98 227V255L67 267Z" className="sl-character__box-side" />
      </g>

      <g className="sl-character--dispatcher">
        <ellipse cx="451" cy="267" rx="63" ry="8" fill="var(--sl-violet)" opacity=".08" />
        <path d="M433 177 425 217 414 255M455 176 470 218 480 255" className="sl-character__trousers" />
        <path d="M414 253 403 267H431L432 255M478 254 479 267H506L492 255" className="sl-character__hair" />
        <path d="M415 114Q436 96 459 111L473 181Q443 191 416 178Z" fill="var(--sl-violet)" />
        <path d="M431 91V110L445 120 451 105V87" className="sl-character__skin" />
        <ellipse cx="439" cy="76" rx="20" ry="25" className="sl-character__skin" />
        <path d="M420 78Q405 58 421 45 443 30 459 53L459 70 446 61Q437 68 421 64Z" className="sl-character__hair" />
        <path d="M420 51Q400 36 395 61L399 104 415 91Z" className="sl-character__hair" />
        <path d="M419 119 401 150 438 162" className="sl-character__limb" />
        <g className="sl-character__scanner-arm"><path d="M451 115 475 144 496 118" className="sl-character__limb" /><rect x="489" y="91" width="20" height="33" rx="5" fill="var(--sl-navy)" transform="rotate(16 499 108)" /><path d="m495 101 10 3" stroke="var(--sl-cyan)" strokeWidth="3" /></g>
        <g transform="rotate(-9 449 155)"><rect x="431" y="136" width="39" height="49" rx="5" fill="#fff" stroke="var(--sl-line)" strokeWidth="2" /><rect x="441" y="131" width="18" height="9" rx="3" fill="var(--sl-cyan)" /><path d="M440 151H460M440 159H455M440 167H460" stroke="var(--sl-blue)" strokeWidth="2" strokeLinecap="round" /></g>
        <g className="sl-character__check"><circle cx="507" cy="65" r="19" fill="var(--sl-cyan)" fillOpacity=".14" /><path d="m498 65 6 6 11-13" fill="none" stroke="var(--sl-blue)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></g>
      </g>

      <g className="sl-character--courier">
        <ellipse cx="788" cy="267" rx="113" ry="8" fill="var(--sl-blue)" opacity=".08" />
        <g className="sl-character__wheel"><circle cx="726" cy="244" r="23" className="sl-character__hair" /><circle cx="726" cy="244" r="12" fill="#fff" /><path d="M726 234V254M716 244H736" stroke="var(--sl-control-line)" strokeWidth="3" /></g>
        <g className="sl-character__wheel"><circle cx="852" cy="244" r="23" className="sl-character__hair" /><circle cx="852" cy="244" r="12" fill="#fff" /><path d="M852 234V254M842 244H862" stroke="var(--sl-control-line)" strokeWidth="3" /></g>
        <path d="M700 216Q707 193 744 197L786 221H819L830 168H850L866 226Q828 244 775 240L744 219 703 226Z" fill="var(--sl-cyan)" />
        <path d="M824 169 814 151H844" fill="none" stroke="var(--sl-navy)" strokeWidth="7" strokeLinecap="round" />
        <path d="M742 192H790" stroke="var(--sl-navy)" strokeWidth="12" strokeLinecap="round" />
        <rect x="691" y="154" width="47" height="40" rx="5" className="sl-character__box" /><path d="M711 155V173H719V155" fill="#fff" fillOpacity=".75" />
        <path d="M772 165 797 188 777 214 810 217" className="sl-character__trousers" /><path d="M802 210 820 217 818 226H792L790 218Z" className="sl-character__hair" />
        <path d="M753 105Q774 94 788 112L803 157 771 175 746 146Z" fill="var(--sl-blue)" />
        <path d="M784 116 805 145 831 152" className="sl-character__limb" />
        <path d="M763 88V106L778 112 783 92" className="sl-character__skin" /><ellipse cx="774" cy="75" rx="20" ry="23" className="sl-character__skin" />
        <path d="M752 77Q742 47 769 44 797 42 798 70L774 67 768 82Z" fill="var(--sl-violet)" /><path d="M775 67H806" stroke="var(--sl-blue)" strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  </figure>;
}
