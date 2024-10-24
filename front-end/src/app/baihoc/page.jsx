'use client'
import Header from '~/components/Header';
import React, { useState } from 'react';
import Navbar from '~/components/Navbar';
import data from '~/components/datatest';

const Chapter = ({ title, lessons, onSelectLesson, selectedLesson }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const handleLessonClick = (lesson) => {
    onSelectLesson(lesson);    
  };

  return (
    <div>
      <button 
        onClick={toggleOpen}
        className={`bg-white border-2 border-gray-200 p-3 w-full text-left rounded-lg flex items-center justify-between
          ${isOpen ? "bg-blue-100 border-blue-500" : "hover:bg-gray-100"}`}
      >
        <span>{title}</span>
        <span className={`ml-4 ${isOpen ? "rotate-90" : ""}`}>▼</span>
      </button>
      {isOpen && (
        <ul className="pl-6 mt-2">
          {lessons.map((lesson, index) => (
            <li key={index} className="py-1">
              <button onClick={() => handleLessonClick(lesson)}
                className={`flex items-center p-2 rounded-lg w-full text-left border-2 border-gray-200
                  ${selectedLesson === lesson ? "bg-green-100 border-green-500" : "bg-white hover:bg-blue-50"}`}>
                 
                {lesson.lesson}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const CourseLayout = () => {
  const [selectedVideo, setSelectedVideo] = useState();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('Toán');
  const [selectedClass, setSelectedClass] = useState('Lớp 1');
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
    setSelectedVideo(lesson.videoUrl);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header />
      <Navbar />
      <div className="flex justify-between py-4">
        {/* Subject selection buttons */}
        <div className="flex space-x-6">
        <button
          className={`bg-white border-2 ${selectedSubject === 'Toán' ? 'border-blue-500' : 'border-transparent'} rounded-lg p-6 flex flex-col items-center cursor-pointer shadow-md`}
          onClick={() => setSelectedSubject('Toán')}
        >
          <span className="mt-3 font-medium text-lg">Toán</span>
        </button>
        <button
          className={`bg-white border-2 ${selectedSubject === 'Tiếng Việt' ? 'border-blue-500' : 'border-transparent'} rounded-lg p-6 flex flex-col items-center cursor-pointer shadow-md`}
          onClick={() => setSelectedSubject('Tiếng Việt')}
        >
          <span className="mt-3 font-medium text-lg">Tiếng Việt</span>
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
        <aside className="w-1/4 bg-white p-4 border-r shadow-md">
          {chapters.map((chapter, index) => (
            <Chapter key={index} title={chapter.chapter} lessons={chapter.lessons} onSelectLesson={handleSelectLesson}  selectedLesson={selectedLesson} />
          ))}
        </aside>

        {/* Main Video Section */}
        <main className="flex-1 p-4">
          <div className="w-[1400px] h-[700px] bg-gray-300 rounded-lg mb-4 ">
            {/* Embed YouTube Video */}
            <iframe
              width="100%"
              height="100%"
              src={selectedVideo}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>

          {/* Video description or extra info */}
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-bold text-xl">{}</h3>
            <p className="mt-2">{}</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseLayout;
