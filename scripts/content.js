var previousURL = ''

setInterval(() => {
    if(previousURL != document.URL) {
        if(document.URL == 'https://app.sowesign.com/student/next-course') {
            document.body.innerHTML = '<div>Hello :)</div>' + document.body.innerHTML
        }
        previousURL = document.URL;
    }
}, 500)
