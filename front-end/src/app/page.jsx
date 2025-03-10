import Header from '../components/Header';
import Navbar from '../components/Navbar';

export default function Home() {
    return (
        <div className="w-screen h-screen flex flex-col bg-amber-50">
            <Header />
            <Navbar />
            <main className="container mx-auto flex-1 flex flex-col gap-6 pt-12">
                <section className="flex-2 px-8 py-5 bg-white shadow-sm rounded-lg border border-gray-200">
                    <h2 className="text-2xl font-bold text-center text-blue-500">Giới thiệu</h2>
                    <p className="text-gray-600 mt-2">
                        Website này được thiết kế để hỗ trợ học sinh tiểu học trong việc ôn tập các
                        môn học Toán và Tiếng Việt. Chúng tôi cung cấp các bài kiểm tra và bài tập
                        để học sinh có thể tự đánh giá kiến thức của mình, phát hiện những điểm cần
                        cải thiện và cải thiện kỹ năng học tập.
                    </p>
                </section>

                <section className="flex-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="px-8 py-5 bg-white shadow-sm rounded-lg border border-gray-200">
                        <h3 className="text-xl text-center font-bold text-blue-500">Môn Toán</h3>
                        <p className="text-gray-600 mt-2">
                            Các bài tập và kiểm tra sẽ giúp học sinh rèn luyện kỹ năng tính toán,
                            giải quyết các bài toán thực tế, và nâng cao tư duy logic.
                        </p>
                    </div>

                    <div className="px-8 py-5 bg-white shadow-sm rounded-lg border border-gray-200">
                        <h3 className="text-xl text-center font-bold text-blue-500">
                            Môn Tiếng Việt
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Học sinh sẽ được củng cố ngữ pháp, luyện từ vựng và phát triển khả năng
                            viết qua các bài tập Tiếng Việt đa dạng.
                        </p>
                    </div>
                </section>

                <section className="flex-3 flex flex-col justify-end items-center pb-5">
                    <h3 className="text-xl font-bold text-blue-500">Tính năng nổi bật</h3>
                    <ul className="mt-3 space-y-1 text-gray-600 text-center">
                        <li>Bài kiểm tra đánh giá kiến thức định kỳ</li>
                        <li>Đánh dấu tiến trình học tập</li>
                        <li>Bài tập tự chọn theo chủ đề</li>
                        <li>{'════ ⋆★⋆ ════'}</li>
                    </ul>
                </section>
            </main>

            <footer className="bg-gray-900">
                <div className="container mx-auto py-4 text-center text-gray-300">
                    <p>&copy; 2024 Hỗ trợ ôn tập Toán và Tiếng Việt</p>
                </div>
            </footer>
        </div>
    );
}
