
const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utills/mailSender');
const{courseEnrollmentEmail} = require('../mail/templates/courseEnrollmentEmail');
const { default: mongoose } = require('mongoose');


// Capture the payment and initiate the razorpay order

exports.capturePayment = async(req, res)=>{

    //get Course Id 
    const {course_id}  = req.body;
    const userId = req.user.id;  
    // validation
      // valid Course id
    if(!course_id){
        return res.status(400).json({
            success:false,
            message:'Please provide valid course ID'
        })
    }

    let course;

    try {
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:'Could not find the Course'
            })
        }

        // user already pay for the same course

        const uid  = new mongoose.Types.ObjectId(userId);

        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:'Student is already enrolled',
            })
        }
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
  

   
    // order create

    const amount = course.price;
    const currency = "INR";


    const options = {
        amount:amount * 100,
        currency,
        receipt:Math.random(Date.now()).toString();
        notes:{
           courseId: course_id,
           userId, 
        }
    };

    try {
        // initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

          return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderID:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
          })
        
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:'Could not initiate order'
        })
    }
   

}

// verify Signature of Razor  pay and server 

exports.verifySignature  = async(req,res)=>{

    const webhookSecret = '455336';
    const signature = req.headers('x-razorpay-signature');

    const shasum = crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest){
        console.log('payment is authorized') 
        
        const {courseId , userId} = req.body.payload.payment.entity.notes;
        try {
            //fulfill the action

            //find the course and enroll the student in it 
            const enrolledCourse = await Course.findByIdAndUpdate({_id:courseId},{$push:{studentsEnrolled:userId}},{new:true})

            if(!enrolledCourse){
                return res.status.(500).json({
                    success:false,
                    message:'Course not found  '
                })
                
            }
            console.log(enrolledCourse);
            const enrolledStudent = await User.findByIdAndUpdate({_id:userId},{$push:{courses:courseId}},{new:true});

            console.log(enrolledStudent);

            // mail send confirmation
           const emailSender = await mailSender(
            enrolledStudent.email,
            "Congratulations Form Sawariya",
            "Congratulations, you are onboarded into new Sawariya Courses"

           )

           console.log(emailSender);

           return res.status(200).json({
            success:true,
            message:"Signature Verified and Course Added"
           })


        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
      }
      else{
        return res.status(500).json({
            success:false,
            message:'Invalid request',
        })
      }




}
