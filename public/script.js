document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.about').addEventListener('click', function() {
        // Redirect to about.html when the div is clicked
        window.location.href = '/about.html';
    });

    document.querySelector('.node-modules').addEventListener('click', function() {
        // Redirect to node-modules.html when the div is clicked
        window.location.href = '/node-modules.html';
    });

    document.querySelector('.access').addEventListener('click', function() {
        // Redirect to access.html when the div is clicked
        window.location.href = '/access.html';
    });

    document.getElementById('home').addEventListener('click', function() {
        // Redirect to home.html when the image is clicked
        window.location.href = '/index.html';
    });
});


async function fetchImages() {
            const response = await fetch('/api/images');
            const images = await response.json();
            const gallery = document.getElementById('image-gallery');
            gallery.innerHTML = '';
    
            images.forEach(image => {
                const div = document.createElement('div');
                div.classList.add('image-container');
    
                const img = document.createElement('img');
                img.src = `data:${image.contentType};base64,${image.image}`;
                img.classList.add('thumbnail');
                img.onclick = () => img.classList.toggle('expanded');
    
                const name = document.createElement('p');
                name.textContent = `Uploaded by: ${image.user}`;
    
                const textarea = document.createElement('textarea');
                textarea.placeholder = 'Type your response here...';
    
                const sendButton = document.createElement('button');
                sendButton.textContent = 'Send Response';
                sendButton.className = 'submit-button';
                sendButton.onclick = async () => {
                    console.log('Question ID:', image.id); // Log for debugging
                    try {
                        const response = await fetch('/api/send-response', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ questionId: image.id, response: textarea.value })
                        });
    
                        if (response.ok) {
                            alert('Response sent successfully!');
                        } else {
                            const errorMessage = await response.json();
                            console.error('Response error:', errorMessage);
                            alert(`Failed to send response: ${errorMessage.message || 'Unknown error'}`);
                        }
                    } catch (err) {
                        console.error('Fetch error:', err);
                        alert('Failed to send response due to network error.');
                    }
                };
    
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete Image';
                deleteButton.className = 'delete-button';

                deleteButton.onclick = async () => {
                    const response = await fetch(`/api/images/${image.id}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        fetchImages(); // Refresh gallery
                    }
                };
    
                div.appendChild(img);
                div.appendChild(name);
                div.appendChild(textarea);
                div.appendChild(sendButton);
                div.appendChild(deleteButton);
                gallery.appendChild(div);
            });
        }
    
        fetchImages();
