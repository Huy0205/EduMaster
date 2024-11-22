'use client';
import { useEffect, useState } from 'react';
import { useFilterData } from '~/context/FilterDataContext';
import AdminFilter from './Filter';
import Link from 'next/link';
import { Add } from '@mui/icons-material';
import AdminTable from './Table';

function AdminManagementWrapper({
    fetchData,
    filterConfig,
    tableConfig,
}: AdminManagementWrapperProps) {
    const { filterData, resetFilterData } = useFilterData();
    const [tableData, setTableData] = useState([]);
    const [mounted, setMounted] = useState(false);

    const handleFilterChange = async () => {
        const result = await fetchData(filterData);
        const { data, message } = result.data;
        if (data) {
            console.log(data.arr || data);
            setTableData(data.arr || data);
        } else {
            console.error(message);
        }
    };

    useEffect(() => {
        if (mounted) handleFilterChange();
        else setMounted(true);

        return () => {
            resetFilterData();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted]);

    return (
        <div className="w-full text-gray-600">
            <div className="flex p-3 mb-1 bg-white">
                <AdminFilter
                    filters={filterConfig}
                    onFilterChange={handleFilterChange}
                />
                {tableConfig.addLink && (
                    <Link href={tableConfig.addLink}>
                        <button className="bg-green-500 text-white px-4 py-2 rounded">
                            <Add />
                            <span>Thêm</span>
                        </button>
                    </Link>
                )}
            </div>
            <AdminTable
                {...tableConfig}
                data={tableData}
            />
        </div>
    );
}

export default AdminManagementWrapper;
