import React from "react";
import { Grid, TextField, Typography } from "@mui/material";

interface CustomItemFormProps {
    metaDataFields: [string, any][];
    nutrientFields: [string, any][];
    formData: Record<string, string>;
    handleChange: (field: string, value: string) => void;
}

export const CustomItemForm: React.FC<CustomItemFormProps> = ({ metaDataFields, nutrientFields, formData, handleChange }) => {
    return (
        <Grid container spacing={4}>
            <Grid container spacing={2}>
                {metaDataFields.map(([field, fieldData]) => (
                    <Grid item xs={12} sm={6} key={field}>
                        <TextField
                            fullWidth
                            label={fieldData.publicName}
                            variant="outlined"
                            value={formData[field]}
                            helperText={fieldData.helpText}
                            required={fieldData.required ?? false}
                            onChange={(e) => handleChange(field, e.target.value)}
                            slotProps={{
                                input: {
                                    inputMode: fieldData.validationType === "textField" ? "text" : "decimal",
                                },
                            }}
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid item xs={12}>
                <Typography variant="h6">Nutrients</Typography>
            </Grid>
            <Grid container spacing={2}>
                {nutrientFields.map(([field, fieldData]) => (
                    <Grid item xs={12} sm={6} key={field}>
                        <TextField
                            fullWidth
                            label={fieldData.publicName}
                            variant="outlined"
                            value={formData[field]}
                            helperText={fieldData.helpText}
                            required={fieldData.required ?? false}
                            onChange={(e) => {
                                if (
                                    fieldData.validationType === "numericField" &&
                                    (e.target.value === "" || /^[0-9]*\.?[0-9]*$/.test(e.target.value))
                                ) {
                                    handleChange(field, e.target.value);
                                } else if (fieldData.validationType === "textField") {
                                    handleChange(field, e.target.value);
                                }
                            }}
                            slotProps={{
                                input: {
                                    inputMode: fieldData.validationType === "numericField" ? "decimal" : "text",
                                },
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Grid>
    );
};
