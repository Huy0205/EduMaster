'use client';
import { Add, Close } from '@mui/icons-material';
import { useState } from 'react';
import BorderWrapper from './BorderWrapper';

function AdminAddQuestion({ items, onSave }: AdminAddQuestionProps) {
    const answerObj = {
        content: '',
        isCorrect: false,
    };
    const [formData, setFormData] = useState({
        content: '',
        image: '',
        type: 1,
        feedback: '',
        answers: [answerObj, answerObj],
    });

    const addAnswer = () => {
        setFormData({
            ...formData,
            answers: [...formData.answers, answerObj],
        });
    };

    const removeAnswer = (index: number) => {
        setFormData({
            ...formData,
            answers: formData.answers.filter((_, i) => i !== index),
        });
    };

    const updateAnswer = (index, key, value) => {
        if (formData.type === 3) {
            setFormData({
                ...formData,
                answers: [
                    {
                        content: value,
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

    const onTypeChange = (e) => {
        setFormData({
            ...formData,
            type: Number(e.target.value),
            answers: [answerObj, answerObj],
        });
    };

    const validate = () => {
        if (formData.content.trim() === '' && formData.image.trim() === '') {
            return false;
        }
        if (formData.answers.some((a) => a.content.trim() === '')) {
            return false;
        }
        if (formData.type === 1 || formData.type === 2) {
            if (!formData.answers.some((a) => a.isCorrect)) {
                return false;
            }
        }
        return true;
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="w-full flex bg-white py-5">
            <div className="flex-2 flex flex-col items-center px-5 border-r-2">
                <div className="w-full mb-5">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col pb-3"
                        >
                            <label className="text-base font-medium m-1">{item.label}:</label>
                            <span className="border-2 rounded-md px-2 py-1">{item.value}</span>
                        </div>
                    ))}
                </div>
                <BorderWrapper title="Loại câu hỏi">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="type"
                            value={1}
                            checked={formData.type === 1}
                            className="mr-2"
                            onChange={onTypeChange}
                        />
                        Chọn một đáp án đúng
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="type"
                            value={2}
                            checked={formData.type === 2}
                            className="mr-2"
                            onChange={onTypeChange}
                        />
                        Chọn nhiều đáp án đúng
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="type"
                            value={3}
                            checked={formData.type === 3}
                            className="mr-2"
                            onChange={onTypeChange}
                        />
                        Điền đáp án
                    </label>
                </BorderWrapper>
            </div>
            <div className="flex-7 flex flex-col px-5">
                <div className="flex-1 flex flex-col">
                    <textarea
                        placeholder="Nhập nội dung câu hỏi"
                        className=" flex-1 border-2 rounded-md p-2"
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                    <div className="flex-4 flex gap-5 pt-5 pb-5">
                        <div className="flex-3 flex">
                            <BorderWrapper
                                title="Câu trả lời"
                                classes="flex-1 flex"
                            >
                                {formData.type === 1 || formData.type === 2 ? (
                                    <div className="flex-1 max-h-[250px] overflow-auto">
                                        <table className="relative w-full table-auto border-collapse border border-gray-300 rounded-md shadow-md">
                                            <thead className="bg-gray-100 sticky top-[-1px] z-10">
                                                <tr>
                                                    <th className="border border-gray-300 px-4 py-2 text-left font-medium">
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
                                                            {formData.type === 1 ? (
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
                                                                className="w-full border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                                                        formData.answers.length <= 2
                                                                            ? 'cursor-not-all text-gray-400'
                                                                            : 'cursor-pointer text-primary'
                                                                    }
                                                                    `}
                                                                disabled={
                                                                    formData.answers.length <= 2
                                                                }
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
                                                                <Add />
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
                                            onChange={(e) =>
                                                updateAnswer(0, 'content', e.target.value)
                                            }
                                        />
                                    </div>
                                )}
                            </BorderWrapper>
                        </div>
                        <div className="flex-1">
                            <BorderWrapper
                                title="Hình ảnh"
                                classes="h-full"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                />
                            </BorderWrapper>
                        </div>
                    </div>
                    <textarea
                        placeholder="Nhập giải thích"
                        className="flex-1 border-2 rounded-md p-2"
                        onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                    />
                </div>
                <div className="flex justify-end py-4">
                    <button
                        className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
                        onClick={handleSave}
                    >
                        <Add />
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminAddQuestion;
