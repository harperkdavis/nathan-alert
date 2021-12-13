let clicks = 0;

document.body.onclick = function() {
    if (clicks == 0) {
        setTimeout(processSwap, 2000);
    }
    clicks += 1;
    document.getElementById('middle').innerHTML = 'Click exactly twice for clear, anything else for not clear (' + clicks + ')';
}

setInterval(updateStatus, 1000);

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
    });
}

updateStatus();