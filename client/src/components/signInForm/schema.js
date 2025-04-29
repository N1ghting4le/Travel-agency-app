import { object, string } from "yup";

const schema = object().shape({
  phoneOrEmail: string()
    .trim()
    .required("Поле обязательно")
    .matches(
      /(^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$|^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$)/,
      "Некорректное значение"
    ),
  password: string()
    .trim()
    .required("Пароль обязателен")
    .min(8, "Минимальная длиина пароля - 8 символов")
    .max(20, "Максимальная длина пароля - 20 символов"),
});

export default schema;
