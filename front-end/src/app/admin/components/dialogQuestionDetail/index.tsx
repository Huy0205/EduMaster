import { Close, HelpOutline } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import QuestionView from '../questionView';

function AdminDialogQuestionDetail({ open, onClose, data }: AdminDialogQuestionDetailProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle
                sx={{
                    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div className="flex items-center gap-2">
                    <HelpOutline />
                    <h2>Chi tiết câu hỏi</h2>
                </div>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <QuestionView data={data} />
            </DialogContent>
        </Dialog>
    );
}

export default AdminDialogQuestionDetail;
