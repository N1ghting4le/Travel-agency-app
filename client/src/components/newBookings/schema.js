import { object, mixed, string } from "yup";
import dayjs from "dayjs";

import { minDate, maxDate } from "./constants";

const schema = object().shape({
  startDate: mixed()
    .required("Дата обязательна")
    .test("is-valid-date", "Некорректная дата", (value) =>
      dayjs(value).isValid(),
    )
    .test(
      "min-start-date",
      "Дата должна быть не раньше чем 01.01.2020",
      (value) => dayjs(value).isSame(minDate) || dayjs(value).isAfter(minDate),
    )
    .test(
      "max-start-date",
      "Дата не может быть позже чем сегодня",
      (value) => dayjs(value).isSame(maxDate) || dayjs(value).isBefore(maxDate),
    ),
  endDate: mixed()
    .required("Дата обязательна")
    .test("is-valid-date", "Некорректная дата", (value) =>
      dayjs(value).isValid(),
    )
    .test(
      "min-end-date",
      "Дата должна быть не раньше чем 01.01.2020",
      (value) => dayjs(value).isSame(minDate) || dayjs(value).isAfter(minDate),
    )
    .test(
      "max-end-date",
      "Дата не может быть позже чем сегодня",
      (value) => dayjs(value).isSame(maxDate) || dayjs(value).isBefore(maxDate),
    )
    .test(
      "is-same-or-after-start-date",
      "Конечная дата должна быть не раньше начальной",
      function (value) {
        const { startDate } = this.parent;

        if (!startDate || !dayjs(startDate).isValid()) {
          return true;
        }

        const minEndDate = dayjs(startDate).startOf("day");

        return (
          dayjs(value).isSame(minEndDate) || dayjs(value).isAfter(minEndDate)
        );
      },
    ),
  email: string()
    .trim()
    .transform((value) => value.toLowerCase())
    .notRequired(),
  phoneNumber: string().trim().notRequired(),
});

export default schema;
