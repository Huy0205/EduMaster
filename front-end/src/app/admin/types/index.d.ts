interface AdminManagementWrapperProps {
    fetchData: (filterData: any) => Promise<any>;
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
}

interface TooltipProps {
    content: string;
    disabled: boolean;
    children: React.ReactElement;
}
