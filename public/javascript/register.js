const registerButton = document.querySelector('.registerButton')

registerButton.addEventListener('click', async () => {
    const firstName = document.getElementById('firstName').value
    const lastName = document.getElementById('lastName').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    const input = { firstName, lastName, email, password }

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
    })

    const data = await response.text()
    const result = JSON.parse(data)

    const messageBox = document.querySelector('.display-message')
    const message = document.querySelector('.display-message > span')

    if (result.status == 'success') {
        messageBox.classList.remove('red')
        messageBox.classList.add('green')
    } else {
        messageBox.classList.remove('green')
        messageBox.classList.add('red')
    }

    message.innerText = result.reason
})


