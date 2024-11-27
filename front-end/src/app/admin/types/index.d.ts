interface AdminManagementWrapperProps {
    fetchData: (filterData: any, page?: number, limit?: number) => Promise<any>;
    updateStatus: (id: string, status: 0 | 1) => Promise<any>;
    filterConfig: {
        key: string;
        placeholder: string;
        options: { value: string; label: string }[];
        disabled?: boolean;
        tooltipTitle?: string;
    }[];
    tableConfig: {
        header: string[];
        columnsData: string[];
        actions?: {
            label: string;
            icon: React.ComponentType;
            onClick: (item: any) => void;
        }[];
        addLink?: string;
    };
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

interface AdminTableProps {
    header: string[];
    data: any[];
    columnsData: string[];
    actions?: {
        label: string;
        icon: React.ComponentType;
        onClick: (item: any) => void;
    }[];
    page: number;
    limit: number;
    onStatusChange: (id: string, rowIndex: number, newState: 0 | 1) => void;
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
        type: string;
        key: string;
        label: string;
        selected: string | number;
        options?: { value: string | number; label: string }[];
        disabled?: boolean;
    }[];
    onSave: (data: any) => void;
}

interface BorderWrapperProps {
    title: string;
    classes?: string;
    children: React.ReactNode;
}
