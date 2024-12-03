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
import Switch from '../Switch';

export default function AdminTable({ data, columns, actions, onStatusChange }: AdminTableProps) {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
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
        const isAsc = orderBy === column && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(column);
    };

    const sortedData = useMemo(() => {
        if (!orderBy) return data;
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

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: '507px' }}>
                <Table
                    stickyHeader
                    aria-label="sticky table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{ backgroundColor: '#f5f5f5', width: '40px' }}
                                align="center"
                            >
                                STT
                            </TableCell>
                            {columns.map((item, index) => (
                                <TableCell
                                    key={index}
                                    sx={{ backgroundColor: '#f5f5f5', width: item.width }}
                                    align="center"
                                >
                                    <TableSortLabel
                                        active={orderBy === columns[index].key}
                                        direction={orderBy === columns[index].key ? order : 'asc'}
                                        onClick={() => handleSort(columns[index].key)}
                                    >
                                        {item.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            {actions && (
                                <TableCell
                                    sx={{ backgroundColor: '#f5f5f5' }}
                                    align="center"
                                >
                                    Thao tác
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData
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
                                            sx={{ width: column.width }}
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
                                            ) : (
                                                item[column.key]
                                            )}
                                        </TableCell>
                                    ))}
                                    {actions && (
                                        <TableCell
                                            align="center"
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '10px',
                                            }}
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
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
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
        </Paper>
    );
}
