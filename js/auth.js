let setToken = (token) =>{
    localStorage.removeItem('token');
    localStorage.setItem('token', token);
}

let onSingIn = (event) => {
    event.preventDefault();

    const url = 'http://localhost:8080/api/v1/auth/authenticate';

    const username = event.target.username.value;
    const password = event.target.password.value;

    fetch(url,
        {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password
            })
        }
    )
    .then(response => {
        if(response.ok){
            response.json()
        }
    })
    .then((json) => {
        const token = json['token'];
        setToken(token);
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to authenticate');
    });
};

let onSingUp = (event) => {
    event.preventDefault();

    const url = 'http://localhost:8080/api/v1/auth/register';

    const username = event.target.username.value;
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    fetch(url,
        {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
                username: username,
                name: name,
                email: email,
                password: password
            })
        }
    )
    .then(response => {
        if(response.ok){
            response.json()
        }
    })
    .then((json) => {
        const token = json['token'];
        setToken(token);
        window.location.href = 'index.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to authenticate');
    });
};