const data = [
  {
    "courses": [
      {
        "id": "1",
        "name": "Toán",
        "grade": 1,
        "topics": [
          {
            "id": "101",
            "name": "Chương 1: Làm quen với một số hình",
            "order": 1,
            "lectures": [
              {
                "id": "1011",
                "title": "Bài 1: Vị trí",
                "url": "https://www.youtube.com/watch?v=4WlZM_9ODag&t=3s",
                "description": "Học về vị trí của các vật thể",
                "type":"MP4",
                "isViewed": false,
                "reviewId": "201"
              }
            ],
            "quizzes": [
              {
                "id": "quiz1",
                "name": "Quiz 1: Hình con vật",
                "time": 10,
                "bonusPoint": 5,
                "questions": [
                  {
                    "id": "q1",
                    "content": "Hình con vật nào ở bên trái?",
                    "type": "SINGLE_CHOICE",
                    "order": 1,
                    "answers": [
                      { "id": "a1", "content": "Con Ong", "isCorrect": true, "feedback": "Đúng" },
                      { "id": "a2", "content": "Con Ngựa", "isCorrect": false, "feedback": "Sai" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "id": "102",
            "name": "Chương 2: Các số đến 10",
            "order": 2,
            "lectures": [
              {
                "id": "1021",
                "title": "Bài 1: Các số 1, 2, 3",
                "url": "https://www.youtube.com/embed/1WmVfol4rq0",
                "description": "Giới thiệu các số từ 1 đến 3",
                "type": { "id": "1", "name": "Video" },
                "isViewed": false,
                "reviewId": "202"
              }
            ],
            "quizzes": []
          }
        ]
      },
      {
        "id": "2",
        "name": "Tiếng Việt",
        "grade": 1,
        "topics": [
          {
            "id": "201",
            "name": "Chủ đề 1: Những chữ cái đầu tiên",
            "order": 1,
            "lectures": [
              {
                "id": "2011",
                "title": "Bài 1: A a",
                "url": "https://www.youtube.com/embed/xwSa3FUydDs",
                "description": "Học chữ cái A a",
                "type": { "id": "1", "name": "Video" },
                "isViewed": false,
                "reviewId": "203"
              }
            ],
            "quizzes": [
              {
                "id": "quiz2",
                "name": "Quiz 2: Chữ cái A a",
                "time": 5,
                "bonusPoint": 3,
                "questions": [
                  {
                    "id": "q2",
                    "content": "Chữ cái nào là A?",
                    "type": "SINGLE_CHOICE",
                    "order": 1,
                    "answers": [
                      { "id": "a3", "content": "A", "isCorrect": true, "feedback": "Đúng" },
                      { "id": "a4", "content": "B", "isCorrect": false, "feedback": "Sai" }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "3",
        "name": "Khoa học lớp 2",
        "grade": 2,
        "topics": [
          {
            "id": "301",
            "name": "Chủ đề 1: Cơ thể người",
            "order": 1,
            "lectures": [
              {
                "id": "3011",
                "title": "Bài 1: Giới thiệu về các bộ phận cơ thể",
                "url": "https://www.youtube.com/embed/samplelink",
                "description": "Tìm hiểu về các bộ phận trên cơ thể",
                "type": { "id": "1", "name": "Video" },
                "isViewed": false,
                "reviewId": "204"
              }
            ],
            "quizzes": [
              {
                "id": "quiz3",
                "name": "Quiz 3: Bộ phận cơ thể",
                "time": 7,
                "bonusPoint": 4,
                "questions": [
                  {
                    "id": "q3",
                    "content": "Bộ phận nào là tay?",
                    "type": "SINGLE_CHOICE",
                    "order": 1,
                    "answers": [
                      { "id": "a5", "content": "Tay", "isCorrect": true, "feedback": "Đúng" },
                      { "id": "a6", "content": "Chân", "isCorrect": false, "feedback": "Sai" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "id": "302",
            "name": "Chủ đề 2: Thực vật",
            "order": 2,
            "lectures": [
              {
                "id": "3021",
                "title": "Bài 1: Các loại cây",
                "url": "https://www.youtube.com/embed/samplelink2",
                "description": "Giới thiệu các loại cây cối",
                "type": { "id": "1", "name": "Video" },
                "isViewed": false,
                "reviewId": "205"
              }
            ],
            "quizzes": []
          }
        ]
      },
      {
        "id": "4",
        "name": "Lịch sử lớp 3",
        "grade": 3,
        "topics": [
          {
            "id": "401",
            "name": "Chủ đề 1: Lịch sử Việt Nam",
            "order": 1,
            "lectures": [
              {
                "id": "4011",
                "title": "Bài 1: Những vị vua đầu tiên",
                "url": "https://www.youtube.com/embed/samplelink3",
                "description": "Tìm hiểu về các vị vua đầu tiên của Việt Nam",
                "type": { "id": "1", "name": "Video" },
                "isViewed": false,
                "reviewId": "206"
              }
            ],
            "quizzes": [
              {
                "id": "quiz4",
                "name": "Quiz 4: Lịch sử Việt Nam",
                "time": 10,
                "bonusPoint": 5,
                "questions": [
                  {
                    "id": "q4",
                    "content": "Ai là vị vua đầu tiên của Việt Nam?",
                    "type": "SINGLE_CHOICE",
                    "order": 1,
                    "answers": [
                      { "id": "a7", "content": "Lý Thái Tổ", "isCorrect": true, "feedback": "Đúng" },
                      { "id": "a8", "content": "Trần Nhân Tông", "isCorrect": false, "feedback": "Sai" }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "5",
        "name": "Địa lý lớp 3",
        "grade": 3,
        "topics": [
          {
            "id": "501",
            "name": "Chủ đề 1: Địa lý Việt Nam",
            "order": 1,
            "lectures": [
              {
                "id": "5011",
                "title": "Bài 1: Vị trí địa lý",
                "url": "https://www.youtube.com/embed/samplelink4",
                "description": "Giới thiệu về vị trí địa lý của Việt Nam",
                "type": { "id": "1", "name": "Video" },
                "isViewed": false,
                "reviewId": "207"
              }
            ],
            "quizzes": [
              {
                "id": "quiz5",
                "name": "Quiz 5: Địa lý Việt Nam",
                "time": 8,
                "bonusPoint": 4,
                "questions": [
                  {
                    "id": "q5",
                    "content": "Việt Nam nằm ở đâu?",
                    "type": "SINGLE_CHOICE",
                    "order": 1,
                    "answers": [
                      { "id": "a1", "content": "Đông Nam Á", "isCorrect": true, "feedback": "Đúng" },
                      { "id": "a2", "content": "Tây Á", "isCorrect": false, "feedback": "Sai" }
                    ]
                  },
                  {
                    "id": "q6",
                    "content": "Kết quả nào tổng bằng 4",
                    "type": "MULTIPLE_CHOICE",
                    "order": 2,
                    "answers": [
                      { "id": "a3", "content": "1+3", "isCorrect": true, "feedback": "Đúng" },
                      { "id": "a4", "content": "2+2", "isCorrect": true, "feedback": "Sai" },
                      { "id": "a5", "content": "1+2", "isCorrect": false, "feedback": "Đúng" },
                      { "id": "a6", "content": "2-2", "isCorrect": false, "feedback": "Sai" },
                    ]
                  },
                  {
                    "id": "q7",
                    "content": "3+3 bằng bao nhiêu ?",
                    "type": "FILL_IN_THE_BLANK",
                    "order": 3,
                    "answers": [
                      { "id": "a7", "content": "6", "isCorrect": true, "feedback": "Đúng" },
                    ]
                  }        
                ]
              }
            ]
          }
        ]
      }
   
    ]
  }
]
export default data;