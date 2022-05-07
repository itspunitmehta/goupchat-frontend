function login(e){
    e.preventDefault();
    const form = new FormData(e.target);

    const detail = {
        email: form.get('email'),
        password: form.get('password')
    }
    console.log(detail);

    axios.post('http://localhost:4000/user/login',{detail})
    .then(res=>{
        if(res.status === 201){
            window.location.href = "../index/homepage.html"
        }
    })
    .catch(err=>{
        console.log(err);
    })
}