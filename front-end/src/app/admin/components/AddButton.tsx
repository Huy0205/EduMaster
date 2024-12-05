import { Add } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import Link from 'next/link';

interface AddButtonProps {
    link?: string;
    onClick?: () => void;
    disabled?: boolean;
}

function AddButton({ link, onClick, disabled }: AddButtonProps) {
    if ((!link && !onClick) || (link && onClick)) {
        return null;
    }
    return (
        <Tooltip
            title={disabled ? 'Vui lòng lọc dữ liệu trước' : 'Thêm'}
            arrow
        >
            {link ? (
                <Link
                    href={disabled ? '#' : link}
                    className="h-btn flex justify-center items-center bg-green-500 text-sm text-white px-3 rounded"
                    aria-label="Thêm"
                >
                    <Add />
                    <span>Thêm</span>
                </Link>
            ) : (
                <button
                    onClick={onClick}
                    className="h-btn flex justify-center items-center bg-green-500 text-sm text-white px-3 rounded"
                    aria-label="Thêm"
                    disabled={disabled}
                >
                    <Add />
                    <span>Thêm</span>
                </button>
            )}
        </Tooltip>
    );
}

export default AddButton;