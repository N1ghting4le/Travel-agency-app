"use client";

import { BASE_URL } from "@/env";
import useQuery from "@/hooks/query.hook";
import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import countries from "@/lists/countries";
import { years, months } from "./constants";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { TableOfTours } from "./TableOfTours";

import styles from "./styles.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        font: {
          size: 16, // X-axis tick label font size
        },
      },
    },
    y: {
      ticks: {
        font: {
          size: 16, // Y-axis tick label font size
        },
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        font: {
          size: 16, // Legend label font size
        },
      },
    },
    tooltip: {
      bodyFont: {
        size: 16, // Tooltip body font size
      },
      titleFont: {
        size: 16, // Tooltip title font size
      },
    },
  },
};

const inputStyles = {
  width: 300,
};

export function Analytics({ initialCosts, initialAmounts, initialSummary }) {
  const [costs, setCosts] = useState(initialCosts);
  const [amounts, setAmounts] = useState(initialAmounts);
  const [summary, setSummary] = useState(initialSummary);

  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(null);
  const [country, setCountry] = useState(null);

  const { query } = useQuery();

  const fetchAnalytics = (year, month, country) => {
    let params = `year=${year}`;

    if (month !== null) {
      params += `&month=${month}`;
    }

    if (country) {
      params += `&country=${country}`;
    }

    query(`${BASE_URL}/booking/charts/costs?${params}`).then(setCosts);
    query(`${BASE_URL}/booking/charts/amounts?${params}`).then(setAmounts);
    query(`${BASE_URL}/booking/summary?${params}`).then(setSummary);
  };

  const handleYearChange = (_, newValue) => {
    setYear(newValue);
    fetchAnalytics(newValue, month, country);
  };

  const handleMonthChange = (_, newValue) => {
    const monthIndex = newValue === null ? null : months.indexOf(newValue);

    setMonth(monthIndex);
    fetchAnalytics(year, monthIndex, country);
  };

  const handleCountryChange = (_, newValue) => {
    setCountry(newValue);
    fetchAnalytics(year, month, newValue);
  };

  const costsChartData = {
    labels:
      month === null
        ? months
        : costs.map((item) => `${item.day} ${months[month].slice(0, 3)}`),
    datasets: [
      {
        label: `Общая стоимость бронирований за ${
          month === null ? "месяц" : "день"
        } ($)`,
        data: costs.map((item) => item.totalAmount),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const amountsChartData = {
    labels:
      month === null
        ? months
        : amounts.map((item) => `${item.day} ${months[month].slice(0, 3)}`),
    datasets: [
      {
        label: `Общее число бронирований за ${
          month === null ? "месяц" : "день"
        }`,
        data: amounts.map((item) => item.bookingsCount),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <>
      <div className={styles.selectMenusWrapper}>
        <Autocomplete
          options={years}
          getOptionLabel={(option) => String(option)}
          value={year}
          renderInput={(params) => <TextField {...params} label="Год" />}
          disableClearable
          onChange={handleYearChange}
          sx={inputStyles}
        />
        <Autocomplete
          options={months}
          value={month === null ? null : months[month]}
          renderInput={(params) => <TextField {...params} label="Месяц" />}
          onChange={handleMonthChange}
          sx={inputStyles}
        />
        <Autocomplete
          options={countries}
          value={country}
          renderInput={(params) => <TextField {...params} label="Страна" />}
          onChange={handleCountryChange}
          sx={inputStyles}
        />
      </div>
      <div className={styles.chartsWrapper}>
        <div className={styles.barContainer}>
          <Bar options={options} data={costsChartData} />
        </div>
        <div className={styles.barContainer}>
          <Bar options={options} data={amountsChartData} />
        </div>
        <p>
          Общая стоимость бронирований за {month === null ? "год" : "месяц"}:{" "}
          <strong>${summary.totalAmount.toFixed(2)}</strong>
        </p>
        <p>
          Общее число бронирований за {month === null ? "год" : "месяц"}:{" "}
          <strong>{summary.totalBookings}</strong>
        </p>
      </div>
      <TableOfTours {...{ year, month, country }} />
    </>
  );
}
