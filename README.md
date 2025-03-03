# EduMaster 🎓📚
🚀 **EduMaster** is an interactive learning platform designed to help elementary school students practice Math and Vietnamese. It provides structured exercises, allowing students to reinforce their knowledge through guided practice.  
## ✨ Features
### **1. Features for students** 
####  1.1 Sign Up & Account Verification
- Function that allows users to register a new account
![image](https://github.com/user-attachments/assets/4f828d2a-005d-4150-9fc7-33e3d64093bd)
- At the registration screen, fill in all the information and click "Register"
![image](https://github.com/user-attachments/assets/fb0e9dd1-4bac-404a-882a-52a13820940e)
- An OTP code will be sent to your email in the form:
![image](https://github.com/user-attachments/assets/d18374e3-a9cc-4100-999f-41c052200848)
- User enters OTP code and clicks "Verify"
![image](https://github.com/user-attachments/assets/3a1a91f8-77fb-4c78-8997-f412be40e0cb)
- If successful, the system will redirect to the Login page allowing the user to log into the system.
####  1.2. User Registration

### **2. Features for admin** 
To perform administrative functions, users must have an administrator account to log into the system's administration page.
![image](https://github.com/user-attachments/assets/a8f91f68-17b7-4f92-8e55-bde75645eebf)
#### 2.1. User management
- The function allows users to view the list of registered users, can delete users from the system
![image](https://github.com/user-attachments/assets/e9a0ae54-ba4c-4ff0-9fdb-c9655d2cc3c2)
#### 2.2. Topic management
- The function allows users to view the list of topics, add, edit or delete any topic, and can filter the list by class and subject.
![image](https://github.com/user-attachments/assets/9ee30894-50e0-4fbf-94ec-11f3ea457950)
- There is also a small function that allows users to hide the topic on the student interface.
##### 2.2.1. Add topic
- Select class and subject filters and click "Add"
![image](https://github.com/user-attachments/assets/876e8789-cd3b-4c43-97e6-f3c85b153b36)
- Enter the new chapter name and press "Save".
##### 2.2.2. Update topic
- Select the topic you want to edit and click on the "Edit" icon
![image](https://github.com/user-attachments/assets/f05f5a41-9da0-4037-bf92-d0cb76ee2e34)
- Edit the topic and click "Save".
##### 2.2.3. Delete topic
- Select the topic to delete and click on the "Delete" icon
![image](https://github.com/user-attachments/assets/76fff976-945b-4abf-a66e-0962754e8701)
- Click "Delete"
![image](https://github.com/user-attachments/assets/c3cffea2-0207-444f-b554-a6e1b7c0609b)
- Deleted successfully.
#### 2.3. Lesson management and Theory management
- These two functions are similar to topic management.
#### 2.4. Question management
- The function allows users to view the list of questions, add, edit or delete questions, and can filter the list of questions by class, subject, topic and lesson.
- The question includes 2 forms:
##### 2.4.1. Practice question
- These are questions used for review purposes and can be selected when creating review and test questions.
- Practice questions will be divided by lesson.
![image](https://github.com/user-attachments/assets/37d4e05e-cd48-4970-8453-132991bc887f)
###### 2.4.1.1. Add practice question
- The function allows the user to add a new practice question to the selected lesson in the system.
- User selects the lesson to add questions on the filter and presses "Add"
![image](https://github.com/user-attachments/assets/5ee9ad20-c605-468f-97e2-01571e6abcc2)
- Enter question information, can add photos and explanations, after completion press "Save" button
###### 2.4.1.1. Show practice question
- The function allows users to view full content that cannot be displayed on the list.
![image](https://github.com/user-attachments/assets/921171a9-69d2-4be0-917a-b546abfc5d82)
###### 2.4.1.1. Delete practice question
- Function allows users to delete practice questions from the question list
- Select the question to delete and click on the "Delete" icon
![image](https://github.com/user-attachments/assets/bcf93098-f0e5-48f2-ae41-1dcc6e358da7)
- Click "Delete" and the question will be removed from the list.
##### 2.4.2. Quiz question
- Quiz questions are questions for testing purposes only and can only be used in tests.
- Quiz questions are divided by chapter (since the test will cover the content of many lessons within the topic)
- The functions of test questions are similar to those of practice questions.
### **3. General features** 
#### 3.1. Login
- Function allows users who already have an account to log into the system
![image](https://github.com/user-attachments/assets/7dd45acc-95f9-416b-bbfe-91b189627179)
#### 3.2. Logout
- Function allows users to log out of the system
![image](https://github.com/user-attachments/assets/edac4e21-1c6e-41d7-ab3b-54688f359fbe)
## 🏃 How to Run  
1. Clone the repo  
2. Install dependencies:
```sh
npm install
```
3. Run server: 
```sh
npm run dev
```
