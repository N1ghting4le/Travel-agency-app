"use client";

import styles from "./selectMenu.module.css";
import { helperStyle } from "../input/Input";
import {
  FormControl,
  FormHelperText,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import { Controller } from "react-hook-form";

const slotProps = {
  listbox: {
    style: {
      maxHeight: 200,
      overflowX: "auto",
    },
  },
};

const SelectMenu = ({
  children,
  values,
  name,
  control,
  error,
  valueField,
  onChange = () => {},
  multiple = false,
  disabled = false,
  disableClearable = false,
}) => {
  const handleChange = (formChange) => (e, value) => {
    formChange(value);
    onChange(e);
  };

  return (
    <FormControl fullWidth>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange: formChange, value } }) => (
          <Autocomplete
            options={values}
            slotProps={slotProps}
            onChange={handleChange(formChange)}
            multiple={multiple}
            disabled={disabled}
            getOptionLabel={(option) =>
              valueField ? (option[valueField] ?? "") : option
            }
            renderInput={(params) => (
              <TextField {...params} label={children} error={!!error} />
            )}
            disableCloseOnSelect={multiple}
            value={value}
            isOptionEqualToValue={
              valueField
                ? (option, value) => option[valueField] === value[valueField]
                : undefined
            }
            disableClearable={disableClearable || !value}
            renderTags={(value, getTagProps) => (
              <div className={styles.chipContainer}>
                {value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });

                  return (
                    <Chip
                      key={key}
                      label={valueField ? option[valueField] : option}
                      {...tagProps}
                      size="small"
                    />
                  );
                })}
              </div>
            )}
          />
        )}
      />
      {error && (
        <FormHelperText sx={helperStyle} error>
          {error.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectMenu;
