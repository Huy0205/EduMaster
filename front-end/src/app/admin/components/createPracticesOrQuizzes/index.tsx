'use client';
import { useEffect, useRef, useState } from 'react';
import { DeleteOutline, NavigateNext, UnfoldMore } from '@mui/icons-material';

import QuestionView from '~/app/admin/components/questionView';
import { useQuestionsSelected } from '~/app/admin/contexts';
import { Popover } from '@mui/material';
import { toast } from 'react-toastify';

function AdminCreatePracticesOrQuizzes({
    fields,
    btnAddQuestion,
    onCreate,
}: AdminCreatePracticesOrQuizzesProps) {
    const [fixedWidth, setFixedWidth] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        time: 0,
        bonusPoint: 0,
    });
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [reorderIndex, setReorderIndex] = useState('');

    const { questionsSelected, setQuestionsSelected } = useQuestionsSelected();

    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSelectAllQuestions = () => {
        const isAllSelected = questionsSelected.every((question) => question.selected);
        const newQuestionsSelected = questionsSelected.map((question) => ({
            ...question,
            selected: !isAllSelected,
        }));
        setQuestionsSelected(newQuestionsSelected);
    };

    const handleSelectQuestion = (questionId: string) => {
        const newQuestionsSelected = questionsSelected.map((question) => {
            if (question.id === questionId) {
                return {
                    ...question,
                    selected: !question.selected,
                };
            }
            return question;
        });
        setQuestionsSelected(newQuestionsSelected);
    };

    const handleDeleteSelectedQuestions = () => {
        const newQuestionsSelected = questionsSelected.filter((question) => !question.selected);
        setQuestionsSelected(newQuestionsSelected);
    };

    const handleChangeFormData = (key: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleCreate = () => {
        onCreate(formData);
    };

    // Hàm mở Popover
    const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Hàm đóng Popover
    const handleClosePopover = () => {
        setAnchorEl(null);
        setReorderIndex(''); // Reset giá trị nhập
    };

    const handleReorder = () => {
        const newIndex = parseInt(reorderIndex, 10) - 1;
        if (isNaN(newIndex) || newIndex < 0 || newIndex >= questionsSelected.length) {
            toast.error('Vị trí không hợp lệ!');
            return;
        }

        const selectedQuestions = questionsSelected.filter((q) => q.selected);

        const unselectedQuestions = questionsSelected.filter((q) => !q.selected);

        const newQuestions = [
            ...unselectedQuestions.slice(0, newIndex),
            ...selectedQuestions,
            ...unselectedQuestions.slice(newIndex),
        ];

        setQuestionsSelected(newQuestions);
        handleClosePopover();
    };

    useEffect(() => {
        if (scrollRef.current) {
            setFixedWidth(scrollRef.current.clientWidth);
        }
    }, [questionsSelected]);

    return (
        <div className="w-full h-full flex">
            <div className="relative w-[80%] h-full overflow-y-auto">
                <div
                    style={{ width: fixedWidth }}
                    className={`fixed h-[50px] z-10 px-3 bg-white flex justify-between items-center border-b border-r text-base`}
                >
                    <div className="flex gap-3 items-center ">
                        <label className="flex justify-center items-center gap-1">
                            <input
                                type="checkbox"
                                checked={questionsSelected.every((question) => question.selected)}
                                onChange={handleSelectAllQuestions}
                            />
                            <span>Tất cả</span>
                        </label>
                        <button
                            className="flex justify-center items-center gap-1"
                            onClick={handleDeleteSelectedQuestions}
                        >
                            <DeleteOutline fontSize="inherit" />
                            <span>Xóa câu đã chọn</span>
                        </button>
                        <button
                            className="flex justify-center items-center gap-1"
                            onClick={handleOpenPopover}
                        >
                            <UnfoldMore fontSize="inherit" />
                            <span>Sắp xếp lại</span>
                        </button>
                        <Popover
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={handleClosePopover}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <div className="p-2 flex flex-col items-center gap-2 min-w-[150px]">
                                <input
                                    type="number"
                                    min="1"
                                    max={questionsSelected.length}
                                    placeholder="Vị trí"
                                    className="w-full p-1 border border-gray-300 rounded text-center text-sm"
                                    value={reorderIndex}
                                    onChange={(e) => setReorderIndex(e.target.value)}
                                />
                                <button
                                    className="bg-blue-500 text-white py-1 px-3 rounded text-sm"
                                    onClick={handleReorder}
                                >
                                    Chuyển
                                </button>
                            </div>
                        </Popover>
                    </div>
                    {btnAddQuestion}
                </div>
                <div
                    ref={scrollRef}
                    className="max-h-[calc(100%-50px)] mt-[50px]"
                >
                    {questionsSelected.map((question, index) => (
                        <div
                            key={question.id}
                            className="w-full flex"
                        >
                            <div className="w-[10%] p-3 border-t">
                                <p>{`Câu ${index + 1}`}</p>
                                <input
                                    type="checkbox"
                                    checked={question.selected}
                                    onChange={() => handleSelectQuestion(question.id)}
                                />
                            </div>
                            <div className="w-[90%] p-3 border border-b-0">
                                <QuestionView data={question} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-[20%] p-3 flex flex-col justify-between text-base">
                <div>
                    {fields.map((field) => (
                        <div
                            key={field.key}
                            className="flex flex-col gap-1 mb-3"
                        >
                            <label>{field.label}</label>
                            <input
                                type={field.type}
                                placeholder={field.placeholder}
                                className="w-full p-2 border border-gray-300 rounded"
                                value={formData[field.key]}
                                onChange={(e) => handleChangeFormData(field.key, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end">
                    <button
                        className="p-2 mt-3 bg-green-400 text-white rounded-md"
                        onClick={handleCreate}
                    >
                        <span>Tạo đề</span>
                        <NavigateNext fontSize="inherit" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminCreatePracticesOrQuizzes;
