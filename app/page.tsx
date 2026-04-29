"use client";

import { useState } from "react";

type Step = "start" | "bmi" | "medication" | "disorders" | "result";
type Result = "eligible" | "not-eligible" | null;

const HEALTH_DISORDERS = [
  { id: 1, label: "耐糖能障害", sub: "2型糖尿病・耐糖能異常など" },
  { id: 2, label: "脂質異常症", sub: "" },
  { id: 3, label: "高血圧", sub: "" },
  { id: 4, label: "高尿酸血症・痛風", sub: "" },
  { id: 5, label: "冠動脈疾患", sub: "" },
  { id: 6, label: "脳梗塞・一過性脳虚血発作", sub: "" },
  { id: 7, label: "非アルコール性脂肪性肝疾患", sub: "NAFLD" },
  { id: 8, label: "月経異常・女性不妊", sub: "" },
  { id: 9, label: "閉塞性睡眠時無呼吸症候群", sub: "肥満低換気症候群" },
  { id: 10, label: "運動器疾患", sub: "変形性関節症・変形性脊椎症" },
  { id: 11, label: "肥満関連腎臓病", sub: "" },
];

export default function Home() {
  const [step, setStep] = useState<Step>("start");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [selectedDisorders, setSelectedDisorders] = useState<number[]>([]);
  const [result, setResult] = useState<Result>(null);
  const [resultReason, setResultReason] = useState("");

  const calcBmi = () => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) return Math.round((w / (h * h)) * 10) / 10;
    return null;
  };

  const bmiCategory = (val: number) => {
    if (val < 18.5) return { label: "低体重", color: "#6b7280" };
    if (val < 25) return { label: "普通体重", color: "#10b981" };
    if (val < 30) return { label: "肥満（1度）", color: "#f59e0b" };
    if (val < 35) return { label: "肥満（2度）", color: "#ef4444" };
    return { label: "高度肥満", color: "#dc2626" };
  };

  const handleBmiSubmit = () => {
    const calculated = calcBmi();
    if (!calculated) return;
    setBmi(calculated);
    if (calculated < 25) {
      setResult("not-eligible");
      setResultReason(
        "BMIが25未満のため、肥満には該当しません。肥満症治療薬の適応対象外となります。"
      );
      setStep("result");
    } else {
      setStep("medication");
    }
  };

  const handleMedication = (has: boolean) => {
    if (!has) {
      setResult("not-eligible");
      setResultReason(
        "肥満症治療薬の保険適応には、高血圧・脂質異常症・2型糖尿病のいずれかで薬物治療中であることが必要です。"
      );
      setStep("result");
    } else if (bmi! >= 35) {
      setResult("eligible");
      setResultReason(
        "高度肥満（BMI 35以上）に該当し、対象疾患の治療中のため、肥満症治療薬の保険適応となる可能性があります。"
      );
      setStep("result");
    } else if (bmi! >= 27) {
      setStep("disorders");
    } else {
      setResult("not-eligible");
      setResultReason(
        "肥満症治療薬の保険適応にはBMI 27以上が必要です。まずは食事療法・運動療法について、かかりつけ医にご相談ください。"
      );
      setStep("result");
    }
  };

  const toggleDisorder = (id: number) => {
    setSelectedDisorders((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleDisordersSubmit = () => {
    if (selectedDisorders.length >= 2) {
      setResult("eligible");
      setResultReason(
        `対象疾患の治療中であり、肥満に関連する健康障害を${selectedDisorders.length}つお持ちのため、肥満症治療薬の保険適応となる可能性があります。`
      );
    } else {
      setResult("not-eligible");
      setResultReason(
        "BMI 27〜35の場合、肥満に関連する健康障害が2つ以上必要です。該当しない場合も、生活習慣の改善で効果が期待できます。"
      );
    }
    setStep("result");
  };

  const reset = () => {
    setStep("start");
    setHeight("");
    setWeight("");
    setBmi(null);
    setSelectedDisorders([]);
    setResult(null);
    setResultReason("");
  };

  const steps = [
    { key: "bmi", label: "BMI計算" },
    { key: "medication", label: "治療状況" },
    { key: "disorders", label: "健康障害" },
  ];
  const currentStepIdx = steps.findIndex((s) => s.key === step);

  return (
    <main className="min-h-screen bg-[#f0f4f8]">
      {/* Header bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-gray-800 leading-tight">
              肥満症治療薬 適応チェック
            </h1>
            <p className="text-[11px] text-gray-400">
              ウゴービ® / ゼップバウンド®
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6">
        {/* Progress bar */}
        {step !== "start" && step !== "result" && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {steps.map((s, i) => (
                <div key={s.key} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all duration-300 ${
                      currentStepIdx === i
                        ? "bg-teal-600 text-white scale-110"
                        : currentStepIdx > i
                        ? "bg-teal-100 text-teal-600"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {currentStepIdx > i ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`text-[10px] ${
                      currentStepIdx === i
                        ? "text-teal-600 font-bold"
                        : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width: `${((currentStepIdx + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Start */}
        {step === "start" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center mx-auto mb-5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" />
                  <path d="M9 14l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
                保険適応をセルフチェック
              </h2>
              <p className="text-sm text-gray-500 text-center leading-relaxed mb-6">
                肥満症治療薬（ウゴービ®・ゼップバウンド®）が
                保険適用で使える可能性があるか、
                3ステップで確認できます。
              </p>
              <div className="space-y-3 mb-6">
                {[
                  { num: "1", text: "身長・体重からBMIを計算" },
                  { num: "2", text: "現在の治療状況を確認" },
                  { num: "3", text: "関連する健康障害を確認" },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {item.num}
                    </div>
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep("bmi")}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-xl text-base font-bold hover:from-teal-700 hover:to-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-teal-200"
              >
                チェックを始める
              </button>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-600 leading-relaxed">
                このチェックは簡易的なセルフチェックです。
                実際の診断・治療は認定された専門医療機関で行われます。
              </p>
            </div>
          </div>
        )}

        {/* Step 1: BMI */}
        {step === "bmi" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              身長と体重を入力してください
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              BMIを自動で計算します
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  身長
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="170"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-lg font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent focus:bg-white transition"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    cm
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  体重
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="80"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-lg font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent focus:bg-white transition"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    kg
                  </span>
                </div>
              </div>

              {height && weight && calcBmi() && (
                <div className="rounded-xl p-5 text-center" style={{ backgroundColor: `${bmiCategory(calcBmi()!).color}08` }}>
                  <p className="text-xs text-gray-400 mb-1">あなたのBMI</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-black" style={{ color: bmiCategory(calcBmi()!).color }}>
                      {calcBmi()}
                    </span>
                    <span className="text-sm text-gray-400">kg/m²</span>
                  </div>
                  <span
                    className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: bmiCategory(calcBmi()!).color }}
                  >
                    {bmiCategory(calcBmi()!).label}
                  </span>
                </div>
              )}

              <button
                onClick={handleBmiSubmit}
                disabled={!height || !weight || !calcBmi()}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-xl text-base font-bold hover:from-teal-700 hover:to-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-teal-200 disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
              >
                次のステップへ
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Medication */}
        {step === "medication" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg">
                BMI {bmi}
              </span>
              <span className="text-xs text-gray-400">
                {bmiCategory(bmi!).label}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              以下の疾患で薬物治療を
              受けていますか？
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              いずれか1つ以上の治療が条件です
            </p>
            <div className="space-y-2 mb-6">
              {[
                { icon: "💊", name: "高血圧", desc: "降圧薬を服用中" },
                { icon: "💊", name: "脂質異常症", desc: "コレステロール・中性脂肪の薬を服用中" },
                { icon: "💊", name: "2型糖尿病", desc: "血糖降下薬・インスリンなどで治療中" },
              ].map((d) => (
                <div
                  key={d.name}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3.5"
                >
                  <span className="text-lg">{d.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{d.name}</p>
                    <p className="text-[11px] text-gray-400">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleMedication(true)}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-xl text-base font-bold hover:from-teal-700 hover:to-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-teal-200"
              >
                はい
              </button>
              <button
                onClick={() => handleMedication(false)}
                className="bg-gray-100 text-gray-500 py-4 rounded-xl text-base font-bold hover:bg-gray-200 active:scale-[0.98] transition-all"
              >
                いいえ
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Health Disorders */}
        {step === "disorders" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg">
                BMI {bmi}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              該当する健康障害を
              すべて選択してください
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              医師から診断を受けている、
              または治療中のものを選んでください
            </p>
            <div className="flex items-center gap-2 bg-rose-50 rounded-lg px-3 py-2 mb-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <span className="text-xs text-rose-600 font-medium">
                2つ以上の該当が必要です
              </span>
            </div>
            <div className="space-y-1.5 mb-5">
              {HEALTH_DISORDERS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => toggleDisorder(d.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all ${
                    selectedDisorders.includes(d.id)
                      ? "border-teal-400 bg-teal-50"
                      : "border-transparent bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all ${
                        selectedDisorders.includes(d.id)
                          ? "bg-teal-600"
                          : "border-2 border-gray-300 bg-white"
                      }`}
                    >
                      {selectedDisorders.includes(d.id) && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <span className={`text-sm ${selectedDisorders.includes(d.id) ? "text-teal-800 font-bold" : "text-gray-700"}`}>
                        {d.label}
                      </span>
                      {d.sub && (
                        <span className="text-[10px] text-gray-400 ml-1">
                          {d.sub}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm text-gray-400">選択中</span>
              <span
                className={`text-2xl font-black ${
                  selectedDisorders.length >= 2
                    ? "text-emerald-600"
                    : "text-gray-300"
                }`}
              >
                {selectedDisorders.length}
              </span>
              <span className="text-sm text-gray-400">/ 2つ以上</span>
            </div>
            <button
              onClick={handleDisordersSubmit}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-4 rounded-xl text-base font-bold hover:from-teal-700 hover:to-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-teal-200"
            >
              判定する
            </button>
          </div>
        )}

        {/* Result */}
        {step === "result" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {result === "eligible" ? (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12l3 3 5-5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-emerald-700 mb-2">
                    保険適応の対象となる
                    可能性があります
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-1">
                    BMI: <span className="font-bold text-gray-700">{bmi} kg/m²</span>
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {resultReason}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9l-6 6M9 9l6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-600 mb-2">
                    現時点では
                    保険適応の対象外です
                  </h3>
                  {bmi && (
                    <p className="text-sm text-gray-500 leading-relaxed mb-1">
                      BMI: <span className="font-bold text-gray-700">{bmi} kg/m²</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {resultReason}
                  </p>
                </div>
              )}
            </div>

            {result === "eligible" && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h4 className="text-sm font-bold text-gray-800 mb-3">
                  次のステップ
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      num: "1",
                      title: "かかりつけ医に相談",
                      desc: "肥満症治療薬に興味があることを伝えてください",
                    },
                    {
                      num: "2",
                      title: "専門医療機関への紹介",
                      desc: "教育認定施設への紹介状を書いてもらいましょう",
                    },
                    {
                      num: "3",
                      title: "生活習慣の見直し",
                      desc: "食事・運動療法の実施状況も確認されます",
                    },
                  ].map((item) => (
                    <div
                      key={item.num}
                      className="flex gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {item.num}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result === "not-eligible" && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h4 className="text-sm font-bold text-gray-800 mb-3">
                  体重管理でお悩みの方へ
                </h4>
                <div className="space-y-2 text-sm text-gray-500 leading-relaxed">
                  <p>
                    肥満症治療は薬物療法だけではありません。
                    食事療法・運動療法・行動療法によって、
                    多くの方が改善を実感されています。
                  </p>
                  <p>
                    まずはかかりつけ医に
                    体重管理についてご相談ください。
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={reset}
              className="w-full bg-white text-teal-600 py-4 rounded-xl text-base font-bold hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm border border-gray-100"
            >
              もう一度チェックする
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pb-6 text-center space-y-1">
          <p className="text-[10px] text-gray-300 leading-relaxed">
            日本肥満学会・日本肥満症治療学会
          </p>
          <p className="text-[10px] text-gray-300 leading-relaxed">
            「肥満症治療薬の安全・適正使用に関する
            ステートメント」（2025年4月改訂）準拠
          </p>
          <p className="text-[10px] text-gray-300 mt-2">
            本ツールは医療行為ではありません
          </p>
        </div>
      </div>
    </main>
  );
}
