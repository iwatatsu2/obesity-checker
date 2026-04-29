"use client";

import { useEffect, useState } from "react";
import { getStats } from "@/lib/supabase";

type Stats = Awaited<ReturnType<typeof getStats>>;

export default function StatsPage() {
  const [stats, setStats] = useState<Stats>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <p className="text-gray-400">読み込み中...</p>
      </main>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <main className="min-h-screen bg-[#f0f4f8]">
        <div className="max-w-2xl mx-auto px-5 py-10 text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-2">統計データ</h1>
          <p className="text-gray-400">まだチェックデータがありません</p>
        </div>
      </main>
    );
  }

  const maxBmiRange = Math.max(...Object.values(stats.bmiRanges));

  return (
    <main className="min-h-screen bg-[#f0f4f8]">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-[15px] font-bold text-gray-800">統計ダッシュボード</h1>
            <p className="text-[11px] text-gray-400">肥満症治療薬 適応チェック</p>
          </div>
          <a href="/" className="text-xs text-teal-600 hover:underline">
            チェックに戻る
          </a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-3xl font-black text-gray-800">{stats.total}</p>
            <p className="text-[11px] text-gray-400 mt-1">総チェック数</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-3xl font-black text-emerald-600">{stats.eligible}</p>
            <p className="text-[11px] text-gray-400 mt-1">適応の可能性あり</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-3xl font-black text-teal-600">{stats.eligibleRate}%</p>
            <p className="text-[11px] text-gray-400 mt-1">適応該当率</p>
          </div>
        </div>

        {/* Result breakdown */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 mb-3">判定結果の内訳</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">適応の可能性あり</span>
                <span className="font-bold text-emerald-600">{stats.eligible}件（{stats.eligibleRate}%）</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                  style={{ width: `${stats.eligibleRate}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">対象外</span>
                <span className="font-bold text-gray-500">{stats.notEligible}件（{100 - stats.eligibleRate}%）</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-300 rounded-full"
                  style={{ width: `${100 - stats.eligibleRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* BMI distribution */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 mb-1">BMI分布</h2>
          <p className="text-xs text-gray-400 mb-4">平均BMI: <span className="font-bold text-teal-600">{stats.avgBmi}</span></p>
          <div className="space-y-2">
            {Object.entries(stats.bmiRanges).map(([range, count]) => (
              <div key={range} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-16 text-right flex-shrink-0">{range}</span>
                <div className="flex-1 h-6 bg-gray-50 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-lg flex items-center px-2"
                    style={{ width: maxBmiRange > 0 ? `${Math.max((count / maxBmiRange) * 100, count > 0 ? 8 : 0)}%` : "0%" }}
                  >
                    {count > 0 && <span className="text-[10px] font-bold text-white">{count}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medication */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 mb-3">薬物治療状況</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none" stroke="#0d9488" strokeWidth="3"
                  strokeDasharray={`${stats.medicationRate} ${100 - stats.medicationRate}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black text-teal-600">{stats.medicationRate}%</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>チェックした方のうち</p>
              <p><span className="font-bold text-teal-700">{stats.withMedication}人</span>が薬物治療中</p>
            </div>
          </div>
        </div>

        {/* Recent checks */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 mb-3">直近のチェック</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-400 font-medium">日時</th>
                  <th className="text-right py-2 text-gray-400 font-medium">BMI</th>
                  <th className="text-center py-2 text-gray-400 font-medium">治療中</th>
                  <th className="text-center py-2 text-gray-400 font-medium">障害数</th>
                  <th className="text-right py-2 text-gray-400 font-medium">結果</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((r, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-2 text-gray-500">
                      {new Date(r.created_at).toLocaleDateString("ja-JP", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-2 text-right font-medium text-gray-700">{r.bmi}</td>
                    <td className="py-2 text-center">
                      {r.has_medication === true ? "✓" : r.has_medication === false ? "—" : "—"}
                    </td>
                    <td className="py-2 text-center text-gray-500">{r.disorders_count}</td>
                    <td className="py-2 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.result === "eligible"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {r.result === "eligible" ? "対象" : "対象外"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-[10px] text-gray-300 text-center pb-4">
          すべてのデータは匿名で収集されています
        </p>
      </div>
    </main>
  );
}
