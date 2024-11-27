'use client';
import { Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

import { useCourses, useGrades, useTopics } from '~/hooks';
import { useFilterData } from '~/context';
import { LessonService } from '~/services';
import AdminForm from '~/app/admin/components/Form';

function AdminAddLessonPage(): JSX.Element {
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
        },
        {
            type: 'select',
            key: 'topicId',
            label: 'Chương mục',
            selected: filterData.topicId,
            options: topics.map((topic: any) => ({ value: topic.id, label: topic.name })),
        },
        {
            type: 'text',
            key: 'lessonName',
            label: 'Tên Bài học',
        },
    ];

    const handleAddLesson = async ({ lessonName, topicId }: any) => {
        const addLessonRes = await LessonService.addLesson(lessonName, topicId);
        const { data, message } = addLessonRes.data;
        if (data) {
            alert('Thêm bài học thành công');
            resetFilterData();
            router.push('/admin/lessons');
        } else {
            alert('Có lỗi xảy ra: ' + message);
        }
    };

    return (
        <div className="w-2/5 flex bg-white">
            <AdminForm
                title="Thêm bài học"
                items={items}
                action={{
                    label: 'Thêm',
                    icon: Add,
                    onClick: handleAddLesson,
                }}
            />
        </div>
    );
}

export default AdminAddLessonPage;
