import React, { useState, useEffect, useRef } from 'react';

type UserRole = 'guest' | 'student' | 'teacher';

interface UserProfile {
  name: string;
  role: UserRole;
  academicId?: string;
  className?: string;
  points?: number;
}

interface Lesson {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  selfLabQuestion: string;
  mindMap: string[];
  industrialApp: string;
  duration: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Ion {
  id: string;
  name: string;
  symbol: string;
  charge: number;
  type: 'cation' | 'anion';
  isPolyatomic: boolean;
}

const CATIONS: Ion[] = [
  { id: 'Na', name: 'صوديوم', symbol: 'Na⁺', charge: 1, type: 'cation', isPolyatomic: false },
  { id: 'K', name: 'بوتاسيوم', symbol: 'K⁺', charge: 1, type: 'cation', isPolyatomic: false },
  { id: 'Mg', name: 'مغنيسيوم', symbol: 'Mg²⁺', charge: 2, type: 'cation', isPolyatomic: false },
  { id: 'Ca', name: 'كالسيوم', symbol: 'Ca²⁺', charge: 2, type: 'cation', isPolyatomic: false },
  { id: 'Al', name: 'ألومنيوم', symbol: 'Al³⁺', charge: 3, type: 'cation', isPolyatomic: false },
  { id: 'Fe2', name: 'حديد (II)', symbol: 'Fe²⁺', charge: 2, type: 'cation', isPolyatomic: false },
  { id: 'Fe3', name: 'حديد (III)', symbol: 'Fe³⁺', charge: 3, type: 'cation', isPolyatomic: false },
  { id: 'NH4', name: 'أمونيوم', symbol: 'NH₄⁺', charge: 1, type: 'cation', isPolyatomic: true },
];

const ANIONS: Ion[] = [
  { id: 'Cl', name: 'كلوريد', symbol: 'Cl⁻', charge: -1, type: 'anion', isPolyatomic: false },
  { id: 'F', name: 'فلوريد', symbol: 'F⁻', charge: -1, type: 'anion', isPolyatomic: false },
  { id: 'O', name: 'أكسيد', symbol: 'O²⁻', charge: -2, type: 'anion', isPolyatomic: false },
  { id: 'S', name: 'كبريتيد', symbol: 'S²⁻', charge: -2, type: 'anion', isPolyatomic: false },
  { id: 'OH', name: 'هيدروكسيد', symbol: 'OH⁻', charge: -1, type: 'anion', isPolyatomic: true },
  { id: 'NO3', name: 'نترات', symbol: 'NO₃⁻', charge: -1, type: 'anion', isPolyatomic: true },
  { id: 'SO4', name: 'كبريتات', symbol: 'SO₄²⁻', charge: -2, type: 'anion', isPolyatomic: true },
  { id: 'CO3', name: 'كربونات', symbol: 'CO₃²⁻', charge: -2, type: 'anion', isPolyatomic: true },
  { id: 'PO4', name: 'فوسفات', symbol: 'PO₄³⁻', charge: -3, type: 'anion', isPolyatomic: true },
];

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

// ================= 1. محاكاة النماذج الذرية وتجاربها =================
function AtomicSim() {
  const [activeModel, setActiveModel] = useState<'dalton' | 'thomson' | 'rutherford' | 'modern'>('dalton');
  
  const [thomsonActive, setThomsonActive] = useState(true);
  const [fieldStrength, setFieldStrength] = useState(50);
  const thomsonCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [rutherfordActive, setRutherfordActive] = useState(false);
  const [stats, setStats] = useState({ passed: 0, deflected: 0, bounced: 0 });
  const rutherfordCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const modernCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (activeModel === 'thomson' && thomsonCanvasRef.current) {
      const canvas = thomsonCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      let animId: number;
      let offset = 0;

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(30, 60, canvas.width - 60, 140);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.strokeRect(30, 60, canvas.width - 60, 140);

        ctx.fillStyle = '#64748b';
        ctx.fillRect(35, 75, 12, 110);
        ctx.fillRect(canvas.width - 47, 75, 12, 110);
        ctx.fillStyle = '#fff';
        ctx.font = '11px sans-serif';
        ctx.fillText('المهبط (-)', 25, 205);
        ctx.fillText('المصعد (+)', canvas.width - 55, 205);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(200, 48, 160, 10);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(200, 202, 160, 10);
        ctx.fillStyle = '#ef4444';
        ctx.fillText('لوح موجب (+)', 240, 40);
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('لوح سالب (-)', 240, 226);

        ctx.beginPath();
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 15;

        const startX = 47;
        const endX = canvas.width - 47;
        const midX = (startX + endX) / 2;

        ctx.moveTo(startX, 130);
        if (thomsonActive) {
          const deflection = (fieldStrength / 50) * 40;
          ctx.quadraticCurveTo(midX, 130 - deflection, endX, 130 - deflection);
        } else {
          ctx.lineTo(endX, 130);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        offset = (offset + 5) % 35;
        ctx.fillStyle = '#ffffff';
        for (let x = startX + offset; x < endX; x += 35) {
          let y = 130;
          if (thomsonActive) {
            const progress = (x - startX) / (endX - startX);
            const deflection = (fieldStrength / 50) * 40;
            y = 130 - deflection * Math.sin(progress * Math.PI);
          }
          ctx.beginPath();
          ctx.arc(x, y, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        animId = requestAnimationFrame(render);
      };

      render();
      return () => cancelAnimationFrame(animId);
    }
  }, [activeModel, thomsonActive, fieldStrength]);

  useEffect(() => {
    if (activeModel === 'rutherford' && rutherfordCanvasRef.current) {
      const canvas = rutherfordCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      let animId: number;

      let particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        history: Array<{ x: number; y: number }>;
        type: 'passed' | 'deflected' | 'bounced';
        counted: boolean;
      }> = [];

      let countPassed = 0;
      let countDeflected = 0;
      let countBounced = 0;

      const spawnParticle = () => {
        if (particles.length < 45 && rutherfordActive) {
          particles.push({
            x: 20,
            y: Math.random() * (canvas.height - 60) + 30,
            vx: 5,
            vy: 0,
            history: [],
            type: 'passed',
            counted: false
          });
        }
      };

      const render = () => {
        ctx.fillStyle = 'rgba(2, 6, 23, 0.35)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < 0.35) spawnParticle();

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        const grad = ctx.createRadialGradient(cx, cy, 3, cx, cy, 28);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#fef08a');
        grad.addColorStop(1, '#ef4444');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 28, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.fillText('النواة الموجبة الثقيلة (+)', cx - 65, cy - 35);

        particles.forEach((p, idx) => {
          p.history.push({ x: p.x, y: p.y });
          if (p.history.length > 15) p.history.shift();

          const dx = p.x - cx;
          const dy = p.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 30) {
            if (Math.abs(dy) < 8 && p.vx > 0) {
              p.vx = -6;
              p.vy = 0;
              p.type = 'bounced';
              if (!p.counted) {
                countBounced++;
                p.counted = true;
              }
            } else if (p.type === 'passed') {
              const angle = Math.atan2(dy, dx);
              p.vx = Math.cos(angle) * 5;
              p.vy = Math.sin(angle) * 5;
              p.type = 'deflected';
              if (!p.counted) {
                countDeflected++;
                p.counted = true;
              }
            }
          } else if (dist < 70 && p.type === 'passed') {
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * 1.2;
            p.vy += Math.sin(angle) * 1.2;
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            p.vx = (p.vx / speed) * 5;
            p.vy = (p.vy / speed) * 5;
            p.type = 'deflected';
            if (!p.counted) {
              countDeflected++;
              p.counted = true;
            }
          }

          p.x += p.vx;
          p.y += p.vy;

          if (p.x > cx + 70 && p.type === 'passed' && !p.counted) {
            countPassed++;
            p.counted = true;
          }

          if (p.x > canvas.width + 40 || p.x < -40 || p.y < -30 || p.y > canvas.height + 30) {
            particles.splice(idx, 1);
          }

          if (p.history.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = 
              p.type === 'bounced' ? 'rgba(239, 68, 68, 0.9)' : 
              p.type === 'deflected' ? 'rgba(245, 158, 11, 0.9)' : 
              'rgba(56, 189, 248, 0.5)';
            ctx.lineWidth = 3;
            ctx.moveTo(p.history[0].x, p.history[0].y);
            for (let i = 1; i < p.history.length; i++) {
              ctx.lineTo(p.history[i].x, p.history[i].y);
            }
            ctx.stroke();
          }

          ctx.fillStyle = 
            p.type === 'bounced' ? '#ef4444' : 
            p.type === 'deflected' ? '#f59e0b' : 
            '#38bdf8';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
          ctx.fill();
        });

        setStats({ passed: countPassed, deflected: countDeflected, bounced: countBounced });
        animId = requestAnimationFrame(render);
      };

      render();
      return () => cancelAnimationFrame(animId);
    }
  }, [activeModel, rutherfordActive]);

  useEffect(() => {
    if (activeModel === 'modern' && modernCanvasRef.current) {
      const canvas = modernCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      let animId: number;
      let angle = 0;

      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        angle += 0.03;
        for (let i = 0; i < 350; i++) {
          const r = Math.random() * 110 + 10;
          const a = Math.random() * Math.PI * 2 + angle;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * (r * 0.75);

          ctx.fillStyle = `rgba(34, 211, 238, ${Math.random() * 0.6 + 0.1})`;
          ctx.fillRect(x, y, 2, 2);
        }

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.fillText('النواة (بروتونات ونيوترونات)', cx - 75, cy - 28);

        animId = requestAnimationFrame(render);
      };

      render();
      return () => cancelAnimationFrame(animId);
    }
  }, [activeModel]);

  return (
    <div className="space-y-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl" dir="rtl">
      <div className="text-center space-y-2 border-b pb-4">
        <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">⚛️ تطور النماذج الذرية وتجاربها</h3>
        <p className="text-sm text-slate-500">استكشف النماذج التاريخية للذرة وتجاربها بعمليات محاكاة دقيقة.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-200 dark:bg-slate-800 p-2 rounded-2xl">
        {[
          { id: 'dalton', label: '1. نموذج دالتون' },
          { id: 'thomson', label: '2. نموذج طومسون' },
          { id: 'rutherford', label: '3. نموذج راذرفورد' },
          { id: 'modern', label: '4. النموذج الحديث' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveModel(tab.id as any)}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeModel === tab.id 
                ? 'bg-red-600 text-white shadow-lg' 
                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeModel === 'dalton' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border text-center space-y-4">
          <h4 className="text-xl font-bold text-red-500">تصور جون دالتون (1803م)</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300">الذرة عبارة عن كرة صلبة مصمتة غير قابلة للتجزئة أو الانقسام.</p>
          <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-tr from-red-600 to-rose-400 shadow-2xl flex items-center justify-center text-white font-black text-base animate-pulse">
            كرة دالتون الصلبة
          </div>
        </div>
      )}

      {activeModel === 'thomson' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-4">
          <h4 className="text-xl font-bold text-red-500">تجربة أشعة الكاثود وطومسون (1897م)</h4>
          <div className="flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border">
            <button
              onClick={() => setThomsonActive(!thomsonActive)}
              className={`px-4 py-2 rounded-xl font-bold text-xs text-white transition ${thomsonActive ? 'bg-emerald-600' : 'bg-slate-600'}`}
            >
              {thomsonActive ? 'إيقاف المجال الكهربائي' : 'تشغيل المجال الكهربائي'}
            </button>
          </div>
          <div className="relative h-60 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <canvas ref={thomsonCanvasRef} width={650} height={240} className="w-full h-full" />
          </div>
        </div>
      )}

      {activeModel === 'rutherford' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-4">
          <h4 className="text-xl font-bold text-red-500">تجربة صفيحة الذهب لراذرفورد (1911م)</h4>
          <div className="flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border">
            <button
              onClick={() => setRutherfordActive(!rutherfordActive)}
              className={`px-5 py-2 rounded-xl font-bold text-xs text-white shadow-md transition ${rutherfordActive ? 'bg-amber-600' : 'bg-red-600'}`}
            >
              {rutherfordActive ? 'إيقاف إطلاق الجسيمات' : 'إطلاق تدفق جسيمات ألفا 🚀'}
            </button>
            <div className="flex gap-4 text-xs font-bold" dir="ltr">
              <span className="text-sky-400">Passed: {stats.passed}</span>
              <span className="text-amber-400">Deflected: {stats.deflected}</span>
              <span className="text-red-400">Bounced: {stats.bounced}</span>
            </div>
          </div>
          <div className="relative h-60 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <canvas ref={rutherfordCanvasRef} width={650} height={240} className="w-full h-full" />
          </div>
        </div>
      )}

      {activeModel === 'modern' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-4">
          <h4 className="text-xl font-bold text-red-500">النموذج الذري الحديث (السحابة الإلكترونية)</h4>
          <div className="relative h-60 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <canvas ref={modernCanvasRef} width={650} height={240} className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
}

// ================= 2. مختبر المول والكتلة المولية =================
interface Substance {
  name: string;
  formula: string;
  molarMass: number;
}

const SUBSTANCES: Substance[] = [
  { name: 'الكربون', formula: 'C', molarMass: 12.011 },
  { name: 'الحديد', formula: 'Fe', molarMass: 55.845 },
  { name: 'الماء', formula: 'H₂O', molarMass: 18.015 },
  { name: 'الأكسجين', formula: 'O₂', molarMass: 31.998 },
  { name: 'كلوريد الصوديوم', formula: 'NaCl', molarMass: 58.44 },
];

function MoleLabSim() {
  const [selectedSubstance, setSelectedSubstance] = useState<Substance>(SUBSTANCES[2]);
  const [moles, setMoles] = useState<number>(1);

  const mass = (moles * selectedSubstance.molarMass).toFixed(2);
  const particles = (moles * 6.022e23).toExponential(3);

  return (
    <div className="space-y-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl" dir="rtl">
      <div className="text-center space-y-2 border-b pb-4">
        <h2 className="text-3xl font-black text-red-600 dark:text-red-400">مختبر المول والكتلة المولية ⚖️</h2>
        <p className="text-sm text-slate-500">احسب كميات المادة والكتلة وعدد الجسيمات وثابت أفوجادرو.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm">كمية المادة (عدد المولات):</span>
            <span className="px-3 py-1 bg-red-600 text-white rounded-lg font-mono font-bold" dir="ltr">{moles} mol</span>
          </div>

          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={moles}
            onChange={(e) => setMoles(parseFloat(e.target.value))}
            className="w-full accent-red-600 cursor-pointer"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border">
              <span className="text-xs text-slate-400 block mb-1">الكتلة الكلية (m):</span>
              <span className="text-xl font-bold text-emerald-600 font-mono" dir="ltr">{mass} g</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border">
              <span className="text-xs text-slate-400 block mb-1">الكتلة المولية (M):</span>
              <span className="text-xl font-bold text-sky-600 font-mono" dir="ltr">{selectedSubstance.molarMass} g/mol</span>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border">
              <span className="text-xs text-slate-400 block mb-1">عدد الجسيمات (N):</span>
              <span className="text-base font-bold text-amber-600 font-mono" dir="ltr">{particles}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-center">
            💡 قانون الحساب: الكتلة <span className="font-mono text-emerald-500">(m = n × M)</span> وعدد الجسيمات <span className="font-mono text-amber-500">(N = n × N_A)</span> حيث ثابت أفوجادرو يساوي <span className="font-mono text-sky-500">6.022 × 10²³</span>.
          </div>
        </div>

        <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border">
          <span className="font-bold text-sm text-red-500 block mb-2">اختر المادة الكيميائية:</span>
          <div className="space-y-2">
            {SUBSTANCES.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSubstance(sub)}
                className={`w-full p-3 rounded-xl font-bold text-sm flex justify-between items-center transition border ${
                  selectedSubstance.formula === sub.formula
                    ? 'bg-red-600 text-white border-red-500 shadow-lg'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}
              >
                <span>{sub.name} ({sub.formula})</span>
                <span className="text-xs font-mono opacity-80" dir="ltr">{sub.molarMass} g/mol</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= 3. مختبر بناء الصيغ وتسمية المركبات =================
function FormulaSim() {
  const [activeSubTab, setActiveSubTab] = useState<'builder' | 'naming' | 'molecular'>('builder');

  const [selectedCation, setSelectedCation] = useState<Ion>(CATIONS[0]);
  const [selectedAnion, setSelectedAnion] = useState<Ion>(ANIONS[0]);
  const [cationCount, setCationCount] = useState<number>(1);
  const [anionCount, setAnionCount] = useState<number>(1);

  const sampleCompounds = [
    { 
      formula: 'NaCl', 
      cation: 'الصوديوم', 
      anion: 'كلوريد', 
      name: 'كلوريد الصوديوم', 
      type: 'أبجدي أيوني بسيط',
      options: ['كلوريد الصوديوم', 'أكسيد الصوديوم', 'نترات الصوديوم', 'كربونات الصوديوم'],
      correct: 0
    },
    { 
      formula: 'MgCl₂', 
      cation: 'المغنيسيوم', 
      anion: 'كلوريد', 
      name: 'كلوريد المغنيسيوم', 
      type: 'أيوني مع عدد سفلي',
      options: ['كلوريد المغنيسيوم', 'أكسيد المغنيسيوم', 'فلوريد المغنيسيوم', 'كربونات المغنيسيوم'],
      correct: 0
    },
    { 
      formula: 'FeCl₃', 
      cation: 'الحديد (III)', 
      anion: 'كلوريد', 
      name: 'كلوريد الحديد (III)', 
      type: 'فلز انتقالي (نظام ستوك)',
      options: ['كلوريد الحديد (II)', 'كلوريد الحديد (III)', 'أكسيد الحديد (III)', 'نترات الحديد (III)'],
      correct: 1
    },
    { 
      formula: 'CaCO₃', 
      cation: 'الكالسيوم', 
      anion: 'كربونات', 
      name: 'كربونات الكالسيوم', 
      type: 'مجموعة ذرية عديدة الذرات',
      options: ['كربونات الكالسيوم', 'نترات الكالسيوم', 'فوسفات الكالسيوم', 'كبريتات الكالسيوم'],
      correct: 0
    },
    { 
      formula: 'NH₄NO₃', 
      cation: 'الأمونيوم', 
      anion: 'نترات', 
      name: 'نترات الأمونيوم', 
      type: 'مجموعات ذرية موجبة وسالبة',
      options: ['نترات الأمونيوم', 'كربونات الأمونيوم', 'فوسفات الأمونيوم', 'كبريتات الأمونيوم'],
      correct: 0
    },
  ];
  const [activeNamingIdx, setActiveNamingIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const handleSelectCompound = (idx: number) => {
    setActiveNamingIdx(idx);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
  };

  const handleAnswerCheck = (optIdx: number) => {
    setSelectedAnswer(optIdx);
    const correct = optIdx === sampleCompounds[activeNamingIdx].correct;
    setIsAnswerCorrect(correct);
  };

  const covalentElements = [
    { name: 'كربون', symbol: 'C' },
    { name: 'نيتروجين', symbol: 'N' },
    { name: 'فوسفور', symbol: 'P' },
    { name: 'كبريت', symbol: 'S' },
    { name: 'أكسجين', symbol: 'O' },
    { name: 'كلور', symbol: 'Cl' },
  ];
  const [elem1, setElem1] = useState(2);
  const [elem2, setElem2] = useState(5);
  const [count1, setCount1] = useState(1);
  const [count2, setCount2] = useState(1);

  const getGreekPrefix = (n: number) => {
    switch (n) {
      case 1: return { ar: 'أحادي', en: 'Mono-' };
      case 2: return { ar: 'ثنائي', en: 'Di-' };
      case 3: return { ar: 'ثلاثي', en: 'Tri-' };
      case 4: return { ar: 'رباعي', en: 'Tetra-' };
      case 5: return { ar: 'خماسي', en: 'Penta-' };
      case 6: return { ar: 'سداسي', en: 'Hexa-' };
      default: return { ar: '', en: '' };
    }
  };

  const getCovalentNaming = () => {
    const el1 = covalentElements[elem1];
    const el2 = covalentElements[elem2];

    const prefix1 = count1 > 1 ? getGreekPrefix(count1).ar : '';
    const prefix2 = getGreekPrefix(count2).ar;

    let baseName2 = el2.name;
    if (baseName2 === 'أكسجين') baseName2 = 'أكسيد';
    else if (baseName2 === 'كلور') baseName2 = 'كلوريد';
    else if (baseName2 === 'فلور') baseName2 = 'فلوريد';
    else if (baseName2 === 'بروم') baseName2 = 'بروميد';
    else if (baseName2 === 'يود') baseName2 = 'يوديد';
    else if (baseName2 === 'كبريت') baseName2 = 'كبريتيد';
    else if (baseName2 === 'نيتروجين') baseName2 = 'نيتريد';
    else if (baseName2 === 'كربون') baseName2 = 'كاربيد';
    else baseName2 = baseName2 + 'يد';

    const part2 = `${prefix2} ${baseName2}`.trim();
    const part1 = prefix1 ? `${prefix1} ${el1.name}` : el1.name;

    return `${part2} ${part1}`;
  };

  const totalPosCharge = selectedCation.charge * cationCount;
  const netCharge = (selectedCation.charge * cationCount) + (selectedAnion.charge * anionCount);
  const isNeutral = totalPosCharge > 0 && netCharge === 0;

  const getChemicalFormula = () => {
    let catSymbol = selectedCation.id === 'NH4' ? 'NH₄' : selectedCation.id;
    if (selectedCation.id === 'Fe2') catSymbol = 'Fe';
    if (selectedCation.id === 'Fe3') catSymbol = 'Fe';
    let anSymbol = selectedAnion.id;
    const totalNegChargeMag = Math.abs(selectedAnion.charge) * anionCount;
    const g = gcd(totalPosCharge / selectedCation.charge, totalNegChargeMag / Math.abs(selectedAnion.charge));
    const cSubNum = cationCount / g;
    const aSubNum = anionCount / g;
    const cSub = cSubNum > 1 ? subscriptNumber(cSubNum) : '';
    let aSub = aSubNum > 1 ? subscriptNumber(aSubNum) : '';
    if (selectedAnion.isPolyatomic && aSubNum > 1) {
      anSymbol = `(${anSymbol})`;
    }
    return `${catSymbol}${cSub}${anSymbol}${aSub}`;
  };

  const subscriptNumber = (num: number) => {
    const map: { [key: string]: string } = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
    return num.toString().split('').map(d => map[d] || d).join('');
  };

  return (
    <div className="space-y-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl" dir="rtl">
      <div className="text-center space-y-2 border-b pb-4">
        <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">🔬 مختبر الصيغ الكيميائية وتسمية المركبات</h3>
        <p className="text-sm text-slate-500">منصة محاكاة متقدمة لدراسة الصيغ، التسمية المنهجية، والمركبات الجزيئية والتساهمية.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-slate-200 dark:bg-slate-800 p-2 rounded-2xl">
        {[
          { id: 'builder', label: '1. بناء الصيغ' },
          { id: 'naming', label: '2. محاكاة التسمية الذكية' },
          { id: 'molecular', label: '3. محاكاة المركبات الجزيئية' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeSubTab === tab.id 
                ? 'bg-red-600 text-white shadow-lg' 
                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border">
            <h4 className="font-bold text-sm text-red-500">اختر الأيونات</h4>
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">الكاتيونات (موجبة):</span>
              <div className="flex flex-wrap gap-2">
                {CATIONS.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCation(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                      selectedCation.id === cat.id 
                        ? 'bg-red-600 text-white border-red-600 shadow-md' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat.name} ({cat.symbol})
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">الأنيونات (سالبة):</span>
              <div className="flex flex-wrap gap-2">
                {ANIONS.map(an => (
                  <button
                    key={an.id}
                    onClick={() => setSelectedAnion(an)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                      selectedAnion.id === an.id 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {an.name} ({an.symbol})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 text-white border space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-amber-400">منطقة البناء والتعادل الكهربائي</h4>
                <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">الهدف: مجموع الشحنات = 0</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/80 space-y-3 border border-slate-700">
                  <div className="flex justify-between text-sm font-bold text-red-400">
                    <span>{selectedCation.name}</span>
                    <span dir="ltr">{selectedCation.symbol}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-200">العدد:</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCationCount(Math.max(1, cationCount - 1))} className="w-7 h-7 rounded bg-slate-700 text-white font-bold">-</button>
                      <span className="font-bold text-white">{cationCount}</span>
                      <button onClick={() => setCationCount(cationCount + 1)} className="w-7 h-7 rounded bg-slate-700 text-white font-bold">+</button>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 space-y-3 border border-slate-700">
                  <div className="flex justify-between text-sm font-bold text-blue-400">
                    <span>{selectedAnion.name}</span>
                    <span dir="ltr">{selectedAnion.symbol}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-200">العدد:</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setAnionCount(Math.max(1, anionCount - 1))} className="w-7 h-7 rounded bg-slate-700 text-white font-bold">-</button>
                      <span className="font-bold text-white">{anionCount}</span>
                      <button onClick={() => setAnionCount(anionCount + 1)} className="w-7 h-7 rounded bg-slate-700 text-white font-bold">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">الصيغة الكيميائية:</div>
                <div className="text-3xl font-black text-amber-300 font-mono mt-1" dir="ltr">{getChemicalFormula()}</div>
              </div>
              <div className={`text-xs font-bold px-4 py-2 rounded-xl ${isNeutral ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                {isNeutral ? '✓ متعادل كهربائياً' : `✗ غير متعادل (صافي الشحنة: ${netCharge > 0 ? '+' + netCharge : netCharge})`}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'naming' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border">
            <h4 className="font-bold text-sm text-red-500 mb-2">اختر الصيغة لاختبار تسميتها:</h4>
            <div className="space-y-2">
              {sampleCompounds.map((comp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectCompound(idx)}
                  className={`w-full p-3.5 rounded-xl font-bold text-lg flex justify-center items-center transition border font-mono ${
                    activeNamingIdx === idx
                      ? 'bg-red-600 text-white border-red-500 shadow-md scale-105'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  dir="ltr"
                >
                  {comp.formula}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 text-white border space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-amber-400">🎯 تدريب التسمية والتفاعل</h4>
                <span className="text-xs bg-red-950 text-red-300 px-3 py-1 rounded-full border border-red-800">
                  {sampleCompounds[activeNamingIdx].type}
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                <span className="text-xs text-slate-400 block">الصيغة المراد تسميتها:</span>
                <span className="text-4xl font-black text-amber-300 font-mono tracking-wider block" dir="ltr">
                  {sampleCompounds[activeNamingIdx].formula}
                </span>
                <p className="text-xs text-slate-300 mt-2">ما هو الاسم العلمي النظامي الصحيح لهذا المركب؟ اختر من الإجابات أدناه:</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sampleCompounds[activeNamingIdx].options.map((opt, optIdx) => {
                  let btnStyle = "bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700";
                  if (selectedAnswer !== null) {
                    if (optIdx === sampleCompounds[activeNamingIdx].correct) {
                      btnStyle = "bg-emerald-600 text-white border-emerald-500 shadow-lg";
                    } else if (selectedAnswer === optIdx) {
                      btnStyle = "bg-rose-600 text-white border-rose-500";
                    } else {
                      btnStyle = "bg-slate-800/40 text-slate-500 border-slate-800";
                    }
                  }
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswerCheck(optIdx)}
                      className={`p-4 rounded-xl font-bold text-sm border transition ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {isAnswerCorrect !== null && (
              <div className={`p-4 rounded-xl text-center text-sm font-bold animate-bounce ${isAnswerCorrect ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                {isAnswerCorrect ? '🌟 إجابة صحيحة وموفقة! أحسنت يا بطل الكيمياء.' : '❌ إجابة خاطئة، حاول مرة أخرى وتذكر قواعد التسمية!'}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'molecular' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border">
            <h4 className="font-bold text-sm text-red-500">اختر العناصر والبادئات</h4>
            
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">العنصر الأول (الطرف الأيسر):</span>
                <div className="grid grid-cols-3 gap-2">
                  {covalentElements.map((el, i) => (
                    <button
                      key={i}
                      onClick={() => setElem1(i)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition border ${
                        elem1 === i
                          ? 'bg-red-600 text-white border-red-600 shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {el.name} ({el.symbol})
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <span className="text-slate-800 dark:text-slate-200 font-bold">عدد الذرات:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(n => (
                      <button
                        key={n}
                        onClick={() => setCount1(n)}
                        className={`w-8 h-8 rounded-lg font-bold transition ${
                          count1 === n 
                            ? 'bg-red-600 text-white shadow-md' 
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">العنصر الثاني (الأكسجين أو هالوجين):</span>
                <div className="grid grid-cols-3 gap-2">
                  {covalentElements.map((el, i) => (
                    <button
                      key={i}
                      onClick={() => setElem2(i)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition border ${
                        elem2 === i
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {el.name} ({el.symbol})
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 text-xs">
                  <span className="text-slate-800 dark:text-slate-200 font-bold">عدد الذرات:</span>
                  <div className="flex gap-1 flex-wrap">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <button
                        key={n}
                        onClick={() => setCount2(n)}
                        className={`w-7 h-7 rounded-lg font-bold transition ${
                          count2 === n 
                            ? 'bg-blue-600 text-white shadow-md' 
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 text-white border space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-amber-400">⚛️ محاكاة بناء الجزيئات التساهمية والبادئات اليونانية</h4>
                <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">روابط تساهمية ثنائية</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-xs text-slate-300">بادئة وعنصر الطرف الأيسر:</span>
                  <span className="text-base font-bold text-red-400">
                    {count1 > 1 ? getGreekPrefix(count1).ar : ''} {covalentElements[elem1].name}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-xs text-slate-300">بادئة وعنصر الطرف الأيمن (-يد):</span>
                  <span className="text-base font-bold text-blue-400">
                    {getGreekPrefix(count2).ar} {covalentElements[elem2].name === 'أكسجين' ? 'أكسيد' : covalentElements[elem2].name + 'يد'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">الصيغة التساهمية الجزيئية:</div>
                <div className="text-3xl font-black text-amber-300 font-mono mt-1" dir="ltr">
                  {covalentElements[elem1].symbol}{count1 > 1 ? subscriptNumber(count1) : ''}{covalentElements[elem2].symbol}{count2 > 1 ? subscriptNumber(count2) : ''}
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs text-slate-400">التسمية العلمية النظامية:</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">
                  {getCovalentNaming()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================= 4. مختبر التفاعلات والمعادلات الكيميائية الفائق (مع LTR للمعادلات) =================
function ReactionsSim() {
  const [reactionType, setReactionType] = useState<'synthesis' | 'decomposition' | 'single' | 'double'>('synthesis');
  const [temperature, setTemperature] = useState<number>(25); // °C
  const [hasCatalyst, setHasCatalyst] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [animStep, setAnimStep] = useState<number>(0);

  const reactionsData = {
    synthesis: {
      title: 'تفاعل التكوين (Synthesis / Combination)',
      description: 'اتحاد عنصرين أو مركبين لتكوين مركب واحد جديد (A + B → AB).',
      reactants: '2Mg(s) + O₂(g)',
      product: '2MgO(s)',
      typeBadge: 'تكوين / اتحاد مباشر',
      observation: 'احتراق المغنيسيوم بضوء أبيض ساطع وتكون مسحوق أبيض من أكسيد المغنيسيوم (طارد للحرارة).',
      energy: 'ΔH = -1204 kJ/mol (طارد للحرارة)'
    },
    decomposition: {
      title: 'تفاعل التفكك (Decomposition)',
      description: 'انقسام مركب واحد إلى مادتين أو أكثر بفعل الحرارة أو الكهرباء (AB → A + B).',
      reactants: '2H₂O(l) ⚡',
      product: '2H₂(g) + O₂(g)',
      typeBadge: 'تفكك / تحليل كهربائي',
      observation: 'تصاعد غاز الهيدروجين عند المهبط والأكسجين عند المصعد بنسبة حجمية 2:1.',
      energy: 'ΔH = +572 kJ/mol (ماص للحرارة)'
    },
    single: {
      title: 'تفاعل الإحلال البسيط (Single Replacement)',
      description: 'فلز أنشط يحل محل فلز أقل نشاطاً أو غاز الهيدروجين في مركب (A + BC → AC + B).',
      reactants: 'Zn(s) + 2HCl(aq)',
      product: 'ZnCl₂(aq) + H₂(g) ↑',
      typeBadge: 'إحلال بسيط (تطاير غاز)',
      observation: 'فوران نشط وتصاعد فقاعات غاز الهيدروجين واختفاء قطعة الخارصين تدريجياً.',
      energy: 'ΔH = -153 kJ/mol (طارد للحرارة)'
    },
    double: {
      title: 'تفاعل الإحلال المزدوج (Double Replacement)',
      description: 'تبادل الأيونات بين مركبين لتكوين راسب، ماء، أو غاز (AB + CD → AD + CB).',
      reactants: 'NaCl(aq) + AgNO₃(aq)',
      product: 'NaNO₃(aq) + AgCl(s) ↓',
      typeBadge: 'إحلال مزدوج (تكوين راسب أبيض)',
      observation: 'ظهور تعكر فوري وتكون راسب أبيض لفهود كلوريد الفضة (AgCl).',
      energy: 'تفاعل ترابط أيوني سريع'
    }
  };

  const currentRxn = reactionsData[reactionType];

  const runSimulation = () => {
    setIsSimulating(true);
    setAnimStep(1);
    const speedMultiplier = hasCatalyst ? 0.6 : 1;
    setTimeout(() => setAnimStep(2), 1000 * speedMultiplier);
    setTimeout(() => {
      setIsSimulating(false);
      setAnimStep(3);
    }, 2200 * speedMultiplier);
  };

  return (
    <div className="space-y-6 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl" dir="rtl">
      <div className="text-center space-y-2 border-b pb-4 dark:border-slate-800">
        <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">⚡ مختبر التفاعلات والمعادلات الكيميائية الافتراضي</h3>
        <p className="text-sm text-slate-500">تحكم بظروف التفاعل (درجة الحرارة والعوامل الحفازة) وراقب سلوك الذرات والمعادلات الموزونة.</p>
      </div>

      {/* نوع التفاعل Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-200 dark:bg-slate-800 p-2 rounded-2xl">
        {[
          { id: 'synthesis', label: '1. تفاعل تكوين' },
          { id: 'decomposition', label: '2. تفاعل تفكك' },
          { id: 'single', label: '3. إحلال بسيط' },
          { id: 'double', label: '4. إحلال مزدوج' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setReactionType(tab.id as any); setAnimStep(0); }}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              reactionType === tab.id 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* لوحة تحكم ظروف المختبر */}
        <div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">
                {currentRxn.typeBadge}
              </span>
              <span className="text-xs font-mono text-amber-500 font-bold">{currentRxn.energy}</span>
            </div>
            <h4 className="text-base font-bold">{currentRxn.title}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{currentRxn.description}</p>

            <div className="space-y-3 pt-2 border-t dark:border-slate-700">
              <div className="flex justify-between text-xs font-bold">
                <span>درجة حرارة التفاعل:</span>
                <span className="text-red-500 font-mono">{temperature} °C</span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                value={temperature}
                onChange={(e) => setTemperature(parseInt(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold">إضافة عامل حفاز (Catalyst):</span>
                <button
                  onClick={() => setHasCatalyst(!hasCatalyst)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${hasCatalyst ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-300'}`}
                >
                  {hasCatalyst ? '✓ مفعل (سرع التفاعل)' : 'معطل'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              👁️ <span className="font-bold">ملاحظة المخبر:</span> {currentRxn.observation}
            </div>

            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition"
            >
              {isSimulating ? '⏳ جاري سير التفاعل...' : '🚀 بدء التجربة والمحاكاة الذرية'}
            </button>
          </div>
        </div>

        {/* مسرح المحاكاة البصرية والمعادلة (مكتوبة من اليسار لليمين LTR تماماً) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-xs text-amber-400 font-bold">🔬 مسرح التفاعل الجزيئي التفاعلي</span>
            <span className="text-xs text-slate-400 font-mono">
              الحالة: {animStep === 0 ? 'في انتظار الإطلاق' : animStep === 1 ? 'اصطدام وتكسير الروابط' : animStep === 2 ? 'إعادة ترتيب الذرات' : 'تكون النواتج بنجاح ✓'}
            </span>
          </div>

          {/* محاكاة بصرية للذرات والمركبات وهي تتفاعل */}
          <div className="h-52 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center relative overflow-hidden">
            {reactionType === 'synthesis' && (
              <div className="flex items-center gap-6">
                <div className={`flex gap-2 transition-all duration-700 ${animStep >= 1 ? 'scale-90 opacity-80 translate-x-4' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center font-bold text-xs shadow-xl animate-pulse">Mg</div>
                  <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center font-bold text-xs shadow-xl animate-pulse">Mg</div>
                </div>
                <div className="text-2xl text-slate-500 font-bold">+</div>
                <div className={`w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs shadow-xl transition-all ${animStep >= 1 ? 'scale-90 -translate-x-4' : ''}`}>O₂</div>
                <div className="text-3xl text-red-500 font-bold animate-pulse">→</div>
                <div className={`p-4 rounded-2xl bg-emerald-950 border border-emerald-500 flex items-center gap-2 transition-all duration-700 ${animStep === 3 ? 'scale-110 shadow-2xl shadow-emerald-500/40 opacity-100' : 'opacity-20'}`}>
                  <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold">Mg</div>
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">O</div>
                </div>
              </div>
            )}

            {reactionType === 'decomposition' && (
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl bg-blue-950 border border-blue-500 flex items-center gap-2 transition-all duration-700 ${animStep === 0 ? 'scale-110 shadow-xl' : animStep >= 1 ? 'scale-75 opacity-70' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-sky-400 flex items-center justify-center text-xs font-bold text-slate-950">H₂O</div>
                </div>
                <div className="text-2xl text-amber-400 font-bold">→ {temperature > 100 ? '🔥 طاقة حرارية' : '⚡ كهرباء'} →</div>
                <div className={`flex gap-4 transition-all duration-700 ${animStep === 3 ? 'scale-110 opacity-100' : 'opacity-25'}`}>
                  <div className="w-11 h-11 rounded-full bg-sky-500 flex items-center justify-center font-bold text-xs shadow-lg animate-bounce">H₂</div>
                  <div className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center font-bold text-xs shadow-lg animate-bounce">O₂</div>
                </div>
              </div>
            )}

            {reactionType === 'single' && (
              <div className="flex items-center gap-4 text-sm font-mono">
                <div className="w-11 h-11 rounded-full bg-zinc-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg">Zn</div>
                <span className="text-slate-500">+</span>
                <div className="px-3 py-2 rounded-xl bg-slate-800 border">2HCl</div>
                <span className="text-red-500 font-bold text-xl">→</span>
                <div className={`px-3 py-2 rounded-xl bg-slate-800 border transition-all ${animStep === 3 ? 'border-emerald-500 text-emerald-400 shadow-lg' : 'opacity-30'}`}>ZnCl₂</div>
                <span className="text-slate-500">+</span>
                <div className={`w-11 h-11 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg transition-all ${animStep === 3 ? 'animate-bounce' : 'opacity-30'}`}>H₂↑</div>
              </div>
            )}

            {reactionType === 'double' && (
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="px-3 py-1.5 rounded bg-slate-800 border">NaCl</div>
                <span>+</span>
                <div className="px-3 py-1.5 rounded bg-slate-800 border">AgNO₃</div>
                <span className="text-red-500 font-bold text-xl">→</span>
                <div className="px-3 py-1.5 rounded bg-slate-800 border">NaNO₃</div>
                <span>+</span>
                <div className={`px-3 py-1.5 rounded bg-white text-slate-950 font-bold transition-all ${animStep === 3 ? 'scale-110 shadow-lg shadow-white/30' : 'opacity-30'}`}>AgCl↓ راسب أبيض</div>
              </div>
            )}
          </div>

          {/* المعادلة الكيميائية الموزونة - مرسومة حصرياً من اليسار إلى اليمين LTR */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block mb-1">المعادلة الكيميائية الموزونة (من اليسار لليمين):</span>
              <div className="text-2xl font-black text-amber-300 font-mono tracking-wider" dir="ltr">
                {currentRxn.reactants} <span className="text-red-500">→</span> {currentRxn.product}
              </div>
            </div>
            <div className="text-left bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">حالة الحفظ:</span>
              <span className="text-xs font-bold text-emerald-400">الكتلة محفوظة الذرات متساوية ✓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= 5. المكون الرئيسي الشامل (App) =================
export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeSimSubTab, setActiveSimSubTab] = useState<'atomic' | 'mole' | 'formula' | 'reactions'>('atomic');
  const [user, setUser] = useState<UserProfile>({ name: 'زائر', role: 'guest' });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginType, setLoginType] = useState<'student' | 'teacher'>('student');
  const [loginId, setLoginId] = useState<string>('');
  const [loginPin, setLoginPin] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "أي الجسيمات التالية يوجد داخل النواة ويحمل شحنة موجبة؟",
      options: ["البروتون", "الإلكترون", "النيوترون", "الفوتون"],
      correctAnswer: 0,
      explanation: "تحتوي النواة على البروتونات الموجبة الشحنة والنيوترونات المتعادلة."
    },
    {
      id: 2,
      question: "ماذا يتساوى في نظائر العنصر الواحد؟",
      options: ["عدد البروتونات", "عدد النيوترونات", "العدد الكتلي", "الكتلة الذرية"],
      correctAnswer: 0,
      explanation: "تتفق نظائر العنصر الواحد في عدد البروتونات (العدد الذري) وتختلف في عدد النيوترونات."
    },
    {
      id: 3,
      question: "ما الجسيم الذي اكتشفه العالم جيمس شادويك عام 1932م؟",
      options: ["النيوترون", "البروتون", "الإلكترون", "أشعة ألفا"],
      correctAnswer: 0,
      explanation: "أثبت جيمس شادويك وجود النيوترونات المتعادلة الشحنة داخل النواة."
    }
  ];

  const lessonsList: Lesson[] = [
    {
      id: 'l1',
      title: 'تركيب الذرة ونماذجها التاريخية',
      category: 'الفصل الأول: المادة - تركيب الذرة',
      summary: 'دراسة النماذج الذرية تاريخياً واكتشاف الإلكترونات والنواة.',
      content: 'تطور مفهوم الذرة عبر التاريخ من نموذج دالتون مروراً بطومسون وراذرفورد حتى النموذج الحديث.',
      selfLabQuestion: '🧠 مختبر ذاتي: لماذا اختلف نموذج طومسون عن نموذج راذرفورد؟',
      mindMap: ['دالتون', 'طومسون', 'راذرفورد', 'النموذج الحديث'],
      industrialApp: '🏭 تطبيق في البحرين: فحص بنية المواد وتطوير تقنيات العزل الحراري.',
      duration: '45 دقيقة'
    },
    {
      id: 'l2',
      title: 'كيف تختلف الذرات؟ النظائر والمول',
      category: 'الفصل الأول: المادة - تركيب الذرة',
      summary: 'العدد الذري والكتلي، النظائر، وحساب الكتلة المولية وعدد أفوجادرو.',
      content: 'تتفق نظائر العنصر الواحد في البروتونات وتختلف في النيوترونات.',
      selfLabQuestion: '🧠 مختبر ذاتي: احسب عدد المولات في 117g من كلوريد الصوديوم.',
      mindMap: ['العدد الذري', 'النظائر', 'الكتلة المولية', 'عدد أفوجادرو'],
      industrialApp: '🏭 تطبيق في البحرين: استخدام النظائر المشعة في الفحص الهندسي للأنابيب.',
      duration: '50 دقيقة'
    }
  ];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    let timer: any;
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isGameActive) {
      handleAnswerOptionClick(-1);
    }
    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

  const startChallenge = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(30);
    setIsGameActive(true);
    setIsGameOver(false);
    setSelectedOption(null);
  };

  const handleAnswerOptionClick = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    if (optionIndex === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 10);
      showToast('إجابة صحيحة! +10 نقاط 🌟');
    } else {
      showToast('إجابة خاطئة أو انتهى الوقت! ❌');
    }

    setTimeout(() => {
      const next = currentQuestionIndex + 1;
      if (next < quizQuestions.length) {
        setCurrentQuestionIndex(next);
        setTimeLeft(30);
        setSelectedOption(null);
      } else {
        setIsGameActive(false);
        setIsGameOver(true);
      }
    }, 1500);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginType === 'student') {
      if (!loginId || !loginPin) {
        showToast('يرجى إدخال الرقم الأكاديمي والرمز السري');
        return;
      }
      setUser({ name: `طالب (${loginId})`, role: 'student', academicId: loginId, className: 'كيم 102', points: 150 });
      showToast('مرحباً بك يا بطل الكيمياء!');
    } else {
      if (loginPin !== 'admin123') {
        showToast('كلمة مرور المعلم غير صحيحة (جرب admin123)');
        return;
      }
      setUser({ name: 'الأستاذ محسن علي عبدالمحسن', role: 'teacher', className: 'جميع شعب كيم 102' });
      showToast('أهلاً بك يا أستاذنا الفاضل');
    }
    setIsLoginModalOpen(false);
    setLoginId('');
    setLoginPin('');
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`} dir="rtl">
      
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-sm ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
              🧪
            </div>
            <div>
              <div className="text-xs font-medium text-red-600 dark:text-red-400">مملكة البحرين • وزارة التربية والتعليم</div>
              <h1 className="text-sm sm:text-base font-bold">مدرسة أحمد العمران الثانوية للبنين</h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1 space-x-reverse bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            {[
              { id: 'home', label: 'الرئيسية' },
              { id: 'lessons', label: 'الدروس التعليمية' },
              { id: 'simulations', label: 'المعامل الافتراضية' },
              { id: 'competitions', label: 'تحدي الثلاثين 🏆' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-red-600 text-white shadow-md shadow-red-600/20' : 'text-slate-700 dark:text-slate-200 hover:text-red-600'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3 space-x-reverse">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:scale-105 transition">
              {darkMode ? '☀️' : '🌙'}
            </button>
            {user.role === 'guest' ? (
              <button onClick={() => setIsLoginModalOpen(true)} className="px-5 py-2.5 rounded-2xl bg-red-600 text-white font-medium text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition">
                تسجيل الدخول
              </button>
            ) : (
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-bold">{user.name}</div>
                  <div className="text-xs text-red-600 dark:text-red-400">{user.role === 'teacher' ? 'معلم المادة' : `نقاط: ${user.points}`}</div>
                </div>
                <button onClick={() => setUser({ name: 'زائر', role: 'guest' })} className="px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 text-xs font-bold">خروج</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-700 to-blue-900 text-white p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center space-y-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />
              <span className="px-4 py-1.5 rounded-full bg-white/10 text-xs sm:text-sm border border-white/20 backdrop-blur-md">مقرر كيم 102 – مسار توحيد المسارات</span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">منصة كيمياء 1 التعليمية</h1>
              <p className="text-xs sm:text-sm text-slate-100 max-w-xl leading-relaxed opacity-90">بوابة تعليمية متقدمة لمحاكاة التجارب والدروس والمسابقات الكيميائية بأسلوب مبسط وممتع.</p>
              <div className="flex gap-4 justify-center pt-3">
                <button onClick={() => setActiveTab('lessons')} className="px-5 py-2.5 rounded-2xl bg-white text-red-600 font-bold text-sm shadow-xl hover:bg-slate-100 transition transform hover:-translate-y-0.5">الدروس التعليمية 📚</button>
                <button onClick={() => setActiveTab('simulations')} className="px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/30 font-bold text-sm hover:bg-white/20 transition transform hover:-translate-y-0.5">المعامل الافتراضية 🧪</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:border-red-500/50 transition duration-300 flex items-center justify-between group">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-400 block tracking-wide">👨‍🏫 إعداد المعلم الفاضل</span>
                  <span className="text-lg sm:text-xl font-black text-red-600 dark:text-red-400 block">الأستاذ محسن علي عبدالمحسن</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">معلم كيمياء بمدرسة أحمد العمران الثانوية للبنين</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition">👨‍🏫</div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:border-sky-500/50 transition duration-300 flex items-center justify-between group">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-400 block tracking-wide">⭐ بإشراف التوجيه التربوي</span>
                  <span className="text-lg sm:text-xl font-black text-sky-600 dark:text-sky-400 block">الأستاذ عادل محمد شوبار</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">موجّه مادة الكيمياء بوزارة التربية والتعليم</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition">⭐</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">📚 دروس مقرر كيم 102</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lessonsList.map(lesson => (
                <div key={lesson.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-500/10 text-red-500">{lesson.category}</span>
                    <h3 className="text-xl font-bold mt-2">{lesson.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{lesson.summary}</p>
                  </div>
                  <button onClick={() => setSelectedLesson(lesson)} className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold w-full hover:bg-red-700 transition shadow-md shadow-red-600/20">عرض الدرس والشرح</button>
                </div>
              ))}
            </div>

            {selectedLesson && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                <div className="w-full max-w-3xl my-8 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
                    <h3 className="text-2xl font-bold text-red-600">{selectedLesson.title}</h3>
                    <button onClick={() => setSelectedLesson(null)} className="text-slate-400 font-bold text-lg hover:text-red-500">✕</button>
                  </div>
                  <p className="leading-loose text-sm">{selectedLesson.content}</p>
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-sm font-medium border border-amber-500/20">{selectedLesson.selfLabQuestion}</div>
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-sm font-medium border border-emerald-500/20">{selectedLesson.industrialApp}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* المعامل الافتراضية */}
        {activeTab === 'simulations' && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">🧪 المعامل الافتراضية</h2>
              <p className="text-sm text-slate-500">اختر المختبر الافتراضي الذي تريد استكشافه:</p>
            </div>

            <div className="flex justify-center gap-2 flex-wrap bg-slate-200 dark:bg-slate-800 p-2 rounded-2xl max-w-5xl mx-auto border border-slate-300 dark:border-slate-700">
              <button
                onClick={() => setActiveSimSubTab('atomic')}
                className={`px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeSimSubTab === 'atomic' 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700'
                }`}
              >
                ⚛️ النماذج الذرية
              </button>
              <button
                onClick={() => setActiveSimSubTab('mole')}
                className={`px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeSimSubTab === 'mole' 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700'
                }`}
              >
                ⚖️ مختبر المول
              </button>
              <button
                onClick={() => setActiveSimSubTab('formula')}
                className={`px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeSimSubTab === 'formula' 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700'
                }`}
              >
                🔬 بناء الصيغ
              </button>
              <button
                onClick={() => setActiveSimSubTab('reactions')}
                className={`px-4 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeSimSubTab === 'reactions' 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700'
                }`}
              >
                ⚡ التفاعلات والمعادلات
              </button>
            </div>

            <div className="pt-2">
              {activeSimSubTab === 'atomic' && <AtomicSim />}
              {activeSimSubTab === 'mole' && <MoleLabSim />}
              {activeSimSubTab === 'formula' && <FormulaSim />}
              {activeSimSubTab === 'reactions' && <ReactionsSim />}
            </div>
          </div>
        )}

        {/* تحدي الثلاثين */}
        {activeTab === 'competitions' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-red-600">🏆 مسابقة تحدي الثلاثين</h2>
              <p className="text-sm text-slate-500">أجب على الأسئلة في أقل من 30 ثانية لكل سؤال!</p>
            </div>

            {!isGameActive && !isGameOver && (
              <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-xl">
                <div className="text-5xl">⏱️</div>
                <h3 className="text-2xl font-bold">مستعد لاختبار معلوماتك؟</h3>
                <button onClick={startChallenge} className="px-8 py-3.5 rounded-2xl bg-red-600 text-white font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition">ابدأ التحدي الآن 🚀</button>
              </div>
            )}

            {isGameActive && (
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
                <div className="flex justify-between items-center text-sm font-bold border-b pb-3 dark:border-slate-800">
                  <span>السؤال {currentQuestionIndex + 1} من {quizQuestions.length}</span>
                  <span className="text-red-500">⏱️ {timeLeft} ثانية</span>
                  <span className="text-emerald-500">النقاط: {score}</span>
                </div>
                <h3 className="text-lg font-bold">{quizQuestions[currentQuestionIndex].question}</h3>
                <div className="grid grid-cols-1 gap-3">
                  {quizQuestions[currentQuestionIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={selectedOption !== null}
                      onClick={() => handleAnswerOptionClick(idx)}
                      className={`p-4 rounded-2xl border text-right font-medium transition ${
                        selectedOption === idx
                          ? idx === quizQuestions[currentQuestionIndex].correctAnswer ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-red-600 text-white border-red-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-red-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isGameOver && (
              <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-xl">
                <div className="text-5xl">🎉</div>
                <h3 className="text-2xl font-bold">أحسنت! انتهى التحدي</h3>
                <div className="text-lg font-bold text-emerald-500">مجموع نقاطك: {score} نقطة</div>
                <button onClick={startChallenge} className="px-6 py-3 rounded-2xl bg-red-600 text-white font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition">إعادة التحدي 🔄</button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">تسجيل الدخول</h3>
              <button onClick={() => setIsLoginModalOpen(false)} className="text-slate-400 font-bold hover:text-red-500">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button onClick={() => setLoginType('student')} className={`py-2 rounded-xl text-xs font-bold transition ${loginType === 'student' ? 'bg-red-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300'}`}>طالب</button>
              <button onClick={() => setLoginType('teacher')} className={`py-2 rounded-xl text-xs font-bold transition ${loginType === 'teacher' ? 'bg-red-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300'}`}>معلم</button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">{loginType === 'student' ? 'الرقم الأكاديمي' : 'اسم المستخدم'}</label>
                <input type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder={loginType === 'student' ? '20230123' : 'teacher@edugov.bh'} className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">{loginType === 'student' ? 'الرمز السري' : 'كلمة المرور'}</label>
                <input type="password" value={loginPin} onChange={(e) => setLoginPin(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm focus:outline-none focus:border-red-500" />
              </div>
              <button type="submit" className="w-full py-3.5 rounded-2xl bg-red-600 text-white font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition">دخول للمنصة</button>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 px-6 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl font-medium animate-bounce text-sm border border-slate-700 dark:border-slate-200">
          {toastMessage}
        </div>
      )}

      {/* Footer - Visible ONLY on Home Page */}
      {activeTab === 'home' && (
        <footer className="mt-12 border-t dark:border-slate-800 py-8 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold border border-red-500/20">
              مملكة البحرين • وزارة التربية والتعليم • مدرسة أحمد العمران الثانوية للبنين
            </div>
            <p className="text-xs text-slate-400 font-medium">منصة كيمياء 1 التعليمية © 2026</p>
          </div>
        </footer>
      )}

    </div>
  );
}