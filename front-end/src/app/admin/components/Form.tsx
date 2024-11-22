interface AdminFormProps {
    title: string;
    items: {
        type: string;
        label: string;
        selected?: any;
        options?: { value: string; label: string }[];
    }[];
}

function AdminForm({ title, items }: AdminFormProps) {
    return (
        <form className="w-1/2 h-full">
            <h3 className="text-2xl text-center my-3">{title}</h3>
            {items.map((item, index) => {
                if (item.type === 'select') {
                    return (
                        <div
                            key={index}
                            className="w-full flex flex-col"
                        >
                            <label className="text-lg mb-1">{item.label}:</label>
                            <select
                                className="border rounded-md p-1 text-lg"
                                value={item.selected}
                            >
                                {item.options?.map((option, index) => (
                                    <option
                                        key={index}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );
                }
                return (
                    <div
                        key={index}
                        className="w-full flex flex-col"
                    >
                        <label className="text-lg mb-1">{item.label}:</label>
                        <input
                            type="text"
                            className="border rounded-md p-1 text-lg"
                        />
                    </div>
                );
            })}
        </form>
    );
}

export default AdminForm;
