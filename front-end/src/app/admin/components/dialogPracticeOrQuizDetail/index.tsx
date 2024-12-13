import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import QuestionView from '../questionView';
import { Close } from '@mui/icons-material';

function AdminDialogPracticeOrQuizDetail({
    open,
    onClose,
    title,
    name,
    time,
    bonusPoint,
    questions,
}: DialogPracticeOrQuizDetailProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
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
                    <h2>{title}</h2>
                </div>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-extrabold text-center py-2">{name}</h2>
                    {time && <p className="text-base font-semibold">Thời gian: {time}</p>}
                    <p className="text-base font-semibold">Điểm thưởng: {bonusPoint}</p>
                </div>
                <div>
                    <ul>
                        {questions?.map((item: any, index: number) => (
                            <div
                                key={item.id}
                                className="flex py-2 border-b border-gray-200"
                            >
                                <div className="flex-1 flex justify-end py-3">
                                    <strong className="text-lg">Câu {index + 1}:</strong>
                                </div>
                                <div className="flex-9 py-3 pl-1">
                                    <QuestionView data={item} />
                                </div>
                            </div>
                        ))}
                    </ul>
                    <div className="flex justify-center pt-2">
                        <span className="text-base font-medium">---------- Hết ----------</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AdminDialogPracticeOrQuizDetail;
