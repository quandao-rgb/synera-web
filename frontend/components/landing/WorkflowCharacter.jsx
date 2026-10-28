'use client';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const descriptions = [
  'Nhân viên kinh doanh tóc ngắn tạo đơn và kiểm tra danh sách hàng.',
  'Nhân viên kho đội mũ, mặc áo bảo hộ kiểm tra và đóng kiện.',
  'Nữ điều phối viên đeo tai nghe chọn dịch vụ giao hàng.',
  'Nhân viên giao nhận đội mũ bảo hiểm theo dõi xe trên hành trình.',
  'Nhân viên kế toán đeo kính đối chiếu và xác nhận chi phí.',
];
const people = [
  { skin: '#f5c7aa', hair: '#343052', shirt: 'var(--sl-violet)', legs: 'M66 131 62 154 47 177M88 131 94 155 105 177', leftArm: 'M51 84 38 106 63 124', rightArm: 'M117 85 137 104 163 94' },
  { skin: '#dba37e', hair: '#192444', shirt: 'var(--sl-cyan)', legs: 'M65 131 52 156 37 177M90 131 106 155 121 177', leftArm: 'M51 84 34 116 63 124', rightArm: 'M117 85 140 110 163 94' },
  { skin: '#b87956', hair: '#192444', shirt: 'var(--sl-blue)', legs: 'M66 131 57 156 43 177M88 131 97 155 110 177', leftArm: 'M51 84 37 111 63 124', rightArm: 'M117 85 133 97 163 94' },
  { skin: '#f0ba94', hair: '#192444', shirt: 'var(--sl-violet)', legs: 'M66 131 57 155 44 177M88 131 108 154 118 177', leftArm: 'M51 84 32 112 63 124', rightArm: 'M117 85 142 98 163 94' },
  { skin: '#e4b58e', hair: '#7b8caa', shirt: '#dcecff', legs: 'M66 131 62 156 45 177M88 131 96 156 112 177', leftArm: 'M51 84 37 115 63 124', rightArm: 'M117 85 138 107 163 94' },
];

export default function WorkflowCharacter({ step, active }) {
  const root = useRef(null);
  const person = people[step];
  useGSAP(() => {
    if (!active) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: root.current, start: 'top 92%', once: true },
      });
      timeline.from('.sl-workflow-actor__body', { y: 5, duration: 0.4 }, 0)
        .from('.sl-workflow-actor__arm', { rotation: [ -8, 14, -16, 8, -10 ][step], svgOrigin: '117 85', duration: 0.55 }, 0)
        .from('.sl-workflow-actor__prop', { y: 8, opacity: 0.4, duration: 0.45 }, 0.08);
      if (step === 1) timeline.from('.sl-workflow-actor__box', { y: -12, duration: 0.5 }, 0.1);
      if (step === 2) timeline.from('.sl-workflow-actor__head', { rotation: -6, svgOrigin: '78 70', duration: 0.5 }, 0.1);
      if (step === 3) {
        timeline.from('.sl-workflow-actor__truck', { x: -18, duration: 0.8 }, 0.05)
          .to('.sl-workflow-actor__wheel', { rotation: 150, transformOrigin: '50% 50%', duration: 0.8 }, 0.05);
      }
      if (step !== 3) timeline.from('.sl-workflow-actor__check', { scale: 0.5, opacity: 0, transformOrigin: '50% 50%', duration: 0.3 }, 0.35);
    });
    return () => media.revert();
  }, { scope: root, dependencies: [step, active], revertOnUpdate: true });

  return <figure ref={root} className="sl-workflow-actor" role="img" aria-label={descriptions[step]} style={{ '--sl-character-skin': person.skin, '--sl-actor-hair': person.hair }}>
    <svg viewBox="0 0 300 200" aria-hidden="true" focusable="false">
      <ellipse cx="155" cy="181" rx="132" ry="10" fill="var(--sl-blue)" opacity=".06" />
      <circle cx="223" cy="95" r="67" fill="var(--sl-cyan)" opacity=".07" />
      <path d={person.legs} className="sl-character__trousers" />
      <path d="M41 174 31 185H57L58 176M111 175 111 185H137L123 176Z" className="sl-character__hair" />
      <g className="sl-workflow-actor__body">
        <path d={step === 1 ? 'M46 80Q76 65 109 80L119 136Q80 148 45 135Z' : 'M49 79Q76 66 104 79L116 134Q80 147 48 133Z'} fill={person.shirt} />
        {step === 1 && <><path d="M58 80 67 135M99 80 94 136" stroke="#d2f3ff" strokeWidth="7" /><path d="M51 113H111" stroke="#fff" strokeOpacity=".8" strokeWidth="5" /></>}
        {step === 3 && <><path d="M58 81 67 135M100 80 95 137" stroke="var(--sl-cyan)" strokeWidth="10" /><rect x="73" y="103" width="14" height="15" rx="3" fill="#fff" fillOpacity=".8" /></>}
        {step === 4 && <><path d="m62 79 15 12 15-13" fill="#fff" /><path d="m77 91 6 0 5 28-9 8-7-9Z" fill="var(--sl-blue)" /></>}
        <g className="sl-workflow-actor__head">
          {step === 0 && <path d="M56 37Q58 13 81 16 104 16 104 44L109 82H52Z" fill="var(--sl-actor-hair)" />}
          {step === 2 && <path d="M59 30Q32 16 37 50L43 87 57 69Z" fill="var(--sl-actor-hair)" />}
          <path d="M62 63V79L80 88 91 76V60" className="sl-character__skin" />
          <ellipse cx="78" cy="47" rx={step === 4 ? 23 : 22} ry="25" className="sl-character__skin" />
          <path d={step === 0 ? 'M55 49Q48 23 72 18 101 12 104 43L91 45 83 30Q75 43 55 45Z' : 'M55 49Q43 20 71 17 100 11 103 38L89 42 83 30Q70 40 55 35Z'} fill="var(--sl-actor-hair)" />
          <circle cx="72" cy="49" r="1.6" fill="var(--sl-ink)" /><circle cx="87" cy="49" r="1.6" fill="var(--sl-ink)" />
          <path d="M74 59q6 5 12-1" fill="none" stroke="var(--sl-ink)" strokeOpacity=".6" strokeWidth="1.5" strokeLinecap="round" />
          {step === 1 && <><path d="M53 33Q52 12 77 12 102 12 104 34Z" fill="var(--sl-cyan)" /><path d="M53 34H112" stroke="var(--sl-blue)" strokeWidth="7" strokeLinecap="round" /></>}
          {step === 2 && <><path d="M54 47Q48 16 77 16 108 16 104 48" fill="none" stroke="var(--sl-violet)" strokeWidth="5" /><rect x="99" y="40" width="9" height="20" rx="4" fill="var(--sl-violet)" /><path d="M103 57 96 64H88" fill="none" stroke="var(--sl-violet)" strokeWidth="3" strokeLinecap="round" /></>}
          {step === 3 && <><path d="M52 43Q48 10 77 10 106 10 106 43L95 46 88 31H63L62 49Z" fill="var(--sl-cyan)" /><path d="M69 31H107V44H92" fill="#c9f3ff" fillOpacity=".85" /><path d="M96 47 88 70" stroke="var(--sl-blue)" strokeWidth="3" /></>}
          {step === 4 && <g fill="none" stroke="var(--sl-ink)" strokeWidth="2"><circle cx="71" cy="49" r="7" /><circle cx="88" cy="49" r="7" /><path d="M78 48H81M63 47 57 44M95 47 100 44" /></g>}
        </g>
        <path d={person.leftArm} fill="none" stroke="var(--sl-character-skin)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <g className="sl-workflow-actor__arm"><path d={person.rightArm} fill="none" stroke="var(--sl-character-skin)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" /><circle cx="164" cy="94" r="8" className="sl-character__skin" /></g>
      </g>
      <g className="sl-workflow-actor__prop">
        {step === 0 && <>
          <rect x="166" y="48" width="96" height="111" rx="12" fill="#fff" stroke="var(--sl-line)" strokeWidth="2" />
          <rect x="192" y="42" width="44" height="13" rx="5" fill="var(--sl-cyan)" />
          <path d="M181 75H242M181 91H234M181 107H219M181 123H211" className="sl-workflow-actor__lines" />
        </>}
        {step === 1 && <g className="sl-workflow-actor__box">
          <path d="M163 88 211 68 260 89 211 109Z" className="sl-character__box-top" />
          <path d="M163 88V143L211 165V109Z" className="sl-character__box" /><path d="M211 109 260 89V144L211 165Z" className="sl-character__box-side" />
          <path d="M187 78 236 99V123" fill="none" stroke="#fff" strokeWidth="9" strokeOpacity=".85" />
        </g>}
        {step === 2 && <>
          <rect x="166" y="48" width="106" height="116" rx="12" fill="#fff" stroke="var(--sl-line)" strokeWidth="2" />
          <rect x="176" y="65" width="86" height="37" rx="7" fill="var(--sl-pale)" />
          <circle cx="187" cy="83" r="6" fill="var(--sl-blue)" /><path d="M201 78H249M201 88H235M182 121H250M182 135H236" className="sl-workflow-actor__lines" />
        </>}
        {step === 3 && <>
          <path d="M156 169H282" fill="none" stroke="var(--sl-cyan)" strokeDasharray="5 6" strokeWidth="2" />
          <g className="sl-workflow-actor__truck">
            <rect x="155" y="89" width="77" height="58" rx="7" fill="var(--sl-blue)" /><path d="M232 108H255L274 129V147H232Z" fill="var(--sl-cyan)" />
            <path d="M239 114H251L263 129H239Z" fill="#d6f3ff" />
            <rect x="178" y="103" width="27" height="26" rx="3" className="sl-character__box-top" /><path d="M191 103V113" stroke="#fff" strokeWidth="4" />
            {[177,253].map(x => <g className="sl-workflow-actor__wheel" key={x}><circle cx={x} cy="148" r="13" fill="var(--sl-ink)" /><circle cx={x} cy="148" r="6" fill="#fff" /><path d={`M${x-4} 148h8`} stroke="var(--sl-control-line)" strokeWidth="2" /></g>)}
          </g>
        </>}
        {step === 4 && <>
          <path d="M177 47H252V163L242 157 232 163 221 157 210 163 199 157 188 163 177 157Z" fill="#fff" stroke="var(--sl-line)" strokeWidth="2" />
          <circle cx="215" cy="79" r="18" fill="var(--sl-violet-pale)" /><text x="215" y="86" textAnchor="middle" fontSize="23" fontWeight="600" fill="var(--sl-violet)">₫</text>
          <path d="M188 113H239M188 126H230M188 139H216" className="sl-workflow-actor__lines" />
        </>}
        {step !== 3 && <g className="sl-workflow-actor__check"><circle cx="253" cy="151" r="20" fill="var(--sl-violet)" /><path d="m244 151 6 6 12-13" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></g>}
      </g>
    </svg>
  </figure>;
}
