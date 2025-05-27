const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router()
const checkUserAuth = require("../middleware/auth");
const JobController = require("../controllers/JobController");
const ApplicationController = require("../controllers/ApplicationController");
const CategoryController = require("../controllers/CategoryController");


//userController

router.post('/register', UserController.registerUser);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout)
router.get('/getUser', checkUserAuth, UserController.getUser);
router.post('/profile/update/:id',checkUserAuth, UserController.updateProfile)
router.post('/profile/password/:id',checkUserAuth, UserController.changePassword)

//JobController
router.post('/jobInsert', checkUserAuth, JobController.postJob)
router.get('/getAllJob', JobController.getAllJob)
router.get('/getMyJob', checkUserAuth, JobController.getMyJobs)
router.post('/updateJob/:id', checkUserAuth, JobController.updateJob)
router.get('/deleteJob/:id',checkUserAuth, JobController.deleteJob);
router.get('/getSingleJob/:id', JobController.getSingleJob)


//application controller
router.post('/post',checkUserAuth,ApplicationController.postApplication)
router.get('/employer/detail',checkUserAuth,ApplicationController.employerGetAllApplications)
router.get("/jobseeker/detail", checkUserAuth, ApplicationController.jobseekerGetAllApplications);
router.get("/application/delete/:id", checkUserAuth, ApplicationController.jobseekerDeleteApplication);

//category controller
router.post('/categoryInsert', checkUserAuth, CategoryController.insertCategory)
router.get('/categoryDisplay', checkUserAuth, CategoryController.displayCategory)
router.get('/categoryView/:id', checkUserAuth, CategoryController.viewCategory)
router.get('/categoryEdit/:id', checkUserAuth, CategoryController.editCategory)
router.post('/categoryUpdate/:id', checkUserAuth, CategoryController.updateCategory)
router.get('/categoryDeleted/:id', checkUserAuth, CategoryController.deletedCategory)
router.get('/categoryList/:name', checkUserAuth, CategoryController.categoryList)






module.exports = router;