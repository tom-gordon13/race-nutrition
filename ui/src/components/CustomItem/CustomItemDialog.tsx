import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { CustomItemForm } from "./CustomItemForm";
import { customItemFormFields, fieldValidation } from "../../reference/forms/custom-item-form";

interface CustomItemDialogProps {
    isCustomItemDialogOpen: boolean;
    onClose: () => void;
    addCustomToStagedItems: Function;
}

export const CustomItemDialog: React.FC<CustomItemDialogProps> = ({ isCustomItemDialogOpen, onClose, addCustomToStagedItems }) => {
    const initialFormData = Object.keys(customItemFormFields).reduce((acc, key) => {
        acc[key] = "";
        return acc;
    }, {} as Record<string, string>);

    const [formData, setFormData] = useState<Record<string, string>>(initialFormData);

    const metaDataFields = Object.entries(customItemFormFields).filter(
        ([_, fieldData]) => fieldData.formCategory === "metaData"
    );

    const nutrientFields = Object.entries(customItemFormFields).filter(
        ([_, fieldData]) => fieldData.formCategory === "nutrients"
    );

    const handleSubmit = () => {
        addCustomToStagedItems(formData);
        onClose();
    };

    const handleChange = (field: string, value: string) => {
        const isValid = fieldValidation[field] ? fieldValidation[field](value) : true;

        if (isValid) {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    return (
        <Dialog open={isCustomItemDialogOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ marginBottom: 0 }}>Create Custom Item</DialogTitle>
            <DialogContent sx={{ padding: "4rem", paddingTop: "3rem !important" }}>
                <CustomItemForm
                    metaDataFields={metaDataFields}
                    nutrientFields={nutrientFields}
                    formData={formData}
                    handleChange={handleChange}
                />
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
