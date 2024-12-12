import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function AdminConfirmDialog({ open, onClose, title, content, onConfirm }: ConfirmDialogProps) {
    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={onClose}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <p>{content}</p>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="primary"
                >
                    Hủy
                </Button>
                <Button
                    onClick={onConfirm}
                    color="secondary"
                >
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AdminConfirmDialog;
