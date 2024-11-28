'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Add } from '@mui/icons-material';

import { useFilterData } from '~/context/FilterDataContext';
import AdminFilter from './Filter';
import AdminTable from './Table';
import { usePathname } from 'next/navigation';

function AdminManagementWrapper({
    fetchData,
    updateStatus,
    filterConfig,
    tableConfig,
}: AdminManagementWrapperProps) {
    const pathname = usePathname();
    const { filterData, resetFilterData } = useFilterData();
    const [tableData, setTableData] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [mounted, setMounted] = useState(false);

    const handleFilterChange = async (page?: number, limit?: number) => {
        const result = await fetchData(filterData, page, limit);
        const { data, message } = result.data;
        if (data) {
            const { totalPage, list } = data;
            if (totalPage && list) {
                console.log(list);
                setTableData(list);
                setTotalPage(totalPage);
                setPage(page || 1);
                setLimit(limit || 10);
            } else setTableData(data);
        } else {
            console.error(message);
        }
    };

    const handleStatusChange = async (id: string, rowIndex: number, newStatus: 0 | 1) => {
        const updateTableData = [...tableData];
        updateTableData[rowIndex].status = newStatus;
        setTableData(updateTableData);
        const res = await updateStatus(id, newStatus);
        console.log(res);
    };

    useEffect(() => {
        if (mounted) handleFilterChange();
        else setMounted(true);

        return () => {
            if (!tableConfig.addLink?.includes(pathname)) {
                resetFilterData();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted]);

    return (
        <div className="flex-1 flex flex-col text-gray-600">
            <div className="flex justify-between p-3 mb-1 bg-white">
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
            <div className="flex-1 flex flex-col justify-between">
                <AdminTable
                    {...tableConfig}
                    data={tableData}
                    page={page}
                    limit={limit}
                    onStatusChange={handleStatusChange}
                />
                {/* paging */}
                {/* {totalPage && (
                    <div className="flex justify-center p-3 bg-white">
                        <button className="px-4 py-2 bg-gray-200 rounded">Trang trước</button>
                        {Array.from({ length: totalPage }, (_, i) => (
                            <button
                                key={i}
                                className="px-4 py-2 bg-gray-200 rounded"
                                onClick={() => handleFilterChange(i + 1, 10)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button className="px-4 py-2 bg-gray-200 rounded">Trang sau</button>
                    </div>
                )} */}
                {totalPage > 1 && (
                    <div className="flex justify-center items-center gap-2 p-3 bg-white">
                        {/* Nút "Trang đầu" */}
                        <button
                            className={`px-3 py-1 rounded border ${
                                page === 1
                                    ? 'bg-gray-300 text-gray-500'
                                    : 'bg-white hover:bg-gray-100'
                            }`}
                            disabled={page === 1}
                            onClick={() => handleFilterChange(1, limit)}
                        >
                            Trang đầu
                        </button>

                        {/* Nút "Trang trước" */}
                        <button
                            className={`px-3 py-1 rounded border ${
                                page === 1
                                    ? 'bg-gray-300 text-gray-500'
                                    : 'bg-white hover:bg-gray-100'
                            }`}
                            disabled={page === 1}
                            onClick={() => handleFilterChange(page - 1, limit)}
                        >
                            Trang trước
                        </button>

                        {/* Hiển thị các trang xung quanh */}
                        {Array.from({ length: Math.min(5, totalPage) }, (_, i) => {
                            const displayPage = i + Math.max(1, page - 2);
                            if (displayPage > totalPage) return null;
                            return (
                                <button
                                    key={displayPage}
                                    className={`px-3 py-1 rounded border ${
                                        page === displayPage
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white hover:bg-gray-100'
                                    }`}
                                    onClick={() => handleFilterChange(displayPage, limit)}
                                >
                                    {displayPage}
                                </button>
                            );
                        })}

                        {/* Nút "Trang sau" */}
                        <button
                            className={`px-3 py-1 rounded border ${
                                page === totalPage
                                    ? 'bg-gray-300 text-gray-500'
                                    : 'bg-white hover:bg-gray-100'
                            }`}
                            disabled={page === totalPage}
                            onClick={() => handleFilterChange(page + 1, limit)}
                        >
                            Trang sau
                        </button>

                        {/* Nút "Trang cuối" */}
                        <button
                            className={`px-3 py-1 rounded border ${
                                page === totalPage
                                    ? 'bg-gray-300 text-gray-500'
                                    : 'bg-white hover:bg-gray-100'
                            }`}
                            disabled={page === totalPage}
                            onClick={() => handleFilterChange(totalPage, limit)}
                        >
                            Trang cuối
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminManagementWrapper;
