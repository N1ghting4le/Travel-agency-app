import { object, string, number } from "yup";
import textFields from "./textFields";

const schema = object().shape({
  ...Object.fromEntries(
    textFields.map((field) => {
      const { name, error } = field;

      return [
        name,
        error ? string().trim().required(error) : string().trim().notRequired(),
      ];
    })
  ),
  departureCity: string().required("Вы не выбрали город"),
  destinationCountry: string().required("Вы не выбрали страну"),
  hotelTitle: string().required("Вы не выбрали отель"),
  basePrice: number()
    .typeError("Вы не установили начальную цену")
    .min(50, "Минимальная цена - 50$")
    .max(1200, "Максимальная цена - 1200$"),
});

export default schema;
