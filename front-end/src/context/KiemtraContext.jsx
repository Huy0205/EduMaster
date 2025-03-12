'use client';
import React, { createContext, useState, useContext } from 'react';

const KiemtraContext = createContext();

export const KiemtraProvider = ({ children }) => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [timeSpent, setTimeSpent] = useState(null);
    const [score, setScore] = useState(null);

    return (
        <KiemtraContext.Provider
            value={{
                selectedCourse,
                setSelectedCourse,
                selectedTopic,
                setSelectedTopic,
                selectedQuiz,
                setSelectedQuiz,
                timeSpent,
                setTimeSpent,
                score,
                setScore,
            }}
        >
            {children}
        </KiemtraContext.Provider>
    );
};

export const useKiemtraContext = () => useContext(KiemtraContext);
