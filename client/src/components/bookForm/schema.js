import { number, object, mixed } from "yup";
import dayjs from "dayjs";

import { minStartDate, maxStartDate } from "./constants";

const schema = object().shape({
  startDate: mixed()
    .required("Вы не ввели дату начала")
    .test("is-valid-date", "Некорректная дата", (value) =>
      dayjs(value).isValid(),
    )
    .test(
      "min-start-date",
      "Дата начала должна быть не раньше чем через неделю от сегодня",
      (value) =>
        dayjs(value).isSame(minStartDate) || dayjs(value).isAfter(minStartDate),
    )
    .test(
      "max-start-date",
      "Дата начала не может быть позже чем через 3 месяца от сегодня",
      (value) =>
        dayjs(value).isSame(maxStartDate) ||
        dayjs(value).isBefore(maxStartDate),
    ),

  endDate: mixed()
    .required("Вы не ввели дату окончания")
    .test("is-valid-date", "Некорректная дата", (value) =>
      dayjs(value).isValid(),
    )
    .test(
      "min-diff",
      "Дата окончания должна быть минимум на 1 день больше даты начала",
      function (value) {
        const { startDate } = this.parent;

        if (!startDate || !dayjs(startDate).isValid()) {
          return true;
        }

        const minEndDate = dayjs(startDate).add(1, "day").startOf("day");

        return (
          dayjs(value).isSame(minEndDate) || dayjs(value).isAfter(minEndDate)
        );
      },
    )
    .test(
      "max-diff",
      "Дата окончания не может быть больше чем через месяц после даты начала",
      function (value) {
        const { startDate } = this.parent;

        if (!startDate || !dayjs(startDate).isValid()) {
          return true;
        }

        const maxEndDate = dayjs(startDate).add(1, "month").endOf("day");

        return (
          dayjs(value).isSame(maxEndDate) || dayjs(value).isBefore(maxEndDate)
        );
      },
    ),
  roomType: object().nonNullable().required("Вы не выбрали тип номера"),
  nutrType: object().nonNullable().required("Вы не выбрали тип питания"),
  adultsAmount: number()
    .typeError("Вы не ввели кол-во взрослых")
    .integer("Кол-во взрослых должно быть целым числом")
    .min(1, "Кол-во взрослых должно быть от 1 до 5")
    .when("roomType", ([roomType], schema) => {
      if (roomType) {
        return schema.max(
          roomType.max,
          "Превышено допустимое кол-во взрослых для данного типа номера",
        );
      }

      return schema.max(5, "Кол-во взрослых должно быть от 1 до 5");
    }),
  childrenAmount: number()
    .typeError("Вы не ввели кол-во детей")
    .integer("Кол-во детей должно быть целым числом")
    .min(0, "Кол-во детей должно быть от 0 до 5")
    .max(5, "Кол-во детей должно быть от 0 до 5"),
});

export default schema;
