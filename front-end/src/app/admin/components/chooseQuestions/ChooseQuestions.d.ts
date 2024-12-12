interface AdminChooseQuestionsProps {
    filterDisplayItems: { key: string; label: string; value: string }[];
    questions: QuestionTypeWithSelection[];
    extraFilterFields?: JSX.Element;
    onContinue: () => void;
}
