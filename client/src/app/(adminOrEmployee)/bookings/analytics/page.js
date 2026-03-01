import { getData } from "@/utils/getData";
import {
  getBookingCostsApiEndpoint,
  getBookingAmountsApiEndpoint,
  getBookingSummaryApiEndpoint,
} from "@/constants/queryPaths";
import { Analytics } from "@/components/analytics";
import { getQueryParams } from "@/utils/getQueryParams";

import styles from "./page.module.css";

const getDefaultAnalytics = async () => {
  const year = new Date().getFullYear();
  const params = getQueryParams({ year });

  return await Promise.all([
    getData(getBookingCostsApiEndpoint(params)),
    getData(getBookingAmountsApiEndpoint(params)),
    getData(getBookingSummaryApiEndpoint(params)),
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
