'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterData {
    grade: number;
    courseId: string;
    topicId: string;
}

interface FilterDataContextProps {
    filterData: FilterData;
    setFilterData: (data: Partial<FilterData>) => void;
    resetFilterData: () => void;
}

const defaultFilterData: FilterData = {
    grade: 0,
    courseId: '',
    topicId: '',
};

export const FilterDataContext = createContext<FilterDataContextProps | undefined>(undefined);

export const FilterDataProvider = ({ children }: { children: ReactNode }) => {
    const [filterData, setFilterDataState] = useState<FilterData>(defaultFilterData);

    const setFilterData = (data: Partial<FilterData>) => {
        setFilterDataState((prev) => ({ ...prev, ...data })); // Chỉ cập nhật các field truyền vào
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