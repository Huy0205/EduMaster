import { createContext, useContext, useState } from 'react';

export const QuestionsSelectedContext = createContext<QuestionsSelectedContext | undefined>(
    undefined,
);

export const QuestionsSelectedProvider = ({ children }: QuestionsSelectedProviderProps) => {
    const [questionsSelected, setQuestionsSelected] = useState<QuestionTypeWithSelection[]>([]);
    return (
        <QuestionsSelectedContext.Provider value={{ questionsSelected, setQuestionsSelected }}>
            {children}
        </QuestionsSelectedContext.Provider>
    );
};

export const useQuestionsSelected = () => {
    const context = useContext(QuestionsSelectedContext);
    if (!context) {
        throw new Error('useQuestionsSelected must be used within a QuestionsSelectedProvider');
    }
    return context;
};
