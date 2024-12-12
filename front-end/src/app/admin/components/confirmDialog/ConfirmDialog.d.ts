interface ConfirmDialogProps {
    open: boolean;
    title: string;
    content: string;
    onClose: () => void;
    onConfirm: () => void;
}
