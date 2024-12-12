'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

const defaultFilterData: FilterData = {
    grade: 0,
    courseId: '',
    topicId: '',
    lessonId: '',
};

export const FilterDataContext = createContext<FilterDataContextProps | undefined>(undefined);

export const FilterDataProvider = ({ children }: { children: ReactNode }) => {
    const [filterData, setFilterDataState] = useState<FilterData>(defaultFilterData);

    const setFilterData = (data: Partial<FilterData>) => {
        setFilterDataState((prev) => {
            let newFilterData = { ...prev, ...data };

            // Kiểm tra và reset giá trị phụ thuộc
            if (data.grade !== undefined && data.grade !== prev.grade) {
                // Nếu grade thay đổi, reset courseId, topicId, lessonId
                newFilterData = {
                    ...newFilterData,
                    courseId: '',
                    topicId: '',
                    lessonId: '',
                };
            } else if (data.courseId !== undefined && data.courseId !== prev.courseId) {
                // Nếu courseId thay đổi, reset topicId, lessonId
                newFilterData = {
                    ...newFilterData,
                    topicId: '',
                    lessonId: '',
                };
            } else if (data.topicId !== undefined && data.topicId !== prev.topicId) {
                // Nếu topicId thay đổi, reset lessonId
                newFilterData = {
                    ...newFilterData,
                    lessonId: '',
                };
            }

            return newFilterData;
        });
    };

    const resetFilterData = () => {
        setFilterDataState(defaultFilterData);
    };

    return (
        <FilterDataContext.Provider value={{ filterData, setFilterData, resetFilterData }}>
            {children}
        </FilterDataContext.Provider>
    );
};

export const useFilterData = () => {
    const context = useContext(FilterDataContext);
    if (!context) {
        throw new Error('useFilterData must be used within a FilterDataProvider');
    }
    return context;
};
