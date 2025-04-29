'use client';

import styles from "./selectMenu.module.css";
import { helperStyle } from "../input/Input";
import { FormControl, FormHelperText, Autocomplete, TextField, Chip } from "@mui/material";
import { Controller } from "react-hook-form";

const MenuProps = {
    style: {
        maxHeight: 200,
        overflowX: "auto"
    }
};

const SelectMenu = ({ children, values, name, control, error, onChange = () => {}, multiple = false, disabled = false, disableClearable = false }) => {

    return (
        <FormControl fullWidth>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange: formChange, value } }) =>
                    <Autocomplete
                        options={values}
                        slotProps={{
                            listbox: MenuProps
                        }}
                        onChange={(e, value) => {
                            formChange(value);
                            onChange(e);
                        }}
                        multiple={multiple}
                        disabled={disabled}
                        getOptionLabel={(option) => option}
                        renderInput={(params) =>
                            <TextField {...params} label={children} error={!!error}/>
                        }
                        disableCloseOnSelect={multiple}
                        value={value}
                        disableClearable={disableClearable || !value}
                        renderTags={(value, getTagProps) => (
                            <div className={styles.chipContainer}>
                                {value.map((option, index) => {
                                    const { key, ...tagProps } = getTagProps({ index });
                                    return (
                                        <Chip
                                            key={key}
                                            label={option}
                                            {...tagProps}
                                            size="small"
                                        />
                                    )
                                })}
                            </div>
                        )}
                    />
                }
            />
            {error && <FormHelperText sx={helperStyle} error>{error.message}</FormHelperText>}
        </FormControl>
    );
};

export default SelectMenu;