
const jwt = require("jsonwebtoken");


exports.auth = async (req, res, next) => {
    console.log("Cookies:", req.cookies);

    try {
      //  console.log("Cookies:", req.cookies);

        
        const token =
            req.cookies.token ||
            req.body.token ||
            req.header("Authorization")?.replace("Bearer ", "");
           
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token missing'
            });
        }

        try {
           
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
           
        } catch (err) {
            console.log(err.message)
            return res.status(401).json({
               
                success: false,
                message: 'Invalid token'
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Error validating token'
        });
    }
};

exports.isStudent = (req, res, next) => {
    if (req.user.accountType !== "Student") {
        return res.status(403).json({
            success: false,
            message: 'Only students allowed'
        });
    }
    next();
};

exports.isInstructor = (req, res, next) => {
    if (req.user.accountType !== "Instructor") {
        return res.status(403).json({
            success: false,
            message: 'Only instructors allowed'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.user.accountType !== "Admin") {
        return res.status(403).json({
            success: false,
            message: 'Only admin allowed'
        });
    }
    next();
};
