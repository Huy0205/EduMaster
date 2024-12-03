import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';

interface DialogComponentProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    title: string;
    fields: { key: string; label: string; type: string; multiline?: boolean }[];
    initialData?: any;
}

function AdminFormDialog({
    open,
    onClose,
    onSave,
    title,
    fields,
    initialData = {},
}: DialogComponentProps) {
    const [formData, setFormData] = useState<any>(initialData);

    useEffect(() => {
        setFormData(initialData); // Reset data when dialog opens/closes
    }, [initialData]);

    const handleChange = (key: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={onClose}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {fields.map((field) => (
                    <TextField
                        key={field.key}
                        label={field.label}
                        type={field.type}
                        fullWidth
                        margin="dense"
                        value={formData?.[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        multiline={field.multiline}
                        rows={field.multiline ? 4 : 1}
                    />
                ))}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="secondary"
                >
                    Hủy
                </Button>
                <Button
                    onClick={handleSave}
                    color="primary"
                >
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AdminFormDialog;
