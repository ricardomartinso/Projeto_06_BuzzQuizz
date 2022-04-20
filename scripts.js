
function helloWorld() {
    console.log("Hello world");
}

function pegarQuizzes() {
    let promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promise.then(function(response) {
        console.log(response.data);
    })
}
pegarQuizzes();