var previousURL = ''

setInterval(() => {
    if(previousURL != document.URL) {
        console.log('page changed!')
        if(document.URL == 'https://app.sowesign.com/student/next-course') {
            console.log('you are on the right page');
        } else {
            console.log('nah not this one');
        }
        previousURL = document.URL;
    }
}, 500)
