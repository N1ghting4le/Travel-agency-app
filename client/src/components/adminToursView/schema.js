import { object, string } from "yup";

const schema = object().shape({
  tourTitle: string()
    .trim()
    .transform((value) => value.toLowerCase())
    .notRequired(),
});

export default schema;
