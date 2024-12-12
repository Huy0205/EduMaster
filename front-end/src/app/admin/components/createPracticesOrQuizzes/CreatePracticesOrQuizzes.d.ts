interface CreatePracticesOrQuizzesFormData {
    name: string;
    time: number;
    bonusPoint: number;
}

interface FieldInput {
    key: keyof CreatePracticesOrQuizzesFormData;
    label: string;
    type: string;
    placeholder: string;
}

interface AdminCreatePracticesOrQuizzesProps {
    fields: FieldInput[];
    btnAddQuestion?: React.ReactNode;
    onCreate: (FormData: CreatePracticesOrQuizzesFormData) => void;
}
