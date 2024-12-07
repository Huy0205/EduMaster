'use client';
import React, { createContext, useState, useContext } from 'react';

const OntapContext = createContext();

export const OntapProvider = ({ children }) => {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedGrade, setSelectedGrade] = useState(1);
    const [selectedLectures, setSelectedLectures] = useState([]);
    const [questionPages, setQuestionPages] = useState([]);
    const [courses, setCourses] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedReviewId, setSelectedReviewId] = useState();
    const [topicStates, setTopicStates] = useState({});
    const [selectedTopicId, setSelectedTopicId] = useState();
    return (
        <OntapContext.Provider
            value={{
                selectedSubject,
                setSelectedSubject,
                selectedGrade,
                setSelectedGrade,
                selectedLectures,
                setSelectedLectures,
                questionPages,
                setQuestionPages,
                courses,
                setCourses,
                topics,
                setTopics,
                selectedReviewId,
                setSelectedReviewId,
                topicStates,
                setTopicStates,
                selectedTopicId,
                setSelectedTopicId,
            }}
        >
            {children}
        </OntapContext.Provider>
    );
};

export const useOntapContext = () => useContext(OntapContext);
