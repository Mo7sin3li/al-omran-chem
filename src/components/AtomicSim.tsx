import React, { useState, useEffect, useRef } from 'react';

export default function AtomicSim() {
  const [activeModel, setActiveModel] = useState<'dalton' | 'thomson' | 'rutherford' | 'modern'>('dalton');
  
  // حالات تجربة طومسون
  const [thomsonActive, setThomsonActive] = useState(true);
  const [fieldStrength, setFieldStrength] = useState(50);
  const thomsonCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // حالات تجربة راذرفورد (الضبط الدقيق للارتداد المرئي والعدادات)
  const [rutherfordActive, setRutherfordActive] = useState(false);
  const [stats, setStats] = useState({ passed: 0, deflected: 0, bounced: 0 });
  const rutherfordCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // حالات النموذج الحديث
  const modernCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. محاكاة أنبوب أشعة الكاثود لطومسون
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

  // 2. محاكاة راذرفورد (الارتداد المرئي الواضح، الانحراف الدقيق، والفراغ الساحق)
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

      let totalPassed = 0;
      let totalDeflected = 0;
      let totalBounced = 0;

      const spawnParticle = () => {
        if (particles.length < 25 && rutherfordActive) {
          particles.push({
            x: 10,
            y: Math.random() * (canvas.height - 40) + 20,
            vx: 1.8, // سرعة هادئة وبطيئة لتتبع العين بوضوح
            vy: 0,
            history: [],
            type: 'passed',
            counted: false
          });
        }
      };

      const render = () => {
        ctx.fillStyle = 'rgba(5, 5, 12, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // رسم الدوائر الحلقية المتقطعة (فراغ الذرة الهائل)
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 8]);
        [40, 80, 120, 160, 200].forEach(r => {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        });
        ctx.restore();

        // رسم النواة في المركز
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '10px sans-serif';
        ctx.fillText('النواة (+)', cx - 20, cy - 14);

        if (Math.random() < 0.15) spawnParticle();

        particles.forEach((p, idx) => {
          p.history.push({ x: p.x, y: p.y });
          if (p.history.length > 20) p.history.shift();

          const dx = p.x - cx;
          const dy = p.y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (!p.counted) {
            // أ) الارتداد (اصطدام مباشر بمركز النواة -> انعكاس كامل وواضح للخلف نحو اليسار)
            if (Math.abs(dx) <= 10 && Math.abs(dy) <= 8 && p.vx > 0) {
              p.vx = -1.8; // ارتداد فوري للخلف نحو اليسار
              p.vy = 0;
              p.type = 'bounced';
              totalBounced++;
              p.counted = true;
            } 
            // ب) الانحراف (مرور بالقرب من النواة -> انحراف بسيط ويواصل طريقه لليمين)
            else if (dist > 10 && dist < 45 && p.type === 'passed') {
              p.vx = 1.8;
              p.vy = dy < 0 ? -0.5 : 0.5; // انحراف طفيف للأعلى أو الأسفل
              p.type = 'deflected';
              totalDeflected++;
              p.counted = true;
            } 
            // ج) المرور (الغالبية العظمى تعبر عبر فراغ الذرة بلا أي انحراف نحو اليمين)
            else if (p.x > cx + 60 && p.type === 'passed') {
              totalPassed++;
              p.counted = true;
            }
          }

          p.x += p.vx;
          p.y += p.vy;

          // تنظيف الجسيمات عند خروجها من الشاشة (سواء لليسار بعد الارتداد أو لليمين)
          if (p.x > canvas.width + 30 || p.x < -30 || p.y < -20 || p.y > canvas.height + 20) {
            particles.splice(idx, 1);
          }

          // رسم ذيل الجسيم (أحمر ساطع للارتداد، بنفسجي للانحراف والعبور)
          if (p.history.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = 
              p.type === 'bounced' ? 'rgba(239, 68, 68, 0.95)' : 
              p.type === 'deflected' ? 'rgba(217, 70, 239, 0.85)' : 
              'rgba(217, 70, 239, 0.35)';
            ctx.lineWidth = p.type === 'bounced' ? 3 : 2.2;
            ctx.moveTo(p.history[0].x, p.history[0].y);
            for (let i = 1; i < p.history.length; i++) {
              ctx.lineTo(p.history[i].x, p.history[i].y);
            }
            ctx.stroke();
          }

          // رسم رأس الجسيم
          ctx.fillStyle = 
            p.type === 'bounced' ? '#ef4444' : 
            p.type === 'deflected' ? '#e879f9' : 
            '#f472b6';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.type === 'bounced' ? 4.5 : 3.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // تحديث العدادات التراكمية بدقة
        setStats({ passed: totalPassed, deflected: totalDeflected, bounced: totalBounced });

        animId = requestAnimationFrame(render);
      };

      render();
      return () => cancelAnimationFrame(animId);
    }
  }, [activeModel, rutherfordActive]);

  // 3. محاكاة النموذج الذري الحديث
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
    <div className="atomic-sim-container space-y-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl" dir="rtl">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-red-600 dark:text-red-400">تطور النماذج الذرية ومكونات الذرة</h2>
        <p className="text-slate-500 dark:text-slate-400">استكشف النماذج التاريخية للذرة وتجاربها بعمليات محاكاة واقعية تفاعلية.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl">
        {[
          { id: 'dalton', label: '1. نموذج دالتون' },
          { id: 'thomson', label: '2. نموذج طومسون' },
          { id: 'rutherford', label: '3. نموذج راذرفورد' },
          { id: 'modern', label: '4. النموذج الحديث' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveModel(tab.id as any)}
            className={`py-3 px-4 rounded-xl font-bold text-sm transition-all ${activeModel === tab.id ? 'bg-red-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeModel === 'dalton' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-6">
          <h3 className="text-2xl font-bold text-red-500">تصور جون دالتون (1803م)</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300">الذرة عبارة عن كرة صلبة مصمتة غير قابلة للتجزئة أو الانقسام.</p>
          <div className="flex justify-center py-8">
            <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 shadow-2xl flex items-center justify-center text-white font-black text-lg animate-pulse">
              كرة دالتون
            </div>
          </div>
        </div>
      )}

      {activeModel === 'thomson' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-6">
          <h3 className="text-2xl font-bold text-red-500">تجربة أشعة الكاثود وطومسون (1897م)</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300">تتحرك حزمة الإلكترونات سالبة الشحنة وتنحرف نحو اللوح الموجب عند تشغيل المجال الكهربائي.</p>

          <div className="flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border">
            <button
              onClick={() => setThomsonActive(!thomsonActive)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm text-white transition ${thomsonActive ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-600'}`}
            >
              {thomsonActive ? 'إيقاف المجال الكهربائي' : 'تشغيل المجال الكهربائي'}
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold">شدة المجال:</span>
              <input
                type="range"
                min="10"
                max="100"
                value={fieldStrength}
                onChange={(e) => setFieldStrength(Number(e.target.value))}
                className="accent-red-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="relative h-64 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <canvas ref={thomsonCanvasRef} width={650} height={250} className="w-full h-full" />
          </div>
        </div>
      )}

      {activeModel === 'rutherford' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-6">
          <h3 className="text-2xl font-bold text-red-500">تجربة صفيحة الذهب لراذرفورد (1911م)</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            تثبت التجربة أن معظم الذرة فراغ (مرور معظم الأشعة بلا انحراف)، مع انحراف بسيط لبعضها نحو اليمين، وارتداد نادر للخلف عند الاصطدام المباشر بالنواة.
          </p>

          <div className="flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border">
            <button
              onClick={() => setRutherfordActive(!rutherfordActive)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition ${rutherfordActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {rutherfordActive ? 'إيقاف إطلاق الجسيمات' : 'إطلاق تدفق جسيمات ألفا 🚀'}
            </button>
            <div className="flex gap-4 text-xs font-bold">
              <span className="text-sky-400">مرت بلا انحراف: {stats.passed}</span>
              <span className="text-amber-400">انحرفت بزوايا: {stats.deflected}</span>
              <span className="text-red-400">ارتدت للخلف: {stats.bounced}</span>
            </div>
          </div>

          <div className="relative h-64 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <canvas ref={rutherfordCanvasRef} width={650} height={250} className="w-full h-full" />
          </div>
        </div>
      )}

      {activeModel === 'modern' && (
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-6">
          <h3 className="text-2xl font-bold text-red-500">النموذج الذري الحديث (السحابة الإلكترونية)</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300">نواة مركزية كثيفة يحيط بها سحابة إلكترونية ديناميكية تمثل احتمالية وجود الإلكترون.</p>

          <div className="relative h-64 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <canvas ref={modernCanvasRef} width={650} height={250} className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
}