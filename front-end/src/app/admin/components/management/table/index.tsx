import { useMemo, useState } from 'react';
import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Tooltip,
} from '@mui/material';
import Switch from '~/app/admin/components/Switch';
import Loading from '~/app/admin/components/loading';

export default function AdminTable({
    data,
    columns,
    actions,
    loading,
    onStatusChange,
}: AdminTableProps) {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState<'asc' | 'desc' | null>('asc');
    const [orderBy, setOrderBy] = useState<string>('');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleStatusChange = (id: string, rowIndex: number, newState: boolean) => {
        const newStatus = newState ? 1 : 0;
        onStatusChange(id, rowIndex, newStatus);
    };

    const handleSort = (column: string) => {
        if (orderBy === column) {
            setOrder(order === 'asc' ? 'desc' : order === 'desc' ? null : 'asc');
            if (order === 'desc') {
                setOrderBy('');
            }
        } else {
            setOrder('asc');
            setOrderBy(column);
        }
    };

    const sortedData = useMemo(() => {
        if (!orderBy || !order) return data;
        return [...data].sort((a, b) => {
            if (a[orderBy] < b[orderBy]) {
                return order === 'asc' ? -1 : 1;
            }
            if (a[orderBy] > b[orderBy]) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [data, order, orderBy]);

    const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
    };

    return (
        <Paper sx={{ width: '100%', height: '100%', overflowY: 'auto' }}>
            <TableContainer sx={{ height: 'calc(100% - 50px)' }}>
                <Table
                    stickyHeader
                    aria-label="sticky table"
                    sx={{
                        '& .MuiTableCell-root': {
                            padding: '9px',
                        },
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{ backgroundColor: '#f5f5f5' }}
                                width="40px"
                                align="center"
                            >
                                STT
                            </TableCell>
                            {columns.map((item, index) => (
                                <TableCell
                                    key={index}
                                    sx={{ backgroundColor: '#f5f5f5' }}
                                    width={item.width}
                                    align="center"
                                >
                                    <TableSortLabel
                                        active={orderBy === columns[index].key}
                                        {...(orderBy === columns[index].key && order
                                            ? { direction: order }
                                            : {})}
                                        onClick={() => handleSort(columns[index].key)}
                                    >
                                        {item.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            {actions && (
                                <TableCell
                                    sx={{ backgroundColor: '#f5f5f5' }}
                                    width="150px"
                                    align="center"
                                >
                                    Thao tác
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + 2}
                                    align="center"
                                >
                                    <Loading />
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item, rowIndex) => (
                                    <TableRow
                                        key={rowIndex}
                                        hover
                                    >
                                        <TableCell
                                            sx={{ width: '40px' }}
                                            align="center"
                                        >
                                            {rowIndex + 1 + page * rowsPerPage}
                                        </TableCell>
                                        {columns.map((column, colIndex) => (
                                            <TableCell
                                                key={colIndex}
                                                width={column.width}
                                                align={column.align}
                                            >
                                                {column.key === 'status' ? (
                                                    <Switch
                                                        visible={item.status}
                                                        onToggle={(newState) =>
                                                            handleStatusChange(
                                                                item.id,
                                                                rowIndex,
                                                                newState,
                                                            )
                                                        }
                                                    />
                                                ) : column.key === 'type' ? (
                                                    <p>
                                                        {(() => {
                                                            const questionTypeMap = {
                                                                1: 'Chọn một đáp án đúng',
                                                                2: 'Chọn nhiều đáp án đúng',
                                                                3: 'Điền đáp án',
                                                            };
                                                            return (
                                                                questionTypeMap[
                                                                    item[
                                                                        column.key
                                                                    ] as keyof typeof questionTypeMap
                                                                ] || 'Không xác định'
                                                            );
                                                        })()}
                                                    </p>
                                                ) : (
                                                    <p>{getNestedValue(item, column.key)}</p>
                                                )}
                                            </TableCell>
                                        ))}
                                        {actions && (
                                            <TableCell
                                                width="150px"
                                                align="center"
                                            >
                                                {actions.map(
                                                    (
                                                        { label, icon: Icon, color, onClick },
                                                        actionIndex,
                                                    ) => (
                                                        <Tooltip
                                                            key={actionIndex}
                                                            title={label}
                                                            arrow
                                                        >
                                                            <IconButton
                                                                aria-label={label}
                                                                sx={{
                                                                    border: '1px solid #e0e0e0',
                                                                    borderRadius: '5px',
                                                                    padding: '3px',
                                                                    margin: '0 5px',
                                                                }}
                                                                onClick={() => onClick(item)}
                                                            >
                                                                <Icon
                                                                    sx={{ color }}
                                                                    fontSize="small"
                                                                />
                                                            </IconButton>
                                                        </Tooltip>
                                                    ),
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {!loading && (
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    sx={{ height: '50px' }}
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số hàng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} trong tổng số ${count !== -1 ? count : `hơn ${to}`}`
                    }
                />
            )}
        </Paper>
    );
}
