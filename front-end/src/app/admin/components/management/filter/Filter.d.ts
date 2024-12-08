interface FilterConfig {
    key: keyof FilterData;
    placeholder: string;
    options: FilterOption[];
    disabled?: boolean;
    tooltipTitle?: string;
    width?: string;
}

interface AdminFilterProps {
    filters: FilterConfig[];
}

interface FilterOption {
    value: string | number;
    label: string;
}
