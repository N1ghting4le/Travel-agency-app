import { textFields, largeTextFields } from "./fields";
import { object, string, array } from "yup";

const schema = object().shape({
    ...Object.fromEntries([...textFields, ...largeTextFields].map(field => {
        const { name, error } = field;

        return [name, error ? string().trim().required(error) : string().trim().notRequired()];
    })),
    country: string().required("Вы не выбрали страну"),
    resort: string().required("Вы не выбрали курорт"),
    nutritionTypes: array().compact().min(1, "Должен быть выбран хотя бы один тип питания"),
    roomTypes: array().compact().min(1, "Должен быть выбран хотя бы один тип номеров"),
    photos: array().min(5, "Должно быть загружено не менее 5 фотографий")
});

export default schema;