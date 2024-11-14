'use client';
import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { CourseService } from '~/services';

interface AdminFilterProps {
    grade?: boolean;
    course?: boolean;
    topic?: boolean;
    onFilterChange: (filters: any) => void;
}

interface Course {
    id: string;
    name: string;
    grade: number;
}

function AdminFilter({
    grade = false,
    course = false,
    topic = false,
    onFilterChange,
}: AdminFilterProps) {
    const [grades, setGrades] = useState([]);
    const [courses, setCourses] = useState([]);
    const [topics, setTopics] = useState([]);

    const [selectedGrade, setSelectedGrade] = useState<number>(0);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');

    useEffect(() => {
        if (grade) {
            const fetchGrades = async () => {
                const result = await CourseService.getGradeDistinct();
                const { data, message } = result.data;
                if (data) {
                    setGrades(data);
                } else {
                    console.error(message);
                }
            };
            fetchGrades();
        }
    }, [grade]);

    useEffect(() => {
        if (course) {
            const fetchCourses = async () => {
                const result = selectedGrade
                    ? await CourseService.getCoursesByGrade(selectedGrade)
                    : await CourseService.getAllCourses();
                const { data, message } = result.data;
                if (data) {
                    setCourses(data);
                } else {
                    console.error(message);
                }
            };
            fetchCourses();
        }
    }, [course, selectedGrade]);

    const handleFilter = () => {
        onFilterChange({
            grade: selectedGrade,
            courseId: selectedCourseId,
        });
    };

    return (
        <div className="flex text-black">
            <h2>Bộ lọc tìm kiếm:</h2>
            {grade && (
                <div>
                    <select
                        className=""
                        onChange={(e) => setSelectedGrade(parseInt(e.target.value))}
                    >
                        <option value={0}>Lớp</option>
                        {grades.map((grade: number, index: number) => (
                            <option
                                key={index}
                                value={grade}
                            >
                                Lớp {grade}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {course && (
                <Tippy
                    content="Vui lòng chọn lớp trước"
                    placement="bottom"
                    disabled={selectedGrade != 0}
                >
                    <div>
                        <select
                            className=""
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            disabled={!selectedGrade}
                        >
                            <option value={''}>Môn học</option>
                            {courses.map((course: Course, index: number) => (
                                <option
                                    key={index}
                                    value={course.id}
                                >
                                    {course.name + ', lớp ' + course.grade}
                                </option>
                            ))}
                        </select>
                    </div>
                </Tippy>
            )}
            {/* <div>
                <select className="">
                    <option value="">Chương mục</option>
                    {Array.from({ length: 5 }, (_, i) => (
                        <option
                            key={i}
                            value={i + 1}
                        >
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div> */}
            <button onClick={handleFilter}>
                <span>Lọc</span>
            </button>
        </div>
    );
}

export default AdminFilter;
