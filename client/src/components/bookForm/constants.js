import dayjs from "dayjs";

const today = dayjs();

export const minStartDate = today.add(1, "week").startOf("day");
export const maxStartDate = today.add(3, "month").endOf("day");
export const defaultEndDate = minStartDate.add(1, "week");

export const amounts = [
  { text: "Кол-во взрослых", name: "adultsAmount" },
  { text: "Кол-во детей", name: "childrenAmount" },
];
