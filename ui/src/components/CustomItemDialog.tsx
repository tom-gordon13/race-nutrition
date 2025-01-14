import React, { useState } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";

interface CustomItemDialogProps {
    isCustomItemDialogOpen: boolean;
    onClose: () => void;
    // onSubmit: (customItemName: string) => void; 
}

export const CustomItemDialog: React.FC<CustomItemDialogProps> = ({ isCustomItemDialogOpen, onClose }) => {
    const [customItemName, setCustomItemName] = useState<string>("");

    const handleSubmit = () => {
        if (customItemName.trim()) {
            // onSubmit(customItemName); 
            setCustomItemName("");
            onClose();
        }
    };
    console.log('isCustom', isCustomItemDialogOpen)

    return (
        <Dialog open={isCustomItemDialogOpen} onClose={onClose}>
            <DialogTitle>Create Custom Item</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Custom Item Name"
                    variant="outlined"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    autoFocus
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
