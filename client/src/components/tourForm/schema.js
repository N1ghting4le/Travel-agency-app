import { object, string, number } from "yup";
import textFields from "./textFields";

const schema = object().shape({
  ...Object.fromEntries(
    textFields.map(({ name, error }) => [
      name,
      error ? string().trim().required(error) : string().trim().notRequired(),
    ]),
  ),
  departureCity: string().required("Вы не выбрали город"),
  destinationCountry: string().required("Вы не выбрали страну"),
  hotel: object()
    .nonNullable("Вы не выбрали отель")
    .required("Вы не выбрали отель"),
  basePrice: number()
    .typeError("Вы не установили начальную цену")
    .min(50, "Минимальная цена - 50$")
    .max(1200, "Максимальная цена - 1200$"),
});

export default schema;
