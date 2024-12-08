interface QuestionViewProps {
    data: {
        content?: string;
        image?: string;
        type: 1 | 2 | 3;
        feedback?: string;
        answers: {
            content: string;
            isCorrect: boolean;
        }[];
    };
}
