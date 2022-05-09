const token = localStorage.getItem('authToken');

// setInterval('window.location.reload()', 1000)

window.addEventListener('load',()=>{
    axios.get('http://localhost:4000/chat/join',{headers:{authanticate:token}})
    .then(response=>{
        if(response.status===200){
            response.data.listOfUser.forEach(user => {
                addUserToDOM(user);
            });
        }
    })
    .catch(err=>{
        console.log(err)
        if(err.response.status===404){
            window.location.href="../404.html"
        }
        if(err.response.status===500){
            window.location.href="../signup/signup.html"
        }
    })

})

function addUserToDOM(quser){
    const parentElement = document.getElementById('user');
    parentElement.innerHTML += `
        <li id=${quser}>
            ${quser} joined the group
        </li>`
}

function sendmessage(e){
    e.preventDefault();

    const form = new FormData(e.target)
    const message = {
        message: form.get('message')
    }
    console.log(message);

    axios.post('http://localhost:4000/chat/message',message,{headers:{authanticate:token}})
    .then(res=>{
        if(res.status===201){
            const userMsg = res.data.msg.message;
            const name = res.data.user;
            addMsgToDOM(userMsg,name);
        }
    })
    .catch(err=>{
        console.log(err)
    })
}


function addMsgToDOM(message,name){
    const parentElement = document.getElementById('message');
    parentElement.innerHTML += `
        <li id=${name}>
            ${name}: ${message}
        </li>`
}

setInterval(()=>{
    axios.get('http://localhost:4000/chat/recieve',{headers:{authanticate:token}})
    .then(res=>{
        if(res.status===200){
            console.log(res)
            const parentElement = document.getElementById('message');
            parentElement.innerHTML = " ";
            const msgs = res.data.messages
            msgs.forEach(msg => {
            addMsgToDOM(msg.message,msg.id);
            });
        }
    })
    .catch(err=>{
        console.log(err);
    })
},2000)