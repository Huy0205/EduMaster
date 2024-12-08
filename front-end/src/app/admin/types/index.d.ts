interface TooltipProps {
    content: string;
    disabled: boolean;
    children: React.ReactElement;
}

interface SwitchProps {
    visible: boolean;
    onToggle: (newState: boolean) => void;
}

interface TopicFormData {
    topicName: string;
    courseId: string;
}

interface BorderWrapperProps {
    title: string;
    classes?: string;
    children: React.ReactNode;
}

interface AddButtonProps {
    link?: string;
    onClick?: () => void;
}

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    content: string;
    onClose: () => void;
    onConfirm: () => void;
}
