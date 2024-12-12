interface DialogPracticeOrQuizDetailProps {
    open: boolean;
    onClose: () => void;
    title: string;
    name: string;
    time?: number;
    bonusPoint: number;
    questions: any[];
}
