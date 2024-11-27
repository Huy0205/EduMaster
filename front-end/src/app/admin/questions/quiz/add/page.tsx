'use client';
import { useRouter } from 'next/navigation';
import { useFilterData } from '~/context';
import { useCourses, useGrades, useTopics } from '~/hooks';
import AdminAddQuestion from '~/app/admin/components/AddQuestion';

function AdminAddQuizQuestionPage() {
    const router = useRouter();
    const { filterData, resetFilterData } = useFilterData();

    const grades = useGrades();
    const courses = useCourses(filterData.grade);
    const topics = useTopics(filterData.courseId);

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
    ];

    const handleAddQuizQuestion = async (FormData: any) => {
        console.log(FormData);
        console.log(filterData.topicId);
        // router.push('/admin/questions/practice');
    };

    return <AdminAddQuestion items={items} />;
}

export default AdminAddQuizQuestionPage;
