'use client';
import { useState } from 'react';
import { useFilterData } from '~/context';

interface AdminFormProps {
    title: string;
    items: {
        type: string;
        key: string;
        label: string;
        selected?: any;
        options?: { value: string; label: string }[];
    }[];
    action: {
        label: string;
        icon: React.ComponentType;
        onClick: (fomData: any) => void;
    };
}

function AdminForm({ title, items, action }: AdminFormProps) {
    const { filterData, setFilterData } = useFilterData();
    const [formData, setFormData] = useState({
        ...filterData,
    });

    const handleChange = (key: string, value: any, hasSetFilterData: boolean = true) => {
        if (hasSetFilterData) {
            setFilterData({ [key]: value });
        }
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        action.onClick(formData);
    };

    return (
        <form
            className="w-1/2 h-full"
            onSubmit={handleSubmit}
        >
            <h3 className="text-2xl text-center my-3">{title}</h3>
            {items.map((item, index) => {
                if (item.type === 'select') {
                    return (
                        <div
                            key={index}
                            className="w-full flex flex-col"
                        >
                            <label className="text-lg mb-1">{item.label}:</label>
                            <select
                                className="border rounded-md p-1 text-lg"
                                value={item.selected}
                                onChange={(e) => handleChange(item.key, e.target.value)}
                            >
                                <option value="">Chọn {item.label.toLowerCase()}</option>
                                {item.options?.map((option, index) => (
                                    <option
                                        key={index}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                }
                return (
                    <div
                        key={index}
                        className="w-full flex flex-col"
                    >
                        <label className="text-lg mb-1">{item.label}:</label>
                        <input
                            type="text"
                            className="border rounded-md p-1 text-lg"
                            value={formData[item.key]}
                            onChange={(e) => handleChange(item.key, e.target.value, false)}
                        />
                    </div>
                );
            })}
            <button
                type="submit"
                className="bg-blue-500 text-white rounded-md p-2 mt-3"
            >
                {action.label}
            </button>
        </form>
    );
}

export default AdminForm;
