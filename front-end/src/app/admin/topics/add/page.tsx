'use client';
import AdminForm from '~/app/admin/components/Form';
import { useFilterData } from '~/context';
import { useCourses, useGrades } from '~/hooks';

function AdminAddTopicPage(): JSX.Element {
    const { filterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade);

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
            type: 'text',
            label: 'Tên chương mục',
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

export default AdminAddTopicPage;
