import { object, string } from "yup";

const schema = object().shape({
  name: string().trim().required("Имя обязательно"),
  surname: string().trim().required("Фамилия обязательна"),
  phoneNumber: string()
    .trim()
    .required("Номер телефона обязателен")
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/,
      "Некорректный номер телефона",
    ),
});

export default schema;
