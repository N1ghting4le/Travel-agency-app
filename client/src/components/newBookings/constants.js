import dayjs from "dayjs";

export const minDate = dayjs("2020-01-01").startOf("day");
export const maxDate = dayjs().endOf("day");
