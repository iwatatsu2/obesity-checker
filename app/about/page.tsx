import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "開発者について｜肥満症治療薬 保険適応セルフチェック",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-lg mx-auto px-5 py-8">
        <h1 className="text-xl font-bold text-gray-800 mb-4">開発者について</h1>

        {/* Profile */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
          <Image
            src="/dr-iwatatsu.png"
            alt="Dr. いわたつ"
            width={120}
            height={120}
            className="rounded-full border-2 border-teal-200 mx-auto mb-4 object-cover object-top"
            style={{ width: 120, height: 120 }}
          />
          <h2 className="text-lg font-bold text-gray-800">Dr. いわたつ</h2>
          <p className="text-sm text-teal-600 mt-1">糖尿病・内分泌 専門医・指導医</p>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed text-left">
            糖尿病・内分泌内科の専門医として臨床に従事しながら、医療現場で本当に使えるツールを自ら開発しています。肥満症治療薬の適応判断を、患者さん・医療者が手早く確認できるよう、このツールを作りました。
          </p>
        </div>

        {/* Links */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mt-4 shadow-sm space-y-2">
          <h3 className="text-sm font-bold text-gray-700 mb-2">リンク</h3>
          <a
            href="https://driwatatsu-hp.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:border-teal-300 transition-colors"
          >
            <span className="text-base">🌐</span>
            <span className="text-sm font-medium text-gray-700">公式サイト</span>
            <span className="text-xs text-gray-400 ml-auto">アプリ・研究・講演情報</span>
          </a>
          <a
            href="https://medapp-market.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:border-teal-300 transition-colors"
          >
            <span className="text-base">🏥</span>
            <span className="text-sm font-medium text-gray-700">医療アプリまとめ</span>
          </a>
          <a
            href="https://www.instagram.com/dr.iwatatsu/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:border-teal-300 transition-colors"
          >
            <span className="text-base">📷</span>
            <span className="text-sm font-medium text-gray-700">Instagram</span>
            <span className="text-xs text-gray-400 ml-auto">@dr.iwatatsu</span>
          </a>
          <a
            href="https://x.com/KenKyu1019799"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:border-teal-300 transition-colors"
          >
            <span className="text-base">𝕏</span>
            <span className="text-sm font-medium text-gray-700">X (Twitter)</span>
            <span className="text-xs text-gray-400 ml-auto">@KenKyu1019799</span>
          </a>
          <a
            href="https://note.com/dr_iwatatsu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:border-teal-300 transition-colors"
          >
            <span className="text-base">📝</span>
            <span className="text-sm font-medium text-gray-700">note</span>
            <span className="text-xs text-gray-400 ml-auto">dr_iwatatsu</span>
          </a>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mt-4">
          <p className="text-xs text-amber-700 leading-relaxed">
            本ツールは医療行為ではなく、保険適応の可能性を簡易的に確認する参考ツールです。実際の診断・治療の適否は必ず医療機関にご相談ください。
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-block bg-teal-600 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors"
          >
            セルフチェックに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
