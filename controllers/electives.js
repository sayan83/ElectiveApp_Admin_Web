var mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();


async function checkAssigned(sem,dept,year) {
    var connection = mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE
    });
        

    const dbConnect = (connection) => {
        return new Promise((resolve, reject) => {
            connection.connect(async function(err) {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    reject(err);
                    return;
                }
                
                console.log('connected as id d' + connection.threadId);
                const checkAssignedStatus = (sem,year,dept,connection) => {
                    return new Promise((resolve,reject) => {
                        connection.query(`select Assigned from ElectiveSubjects where Semester=${sem} and Year=${year} and Dept='${dept}' LIMIT 1;`, function (error, results, fields) {
                            if (error) {
                                reject(error);
                                return
                            }
                            // console.log('The solution is: ', results[0].password);
                
                            console.log(results[0]);
                            connection.end();
                            resolve(results);
                        });
                    })
                }
        
                const results = await checkAssignedStatus(sem,year,dept,connection);
                resolve(results);
            });
        })
    }

    const results = await dbConnect(connection);
    if(results[0] != undefined && results[0].Assigned === 1)
        return true;
    
    return false;
    
}


exports.electiveNames = async function electiveNames(req,res) {

    const {sem,dept,year} = req.body;
    
    let isAssigned = await checkAssigned(sem,dept,year);
    console.log(isAssigned);
    if(isAssigned) {
        return res.json({isAssigned});
    }


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

        connection.query(`select distinct(Electivename) as ElectiveName from ElectiveSubjects where Semester=${sem} and Year=${year} and Dept='${dept}';`, function (error, results, fields) {
            if (error) throw error;
            // console.log('The solution is: ', results[0].password);

            return res.json({isAssigned, 
                            ElectiveNames: results});

        });
        connection.end();

    });
}


exports.subjectNames = async function subjectNames(req,res) {

    const {sem,dept,year,electiveName} = req.body;
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

        connection.query(`select PCode from ElectiveSubjects where Semester=${sem} and Year=${year} and Dept='${dept}' and ElectiveName='${electiveName}';`, function (error, results, fields) {
            if (error) throw error;
            // console.log('The solution is: ', results[0].password);

    		return res.json({SubjectNames: results});

        });
        connection.end();

    });
}


exports.subjectDetails = async function subjectDetails(req,res) {

    const {sem,dept,year,pcode} = req.body;
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

        connection.query(`select Count, MaxCount from ElectiveSubjects where Semester=${sem} and Year=${year} and Dept='${dept}' and PCode='${pcode}';`, function (error, results, fields) {
            if (error) throw error;
            // console.log('The solution is: ', results[0].password);

    		return res.json({SubjectDetails: results});

        });
        connection.end();

    });
}


exports.addNewSubject = async function addNewSubject(req,res) {

    const {sem,dept,year,pcode,maxCount,electiveName} = req.body;
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

        connection.query(`Insert into ElectiveSubjects values ('${pcode}',${sem},${year},'${electiveName}','${dept}',0,${maxCount});`, function (error, results, fields) {
            if (error) throw error;
            // console.log('The solution is: ', results[0].password);

    		return res.json({results});

        });
        connection.end();

    });
}

exports.assignElectives = async function assignElectives(req,res) {

    const {sem,dept,year} = req.body;
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

        connection.query(`CALL AssignElectives('${dept}',${sem}, ${year});`, function (error, results, fields) {
            if (error) throw error;
            // console.log('The solution is: ', results[0].password);

    		return res.json({results});

        });
        connection.end();

    });
}
