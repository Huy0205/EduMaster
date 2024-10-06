'use client'
import React, { useState } from 'react';

const subjectsData = {
  'Tiếng Việt': [
    {
      chapter: 'Chương 1: Luyện âm',
      lessons: [
        { title: 'Bài 1: Âm A', content: 'Nội dung của bài 1: Âm A' },
        { title: 'Bài 2: Âm B', content: 'Nội dung của bài 2: Âm B' },
      ],
    },
    {
      chapter: 'Chương 2: Tập đọc',
      lessons: [
        { title: 'Bài 3: Bài đọc 1', content: 'Nội dung của bài 3: Bài đọc 1' },
        { title: 'Bài 4: Bài đọc 2', content: 'Nội dung của bài 4: Bài đọc 2' },
      ],
    },
  ],
  'Môn khác': [
    {
      chapter: 'Chương 1: Chủ đề 1',
      lessons: [
        { title: 'Bài 1: Nội dung 1', content: 'Nội dung của bài 1' },
        { title: 'Bài 2: Nội dung 2', content: 'Nội dung của bài 2' },
      ],
    },
  ],
};

function OnTap() {
  const [selectedSubject, setSelectedSubject] = useState('Tiếng Việt');
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-bold">Danh sách chương</h2>
        <div className="mt-4">
          {subjectsData[selectedSubject].map((chapter, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold">{chapter.chapter}</h3>
              <ul className="mt-2">
                {chapter.lessons.map((lesson, lessonIndex) => (
                  <li
                    key={lessonIndex}
                    onClick={() => handleLessonClick(lesson)}
                    className="cursor-pointer text-blue-500 hover:underline mt-2"
                  >
                    {lesson.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="w-3/4 p-6">
        {selectedLesson ? (
          <div>
            <h1 className="text-2xl font-bold">{selectedLesson.title}</h1>
            <p className="mt-4">{selectedLesson.content}</p>
          </div>
        ) : (
          <p className="text-xl">Chọn một bài học để xem nội dung</p>
        )}
      </div>
    </div>
  );
}

export default OnTap;
