// Bộ lọc lớp
const createGradeFilter = (grades: number[]): FilterConfig => ({
    key: 'grade',
    placeholder: 'Lớp',
    options: grades.map((grade) => ({ value: grade, label: 'Lớp ' + grade })),
    width: '125px',
});

// Bộ lọc môn học
const createCourseFilter = (courses: ParamData[], grade: number): FilterConfig => ({
    key: 'courseId',
    placeholder: 'Môn học',
    options: courses.map((course) => ({ value: course.id, label: course.name })),
    disabled: !grade,
    tooltipTitle: 'Vui lòng chọn lớp trước',
    width: '150px',
});

// Bộ lọc chương mục
const createTopicFilter = (topics: ParamData[], courseId: string): FilterConfig => ({
    key: 'topicId',
    placeholder: 'Chương mục',
    options: topics.map((topic) => ({ value: topic.id, label: topic.name })),
    disabled: !courseId,
    tooltipTitle: 'Vui lòng chọn môn học trước',
    width: '250px',
});

// Bộ lọc bài học
const createLessonFilter = (lessons: ParamData[], topicId: string): FilterConfig => ({
    key: 'lessonId',
    placeholder: 'Bài học',
    options: lessons.map((lesson: any) => ({ value: lesson.id, label: lesson.name })),
    disabled: !topicId,
    tooltipTitle: 'Vui lòng chọn chương mục trước',
    width: '350px',
});

export { createGradeFilter, createCourseFilter, createTopicFilter, createLessonFilter };
