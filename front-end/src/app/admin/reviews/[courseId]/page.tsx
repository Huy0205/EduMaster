import { Add } from '@mui/icons-material';

function AdminReviewsDetailPage({ params }: { params: { courseId: string } }) {
    const { courseId } = params;
    return (
        <div>
            <div className="flex justify-between p-3">
                <h3 className="text-lg text-gray-600 font-bold">Quản lý bài ôn tập</h3>
                <div>
                    <select>
                        <option value="">Tất cả</option>
                        <option value="">Bài 1</option>
                        <option value="">Bài 2</option>
                        <option value="">Bài 3</option>
                    </select>
                    <button>
                        <Add />
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminReviewsDetailPage;
