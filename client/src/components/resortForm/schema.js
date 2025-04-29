import { object, string } from "yup";

const schema = object().shape({
    country: string().required("Вы не выбрали страну"),
    resort: string().required("Вы не выбрали курорт"),
});

export default schema;