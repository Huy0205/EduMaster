interface AdminManagementWrapperProps {
    fetchData: (filterData: any, page?: number, limit?: number) => Promise<any>;
    updateData?: (id: string, data: any) => Promise<any>;
    filterConfig: {
        key: string;
        placeholder: string;
        options: { value: string; label: string }[];
        disabled?: boolean;
        tooltipTitle?: string;
    }[];
    tableConfig: {
        columns: {
            key: string;
            label: string;
            width: string;
            align: 'center' | 'left' | 'right' | string;
        }[];
        actions?: {
            label: string;
            icon: React.ComponentType;
            color: string;
            onClick: (item: any) => void;
        }[];
    };
    addBtn: {
        link?: string;
        onClick?: () => void;
        disabled?: boolean;
    };
    onReloadTable?: (setReloadFn: (reload: boolean) => void) => void;
}

interface AdminFilterProps {
    filters: {
        key: string;
        placeholder: string;
        options: { value: string; label: string }[];
        disabled?: boolean;
        tooltipTitle?: string;
    }[];
    onFilterChange: () => void;
}

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

interface AdminAddQuestionProps {
    items: {
        key: string;
        label: string;
        value: string;
    }[];
    onSave: (data: any) => void;
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

interface Action {
    label: string;
    icon: React.ElementType;
    color: any;
    onClick: (item: any) => void;
}

interface AdminTableProps {
    columns: {
        key: string;
        label: string;
        width: string;
        align: 'center' | 'left' | 'right' | string;
    }[];
    data: any[];
    actions?: Action[];
    onStatusChange: (id: string, rowIndex: number, newStatus: 0 | 1) => void;
}
