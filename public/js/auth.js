console.log('hello')

async function login() {
	const password = document.getElementById('password').value;
    //VERIFY USERNAME AND PASSWORDS
    try {
    	const data = JSON.stringify({
			password: password
		})
        const attemptLogin = await fetch("http://localhost:3000/adminLogin", { 
		    method: "POST", 
		    body: data,
		    headers: {
		    	// 'Access-Control-Allow-Credentials': true,
			    'Content-Type': 'application/json',
			    'Content-Length': data.length
			},
			credentials: 'include', 
		});

		console.log(attemptLogin.headers) 

		if(attemptLogin.status === 401)
			alert("Invalid Credentials");
		else {
			const accessToken = await attemptLogin.json();
			console.log(accessToken);
			localStorage.setItem(
				'AccessToken', accessToken.AccessToken,
			);

			window.location.href = '/home';
		}

    } catch (err) {
        alert("Error occured!");
        console.log(err);
    }
}

async function sendOTP() {
    try {
        const attemptOTP = await fetch("http://localhost:3000/sendOTP", { 
		    method: "GET",
			credentials: 'include', 
		});


		if(attemptOTP.status != 200)
			alert("Something went wrong!");
		else {
			alert("OTP Sent. Please check your email")
		}

    } catch (err) {
        alert("Error occured!");
        console.log(err);
    }
}

async function resetPassword() {
	const otp = document.getElementById('otp').value;
	const newPassword = document.getElementById('newpassword').value;
    try {
		const data = JSON.stringify({
			password: newPassword,
			OTP: otp
		});
        const attemptReset = await fetch("http://localhost:3000/resetPassword", { 
		    method: "POST", 
		    body: data,
		    headers: {
		    	// 'Access-Control-Allow-Credentials': true,
			    'Content-Type': 'application/json',
			    'Content-Length': data.length
			},
			credentials: 'include',  
		});

		const respMessage = await attemptReset.json();
		if(attemptReset.status != 200)
			alert("Something went wrong!");
		else if(respMessage.Message === "Invalid OTP") {
			alert("Invalid OTP");
		}
		else {
			alert("Password reset successful");
			window.location.href = "/";
		}

    } catch (err) {
        alert("Error occured!");
        console.log(err);
    }
}

function showResetPassword() {
	document.getElementById('login-form').style.display = 'none';
	document.getElementById('forgot-password').style.display = 'block';
	document.getElementById('login-heading').innerHTML = "RESET PASSWORD";
}

function back() {
	document.getElementById('login-form').style.display = 'block';
	document.getElementById('forgot-password').style.display = 'none';
	document.getElementById('login-heading').innerHTML = "ADMIN LOGIN";
}


async function checkLoginStatus() {
    const accessTokens = localStorage.AccessToken;
    if(accessTokens === undefined) {
        return
    }

    try {
    	const data = JSON.stringify({
            accessTokens
		})
        const response = await fetch("http://localhost:3000/verifyTokens", { 
		    method: "POST", 
		    body: data,
		    headers: {
		    	// 'Access-Control-Allow-Credentials': true,
			    'Content-Type': 'application/json',
			    'Content-Length': data.length
			},
			credentials: 'include', 
		});
        const respMessage = await response.json();

		if(response.status != 200)
            alert("Something went wrong");
        else if(respMessage.Message === "Expired") {
            return;
		}
		else
			window.location.href = "/home";

    } catch (err) {
        alert("Error occured!");
        console.log(err);
    }
}


checkLoginStatus();