'use client';
import React, { createContext, useState, useContext } from 'react';

const KiemtraContext = createContext();

export const KiemtraProvider = ({ children }) => {
    const [selectedSubject, setSelectedSubject] = useState();
    const [selectedGrade, setSelectedGrade] = useState(1);
    const [courses, setCourses] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const [quizzes, setQuizzes] = useState([]);

    return (
        <KiemtraContext.Provider
            value={{
                selectedSubject,
                setSelectedSubject,
                selectedGrade,
                setSelectedGrade,
                courses,
                setCourses,
                topics,
                setTopics,
                selectedTopicId,
                setSelectedTopicId,
                quizzes,
                setQuizzes,
            }}
        >
            {children}
        </KiemtraContext.Provider>
    );
};

export const useKiemtraContext = () => useContext(KiemtraContext);
