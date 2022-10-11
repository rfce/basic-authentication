const welcome = document.querySelector('.welcome-message > span')

const init = async () => {
    const response = await fetch("/api/info")
    const data = await response.json()

    if (data.status == "fail") {
        window.location = "/login"
    } else {
        const name = `${data.data.firstName == "" ? "Guest" : data.data.firstName}${data.data.lastName == "" ? "" : " " + data.data.lastName}`
        welcome.innerText = `${name} (${data.data.email})`
    }
}

const logout = document.getElementById('logout')

logout.addEventListener('click', async () => {
    const response = await fetch("/api/logout")
    const data = await response.json()
    
    if (data.status == "success") {
        window.location = "/login"
    } else {
        console.log(data)
        alert("Something went wrong")
    }
})

init()


