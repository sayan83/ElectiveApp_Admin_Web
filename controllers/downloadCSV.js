var mysql = require('mysql');
const dotenv = require('dotenv');
var fs = require('fs');
var stringify = require('csv-stringify');

dotenv.config();


exports.getAssignedData = async function getAssignedData(req,res) {

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

        connection.query(`select Roll, p.Year, p.Semester, p.PCode, ElectiveName from PreferenceDetails p inner join ElectiveSubjects e on p.PCode = e.PCode where Confirmed=1 and p.Semester=${sem} and p.Year=${year} and Dept='${dept}' order by Roll;`, function (error, results, fields) {
            if (error) throw error;
            // console.log('The solution is: ', results[0].password);

            connection.end();
            
            stringify.stringify(results, {
                header: true
                }, function (err, output) {
                    if(err) throw err;
                    fs.writeFile(__dirname+`/../assigned_${dept}_Sem${sem}.csv`, output,(err) => {
                        if(err) throw err;
                });
                // res.setHeader('Content-disposition', `attachment; filename=assigned_${dept}_${sem}Sem.csv`);
                // res.set('Content-Type', 'text/csv');
                // return res.status(200).send(output);
                // return res.status(200).sendFile(__dirname+'/someData.csv');

                // res.download(__dirname+'/../someData.csv');
                return res.json({"url": `/download/assigned_${dept}_Sem${sem}.csv`});
            });
            
        });

    });
}