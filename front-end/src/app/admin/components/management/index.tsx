'use client';
import { useEffect, useState } from 'react';

import { useFilterData } from '~/app/admin/contexts';
import AdminFilter from './filter';
import AdminTable from './table';
import AddButton from '../AddButton';
import { useDebounce } from '~/app/admin/hooks';
// import { usePathname } from 'next/navigation';

function AdminManagementWrapper({
    fetchData,
    updateData,
    filterConfig,
    tableConfig,
    addBtn,
    onReloadTable,
}: AdminManagementWrapperProps) {
    // const pathname = usePathname();
    const { filterData, resetFilterData } = useFilterData();
    const [tableData, setTableData] = useState<any[]>([]);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reLoadTable, setReLoadTable] = useState(false);

    const debouncedValue = useDebounce(filterData, 1000);

    const handleFilterChange = async () => {
        console.log('Filter data>>>>>>:', debouncedValue);
        setLoading(true);
        const result = await fetchData(debouncedValue);
        const { data, message } = result.data;
        if (data) {
            setTableData(data);
        } else {
            console.error(message);
        }
        setLoading(false);
    };

    const handleStatusChange = async (id: string, rowIndex: number, newStatus: 0 | 1) => {
        const updateTableData = [...tableData];
        updateTableData[rowIndex].status = newStatus;
        setTableData(updateTableData);
        if (typeof updateData === 'function') {
            const res = await updateData(id, { status: newStatus });
            console.log(res);
        }
    };

    useEffect(() => {
        if (typeof onReloadTable === 'function') {
            onReloadTable(setReLoadTable); // Truyền setReLoadTable lên component cha
        }
    }, [onReloadTable]);

    useEffect(() => {
        if (reLoadTable) {
            handleFilterChange();
            setReLoadTable(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reLoadTable]);

    useEffect(() => {
        if (mounted && debouncedValue) handleFilterChange();
        else {
            resetFilterData();
            setMounted(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted, debouncedValue]);

    return (
        <div className="flex-auto text-gray-600">
            <div className="p-[12px] flex justify-between items-center">
                <AdminFilter filters={filterConfig} />
                <AddButton {...addBtn} />
            </div>
            <div className="h-[calc(100%-57px)]">
                <AdminTable
                    {...tableConfig}
                    data={tableData}
                    loading={loading}
                    onStatusChange={handleStatusChange}
                />
            </div>
        </div>
    );
}

export default AdminManagementWrapper;
