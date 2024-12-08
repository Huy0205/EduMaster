interface AdminAddQuestionProps {
    items: {
        key: string;
        label: string;
        value: string;
    }[];
    onSave: (data: any) => void;
}

interface FormDataAddQuestion {
    content: string;
    image: string;
    type: 1 | 2 | 3;
    feedback: string;
    answers: {
        content: string;
        isCorrect: boolean;
    };
    [];
}
