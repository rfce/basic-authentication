const loginButton = document.querySelector('.loginButton')

const messageBox = document.querySelector('.display-message')
const message = document.querySelector('.display-message > span')

loginButton.addEventListener('click', async () => {
    const email = document.getElementById('email').value
    const password  = document.getElementById('password').value

    const input = { email, password }

    const response = await fetch("/api/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
    })

    const result = await response.json()

    if (result.status == 'success') {
        messageBox.classList.remove('red')
        messageBox.classList.add('green')
    
        // Redirect user to dashboard
        setTimeout(() => {
            window.location = "/dashboard"
        }, 2000)
    } else {
        messageBox.classList.remove('green')
        messageBox.classList.add('red')
    }
    
    message.innerText = result.reason
})

