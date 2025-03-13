'use client';
import React, { createContext, useState, useContext } from 'react';

const KiemtraContext = createContext();

export const KiemtraProvider = ({ children }) => {
    const getStoredValue = (key, defaultValue = null) => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem(key);
            if (storedValue && storedValue !== 'undefined') {
                try {
                    return JSON.parse(storedValue);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    return defaultValue;
                }
            }
        }
        return defaultValue;
    };

    const [selectedCourse, setSelectedCourse] = useState(() =>
        getStoredValue('kiemTra_selectedCourse'),
    );
    const [selectedTopic, setSelectedTopic] = useState(() =>
        getStoredValue('kiemTra_selectedTopic'),
    );
    const [selectedQuiz, setSelectedQuiz] = useState(() => getStoredValue('kiemTra_selectedQuiz'));
    const [timeSpent, setTimeSpent] = useState(() => getStoredValue('kiemTra_timeSpent'));
    const [score, setScore] = useState(() => getStoredValue('kiemTra_score'));

    const setStateWithStorage = (key, setter) => (value) => {
        setter(value);
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value));
        }
    };

    return (
        <KiemtraContext.Provider
            value={{
                selectedCourse,
                setSelectedCourse: setStateWithStorage('kiemTra_selectedCourse', setSelectedCourse),
                selectedTopic,
                setSelectedTopic: setStateWithStorage('kiemTra_selectedTopic', setSelectedTopic),
                selectedQuiz,
                setSelectedQuiz: setStateWithStorage('kiemTra_selectedQuiz', setSelectedQuiz),
                timeSpent,
                setTimeSpent: setStateWithStorage('kiemTra_timeSpent', setTimeSpent),
                score,
                setScore: setStateWithStorage('kiemTra_score', setScore),
            }}
        >
            {children}
        </KiemtraContext.Provider>
    );
};

export const useKiemtraContext = () => useContext(KiemtraContext);
