'use client';
import { createContext, useState, useContext } from 'react';

const OntapContext = createContext();

export const OntapProvider = ({ children }) => {
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
        getStoredValue('onTap_selectedCourse'),
    );
    const [selectedTopic, setSelectedTopic] = useState(() => getStoredValue('onTap_selectedTopic'));
    const [selectedLesson, setSelectedLesson] = useState(() =>
        getStoredValue('onTap_selectedLesson'),
    );
    const [selectedTheory, setSelectedTheory] = useState(() =>
        getStoredValue('onTap_selectedTheory'),
    );
    const [selectedPractice, setSelectedPractice] = useState(() =>
        getStoredValue('selectedPractice'),
    );
    const [firstPracticeInLesson, setFirstPracticeInLesson] = useState(() =>
        getStoredValue('firstPracticeInLesson'),
    );

    const setStateWithStorage = (key, setter) => (value) => {
        setter(value);
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value));
        }
    };

    return (
        <OntapContext.Provider
            value={{
                selectedCourse,
                setSelectedCourse: setStateWithStorage('onTap_selectedCourse', setSelectedCourse),
                selectedTopic,
                setSelectedTopic: setStateWithStorage('onTap_selectedTopic', setSelectedTopic),
                selectedLesson,
                setSelectedLesson: setStateWithStorage('onTap_selectedLesson', setSelectedLesson),
                selectedTheory,
                setSelectedTheory: setStateWithStorage('onTap_selectedTheory', setSelectedTheory),
                selectedPractice,
                setSelectedPractice: setStateWithStorage(
                    'onTap_selectedPractice',
                    setSelectedPractice,
                ),
                firstPracticeInLesson,
                setFirstPracticeInLesson: setStateWithStorage(
                    'firstPracticeInLesson',
                    setFirstPracticeInLesson,
                ),
            }}
        >
            {children}
        </OntapContext.Provider>
    );
};

export const useOntapContext = () => useContext(OntapContext);
