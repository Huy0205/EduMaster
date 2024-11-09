'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GradeContextProps {
    grade: number;
    setGrade: React.Dispatch<React.SetStateAction<number>>;
}
interface GradeProviderProps {
    children: ReactNode;
}

export const GradeContext = createContext<GradeContextProps | undefined>(undefined);

export const GradeProvider = ({ children }: GradeProviderProps) => {
    const [grade, setGrade] = useState<number>(1);

    return <GradeContext.Provider value={{ grade, setGrade }}>{children}</GradeContext.Provider>;
};

export const useGrade = () => {
    const context = useContext(GradeContext);
    if (!context) {
        throw new Error('useGrade must be used within a GradeProvider');
    }
    return context;
};
