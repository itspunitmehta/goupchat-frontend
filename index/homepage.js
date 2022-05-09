const token = localStorage.getItem('authToken');
let localTextSaved = JSON.parse(localStorage.getItem('localMessage'));
let lastMsgId;


// loading page calling backend to get user list and msgs
window.addEventListener('load',()=>{
    showGroupMembers(); //this will print user 

    if(localTextSaved){
        getMessageFromLocal();
    }

    setInterval(()=>{
    updateMessage();
    },3000)
})


function showGroupMembers(){
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
        }else{
        console.log('err')
            // window.location.href="../signup/signup.html"
        }
    })
}


// showing user list on dom
function addUserToDOM(quser){
    const parentElement = document.getElementById('user');
    parentElement.innerHTML += `
        <li id=${quser}>
            ${quser} joined the group
        </li>`
}


//mesage sending to backend and same time showing on the 
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
            // const userMsg = res.data.msg.message;
            // const name = res.data.msg.senderName;
            // addMsgToDOM(userMsg,name);
            document.getElementById('msg-input').value = "";
        }
    })
    .catch(err=>{
        console.log(err)
        if(err.response.status===500){
            window.location.href="../signup/signup.html"
        }
    })
}

function getMessageFromLocal(){
    let  localTextSaved = JSON.parse(localStorage.getItem('localMessage'));
    // console.log(localTextSaved);
    localTextSaved.forEach(element => {
        addMsgToDOM(element.message,element.senderName)
    });
}


function addMsgToDOM(message,name){
    const parentElement = document.getElementById('message');
    // parentElement.innerHTML = " ";
    parentElement.innerHTML += `
        <li id=${name}>
            ${name}: ${message}
        </li>`
}


function updateMessage(){
    let localTextSaved = JSON.parse(localStorage.getItem('localMessage'));
    let lastMsgId;
    if(localTextSaved){
        lastMsgId = localTextSaved[localTextSaved.length-1].id;
    }else{
        lastMsgId = 0;
    }
    // console.log(lastMsgId)
    let mergeMessageArray;
    axios.get(`http://localhost:4000/chat/recieve?id=${lastMsgId+1}`,{headers:{authanticate:token}})
    .then(res=>{
        if(res.status===200){
            const msgs = res.data.messages
            if(msgs.length>0){
                if(localTextSaved){
                    mergeMessageArray = localTextSaved.concat(msgs)
                    msgs.forEach(messageData => {
                        // console.log(messageData.message,messageData.senderName, 'inside local storage');
                        addMsgToDOM(messageData.message,messageData.senderName)
        
                    })
                }else{
                    mergeMessageArray = msgs;
                    msgs.forEach(messageData => {
                        // console.log(messageData.message,messageData.senderName,'inside backend');
                        addMsgToDOM(messageData.message,messageData.senderName)
                    })
                }
                if(mergeMessageArray.length>100){
                    let popFrontMsg = mergeMessageArray.length-100; //
                    for(var i=0;i<popFrontMsg;i++){
                        mergeMessageArray.shift();
                    }
                }
            }
            else{
                mergeMessageArray = JSON.parse(localStorage.getItem('localMessage'))
            }
            localStorage.setItem('localMessage',JSON.stringify(mergeMessageArray))

            mergeMessageArray.forEach(messageData => {
                // console.log(messageData);

            });
        }
    })
    .catch(err=>{
        console.log(err);
        if(err.response.status===404){
            window.location.href="../404.html"
        }else{
            // window.location.href="../signup/signup.html"
        }
    })
}

