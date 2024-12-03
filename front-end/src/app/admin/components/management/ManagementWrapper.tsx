'use client';
import { useEffect, useState } from 'react';

import { useFilterData } from '~/context/FilterDataContext';
import AdminFilter from './Filter';
import AdminTable from './Table';
import AddButton from '../AddButton';
import { usePathname } from 'next/navigation';

function AdminManagementWrapper({
    fetchData,
    updateData,
    filterConfig,
    tableConfig,
    addBtn,
    onReloadTable,
}: AdminManagementWrapperProps) {
    const pathname = usePathname();
    const { filterData, resetFilterData } = useFilterData();
    const [tableData, setTableData] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [reLoadTable, setReLoadTable] = useState(false);

    const handleFilterChange = async () => {
        const result = await fetchData(filterData);
        const { data, message } = result.data;
        if (data) {
            console.log(data);
            setTableData(data);
        } else {
            console.error(message);
        }
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
        if (mounted) handleFilterChange();
        else setMounted(true);

        return () => {
            if (addBtn.link && addBtn.link.includes(pathname)) return;
            console.log('unmount:');
            resetFilterData();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted]);

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
