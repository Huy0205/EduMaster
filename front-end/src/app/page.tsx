import Header from '../components/Header';
import Navbar from '../components/Navbar';

export default function Home() {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <Navbar />
            <main className="container mx-auto px-4 py-10">
                <section className="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-200">
                    <h2 className="text-2xl font-bold text-center text-blue-500">Giới thiệu</h2>
                    <p className="text-gray-600 mt-4">
                        Website này được thiết kế để hỗ trợ học sinh tiểu học trong việc ôn tập các
                        môn học Toán và Tiếng Việt. Chúng tôi cung cấp các bài kiểm tra và bài tập
                        để học sinh có thể tự đánh giá kiến thức của mình, phát hiện những điểm cần
                        cải thiện và cải thiện kỹ năng học tập.
                    </p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                        <h3 className="text-xl font-bold text-blue-500">Môn Toán</h3>
                        <p className="text-gray-600 mt-2">
                            Các bài tập và kiểm tra sẽ giúp học sinh rèn luyện kỹ năng tính toán,
                            giải quyết các bài toán thực tế, và nâng cao tư duy logic.
                        </p>
                    </div>

                    <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                        <h3 className="text-xl font-bold text-blue-500">Môn Tiếng Việt</h3>
                        <p className="text-gray-600 mt-2">
                            Học sinh sẽ được củng cố ngữ pháp, luyện từ vựng và phát triển khả năng
                            viết qua các bài tập Tiếng Việt đa dạng.
                        </p>
                    </div>
                </section>

                <section className="mt-10 text-center">
                    <h3 className="text-xl font-bold text-blue-500">Tính năng nổi bật</h3>
                    <ul className="mt-4 space-y-2 text-gray-600">
                        <li>Bài kiểm tra đánh giá kiến thức định kỳ</li>
                        <li>Đánh dấu tiến trình học tập</li>
                        <li>Bài tập tự chọn theo chủ đề</li>
                    </ul>
                </section>
            </main>

            <footer className="bg-gray-900 py-6 mt-10">
                <div className="container mx-auto text-center text-gray-300">
                    <p>&copy; 2024 Hỗ trợ ôn tập Toán và Tiếng Việt</p>
                </div>
            </footer>
        </div>
    );
}
