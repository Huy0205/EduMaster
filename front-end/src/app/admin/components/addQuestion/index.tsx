'use client';
import { useState } from 'react';

import BorderWrapper from '../BorderWrapper';
import FilterDisplay from '../filterDisplay';
import AdminFormAddQuestion from '../formAddQuestion';

function AdminAddQuestion({ items, onSave }: AdminAddQuestionProps) {
    const [type, setType] = useState(1);

    const onTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setType(Number(e.target.value));
    };

    const handleSave = (data: FormDataAddQuestionWithoutType) => {
        onSave({
            ...data,
            type,
        });
    };

    return (
        <div className="w-full h-full flex bg-white py-3">
            <div className="w-[21%] flex flex-col items-center px-3 border-r-2 text-sm">
                <FilterDisplay items={items} />
                <div className="w-full mt-3">
                    <BorderWrapper title="Loại câu hỏi">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="type"
                                value={1}
                                checked={type === 1}
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
                                checked={type === 2}
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
                                checked={type === 3}
                                className="mr-2"
                                onChange={onTypeChange}
                            />
                            Điền đáp án
                        </label>
                    </BorderWrapper>{' '}
                </div>
            </div>
            <div className="w-[79%] h-full px-3">
                <AdminFormAddQuestion
                    type={type}
                    onSave={handleSave}
                />
            </div>
        </div>
    );
}

export default AdminAddQuestion;
