interface ColumnConfig {
    key: string;
    label: string;
    width: 'auto' | `${number}px` | string;
    align: 'center' | 'left' | 'right' | undefined;
}

interface Action {
    label: string;
    icon: React.ElementType;
    color: string;
    onClick: (item: any) => void;
}

interface AdminTableProps {
    columns: ColumnConfig[];
    data: any[];
    actions?: Action[];
    loading: boolean;
    onStatusChange: (id: string, rowIndex: number, newStatus: 0 | 1) => void;
}
