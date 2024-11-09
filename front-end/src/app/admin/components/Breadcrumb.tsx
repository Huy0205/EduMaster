import React from 'react';
import Link from 'next/link';
import { Home } from '@mui/icons-material';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="text-gray-500 text-sm">
            <ul className="flex space-x-2">
                <li>
                    <Link
                        href="admin/dashboard"
                        className="hover:text-blue-500"
                    >
                        <Home />
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li
                        key={index}
                        className="flex items-center"
                    >
                        <Link
                            href={item.href}
                            className="hover:text-blue-500"
                        >
                            {item.label}
                        </Link>
                        {index < items.length - 1 && <span className="mx-2">/</span>}
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Breadcrumb;
