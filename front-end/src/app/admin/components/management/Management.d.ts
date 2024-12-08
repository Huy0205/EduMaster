interface AdminManagementWrapperProps {
    fetchData: (filterData: any, page?: number, limit?: number) => Promise<any>;
    updateData?: (id: string, data: any) => Promise<any>;
    filterConfig: FilterConfig[];
    tableConfig: {
        columns: ColumnConfig[];
        actions?: Action[];
    };
    addBtn: {
        link?: string;
        onClick?: () => void;
        disabled?: boolean;
    };
    onReloadTable?: (setReloadFn: (reload: boolean) => void) => void;
}
