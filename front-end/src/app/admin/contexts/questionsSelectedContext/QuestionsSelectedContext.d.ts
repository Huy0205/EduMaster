interface QuestionsSelectedProviderProps {
    children: React.ReactNode;
}

interface QuestionType {
    id: string;
    content: string;
    image: string;
    type: number;
    feedback: string;
    answers: {
        id: number;
        content: string;
        isCorrect: boolean;
    }[];
}

interface QuestionTypeWithSelection extends QuestionType {
    selected: boolean;
}

interface QuestionsSelectedContext {
    questionsSelected: QuestionTypeWithSelection[];
    setQuestionsSelected: React.Dispatch<React.SetStateAction<QuestionTypeWithSelection[]>>;
}
