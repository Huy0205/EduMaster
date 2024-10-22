'use client';
import Header from '~/components/Header';
import React, { useState } from 'react';
import Navbar from '~/components/Navbar';
import data from '~/components/datatest';
const Chapter = ({ title, lessons, onSelectLesson }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={toggleOpen}
        className="bg-gray-200 p-2 rounded w-full text-left"
      >
        {title}
      </button>
      {isOpen && (
        <ul className="pl-4">
          {lessons.map((lesson, index) => (
            <li key={index} className="py-1">
              <button onClick={() => onSelectLesson(lesson)}>
                {lesson.lesson}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Practice = ({ lesson, resetPractice  }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [showNext, setShowNext] = useState(false);

  const question = lesson.questions[currentQuestionIndex];

  const handleAnswer = (answer) => {
    if (userAnswer === null) { // Chỉ cho phép chọn nếu chưa có câu trả lời
      setUserAnswer(answer);
      if (answer === question.correctAnswer) {
        setResult('Đáp án đúng!');
      } else {
        setResult(`Đáp án sai! Đáp án đúng là: ${question.correctAnswer}`);
      }
      setShowNext(true);
    }
  };

  const handleNextQuestion = () => {
    setUserAnswer(null);
    setResult(null);
    setShowNext(false);
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert('Đã kết thúc các câu hỏi!');
    }
  };

  return (
    <div>
    {question ? (
      <div>
        <h1 className="font-bold text-xl mb-4">Ôn Tập: {lesson.lesson}</h1>
        <h2 className="text-lg mb-2">{question.question}</h2>
        
        {/* Display the content description and image */}
        <p className="mb-2">{question.content}</p>
        {question.contentImg && (
          <img src={question.contentImg} alt="Question Content" className="rounded mb-4" />
        )}
  
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`p-2 m-2 rounded transition duration-300 ease-in-out transform ${
                userAnswer === option
                  ? option === question.correctAnswer
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {result && <p className="mt-4 text-lg font-semibold">{result}</p>}
        {showNext && (
          <button onClick={handleNextQuestion} className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Câu hỏi tiếp theo
          </button>
        )}
      </div>
    ) : (
      <p className="text-gray-500">Không có câu hỏi nào!</p>
    )}
  </div>
  
  );
};
const OnTap = () => {
  const [selectedSubject, setSelectedSubject] = useState('Toán');
  const [selectedClass, setSelectedClass] = useState('Lớp 1');
  const [selectedLesson, setSelectedLesson] = useState();
  const [focusSection, setFocusSection] = useState(null); // State để quản lý phần nào đang được "focus" (lý thuyết hoặc thực hành)
  const [isPracticing, setIsPracticing] = useState(false);
  const getChapters = () => {
    const selectedClassData = data[0].classes.find(cls => cls.class === selectedClass);
    if (selectedClassData) {
      const subjectData = selectedClassData.subjects.find(sub => sub.subject === selectedSubject);
      return subjectData ? subjectData.chapters : [];
    }
    return [];
  };

  const chapters = getChapters();

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setFocusSection(null); // Reset focus khi chọn lesson mới
    setIsPracticing(false);
  };

  const handleWatchVideo = () => {
    if (focusSection === 'theory') {
      setFocusSection(null);
    } else {
      setFocusSection('theory');
    } // Chuyển focus sang phần lý thuyết
  };

  const handlePracticeClick = () => {
    if (focusSection === 'practice') {
      setFocusSection(null);
      setIsPracticing(false);
    } else {
      setFocusSection('practice');
      setIsPracticing(true);
    } // Chuyển focus sang phần thực hành
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />
      <Navbar />
      <div className="flex justify-between py-2">
        {/* Subject selection buttons */}
        <div className="flex space-x-4">
          <button
            className={`bg-white border-2 ${selectedSubject === 'Toán' ? 'border-blue-500' : 'border-transparent'} rounded-lg p-6 flex flex-col items-center cursor-pointer shadow-md`}
            onClick={() => setSelectedSubject('Toán')}
          >
            <span className="mt-1 font-medium text-lg">Toán</span>
          </button>
          <button
            className={`bg-white border-2 ${selectedSubject === 'Tiếng Việt' ? 'border-blue-500' : 'border-transparent'} rounded-lg p-6 flex flex-col items-center cursor-pointer shadow-md`}
            onClick={() => setSelectedSubject('Tiếng Việt')}
          >
            <span className="mt-1 font-medium text-lg">Tiếng Việt</span>
          </button>
        </div>
        <div className="py-4 justify-center items-center">
          <select
            id="class-select"
            className="p-2 border rounded-lg"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="Lớp 1">Lớp 1</option>
            <option value="Lớp 2">Lớp 2</option>
          </select>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar for Course Content */}
        {!isPracticing && ( // Ẩn phần Chapter nếu đang thực hành
          <aside className="w-1/4 bg-white p-4 border-r">
            {chapters.map((chapter, index) => (
              <Chapter
                key={index}
                title={chapter.chapter}
                lessons={chapter.lessons}
                onSelectLesson={handleSelectLesson}
              />
            ))}
          </aside>
        )}

        {/* Main Video Section */}
        <main className="flex-1 p-4 grid grid-cols-2 gap-4">
          {/* Lý thuyết (Theory) Section */}
          <div
            className={`bg-white p-4 rounded shadow ${focusSection === 'practice' ? 'hidden' : 'col-span-2'}`}
          >
            <h2 className="font-bold text-xl mb-4">VIDEO LÝ THUYẾT</h2>
            {selectedLesson && (
              <div>
                <img
                  src={selectedLesson.theoryImage}
                  alt="Lý thuyết"
                  className="rounded-lg mb-4"
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow"
                  onClick={handleWatchVideo}
                >
                  Xem
                </button>

                {/* Display video when 'Xem' is clicked */}
                {focusSection === 'theory' && (
                  <div className="mt-4 ">
                    <iframe
                      width="1000"
                      height="500"
                      src={selectedLesson.videoUrl}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Thực hành (Practice) Section */}
           <div
            className={`bg-white p-4 rounded shadow ${focusSection === 'theory' ? 'hidden' : 'col-span-2'}`}
          >
            <h2 className={`font-bold text-xl mb-4 ${isPracticing ? 'hidden' : ''}`}>THỰC HÀNH</h2>
            {selectedLesson && !isPracticing && (
              <>
                <img
                  src={selectedLesson.practiceImage}
                  alt="Thực hành"
                  className="rounded-lg mb-4"
                />
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded shadow"
                  onClick={handlePracticeClick}
                >
                  Làm bài
                </button>
              </>
            )}
            {focusSection ==='practice' && <Practice lesson={selectedLesson} />}         
          </div>
        </main>
      </div>
    </div>
  );
};

export default OnTap;
