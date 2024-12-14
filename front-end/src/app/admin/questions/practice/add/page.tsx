'use client';

import dynamic from 'next/dynamic';

const AdminAddPracticeQuestionPage = dynamic(() => import('./AdminAddPracticeQuestionPage'), { ssr: false });

export default AdminAddPracticeQuestionPage;
