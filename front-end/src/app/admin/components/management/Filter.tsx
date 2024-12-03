import { Tooltip } from '@mui/material';
import { useFilterData } from '~/context/FilterDataContext';

function AdminFilter({ filters, onFilterChange }: AdminFilterProps) {
    const { filterData, setFilterData } = useFilterData();

    const handleChange = (key: string, value: any) => {
        setFilterData({ ...filterData, [key]: value });
    };

    return (
        <div className="flex gap-2 items-center text-sm">
            <h2>Bộ lọc tìm kiếm:</h2>
            {filters.map(({ key, options, disabled, placeholder, tooltipTitle }) => (
                <Tooltip
                    key={key}
                    title={disabled ? tooltipTitle : ''}
                    arrow
                >
                    <select
                        className="h-btn px-1 border border-gray-300 rounded"
                        onChange={(e) => handleChange(key, e.target.value)}
                        disabled={disabled}
                    >
                        <option value="">{placeholder}</option>
                        {options.map((option, index) => (
                            <option
                                key={index}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </Tooltip>
            ))}
            <button
                className="h-btn bg-blue-500 text-white px-3 rounded"
                onClick={onFilterChange}
            >
                Lọc
            </button>
        </div>
    );
}

export default AdminFilter;
