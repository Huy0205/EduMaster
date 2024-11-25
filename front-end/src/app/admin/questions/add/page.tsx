'use client';
import { useRouter } from 'next/navigation';
import { useFilterData } from '~/context';
import { useCourses, useGrades, useTopics } from '~/hooks';
import useLessons from '~/hooks/useLessons';
import AdminForm from '../../components/Form';
import { Add } from '@mui/icons-material';

function AdminAddQuestionPage() {
    const router = useRouter();
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
        },
        {
            type: 'select',
            key: 'topicId',
            label: 'Chương mục',
            selected: filterData.topicId,
            options: topics.map((topic: any) => ({ value: topic.id, label: topic.name })),
        },
        {
            type: 'select',
            key: 'lessonId',
            label: 'Chương bài học',
            selected: filterData.lessonId,
            options: lessons.map((lesson: any) => ({ value: lesson.id, label: lesson.name })),
        },
    ];

    const handleAddQuestion = async () => {
        router.push('/admin/questions');
    };

    return (
        <div className="w-full flex justify-center bg-white">
            <AdminForm
                title="Thêm câu hỏi"
                items={items}
                action={{
                    label: 'Thêm',
                    icon: Add,
                    onClick: handleAddQuestion,
                }}
            />
        </div>
    );
}

export default AdminAddQuestionPage;
