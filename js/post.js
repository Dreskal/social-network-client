let createPost = (event) =>{
    
    const url = 'http://localhost:8080/api/v1/auth/authenticate';

    const titleValue = event.target.title.value;
    const descriptionValue = event.target.description.value;
    fetch(url,
        {
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${localStorage.getItem('token')}` 
            },
            method: "POST",
            body: JSON.stringify({
                title: titleValue,
                description: descriptionValue
            })
        }
    ).then(response => {
        if(response.ok){
            response.json()
        }
    })
    .then((json) => window.location.href = "index.html")
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to authenticate');
    });
};