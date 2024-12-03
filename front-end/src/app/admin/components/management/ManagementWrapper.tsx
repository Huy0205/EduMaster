'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { useFilterData } from '~/context/FilterDataContext';
import AdminFilter from './Filter';
import AdminTable from './Table';
import AddButton from '../AddButton';

function AdminManagementWrapper({
    fetchData,
    updateData,
    filterConfig,
    tableConfig,
    addBtn,
    reLoadTable,
}: AdminManagementWrapperProps) {
    const pathname = usePathname();
    const { filterData, resetFilterData } = useFilterData();
    const [tableData, setTableData] = useState([]);
    const [mounted, setMounted] = useState(false);

    const handleFilterChange = async (page?: number, limit?: number) => {
        const result = await fetchData(filterData, page, limit);
        const { data, message } = result.data;
        if (data) {
            const { totalPage, list } = data;
            if (totalPage && list) {
                setTableData(list);
            } else setTableData(data);
        } else {
            console.error(message);
        }
    };

    const handleStatusChange = async (id: string, rowIndex: number, newStatus: 0 | 1) => {
        const updateTableData = [...tableData];
        updateTableData[rowIndex].status = newStatus;
        setTableData(updateTableData);
        const res = await updateData(id, { status: newStatus });
        console.log(res);
    };

    useEffect(() => {
        if (mounted) handleFilterChange();
        else setMounted(true);

        return () => {
            console.log('unmount');
            const navigationPath = addBtn.link || addBtn.currentPath;
            if (navigationPath && !navigationPath.includes(pathname)) {
                resetFilterData();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted, reLoadTable]);

    return (
        <div className="flex-auto text-gray-600">
            <div className="p-[12px] flex justify-between items-center">
                <AdminFilter
                    filters={filterConfig}
                    onFilterChange={handleFilterChange}
                />
                <AddButton {...addBtn} />
            </div>
            <div className="h-[calc(100%-57px)]">
                <AdminTable
                    {...tableConfig}
                    data={tableData}
                    onStatusChange={handleStatusChange}
                />
            </div>
        </div>
    );
}

export default AdminManagementWrapper;
