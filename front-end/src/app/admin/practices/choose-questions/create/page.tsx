'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useFilterData, useQuestionsSelected } from '~/app/admin/contexts';
import { PracticeQuestionService, PracticeService } from '~/services';
import { toast } from 'react-toastify';
import AdminCreatePracticesOrQuizzes from '~/app/admin/components/createPracticesOrQuizzes';

function CreatePracticePage() {
    const router = useRouter();

    const { filterData } = useFilterData();
    const { questionsSelected, setQuestionsSelected } = useQuestionsSelected();

    const handleCreatePractice = async (formData: CreatePracticesOrQuizzesFormData) => {
        const { name, bonusPoint } = formData;
        const practiceRes = await PracticeService.addPractice({
            name,
            bonusPoint,
            lessonId: filterData.lessonId,
        });
        const { data, message } = practiceRes.data;
        if (data) {
            const { id: practiceId } = data;
            const practiceQuestions = questionsSelected.map((question, index) => ({
                practiceId,
                questionId: question.id,
                orderInPractice: index + 1,
            }));
            const practiceQuestionRes = await PracticeQuestionService.addPracticeQuestion(
                practiceQuestions,
            );
            const { data: practiceQuestionData, message: practiceQuestionMessage } =
                practiceQuestionRes.data;
            if (practiceQuestionData) {
                setQuestionsSelected([]);
                toast.success('Tạo bài thực hành thành công');
                router.push('/admin/practices');
            } else {
                toast.error('Có lỗi xảy ra: ' + practiceQuestionMessage);
            }
        } else {
            toast.error('Có lỗi xảy ra: ' + message);
        }
    };

    useEffect(() => {
        if (questionsSelected.length === 0) {
            router.push('/admin/practices/choose-questions');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fieldInputs = [
        {
            key: 'name',
            label: 'Tên bài thực hành',
            type: 'text',
            placeholder: 'Nhập tên bài thực hành',
        },
        {
            key: 'bonusPoint',
            label: 'Điểm thưởng',
            type: 'number',
            placeholder: 'Nhập điểm thưởng',
        },
    ] as FieldInput[];

    return (
        <AdminCreatePracticesOrQuizzes
            fields={fieldInputs}
            onCreate={handleCreatePractice}
        />
    );
}

export default CreatePracticePage;
