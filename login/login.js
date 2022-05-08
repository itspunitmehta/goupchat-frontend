function login(e){
    e.preventDefault();
    const form = new FormData(e.target);

    const userDetails = {
        email: form.get('email'),
        password: form.get('password')
    }
    console.log(userDetails);

    axios.post('http://localhost:4000/user/login',userDetails)
    .then(res=>{
        if(res.status === 200){
            localStorage.setItem('authToken',res.data.token);
            window.location.href = "../index/homepage.html"
        }
    })
    .catch(err=>{
        console.log(err);
        alert(`${err.response.data.message}`)
    })
}