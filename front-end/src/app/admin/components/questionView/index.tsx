'use client';
import { useState } from 'react';
import Image from 'next/image';
import { QuestionAnswerOutlined } from '@mui/icons-material';

function QuestionView({ data }: QuestionViewProps) {
    const { content, type, image, feedback, answers } = data;

    const [size, setSize] = useState({ width: 0, height: 0 });

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth > naturalHeight) {
            if (naturalWidth - naturalHeight > 300) {
                setSize({ width: 650, height: 100 });
            } else if (naturalWidth - naturalHeight > 200) {
                setSize({ width: 400, height: 300 });
            } else {
                setSize({ width: 300, height: 300 });
            }
        } else {
            if (naturalHeight - naturalWidth > 200) {
                setSize({ width: 200, height: 200 });
            } else if (naturalHeight - naturalWidth > 100) {
                setSize({ width: 200, height: 300 });
            } else {
                setSize({ width: 300, height: 300 });
            }
        }
    };

    return (
        <div className="w-full">
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
                    className="flex-1 py-1 px-4"
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
                    <div className="relative flex-3 w-full flex items-center">
                        <Image
                            src={image}
                            alt="Question image"
                            width={size.width}
                            height={size.height}
                            objectFit="contain"
                            onLoad={handleImageLoad}
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
