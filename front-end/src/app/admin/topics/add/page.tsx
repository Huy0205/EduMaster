'use client';
import { Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import AdminForm from '~/app/admin/components/Form';
import { useFilterData } from '~/context';
import { useCourses, useGrades } from '~/hooks';
import { TopicService } from '~/services';

function AdminAddTopicPage(): JSX.Element {
    const router = useRouter();
    const { filterData, resetFilterData } = useFilterData();
    const grades = useGrades();
    const courses = useCourses(filterData.grade, true);

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
            type: 'text',
            key: 'topicName',
            label: 'Tên chương mục',
        },
    ];

    const handleAddTopic = async ({ topicName, courseId }: TopicFormData) => {
        const addTopicRes = await TopicService.addTopic(topicName, courseId);
        const { data, message } = addTopicRes.data;
        if (data) {
            alert('Thêm chương mục thành công');
            resetFilterData();
            router.push('/admin/topics');
        } else {
            alert('Có lỗi xảy ra: ' + message);
        }
    };

    return (
        <div className="w-full flex justify-center bg-white">
            <AdminForm
                title="Thêm chương mục"
                items={items}
                action={{
                    label: 'Thêm',
                    icon: Add,
                    onClick: handleAddTopic,
                }}
            />
        </div>
    );
}

export default AdminAddTopicPage;
