const token = localStorage.getItem('authToken');

window.addEventListener('load',()=>{
    axios.get('http://localhost:4000/chat/message',{headers:{authanticate:token}})
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
    })
})

function addUserToDOM(quser){
    const parentElement = document.getElementById('user');
    // const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id=${quser}>
            ${quser} joined the group
        </li>`
}