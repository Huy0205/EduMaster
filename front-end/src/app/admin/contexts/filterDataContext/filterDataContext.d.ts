interface FilterData {
    grade: number;
    courseId: string;
    topicId: string;
    lessonId: string;
}

interface FilterDataContextProps {
    filterData: FilterData;
    setFilterData: (data: Partial<FilterData>) => void;
    resetFilterData: () => void;
}
