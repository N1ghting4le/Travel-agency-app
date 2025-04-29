import { string, number, object } from "yup";
import roomTypes from "@/lists/roomTypes";

const schema = object().shape({
    roomType: string().required("Вы не выбрали тип номера"),
    nutrType: string().required("Вы не выбрали тип питания"),
    adultsAmount: number()
        .typeError("Вы не ввели кол-во взрослых")
        .integer("Кол-во взрослых должно быть целым числом")
        .min(1, "Кол-во взрослых должно быть от 1 до 5")
        .when("roomType", (arr, schema) => {
            const roomType = arr[0];

            if (roomType) {
                const roomTypeValue = roomType.split(' ')[0];
                const roomTypeConfig = roomTypes.find(rt => rt.value === roomTypeValue);
                return schema.max(
                    roomTypeConfig ? roomTypeConfig.max : 5,
                    roomTypeConfig ? "Превышено допустимое кол-во взрослых для данного типа номера"
                    : "Кол-во взрослых должно быть от 1 до 5"
                );
            }

            return schema.max(5, "Кол-во взрослых должно быть от 1 до 5");
        }),
    childrenAmount: number()
        .typeError("Вы не ввели кол-во детей")
        .integer("Кол-во детей должно быть целым числом")
        .min(0, "Кол-во детей должно быть от 0 до 5")
        .max(5, "Кол-во детей должно быть от 0 до 5")
});

export default schema;