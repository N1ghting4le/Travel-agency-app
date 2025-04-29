import { TextField } from "@mui/material";
import "./input.css";

export const labelStyle = {
  paddingRight: "5px",
};

export const helperStyle = {
  fontSize: "16px",
};

const Input = ({ placeholder, error, multiline = false, ...props }) => (
  <TextField
    sx={{
      "& .MuiInputLabel-root": labelStyle,
      "& .Mui-error": helperStyle,
    }}
    fullWidth
    label={placeholder}
    error={!!error}
    multiline={multiline}
    {...props}
    helperText={error?.message}
  />
);

export default Input;
