import { QuestionAnswerOutlined } from '@mui/icons-material';
import Image from 'next/image';

function QuestionView({ data }: QuestionViewProps) {
    const { content, type, image, feedback, answers } = data;
    return (
        <div className="w-full p-3">
            <h3 className="text-lg">
                <span className="italic">
                    {type === 1
                        ? '(Chọn 1 đáp án đúng)'
                        : type === 2
                        ? '(Chọn tất cả đáp án đúng)'
                        : '(Điền đáp án)'}
                    : &nbsp;
                </span>
                {content}
            </h3>
            <div className="flex w-full p-3">
                <ul
                    className="py-1 px-4"
                    style={{
                        listStyleType: type === 3 ? 'none' : 'upper-alpha',
                    }}
                >
                    {answers.map((answer, index) => (
                        <li
                            key={index}
                            className={`${
                                type === 3
                                    ? 'text-gray-600'
                                    : answer.isCorrect
                                    ? 'text-green-500'
                                    : 'text-gray-600'
                            } py-1 text-base font-medium`}
                        >
                            <p> {answer.content}</p>
                        </li>
                    ))}
                </ul>
                {image && (
                    <div className="flex-1 relative w-full flex justify-center items-center">
                        <Image
                            src={image}
                            alt="Question image"
                            layout="responsive"
                            width={80}
                            height={80}
                            objectFit="contain"
                        />
                    </div>
                )}
            </div>
            {feedback && (
                <div className="py-2">
                    <div className="flex items-center gap-2">
                        <QuestionAnswerOutlined fontSize="small" />
                        <p className="font-medium underline text-base">Giải thích:</p>
                    </div>
                    <p className="text-sm font-medium">{feedback}</p>
                </div>
            )}
        </div>
    );
}

export default QuestionView;
