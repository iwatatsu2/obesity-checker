import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type ObesityCheck = {
  bmi: number;
  has_medication: boolean | null;
  disorders_count: number;
  result: "eligible" | "not-eligible";
};

export async function saveCheck(data: ObesityCheck) {
  return supabase.from("obesity_checks").insert(data);
}

export async function getStats() {
  const { data, error } = await supabase
    .from("obesity_checks")
    .select("bmi, has_medication, disorders_count, result, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return null;

  const total = data.length;
  const eligible = data.filter((d) => d.result === "eligible").length;
  const notEligible = total - eligible;

  const bmiRanges = {
    "25未満": data.filter((d) => d.bmi < 25).length,
    "25〜27": data.filter((d) => d.bmi >= 25 && d.bmi < 27).length,
    "27〜30": data.filter((d) => d.bmi >= 27 && d.bmi < 30).length,
    "30〜35": data.filter((d) => d.bmi >= 30 && d.bmi < 35).length,
    "35以上": data.filter((d) => d.bmi >= 35).length,
  };

  const avgBmi =
    total > 0 ? Math.round((data.reduce((s, d) => s + d.bmi, 0) / total) * 10) / 10 : 0;

  const withMedication = data.filter((d) => d.has_medication === true).length;

  return {
    total,
    eligible,
    notEligible,
    eligibleRate: total > 0 ? Math.round((eligible / total) * 100) : 0,
    bmiRanges,
    avgBmi,
    withMedication,
    medicationRate: total > 0 ? Math.round((withMedication / total) * 100) : 0,
    recent: data.slice(0, 20),
  };
}
