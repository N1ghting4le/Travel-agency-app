import { TextField, FormControl, FormHelperText } from "@mui/material";
import "./input.css";

export const labelStyle = {
  paddingRight: "5px",
};

export const helperStyle = {
  position: "absolute",
  top: "100%",
  lineHeight: "normal",
};

const Input = ({ placeholder, error, multiline = false, ...props }) => (
  <FormControl fullWidth>
    <TextField
      slotProps={{
        inputLabel: { style: labelStyle },
      }}
      fullWidth
      label={placeholder}
      error={!!error}
      multiline={multiline}
      rows={multiline ? 5 : undefined}
      {...props}
    />
    {error && (
      <FormHelperText sx={helperStyle} error>
        {error.message}
      </FormHelperText>
    )}
  </FormControl>
);

export default Input;
