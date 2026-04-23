const express = require('express')
const protect = require('../middleware/authMiddleware')
const Job = require('../model/job.model')
const router = express.Router()


// create Job

router.post('/addJob' , protect , async(req , res)=> {
    try 
    {
        const {company_name , apply_status , role , note} = req.body;
        
        const newJob =  await Job.create({
            userId : req.user._id,
            company_name,
            apply_status,
            role,
            note,
        })

        const job = newJob.toString()

        return res.status(200).json({
            Message : "Job Added Successfully",
            data : job,
        });

    } 
    catch (error) 
    {
        console.log(error)
        return res.status(500).json({
            Message : "Server Error , Job Can Not Be Added"
        })
        
    }
})


// Get All Job

router.get("/" , protect , async(req , res)=>{

    try 
    {
        const job = await Job.find({userId : req.user._id})
        .sort({createdAt : -1})

        return res.status(200).json({
            Message : "All Jobs Fetched Successfully",
            count : job.length,
            data : job, 
        })
    } 
    catch (error) 
    {
        console.log(error)
        return res.status(500).json({
            Message : "Server Error , While Fetching All The Jobs"
        })    
    }
})


router.get("/:id" , protect , async(req , res) => {

    try 
    {
        const job = await Job.findById(req.params.id)

        if(!job)
        {
            return res.status(404).json({
                Message : "Job Not Found"
            })
        }

        if(job.userId.toString() !== req.user._id.toString())
        {
            return res.status(403).json({
                Message : "Not Authorized"
            })
        }

        return res.status(200).json({
            Message : "Job Found Successfully",
            data : job,
        })
        
    } 
    catch (error) 
    {
        console.log(error);
        return res.status(500).json({
            Message : "Server Error , Job Not Found"
        })

    }

})




// Update 
router.put("/:id" , protect , async(req , res) => {

    try {
        const job = await Job.findById(req.params.id)

        if(!job)
        {
            return res.status(404).json({
                Message : "Job Is Not Found"
            })
        }

        if(job.userId.toString() !== req.user._id.toString())
        {
            return res.status(403).json({
                Message : "Not Authorized"
            })
        }


        const {company_name , role , apply_status , note} = req.body;

        job.company_name = company_name || job.company_name;
        job.role = role || job.role;
        job.apply_status = apply_status || job.apply_status;
        job.note = note || job.note;

        const UpdateJob = job.save().toString();

        return res.status(200).json({
            Message : "Updated Successfully",
            data : job,
        })
        
    } catch (error) {
        
        console.log(error);
        return res.status(500).json({
            Message : "Server Error , Error While Updating Job Data"
        })
        
    }
})



//  delete Job

router.delete("/:id" , protect , async(req , res) => {

    try 
    {
        const job = await Job.findById(req.params.id)
        
        if (!job) 
        {
            return res.status(404).json({
                Message : "Job Data Not Found"
            })    
        }

        if(job.userId.toString() !== req.user._id.toString())
        {
            return res.status(403).json({
                Message : "Not Authorized"
            })
        }


        const DeleteJob = await Job.findByIdAndDelete(req.params.id)

        return res.status(200).json({
            Message : "Job Data Delete Successfully"
        })
    } 
    catch (error) 
    {
        console.log(error);
        return res.status(500).json({
            Message : "Server Error , Error While Deleting Job Data"
        })
        
    }
})


module.exports = router