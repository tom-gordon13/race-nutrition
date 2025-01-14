import React, { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from "@mui/material";
import { nutrientsToShow } from '../reference/nutrient-mapping'

interface CustomItemDialogProps {
    isCustomItemDialogOpen: boolean;
    onClose: () => void;
    // onSubmit: (customItemName: string) => void; 
}

// Custom item Fields
// itemName (required)
// itemBrand (optional)
// itemCategory (optional)
// nutrientsToShow nutrients


export const CustomItemDialog: React.FC<CustomItemDialogProps> = ({ isCustomItemDialogOpen, onClose }) => {
    const [customItemName, setCustomItemName] = useState<string>("");
    const [formData, setFormData] = useState<Record<string, string>>({
        Protein: "",
        Fat: "",
        Carbohydrate: "",
        Fiber: "",
        Sodium: "",
    });

    const handleSubmit = () => {
        if (customItemName.trim()) {
            // onSubmit(customItemName); 
            setCustomItemName("");
            onClose();
        }
    };

    const handleChange = (field: string, value: string) => {
        if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    return (
        <Dialog open={isCustomItemDialogOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create Custom Item</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {nutrientsToShow.map((field) => (
                        <Grid item xs={12} sm={6} key={field}>
                            <TextField
                                fullWidth
                                label={field}
                                variant="outlined"
                                value={formData[field]}
                                onChange={(e) => handleChange(field, e.target.value)}
                                inputProps={{ inputMode: "decimal", pattern: "[0-9]*\\.?[0-9]*" }}
                            />
                        </Grid>
                    ))}
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
