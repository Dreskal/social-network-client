const postsContainer = document.getElementsByClassName('posts')[0];

let getAllPosts = () => {
    return fetch('http://localhost:8080/api/v1/posts')
        .then(response => {
            if (!response.ok) {
                alert('Ne OK');
                return;
            }
            return response.json();
        });
};

let addComment = (event, postId) =>{
    event.preventDefault();

    const url = 'http://localhost:8080/api/v1/comment';
    const description = event.target.description.value;

    fetch(url,
        {
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${localStorage.getItem('token')}` 
            },
            method: "POST",
            body: JSON.stringify({
                description: description,
                postId: postId
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
        alert('Failed comment');
    });
};

let timeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const seconds = Math.floor((now - past) / 1000);
      
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";
      
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";
      
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";
      
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + " hour" + (interval > 1 ? "s" : "") + " ago";
      
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + " minute" + (interval > 1 ? "s" : "") + " ago";
      
        return Math.floor(seconds) + " second" + (seconds > 1 ? "s" : "") + " ago";
}

window.onload = () => {
    getAllPosts()
        .then(data => {
            data.map(post => {  

                let commentLimit = 2;

                let initComments = post.comments.slice(0, commentLimit);
                let remainigComment = post.comments.slice(commentLimit);

                let commentToHTML = (comment) => {
                  return   `<div class="comment">
                                <p>
                                    <span>
                                        <strong>${comment.user.username}</strong>: ${comment.description} 
                                    </span>    
                                    <span class="date">${timeAgo(comment.createDate)}</span>
                                </p>
                                <button>Like</button>
                            </div>`
                  
                };

                let commentsHtml = initComments.map(comment => commentToHTML(comment)).join('');

                if(remainigComment.length > 0){
                    commentsHtml +=`<button class="show-more-btn">show more</button>`
                }

                postsContainer.insertAdjacentHTML('beforeend', 
                    `
                    <article class="post">
                        <div class="title">
                            <h2>${post.title}</h2>
                                <span class="date" id="created-on-date">${timeAgo(post.createDate)}</span>
                        </div>
                        
                        <p class="post-owner">
                            <span id="post-owner-id">${post.user.username}</span>
                        </p>
                        <p class="description">
                            ${post.description}
                        </p>
                        <div class="post-btn">
                            <button class="reaction-btn">Like ${post.reaction}</button>
                        </div>

                        <hr>
                        <div class="comment-form">
                            <form onsubmit="return addComment(event, ${post.id})" method="post">
                                <textarea class="comment-input" name="description" rows="4"
                                        placeholder="Write your comment here..."></textarea>
                                <button type="submit">comment</button>
                            </form>
                        </div>
                        <div class="comments">
                            <h3>Comments:</h3>
                            <div class="comment-conteiner">
                            ${commentsHtml}
                            </div>
                        </div>
                    </article>
                `);

                const commentsConteiner = postsContainer.lastElementChild.querySelector('.comment-conteiner');
                const showMoreBtn = commentsConteiner.querySelector('.show-more-btn');

                if(showMoreBtn){
                    showMoreBtn.addEventListener('click', e => {
                        remainigComment.forEach(comment => {
                            const commentHTML = commentToHTML(comment);
                            commentsConteiner.insertAdjacentHTML('beforeend', commentHTML);
                        });
                        showMoreBtn.remove();
                    });
                }

            })
        });
};
