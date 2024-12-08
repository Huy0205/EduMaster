import { Tooltip } from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';

function FilterDisplay({ items }: FilterDisplayProps) {
    return (
        <div className="w-full mb-5">
            {items.map((item, index) => (
                <TruncatedTooltip
                    key={index}
                    label={item.label}
                    value={item.value}
                />
            ))}
        </div>
    );
}

function TruncatedTooltip({ label, value }: { label: string; value: string }) {
    const spanRef = useRef<HTMLSpanElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
        const checkTruncation = () => {
            if (spanRef.current) {
                setIsTruncated(spanRef.current.scrollWidth > spanRef.current.offsetWidth);
            }
        };
        checkTruncation();

        window.addEventListener('resize', checkTruncation);
        return () => window.removeEventListener('resize', checkTruncation);
    }, [value]);

    return (
        <Tooltip
            title={isTruncated ? value : ''}
            placement="bottom-start"
            arrow
            slotProps={{
                popper: {
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, -20],
                            },
                        },
                    ],
                },
            }}
        >
            <div className="flex flex-col pb-3">
                <label className="font-medium m-1">{label}:</label>
                <span
                    ref={spanRef}
                    className="w-full border-2 rounded-md px-2 py-1 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                    {value}
                </span>
            </div>
        </Tooltip>
    );
}

export default FilterDisplay;
