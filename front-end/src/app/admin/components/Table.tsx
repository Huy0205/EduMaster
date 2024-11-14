interface AdminTableProps {
    header: string[];
    columnsData: any[];
    data: any[];
}

function AdminTable({ header, data, columnsData }: AdminTableProps) {
    return (
        <table>
            <thead>
                <tr>
                    {header.map((item, index) => (
                        <th key={index}>{item}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        {columnsData.map((column, index) => (
                            <td key={index}>{item[column]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default AdminTable;
