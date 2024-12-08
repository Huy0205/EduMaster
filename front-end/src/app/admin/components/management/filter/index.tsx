import { Autocomplete, TextField, Tooltip } from '@mui/material';
import { useFilterData } from '~/app/admin/contexts';

function AdminFilter({ filters }: AdminFilterProps) {
    const { filterData, setFilterData } = useFilterData();

    const handleChange = (key: keyof FilterData, value: FilterOption | null) => {
        setFilterData({ ...filterData, [key]: value ? value.value : null });
    };

    return (
        <div className="flex gap-2 items-center text-sm">
            <h2>Bộ lọc tìm kiếm:</h2>
            {filters.map(({ key, options, disabled, placeholder, tooltipTitle, width }) => (
                <Tooltip
                    key={key}
                    title={disabled ? tooltipTitle : ''}
                    arrow
                >
                    <Autocomplete
                        disablePortal
                        options={options}
                        value={options.find((option) => option.value === filterData[key]) || null}
                        disabled={disabled}
                        autoHighlight
                        style={{ width: width }}
                        noOptionsText="Không tìm thấy"
                        classes={{
                            input: 'text-sm',
                            listbox: 'text-sm',
                            noOptions: 'text-sm',
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={placeholder}
                                size="small"
                                sx={{
                                    '& label': {
                                        fontSize: '0.875rem',
                                    },
                                    '& label.Mui-focused, & label.MuiFormLabel-filled': {
                                        transform: 'translate(14px, -8px) scale(0.75)',
                                    },
                                    '& .MuiOutlinedInput-root legend': {
                                        fontSize: '0.65em',
                                    },
                                }}
                            />
                        )}
                        onChange={(_, value) => handleChange(key, value)}
                    />
                </Tooltip>
            ))}
        </div>
    );
}

export default AdminFilter;
