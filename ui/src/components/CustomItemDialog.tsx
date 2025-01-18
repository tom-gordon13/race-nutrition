import React, { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Typography } from "@mui/material";
import { nutrientsToShow } from '../reference/object-mapping/nutrient-mapping'
import { customItemFormFields } from '../reference/forms/custom-item-form'

interface CustomItemDialogProps {
    isCustomItemDialogOpen: boolean;
    onClose: () => void;
    addCustomToStagedItems: Function
}

const itemMetaFields: string[] = [
    'Item Name',
    'Item Brand',
    'Item Category'
]

const numericFieldPattern = /^[0-9]*\.?[0-9]*$/

const fieldValidation: Record<string, (value: string) => boolean> = {
    numericField: (value) => numericFieldPattern.test(value),
    textField: () => true,
};


export const CustomItemDialog: React.FC<CustomItemDialogProps> = ({ isCustomItemDialogOpen, onClose, addCustomToStagedItems }) => {
    const initialFormData = Object.keys(customItemFormFields).reduce((acc, key) => {
        acc[key] = "";
        return acc;
    }, {} as Record<string, string>);

    const [formData, setFormData] = useState<Record<string, string>>(initialFormData);

    const metaDataFields = Object.entries(customItemFormFields).filter(
        ([_, fieldData]) => fieldData.formCategory === 'metaData'
    );

    const nutrientFields = Object.entries(customItemFormFields).filter(
        ([_, fieldData]) => fieldData.formCategory === 'nutrients'
    );

    const handleSubmit = () => {
        addCustomToStagedItems(formData)

        onClose()
    };

    const handleChange = (field: string, value: string) => {
        const isValid = fieldValidation[field] ? fieldValidation[field](value) : true;

        if (isValid) {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    return (
        <Dialog open={isCustomItemDialogOpen} onClose={onClose} maxWidth="sm" fullWidth >
            <DialogTitle sx={{ marginBottom: 0 }}>Create Custom Item</DialogTitle>
            <DialogContent sx={{ padding: '4rem', paddingTop: '3rem !important' }}>
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
                                            inputMode: fieldData.validationType === 'textField' ? 'text' : 'decimal',
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
                                            fieldData.validationType === 'numericField' &&
                                            (e.target.value === '' || /^[0-9]*\.?[0-9]*$/.test(e.target.value))
                                        ) {
                                            handleChange(field, e.target.value);
                                        } else if (fieldData.validationType === 'textField') {
                                            handleChange(field, e.target.value);
                                        }
                                    }}
                                    slotProps={{
                                        input: {
                                            inputMode: fieldData.validationType === 'numericField' ? 'decimal' : 'text',
                                        },
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};
