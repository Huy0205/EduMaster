'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useFilterData, useQuestionsSelected } from '~/app/admin/contexts';
import {
    AnswerService,
    QuestionService,
    QuizQuestionService,
    QuizService,
    UploadService,
} from '~/services';
import { toast } from 'react-toastify';
import AdminCreatePracticesOrQuizzes from '~/app/admin/components/createPracticesOrQuizzes';
import { AddCircleOutline } from '@mui/icons-material';
import AdminFormAddQuestion from '~/app/admin/components/formAddQuestion';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

function CreatePracticePage() {
    const router = useRouter();

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [questionType, setQuestionType] = useState<1 | 2 | 3>(1);
    const [formData, setFormData] = useState<FormDataAddQuestion>({} as FormDataAddQuestion);

    const { filterData } = useFilterData();
    const { questionsSelected, setQuestionsSelected } = useQuestionsSelected();

    const handleCreateQuiz = async (formData: CreatePracticesOrQuizzesFormData) => {
        const { name, time, bonusPoint } = formData;
        const quizRes = await QuizService.addQuiz({
            name,
            time,
            bonusPoint,
            topicId: filterData.topicId,
        });
        const { data, message } = quizRes.data;
        if (data) {
            const { id: quizId } = data;
            const quizQuestions = questionsSelected.map((question, index) => ({
                quizId,
                questionId: question.id,
                orderInQuiz: index + 1,
            }));
            const quizQuestionRes = await QuizQuestionService.addQuizQuestions(quizQuestions);
            const { data: quizQuestionData, message: quizQuestionMessage } = quizQuestionRes.data;
            if (quizQuestionData) {
                setQuestionsSelected([]);
                toast.success('Tạo bài kiểm tra thành công');
                router.push('/admin/quizzes');
            } else {
                toast.error('Có lỗi xảy ra: ' + quizQuestionMessage);
            }
        } else {
            toast.error('Có lỗi xảy ra: ' + message);
        }
    };

    const handleOpenAddDialog = () => {
        setIsAddDialogOpen(true);
    };

    const handleCloseAddDialog = () => {
        setIsAddDialogOpen(false);
    };

    const handleOpenConfirmDialog = (formData: FormDataAddQuestionWithoutType) => {
        setFormData({
            ...formData,
            type: questionType as 1 | 2 | 3,
        });
        setIsAddDialogOpen(false);
        setIsConfirmDialogOpen(true);
    };

    const handleAddQuestion = async (isSaveToQuestionBank: boolean) => {
        setIsConfirmDialogOpen(false);
        const { answers, file, ...question } = formData;
        const uploadRes = await UploadService.uploadQuestionImage(file);
        const { data: uploadData, message: uploadMessage } = uploadRes.data;
        try {
            if (uploadData) {
                question.image = uploadData.fileUrl;
                const questionRes = await QuestionService.addQuestion({
                    ...question,
                    status: (isSaveToQuestionBank ? 1 : 0) as -1 | 0 | 1,
                    topicId: filterData.topicId,
                    lessonId: null,
                });
                const { data: questionData, message: questionMessage } = questionRes.data;
                if (questionData) {
                    const questionId = questionData.id;
                    const answerData = answers.map((answer: any) => ({
                        ...answer,
                        question: {
                            id: questionId,
                        },
                    }));
                    const answerRes = await AnswerService.addAnswers(answerData);
                    const { data: answerDataRes, message: answerMessageRes } = answerRes.data;
                    if (answerDataRes) {
                        toast.success('Thêm câu hỏi thành công');
                        router.push('/admin/questions/practice');
                    } else {
                        throw new Error(answerMessageRes);
                    }
                } else {
                    throw new Error(questionMessage);
                }
            } else {
                throw new Error(uploadMessage);
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
            setTimeout(() => {
                router.push('/admin/quizzes');
            }, 3000);
            console.log(error);
        }
    };

    const fieldInputs = [
        {
            key: 'name',
            label: 'Tên bài bài kiểm tra',
            type: 'text',
            placeholder: 'Nhập tên bài kiểm tra',
        },
        {
            key: 'time',
            label: 'Thời gian (phút)',
            type: 'number',
            placeholder: 'Nhập thời gian làm bài',
        },
        {
            key: 'bonusPoint',
            label: 'Điểm thưởng',
            type: 'number',
            placeholder: 'Nhập điểm thưởng',
        },
    ] as FieldInput[];

    return (
        <>
            <AdminCreatePracticesOrQuizzes
                fields={fieldInputs}
                btnAddQuestion={
                    <button
                        className="flex justify-center items-center gap-1"
                        onClick={handleOpenAddDialog}
                    >
                        <AddCircleOutline fontSize="inherit" />
                        <span>Thêm câu hỏi</span>
                    </button>
                }
                onCreate={handleCreateQuiz}
            />
            <Dialog
                fullWidth
                open={isAddDialogOpen}
                onClose={handleCloseAddDialog}
                maxWidth="md"
            >
                <DialogTitle>Thêm câu hỏi</DialogTitle>
                <DialogContent>
                    <div className="flex gap-2 pb-2">
                        <label>Loại câu hỏi:</label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="type"
                                value={1}
                                checked={questionType === 1}
                                className="mr-2"
                                onChange={() => setQuestionType(1)}
                            />
                            Chọn một đáp án đúng
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="type"
                                value={2}
                                checked={questionType === 2}
                                className="mr-2"
                                onChange={() => setQuestionType(2)}
                            />
                            Chọn nhiều đáp án đúng
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="type"
                                value={3}
                                checked={questionType === 3}
                                className="mr-2"
                                onChange={() => setQuestionType(3)}
                            />
                            Điền đáp án
                        </label>
                    </div>
                    <AdminFormAddQuestion
                        type={questionType}
                        onSave={handleOpenConfirmDialog}
                    />
                </DialogContent>
            </Dialog>
            <Dialog
                open={isConfirmDialogOpen}
                onClose={() => handleAddQuestion(false)}
            >
                <DialogTitle>Xác nhận</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có muốn lưu câu hỏi vào ngân hàng câu hỏi không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleAddQuestion(false)}>Không</Button>
                    <Button
                        onClick={() => handleAddQuestion(true)}
                        autoFocus
                    >
                        Có
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default CreatePracticePage;
