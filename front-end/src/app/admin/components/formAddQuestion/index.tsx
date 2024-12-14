'use client';
import { useEffect, useState } from 'react';
import { Add, Close } from '@mui/icons-material';

import BorderWrapper from '../BorderWrapper';
import Image from 'next/image';
import { toast } from 'react-toastify';

function AdminFormAddQuestion({ type, onSave }: FormAddQuestionProps) {
    const answerObj = {
        content: '',
        isCorrect: false,
    };
    const [formData, setFormData] = useState<FormDataAddQuestionWithoutType>({
        content: '',
        image: '',
        feedback: '',
        file: new File([''], 'filename'),
        answers: [answerObj, answerObj],
    });

    const addAnswer = () => {
        setFormData({
            ...formData,
            answers: [...formData.answers, answerObj],
        });
    };

    const disableRemoveAnswer = () => {
        if (type === 1) {
            console.log(formData.answers.length);
            return formData.answers.length <= 2;
        }
        console.log(formData.answers.length);
        return formData.answers.length <= 3;
    };

    const removeAnswer = (index: number) => {
        setFormData({
            ...formData,
            answers: formData.answers.filter((_, i) => i !== index),
        });
    };

    const updateAnswer = (index: number, key: string, value: string | boolean) => {
        if (type === 3) {
            setFormData({
                ...formData,
                answers: [
                    {
                        content: value as string,
                        isCorrect: true,
                    },
                ],
            });
        } else {
            setFormData({
                ...formData,
                answers: formData.answers.map((a, i) => (i === index ? { ...a, [key]: value } : a)),
            });
        }
    };

    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData({
                    ...formData,
                    image: e.target?.result as string,
                    file,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (formData.content === '' && formData.image === '') {
            toast.error('Vui lòng nhập nội dung câu hỏi hoặc chọn hình ảnh');
            return;
        }
        const answersHasContent = formData.answers.filter((answer) => answer.content !== '');
        const numberOfCorrectAnswer = answersHasContent.filter((answer) => answer.isCorrect).length;
        if (type === 1) {
            if (answersHasContent.length < 2) {
                toast.error('Vui lòng nhập ít nhất 2 đáp án');
                return;
            }
            if (numberOfCorrectAnswer !== 1) {
                toast.error('Vui lòng chọn 1 đáp án đúng');
                return;
            }
        }
        if (type === 2) {
            if (answersHasContent.length < 3) {
                toast.error('Vui lòng nhập ít nhất 3 đáp án');
                return;
            }
            if (numberOfCorrectAnswer < 2) {
                toast.error('Vui lòng chọn ít nhất 2 đáp án đúng');
                return;
            }
            if (numberOfCorrectAnswer === answersHasContent.length) {
                toast.error('Phải có ít nhất 1 đáp án sai');
                return;
            }
        }
        if (type === 3) {
            if (answersHasContent.length === 0) {
                toast.error('Vui lòng nhập đáp án');
                return;
            }
        }
        onSave(formData);
    };

    useEffect(() => {
        if (type === 3) {
            setFormData({
                ...formData,
                answers: [answerObj],
            });
        } else if (type === 2) {
            setFormData({
                ...formData,
                answers: [answerObj, answerObj, answerObj],
            });
        } else {
            setFormData({
                ...formData,
                answers: [answerObj, answerObj],
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="h-[calc(100%-74px)] flex-1 flex flex-col">
                <textarea
                    placeholder="Nhập nội dung câu hỏi"
                    className="w-full h-[19%] border-2 rounded-md p-2"
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
                <div className="w-full h-[62%] flex gap-3 pt-3 pb-3">
                    <div className="w-[60%] h-full flex">
                        <BorderWrapper
                            title="Câu trả lời"
                            classes="flex-1 flex min-h-[312px]"
                        >
                            {type === 1 || type === 2 ? (
                                <div className="flex-1 h-full">
                                    <table className="relative w-full table-auto border-collapse border border-gray-300">
                                        <thead className="bg-gray-100 sticky top-[-1px] z-10">
                                            <tr>
                                                <th className="border border-gray-300 px-4 py-1 text-left font-medium">
                                                    Chính xác
                                                </th>
                                                <th
                                                    className="border border-gray-300 px-4 py-2 text-left font-medium"
                                                    colSpan={2}
                                                >
                                                    Lựa chọn
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.answers.map((answer, index) => (
                                                <tr
                                                    key={index}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        {type === 1 ? (
                                                            <input
                                                                type="radio"
                                                                name="correct-answer"
                                                                checked={answer.isCorrect}
                                                                className="h-4 w-4"
                                                                onChange={() => {
                                                                    setFormData({
                                                                        ...formData,
                                                                        answers:
                                                                            formData.answers.map(
                                                                                (a, i) =>
                                                                                    i === index
                                                                                        ? {
                                                                                              ...a,
                                                                                              isCorrect:
                                                                                                  true,
                                                                                          }
                                                                                        : {
                                                                                              ...a,
                                                                                              isCorrect:
                                                                                                  false,
                                                                                          },
                                                                            ),
                                                                    });
                                                                }}
                                                            />
                                                        ) : (
                                                            <input
                                                                type="checkbox"
                                                                checked={answer.isCorrect}
                                                                className="h-4 w-4"
                                                                onChange={(e) =>
                                                                    updateAnswer(
                                                                        index,
                                                                        'isCorrect',
                                                                        e.target.checked,
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <input
                                                            type="text"
                                                            className="w-full px-2 py-1 outline-none"
                                                            value={answer.content}
                                                            onChange={(e) =>
                                                                updateAnswer(
                                                                    index,
                                                                    'content',
                                                                    e.target.value,
                                                                )
                                                            }
                                                            placeholder="Nhập đáp án"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <button
                                                            className={`
                                                                    ${
                                                                        disableRemoveAnswer()
                                                                            ? 'cursor-not-all text-gray-400'
                                                                            : 'cursor-pointer text-primary'
                                                                    }
                                                                    `}
                                                            disabled={disableRemoveAnswer()}
                                                            onClick={() => removeAnswer(index)}
                                                        >
                                                            <Close />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {formData.answers.length < 5 && (
                                                <tr className="hover:bg-gray-50">
                                                    <td
                                                        className="border border-gray-300 px-4 py-2 text-center"
                                                        colSpan={3}
                                                    >
                                                        <button
                                                            className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                                                            onClick={addAnswer}
                                                        >
                                                            <Add fontSize="inherit" />
                                                            <span>Thêm</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <input
                                        type="text"
                                        className="w-full border-2 rounded-md p-2"
                                        placeholder="Nhập đáp án"
                                        value={formData.answers[0].content}
                                        onChange={(e) => updateAnswer(0, 'content', e.target.value)}
                                    />
                                </div>
                            )}
                        </BorderWrapper>
                    </div>
                    <div className="w-[40%] h-full">
                        <BorderWrapper
                            title="Hình ảnh"
                            classes="min-h-[312px]"
                        >
                            <div className="h-full flex flex-col items-center justify-between">
                                {formData.image && (
                                    <Image
                                        src={formData.image}
                                        alt="Uploaded preview"
                                        width={200}
                                        height={200}
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={uploadImage}
                                    className="text-center"
                                />
                            </div>
                        </BorderWrapper>
                    </div>
                </div>
                <textarea
                    placeholder="Nhập giải thích"
                    className="w-full h-[19%] border-2 rounded-md p-2"
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                />
            </div>
            <div className="w-full h-[50px] flex justify-end items-end">
                <button
                    className="max-h-[38px] flex justify-center items-center bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
                    onClick={handleSave}
                >
                    <Add />
                    Lưu
                </button>
            </div>
        </div>
    );
}

export default AdminFormAddQuestion;
