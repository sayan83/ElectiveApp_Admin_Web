function proceed() {
    console.log('hello;')
    document.getElementById('batch-container').style.display = "none";
    document.getElementById('elective-container').style.display = "block";
    getElectiveNames();
}

function back() {
    console.log('bye;')
    document.getElementById('batch-container').style.display = "block";
    document.getElementById('elective-container').style.display = "none";
}



async function getElectiveNames() {
    document.getElementById('subject-label').style.display = 'block';
    document.getElementById('subjects').style.display = 'block';
    document.getElementById('subject-details').style.display = 'block';
    document.getElementById('new-elective').style.display = 'none';
    document.getElementById('new-subject').style.display = "none";

    const sem = document.getElementById('sem').value;
    const dept = document.getElementById('dept').value;
    const year = document.getElementById('year').value;

    document.getElementById('batch-heading').firstChild.innerHTML = `ELECTIVE OPTIONS FOR ${dept} SEM ${sem}`;
    console.log(sem, dept, year);

    try {
    	const data = JSON.stringify({
            sem,
            dept,
            year
		})
        const response = await fetch(`https://elective-app.herokuapp.com/electiveNames`, { 
		    method: "POST", 
		    body: data,
		    headers: {
		    	// 'Access-Control-Allow-Credentials': true,
			    'Content-Type': 'application/json',
			    'Content-Length': data.length
			},
			credentials: 'include', 
		});
        const electiveNames = await response.json();

		if(response.status != 200)
            alert("Something went wrong");
        else if(electiveNames.isAssigned) {
            let assigBtn = document.getElementById('assign');
            assigBtn.innerHTML = "Download CSV";
            assigBtn.onclick = downloadCSV;
            document.getElementById("electiveName").disabled = true;
            document.getElementById("subjects").disabled = true;
        }
		else {
            let assigBtn = document.getElementById('assign');
            assigBtn.innerHTML = "ASSIGN ELECTIVES";
            assigBtn.onclick = assign;
            document.getElementById("electiveName").disabled = false;
            document.getElementById("subjects").disabled = false;

            console.log(electiveNames.ElectiveNames);
            
            const namesselect = document.getElementById('electiveName');
            namesselect.innerHTML = "<option disabled selected value> -- select an option -- </option>";
            electiveNames.ElectiveNames.forEach(name => {
                var opt = document.createElement('option');
                opt.value = name.ElectiveName;
                opt.innerHTML = name.ElectiveName;
                namesselect.appendChild(opt);
            });
            var opt = document.createElement('option');
            opt.value = 'new';
            opt.innerHTML = 'Add new Elective';
            namesselect.appendChild(opt);
		}

    } catch (err) {
        alert("Error occured!");
        console.log(err);
    }
}

let electiveNameSelector = document.getElementById("electiveName");

electiveNameSelector.addEventListener("click", function() {
    var options = electiveNameSelector.querySelectorAll("option");
    var count = options.length;
    if(typeof(count) === "undefined" || count < 2)
    {
        addNewElective();
    }
});

electiveNameSelector.addEventListener("change", function() {
    if(electiveNameSelector.value == "new")
    {
        addNewElective();
    }
    else {
        document.getElementById('subject-label').style.display = 'block';
        document.getElementById('subjects').style.display = 'block';
        document.getElementById('subject-details').style.display = 'block';
        document.getElementById('new-elective').style.display = 'none';
        document.getElementById('new-subject').style.display = "none";
        getSubjectNames(electiveNameSelector.value);
    }
});

function addNewElective() {
    // ... Code to add item 
    document.getElementById('subject-label').style.display = 'none';
    document.getElementById('subjects').style.display = 'none';
    document.getElementById('subject-details').style.display = 'none';
    document.getElementById('new-elective').style.display = 'block';
    document.getElementById('new-subject').style.display = "block";

    let addNew = document.getElementById('addNew')
    addNew.innerHTML = "ADD ELECTIVE";
    addNew.onclick = addElective;
}


async function addElective() {
    const pcode = document.getElementById('pcode').value;
    const maxCount = document.getElementById('maxCountInput').value;
    const sem = document.getElementById('sem').value;
    const dept = document.getElementById('dept').value;
    const year = document.getElementById('year').value;
    const electiveName = document.getElementById('newElectiveName').value;

    try {
    	const data = JSON.stringify({
            sem,
            dept,
            year,
            pcode,
            maxCount,
            electiveName
		})
        const response = await fetch(`https://elective-app.herokuapp.com/addNewSubject`, { 
		    method: "POST", 
		    body: data,
		    headers: {
		    	// 'Access-Control-Allow-Credentials': true,
			    'Content-Type': 'application/json',
			    'Content-Length': data.length
			},
			credentials: 'include', 
		});
        const subjectDetails = await response.json();

		if(response.status != 200)
			alert("Something went wrong");
		else {
            alert("Subject added!!");
            getElectiveNames();
		}

    } catch (err) {
        alert("Error occured!");
        console.log(err);
    }
}



async function getSubjectNames(electiveName) {
    const sem = document.getElementById('sem').value;
    const dept = document.getElementById('dept').value;
    const year = document.getElementById('year').value;

    console.log(sem, dept, year);

    try {
    	const data = JSON.stringify({
            sem,
            dept,
            year,
            electiveName
		})
        const response = await fetch(`https://elective-app.herokuapp.com/subjectNames`, { 
		    method: "POST", 
		    body: data,
		    headers: {
		    	// 'Access-Control-Allow-Credentials': true,
			    'Content-Type': 'application/json',
			    'Content-Length': data.length
			},
			credentials: 'include', 
		});
        const subjectNames = await response.json();

		if(response.status != 200)
			alert("Something went wrong");
		else {
            console.log(subjectNames.SubjectNames);
            
            const namesselect = document.getElementById('subjects');
            namesselect.innerHTML = "<option disabled selected value> -- select an option -- </option>";
            subjectNames.SubjectNames.forEach(name => {
                var opt = document.createElement('option');
                opt.value = name.PCode;
                opt.innerHTML = name.PCode;
                namesselect.appendChild(opt);
            });
            var opt = document.createElement('option');
            opt.value = 'new';
            opt.innerHTML = 'Add new Subject';
            namesselect.appendChild(opt);
		}

    } catch (err) {
        alert("Error occured!");
        console.log(err);
    }
}


let subjectsNameSelector = document.getElementById("subjects");

subjectsNameSelector.addEventListener("click", function() {
    var options = subjectsNameSelector.querySelectorAll("option");
    var count = options.length;
    if(typeof(count) === "undefined" || count < 2)
    {
        addNewSubject();
    }
});

subjectsNameSelector.addEventListener("change", function() {
    if(subjectsNameSelector.value == "new")
    {
        addNewSubject();
    }
    else {
        document.getElementById('subject-details').style.display = "block";
        document.getElementById('new-subject').style.display = "none";
        getSubjectDetails(subjectsNameSelector.value);
    }
});

function addNewSubject() {
    // ... Code to add item here
    document.getElementById('subject-details').style.display = "none";
    document.getElementById('new-subject').style.display = "block";

    let addNew = document.getElementById('addNew')
    addNew.innerHTML = "ADD SUBJECT";
    addNew.onclick = addSubject;
}

async function getSubjectDetails(pcode) {
    const sem = document.getElementById('sem').value;
    const dept = document.getElementById('dept').value;
    const year = document.getElementById('year').value;

    console.log(sem, dept, year);

    try {
    	const data = JSON.stringify({
            sem,
            dept,
            year,
            pcode
		})
        const response = await fetch(`https://elective-app.herokuapp.com/subjectDetails`, { 
		    method: "POST", 
		    body: data,
		    headers: {
		    	// 'Access-Control-Allow-Credentials': true,
			    'Content-Type': 'application/json',
			    'Content-Length': data.length
			},
			credentials: 'include', 
		});
        const subjectDetails = await response.json();

		if(response.status != 200)
			alert("Something went wrong");
		else {
            console.log(subjectDetails.SubjectDetails[0]);
            document.getElementById('assignedCount').innerHTML = `Assigned Count : ${subjectDetails.SubjectDetails[0].Count}`;
            document.getElementById('maxCount').innerHTML = `Max Count : ${subjectDetails.SubjectDetails[0].MaxCount}`;
		}

    } catch (err) {
        alert("Error occured!");
        console.log(err);
    }
}

async function addSubject() {
    const pcode = document.getElementById('pcode').value;
    const maxCount = document.getElementById('maxCountInput').value;
    const sem = document.getElementById('sem').value;
    const dept = document.getElementById('dept').value;
    const year = document.getElementById('year').value;
    const electiveName = document.getElementById('electiveName').value;

    try {
    	const data = JSON.stringify({
            sem,
            dept,
            year,
            pcode,
            maxCount,
            electiveName
		})
        const response = await fetch(`https://elective-app.herokuapp.com/addNewSubject`, { 
		    method: "POST", 
		    body: data,
		    headers: {
		    	// 'Access-Control-Allow-Credentials': true,
			    'Content-Type': 'application/json',
			    'Content-Length': data.length
			},
			credentials: 'include', 
		});
        const subjectDetails = await response.json();

		if(response.status != 200)
			alert("Something went wrong");
		else {
            alert("Subject added!!");
            getSubjectNames(electiveName);
		}

    } catch (err) {
        alert("Error occured!");
        console.log(err);
    }
}


async function assign() {
    const loader = document.getElementById('loader-container')
    loader.style.display = 'block';
    const sem = document.getElementById('sem').value;
    const dept = document.getElementById('dept').value;
    const year = document.getElementById('year').value;

    try {
    	const data = JSON.stringify({
            sem,
            dept,
            year
		})
        const response = await fetch(`https://elective-app.herokuapp.com/assignElectives`, { 
		    method: "POST", 
		    body: data,
		    headers: {
		    	// 'Access-Control-Allow-Credentials': true,
			    'Content-Type': 'application/json',
			    'Content-Length': data.length
			},
			credentials: 'include', 
		});
        // const subjectDetails = await response.json();

		if(response.status != 200)
			alert("Something went wrong");
		else {
            alert("Electives Assigned Successfully");
            getElectiveNames();
		}

    } catch (err) {
        alert("Error occured!");
        console.log(err);
    }
    finally {
        loader.style.display = "none";
    }
}


async function downloadCSV() {
    const sem = document.getElementById('sem').value;
    const dept = document.getElementById('dept').value;
    const year = document.getElementById('year').value;

    try {
    	const data = JSON.stringify({
            sem,
            dept,
            year
		})
        const response = await fetch(`https://elective-app.herokuapp.com/getCSV`, { 
		    method: "POST", 
		    body: data,
		    headers: {
		    	// 'Access-Control-Allow-Credentials': true,
			    'Content-Type': 'application/json',
			    'Content-Length': data.length
			},
			credentials: 'include', 
		});
        const datajson = await response.json();

		if(response.status != 200)
			alert("Something went wrong");
		else {
            window.open(datajson.url);
		}

    } catch (err) {
        alert("Error occured!");
        console.log(err);
    }
}