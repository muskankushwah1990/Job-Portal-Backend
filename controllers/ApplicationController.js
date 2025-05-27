const ApplicationModel = require("../models/application");
const cloudinary = require('cloudinary').v2
const JobModel = require("../models/job");

class ApplicationController {
  
  static postApplication = async (req, res) => {
    try {
      // console.log(req.files)
      const { role } = req.userdata;
      if (role === "Employer") {
       return res.status(400).json({
          status: "failed",
          message: "Employer not allowed to access this resource.",
        });
      }
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          status: "failed",
          message: "Resume File Required!.",
        });
      }

      const { resume } = req.files;
      const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
      if (!allowedFormats.includes(resume.mimetype)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid file type. Please upload a PNG file.",
        });
      }
      const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath
      );
      //console.log(cloudinaryResponse)

      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
          "Cloudinary Error:",
          cloudinaryResponse.error || "Unknown Cloudinary error"
        );

        return  res.status(400).json({
          status: "failed",
          message: "Failed to upload Resume to Cloudinary.",
        });
      }
      const { name, email, coverLetter, phone, address, jobId } = req.body;
      const applicantID = {
        user: req.userdata._id,
        role: "Job Seeker",
      };
      if (!jobId) {
        return  res.status(400).json({
          status: "failed",
          message: "Job not found!.",
        });
      }
      
      const jobDetails = await JobModel.findById(jobId);
      if (!jobDetails) {
        return  res.status(400).json({
          status: "failed",
          message: "Job not found!.",
        });
      }

      const employerID = {
        user: jobDetails.postedBy,
        role: "Employer",
      };
      if (
        !name ||
        !email ||
        !coverLetter ||
        !phone ||
        !address ||
        !applicantID ||
        !employerID ||
        !resume
      ) {
        return  res.status(400).json({
          status: "failed",
          message: "Please fill all fields.",
        });
      }
      const application = await ApplicationModel.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        applicantID,
        employerID,
        resume: {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        },
      });
      return  res.status(200).json({
        success: true,
        message: "Application Submitted!",
        application,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static employerGetAllApplications = async (req, res) => {
    try {
      const { role } = req.userdata;
      if (role === "Job Seeker") {
        return  res.status(400).json({
          status: "failed",
          message: "Job Seeker not allowed to access this resource..",
        });
      }
      const { _id } = req.userdata;
      const applications = await ApplicationModel.find({
        "employerID.user": _id,
      });
     return res.status(200).json({
        success: true,
        applications,
      });
    } catch (error) {
      console.log(error);
      
    }
  };

  static jobseekerGetAllApplications = async (req, res) => {
    try {
      const { role } = req.userdata;
      if (role === "Employer") {
        return  res.status(400).json({
          status: "failed",
          message: "Employer not allowed to access this resource...",
        });
      }
      const { _id } = req.userdata;
      const applications = await ApplicationModel.find({
        "applicantID.user": _id
      });
      return res.status(200).json({
        success: true,
        applications,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static jobseekerDeleteApplication = async (req, res) => {
    try {
      const { role } = req.userdata;
      if (role === "Employer") {
        return  res.status(400).json({
          status: "failed",
          message: "Employer not allowed to access this resource...",
        });
      }
      const { id } = req.params;
      // console.log(id)
      const application = await ApplicationModel.findById(id);
      if (!application) {
        
       return res.status(404).json({
          success: false,
          message: "Application not found!",
        });
      }
      await ApplicationModel.deleteOne();
     return res.status(200).json({
        success: true,
        message: "Application Deleted!",
      });
    } catch (error) {
      console.log(error);
    }
  };



  
}
module.exports = ApplicationController;