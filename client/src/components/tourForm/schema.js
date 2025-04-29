import { object, string, number } from "yup";
import textFields from "./textFields";

const schema = object().shape({
    ...Object.fromEntries(textFields.map(field => {
        const { name, error } = field;

        return [name, error ? string().trim().required(error) : string().trim().notRequired()];
    })),
    departureCity: string().required("Вы не выбрали город"),
    destinationCountry: string().required("Вы не выбрали страну"),
    hotelTitle: string().required("Вы не выбрали отель"),
    basePrice: number()
                .typeError("Вы не установили начальную цену")
                .positive("Значение должно быть положительным")
});

export default schema;