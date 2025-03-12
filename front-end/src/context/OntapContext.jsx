'use client';
import { createContext, useState, useContext } from 'react';

const OntapContext = createContext();

export const OntapProvider = ({ children }) => {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [selectedTheory, setSelectedTheory] = useState(null);
    const [selectedPractice, setSelectedPractice] = useState(null);
    const [firstPracticeInLesson, setFirstPracticeInLesson] = useState(null);

    return (
        <OntapContext.Provider
            value={{
                selectedCourse,
                setSelectedCourse,
                selectedTopic,
                setSelectedTopic,
                selectedLesson,
                setSelectedLesson,
                selectedTheory,
                setSelectedTheory,
                selectedPractice,
                setSelectedPractice,
                firstPracticeInLesson,
                setFirstPracticeInLesson,
            }}
        >
            {children}
        </OntapContext.Provider>
    );
};

export const useOntapContext = () => useContext(OntapContext);
