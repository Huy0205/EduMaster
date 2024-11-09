'use client';
import { Add, Delete, Edit, ViewList } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { ReviewService, TopicService } from '~/services';

interface Topic {
    id: string;
    name: string;
    order: number;
    course: object;
}

function AdminReviewsDetailPage({ params }: { params: { courseId: string } }) {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [reviews, setReviews] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState<string>('');

    const { courseId } = params;

    useEffect(() => {
        const fetchTopics = async () => {
            const topicRes = await TopicService.getTopicsByCourse(courseId);
            const { data, message } = topicRes.data;
            if (data) {
                setTopics(data);
                setSelectedTopic(data[0].id);
            } else {
                console.log(message);
            }
        };
        fetchTopics();
    }, [courseId]);

    useEffect(() => {
        const fetchReviews = async () => {
            const reviewRes = await ReviewService.getReviewsByTopic(selectedTopic);
            const { data, message } = reviewRes.data;
            if (data) {
                setReviews(data);
            } else {
                console.log(message);
            }
        };
        fetchReviews();
    }, [selectedTopic]);

    return (
        <div className="flex flex-col flex-1 bg-white">
            <div className="w-full flex justify-between p-3 ">
                <h3 className="text-lg text-gray-600 font-bold">Quản lý bài ôn tập</h3>
                <div className="flex gap-4">
                    <select
                        className="w-[400px] border border-gray-500 rounded-md text-base font-medium text-gray-700 px-2 outline-none"
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                    >
                        {topics.map((topic) => (
                            <option
                                key={topic.id}
                                value={topic.id}
                            >
                                {topic.name}
                            </option>
                        ))}
                    </select>
                    <button className="flex justify-center items-center gap-1 text-base font-semibold bg-primary py-1 px-2 rounded-md">
                        <Add />
                        <span>Thêm</span>
                    </button>
                </div>
            </div>
            <div className="w-full p-3 pt-0">
                <table className="w-full border-collapse text-base text-gray-500">
                    <thead>
                        <tr>
                            <th className="border-2 border-slate-300">STT</th>
                            <th className="border-2 border-slate-300">Tiêu đề</th>
                            <th className="border-2 border-slate-300">Điểm thưởng</th>
                            <th className="border-2 border-slate-300 p-1">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review, index) => (
                            <tr key={review.id}>
                                <td className="border-2 border-slate-300 text-center">
                                    {index + 1}
                                </td>
                                <td className="border-2 border-slate-300 px-1">{review.name}</td>
                                <td className="border-2 border-slate-300 px-1">
                                    {review.bonusPoint}
                                </td>
                                <td className="border-2 border-slate-300 p-1">
                                    <div className="flex gap-2 justify-center items-center">
                                        <button className="border-2 border-slate-300 rounded-md p-[1px]">
                                            <Edit />
                                        </button>
                                        <button className="border-2 border-slate-300 rounded-md p-[1px]">
                                            <Delete />
                                        </button>
                                        <button className="border-2 border-slate-300 rounded-md p-[1px]">
                                            <ViewList />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminReviewsDetailPage;
