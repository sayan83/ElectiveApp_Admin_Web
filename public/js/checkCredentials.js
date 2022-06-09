async function checkCredentials() {
    const accessTokens = localStorage.AccessToken;
    if(accessTokens === undefined) {
        window.location.href = "/";
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
            window.location.href = "/";
        }

    } catch (err) {
        alert("Error occured!");
        console.log(err);
    }
}


checkCredentials();


function logout() {
    localStorage.removeItem('AccessToken');
    checkCredentials();
}