'use client';
import AdminForm from '~/app/admin/components/Form';
import { useFilterData } from '~/context';
import { useCourses, useGrades, useTopics } from '~/hooks';

function AdminAddLessonPage(): JSX.Element {
    const { filterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade);
    const topics = useTopics(filterData.courseId);

    const items = [
        {
            type: 'select',
            label: 'Lớp',
            selected: filterData.grade,
            options: grades.map((grade) => ({ value: grade, label: 'Lớp ' + grade })),
        },
        {
            type: 'select',
            label: 'Môn học',
            selected: filterData.courseId,
            options: courses.map((course: any) => ({ value: course.id, label: course.name })),
        },
        {
            type: 'select',
            label: 'Chương mục',
            selected: filterData.topicId,
            options: topics.map((topic: any) => ({ value: topic.id, label: topic.name })),
        },
        {
            type: 'text',
            label: 'Tên Bài học',
        },
    ];

    return (
        <div className="w-full flex justify-center bg-white">
            <AdminForm
                title="Thêm chương mục"
                items={items}
            />
        </div>
    );
}

export default AdminAddLessonPage;
