import { object, string, ref } from "yup";

const schema = object().shape({
    email: string()
        .trim()
        .required("Адрес эл. почты обязателен")
        .email("Некорректный адрес эл. почты"),
    password: string()
        .trim()
        .required("Пароль обязателен")
        .min(8, "Минимальная длиина пароля - 8 символов")
        .max(20, "Максимальная длина пароля - 20 символов"),
    name: string()
        .trim()
        .required("Имя обязательно"),
    surname: string()
        .trim()
        .required("Фамилия обязательна"),
    phoneNumber: string()
        .trim()
        .required("Номер телефона обязателен")
        .matches(
            /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/,
            "Некорректный номер телефона"
        ),
    confirmPassword: string()
        .oneOf([ref("password")], "Пароли должны совпадать")
});

export default schema;