let clicks = 0;
let mode = 0;

document.getElementById("center").onclick = function() {
    if (clicks == 0) {
        setTimeout(processSwap, 1000);
    }
    clicks += 1;
    document.getElementById('middle').innerHTML = 'Click exactly twice for clear, anything else for not clear (' + clicks + ')';
}

document.getElementById("title").onclick = function() {
    if (clicks == 0) {
        setTimeout(processSwap, 1000);
    }
    clicks += 1;
    document.getElementById('middle').innerHTML = 'Click exactly twice for clear, anything else for not clear (' + clicks + ')';
}

document.getElementById("editmessage").onclick = function() {
    switchMode();
}

document.getElementById("submit").onclick = function() {
    let message = document.getElementById('messagearea').value;
    setMessage(message);
    switchMode();
}

function switchMode() {
    mode = 1 - mode;
    if (mode == 0) {
        document.getElementById("center").style.display = "none";
        document.getElementById("editor").style.display = "block";
    } else if (mode == 1) {
        document.getElementById("center").style.display = "block";
        document.getElementById("editor").style.display = "none";
    }
}

async function processSwap() {
    let data;
    if (clicks == 2) {
        data = {'clear': true};
    } else {
        data = {'clear': false};
    }
    await fetch('https://arcane-woodland-27174.herokuapp.com/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    updateStatus();
    clicks = 0;
    document.getElementById('middle').innerHTML = 'Click exactly twice for clear, anything else for not clear';
}

async function setMessage(message) {
    let data = {'message': message};
    await fetch('https://arcane-woodland-27174.herokuapp.com/updateMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    updateStatus();
}


async function updateStatus() {
    let clear;
    await fetch('https://arcane-woodland-27174.herokuapp.com/status').then(response => response.json()).then(data => {

        let statusText = document.getElementById('status');
        if (statusText.classList.contains('notclear')) {
            statusText.classList.remove('noclear');
        }
        if (statusText.classList.contains('clear')) {
            statusText.classList.remove('clear');
        }

        statusText.innerHTML = data['clear'] ? 'CLEAR' : 'NOT CLEAR';
        statusText.classList.add(data['clear'] ? 'clear' : 'notclear');
        
        let statusTime = new Date(data['clearTime']).toLocaleString("en-US", {timeZone: "America/Los_Angeles"});
        let messageTime = new Date(data['messageTime']).toLocaleString("en-US", {timeZone: "America/Los_Angeles"});

        document.getElementById("statusTime").innerHTML = "Last updated: " + statusTime;

        document.getElementById("message").innerHTML = '"' + data['message'] + '"';
        document.getElementById("messageTime").innerHTML = "Last updated: " + messageTime;
    });
}

updateStatus();
setInterval(updateStatus, 500);

switchMode();

if ('wakeLock' in navigator) {
    try {
        navigator.wakeLock.request();
    } catch(err) {
        console.error(err);
    }
}