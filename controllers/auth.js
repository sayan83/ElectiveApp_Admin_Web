var mysql      = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
let otp = null;

exports.adminLogin = async function adminLogin(req,res) {
    var connection = mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE
    });
        
    connection.connect( async function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        
        console.log('connected as id ' + connection.threadId);

        const checkPassword = (connection) => {
            return new Promise((resolve,reject) => {
                connection.query('SELECT password, AdminEmail from AdminCredentials', async function (error, results, fields) {
                    if (error) reject(error);
                    // console.log('The solution is: ', results[0].password);
        
                    const isPasswordValid = await bcrypt.compare(req.body.password, results[0].password);
                    if(!isPasswordValid) resolve(null);
        
                    //GENERATE JWT TOKENS
                    const accessToken = jwt.sign({_id:results[0].AdminEmail}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
                    // const refreshToken = jwt.sign({_id:user._id}, process.env.REFRESH_TOKEN_SECRET);
                    resolve(accessToken);
                    
                });
            });
        }
        const accessToken = await checkPassword(connection);
        if(accessToken === null)
            return res.status(401).send('Invalid Password!')


        res.cookie('AccessToken',accessToken,{httpOnly:true,secure:true});
        return res.json({AccessToken: accessToken});

        connection.end();

    });
}


exports.sendOTP = async function sendOTP(req,res) {
    var connection = mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE
    });
        
    connection.connect(async function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        
        console.log('connected as id ' + connection.threadId);

        const getAdminEmail = (connection) => {
            return new Promise((resolve,reject) => {
                connection.query('SELECT AdminEmail from AdminCredentials', function (error, results, fields) {
                    if (error) reject(error);
            
                    resolve(results[0].AdminEmail);
                    
                });
            });
        }
        const AdminEmail = await getAdminEmail(connection);
        
        connection.end();
        otp = Math.floor(Math.random()*10)*1000 + Math.floor(Math.random()*10)*100 + Math.floor(Math.random()*10)*10 + Math.floor(Math.random()*10); 

        // Send Mail here
        console.log(AdminEmail);
        console.log(otp);
        return res.json({"Message": "OTP sent successfully"});

    });
}




exports.resetPassword = async function resetPassword(req,res) {
    const otpReceived = req.body.OTP;
    if(otpReceived != otp) {
        return res.json({"Message": "Invalid OTP"});
    }

    otp = null;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);
    
    var connection = mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE
    });
        
    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        
        console.log('connected as id ' + connection.threadId);

        
        connection.query(`Update AdminCredentials set Password='${hashedPassword}';`, function (error, results, fields) {
            if (error) throw (error);
    
            res.json({"Message": "Password Changed"});
                    
        });
        connection.end();
    });
}


exports.verifyToken = async function verifyToken(req,res) {
    const token = req.body.accessTokens;
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decode) => {
        if(err) {
            console.log(err.name);
            if(err.name === 'TokenExpiredError') {
                return res.json({"Message": "Expired"})
            }
        }
        console.log(decode);
        res.json(decode);
    })
}

