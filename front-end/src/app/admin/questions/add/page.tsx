'use client';
import { useRouter } from 'next/navigation';
import { useFilterData } from '~/context';
import { useCourses, useGrades, useTopics } from '~/hooks';
import useLessons from '~/hooks/useLessons';
import AdminForm from '../../components/Form';
import { Add, Close } from '@mui/icons-material';
import { useState } from 'react';

function Wrapper({ children, title, classes = '' }) {
    return (
        <div className={`w-full relative border-2 p-4 rounded-md ${classes}`}>
            <div className="absolute top-[-12px] left-[7px] bg-white px-1">
                <p className="font-semibold">{title}</p>
            </div>
            <>{children}</>
        </div>
    );
}

function AdminAddQuestionPage() {
    const router = useRouter();
    const [type, setType] = useState(1);
    const { filterData, resetFilterData } = useFilterData();

    const grades = useGrades();
    const courses = useCourses(filterData.grade);
    const topics = useTopics(filterData.courseId);
    const lessons = useLessons(filterData.topicId);

    const items = [
        {
            type: 'select',
            key: 'grade',
            label: 'Lớp',
            selected: filterData.grade,
            options: grades.map((grade) => ({ value: grade, label: 'Lớp ' + grade })),
        },
        {
            type: 'select',
            key: 'courseId',
            label: 'Môn học',
            selected: filterData.courseId,
            options: courses.map((course: any) => ({ value: course.id, label: course.name })),
            disabled: !filterData.grade,
        },
        {
            type: 'select',
            key: 'topicId',
            label: 'Chương mục',
            selected: filterData.topicId,
            options: topics.map((topic: any) => ({ value: topic.id, label: topic.name })),
            disabled: !filterData.courseId,
        },
        {
            type: 'select',
            key: 'lessonId',
            label: 'Bài học',
            selected: filterData.lessonId,
            options: lessons.map((lesson: any) => ({ value: lesson.id, label: lesson.name })),
            disabled: !filterData.topicId,
        },
    ];

    const handleAddQuestion = async () => {
        router.push('/admin/questions');
    };

    return (
        <div className="w-full flex bg-white py-5">
            <div className="flex-2 flex flex-col items-center px-5 border-r-2">
                <div className="w-full mb-5">
                    <AdminForm items={items} />
                </div>
                <Wrapper title="Loại câu hỏi">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="type"
                            value={1}
                            checked={type === 1}
                            className="mr-2"
                            onChange={(e) => setType(Number(e.target.value))}
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
                            onChange={(e) => setType(Number(e.target.value))}
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
                            onChange={(e) => setType(Number(e.target.value))}
                        />
                        Điền đáp án
                    </label>
                </Wrapper>
            </div>
            <div className="flex-7 flex flex-col px-5">
                <div className="flex-1 flex flex-col">
                    <textarea
                        rows={2}
                        placeholder="Nhập nội dung câu hỏi"
                        className=" flex-1 border-2 rounded-md p-2"
                    />
                    <div className="flex-4 flex gap-5 pt-5 pb-5">
                        <div className="flex-3 flex">
                            <Wrapper
                                title="Câu trả lời"
                                classes="flex-1 flex"
                            >
                                <div className="flex-1 max-h-[250px] flex flex-grow overflow-auto">
                                    <table className="relative table-auto flex-1 border-collapse border border-gray-300 rounded-md shadow-md">
                                        <thead
                                            className="bg-gray-100
                                            sticky top-[-1px] z-10
                                        "
                                        >
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
                                            {[1, 2, 3].map((_, index) => (
                                                <tr
                                                    key={index}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="radio"
                                                            name="correct-answer"
                                                            className="h-4 w-4"
                                                        />
                                                        {/* <input
                                                                type="checkbox"
                                                                className="h-4 w-4"
                                                            /> */}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <input
                                                            type="text"
                                                            className="w-full border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Nhập đáp án"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <button className="text-red-500 hover:text-red-700">
                                                            <Close />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {[1, 2, 3].map((_, index) => (
                                                <tr
                                                    key={index}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <input
                                                            type="radio"
                                                            name="correct-answer"
                                                            className="h-4 w-4"
                                                        />
                                                        {/* <input
                                                                type="checkbox"
                                                                className="h-4 w-4"
                                                            /> */}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <input
                                                            type="text"
                                                            className="w-full border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Nhập đáp án"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                                        <button className="text-red-500 hover:text-red-700">
                                                            <Close />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="hover:bg-gray-50">
                                                <td
                                                    className="border border-gray-300 px-4 py-2 text-center"
                                                    colSpan={3}
                                                >
                                                    <button className="flex items-center gap-2 text-blue-500 hover:text-blue-700">
                                                        <Add />
                                                        <span>Thêm</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Wrapper>
                        </div>
                        <div className="flex-1">
                            <Wrapper
                                title="Hình ảnh"
                                classes="h-full"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                />
                            </Wrapper>
                        </div>
                    </div>
                    <textarea
                        rows={3}
                        placeholder="Nhập giải thích"
                        className="flex-1 border-2 rounded-md p-2"
                    />
                </div>
                <div className="flex justify-end py-4">
                    <button
                        className="bg-blue-500 text-white rounded-md p-2"
                        onClick={handleAddQuestion}
                    >
                        <Add />
                        Thêm câu hỏi
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminAddQuestionPage;
