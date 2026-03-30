import { createOrderWeights } from "@/utils/createOrderWeights";

const roomTypes = [
  {
    value: "SGL",
    descr: "SGL - Одноместный",
    max: 1,
  },
  {
    value: "DBL",
    descr: "DBL - Двухместный с одной кроватью",
    max: 2,
  },
  {
    value: "TWIN",
    descr: "TWIN - Двухместный с двумя кроватями",
    max: 2,
  },
  {
    value: "TRPL",
    descr: "TRPL - Трёхместный",
    max: 3,
  },
  {
    value: "QDPL",
    descr: "QDPL - Четырёхместный",
    max: 4,
  },
  {
    value: "5 ADL",
    descr: "5 ADL - Пятиместный",
    max: 5,
  },
];

export default roomTypes;

export const roomOrderWeights = createOrderWeights(roomTypes, "value");
