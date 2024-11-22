import { Tooltip } from '@mui/material';

function AdminTable({ header, data, columnsData, actions }: AdminTableProps) {
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
                            <td className="border p-2">{rowIndex + 1}</td>
                            {columnsData.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="border p-2"
                                >
                                    {item[column]}
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
