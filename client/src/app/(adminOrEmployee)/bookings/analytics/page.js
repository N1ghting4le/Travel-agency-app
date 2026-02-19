import { getData } from "@/utils/getData";
import { BASE_URL } from "@/constants/queryPaths";
import { Analytics } from "@/components/analytics";

import styles from "./page.module.css";

const getDefaultAnalytics = async () => {
  const year = new Date().getFullYear();

  return await Promise.all([
    getData(`${BASE_URL}/booking/charts/costs?year=${year}`),
    getData(`${BASE_URL}/booking/charts/amounts?year=${year}`),
    getData(`${BASE_URL}/booking/summary?year=${year}`),
  ]);
};

export default async function AnalyticsPage() {
  const [costs, amounts, summary] = await getDefaultAnalytics();

  return (
    <main className={styles.main}>
      <Analytics
        initialAmounts={amounts}
        initialCosts={costs}
        initialSummary={summary}
      />
    </main>
  );
}
