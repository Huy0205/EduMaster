import { Tooltip } from '@mui/material';
import Switch from '../Switch';

function AdminTable({
    header,
    data,
    columnsData,
    actions,
    page,
    limit,
    onStatusChange,
}: AdminTableProps) {
    const handleStatusChange = (id: string, rowIndex: number, newState: boolean) => {
        const newStatus = newState ? 1 : 0;
        onStatusChange(id, rowIndex, newStatus);
    };

    return (
        <table className="w-full bg-white border-collapse">
            <thead>
                <tr className="bg-red-100">
                    {header.map((item, index) => (
                        <th
                            key={index}
                            className="border p-2"
                        >
                            {item}
                        </th>
                    ))}
                    {actions && <th className="border p-2">Thao tác</th>}
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((item, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="border hover:bg-gray-100"
                        >
                            <td className="border p-2">{rowIndex - 9 + page * limit}</td>
                            {columnsData.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="border p-2"
                                >
                                    {column === 'status' ? (
                                        <div className="flex justify-center items-center">
                                            <Switch
                                                visible={item.status}
                                                onToggle={(newState) =>
                                                    handleStatusChange(item.id, rowIndex, newState)
                                                }
                                            />
                                        </div>
                                    ) : (
                                        item[column]
                                    )}
                                </td>
                            ))}
                            {actions && (
                                <td className="border p-2">
                                    {actions.map(({ label, icon: Icon, onClick }, actionIndex) => (
                                        <Tooltip
                                            key={actionIndex}
                                            title={label}
                                            arrow
                                        >
                                            <button
                                                className="mx-1 text-blue-600"
                                                onClick={() => onClick(item)}
                                            >
                                                <Icon />
                                            </button>
                                        </Tooltip>
                                    ))}
                                </td>
                            )}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan={header.length + 1}
                            className="text-center p-2"
                        >
                            Không có dữ liệu
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default AdminTable;
