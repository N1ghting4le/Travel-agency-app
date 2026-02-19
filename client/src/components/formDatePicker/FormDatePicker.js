import { FormControl, FormHelperText } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { helperStyle } from "../input/Input";

const FormDatePicker = ({ name, value, minDate, maxDate, onChange, error }) => (
  <FormControl fullWidth>
    <DatePicker
      name={name}
      value={value}
      minDate={minDate}
      maxDate={maxDate}
      slotProps={{
        textField: {
          error: !!error,
          fullWidth: true,
        },
      }}
      onChange={onChange}
    />
    {error && (
      <FormHelperText sx={helperStyle} error>
        {error.message}
      </FormHelperText>
    )}
  </FormControl>
);

export default FormDatePicker;
