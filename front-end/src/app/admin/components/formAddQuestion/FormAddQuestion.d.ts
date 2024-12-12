interface FormDataAddQuestionWithoutType {
    content: string;
    image: string;
    feedback: string;
    file: File;
    answers: {
        content: string;
        isCorrect: boolean;
    }[];
}

interface FormAddQuestionProps {
    type: number;
    onSave: (data: FormDataAddQuestionWithoutType) => void;
}
