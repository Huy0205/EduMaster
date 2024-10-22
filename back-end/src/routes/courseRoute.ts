import { Router } from "express";
import { CourseController } from "~/app/controllers";

const courseRouter = Router();

courseRouter.get("/", (req, res) => {
  res.send("Course Route");
});

// GET: localhost:8080/api/v1/course/list
courseRouter.get("/list", CourseController.getAllCourses);

export default courseRouter;