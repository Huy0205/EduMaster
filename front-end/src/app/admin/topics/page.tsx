'use client';
import { useState } from 'react';
import AdminFilter from '../components/Filter';
import AdminTable from '../components/Table';
import { TopicService } from '~/services';

interface FilterData {
    grade: number;
    courseId: string;
}

function AdminTopicsPage() {
    const [filterData, setFilterData] = useState([]);

    const handleFilter = async ({ grade, courseId }: FilterData) => {
        const result = courseId
            ? await TopicService.getTopicsByCourse(courseId, 0)
            : await TopicService.getTopicByGrade(grade);
        const { data, message } = result.data;
        if (data) {
            setFilterData(data);
        } else {
            console.error(message);
        }
    };

    return (
        <div>
            <AdminFilter
                grade
                course
                onFilterChange={handleFilter}
            />
            <AdminTable
                header={['STT', 'Tên chương mục', 'Môn học', 'Lớp']}
                columnsData={['name', 'courseName', 'grade']}
                data={filterData}
            />
        </div>
    );
}

export default AdminTopicsPage;
