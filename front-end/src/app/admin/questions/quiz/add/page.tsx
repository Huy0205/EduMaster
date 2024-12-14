'use client';

import dynamic from 'next/dynamic';

const AdminAddQuizQuestionPage = dynamic(() => import('./AdminAddQuizQuestionPage'), { ssr: false });

export default AdminAddQuizQuestionPage;
