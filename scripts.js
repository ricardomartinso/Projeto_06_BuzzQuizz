let listaQuizzes = [];
const containerQuizzes = document.querySelector(".quizz-boxes");
const containerTela1 = document.querySelector(".container");
const containerTela2 = document.querySelector(".container-tela-2");



function helloWorld() {
    console.log("Hello world");
}

function pegarQuizzes() {

    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promise.then(function (resposta) {
        console.log(resposta.data);
    })
    promise.then(renderizarQuizzes);
}

pegarQuizzes();

function renderizarQuizzes(resposta) {
    listaQuizzes = resposta.data;
    containerQuizzes.innerHTML = "";
    povoarDomQuizzes();
}

function povoarDomQuizzes() {

    for (let i = 0; i < listaQuizzes.length; i++) {
        let quizz = listaQuizzes[i];
        containerQuizzes.innerHTML += `
        <div id="${i}" class="quizz-box" onclick="selecionarQuizz(this)">

            <div class="linear-gradient"></div>

            <div class="quizz-imagem">
                <img 
                src="${quizz.image}" 
                style="width: 340px; height: 181px; object-fit: fill;"
                >
            </div>
            
            <div class="quizz-titulo">
                <p>${quizz.title}</p>
            </div>
                    
        </div>
        `
    }
}

function selecionarQuizz(elemento){
    //Definindo variáveis do quizz que serão usadas ao renderizar a tela 2//
    const posicaoNoArray = Number(elemento.id);

    const quizzSelecionado = listaQuizzes[posicaoNoArray];

    const UrlImagem = quizzSelecionado.image;

    const TituloQuizz = quizzSelecionado.title;

    const questoesQuizz = quizzSelecionado.questions;

    const niveisQuizz = quizzSelecionado.levels

    //Atualizando o DOM e renderizando a página//
    atualizarTela2(UrlImagem, TituloQuizz, questoesQuizz, niveisQuizz);

    visualizarTela2();
}

function visualizarTela2(){
    containerTela1.classList.add("invisivel");

    containerTela2.classList.remove("invisivel");
}

function atualizarTela2(url, titulo, questoes, niveis){

    containerTela2.innerHTML = `
    <div class="imagem-titulo">
        <img src="${url}" alt="">
        <h3>${titulo}</h3>
    </div>
    `
 

    for (let i = 0; i < questoes.length; i++){
        let respostas = questoes[i].answers;
        respostas.sort(comparador);

        //Embaralhar array de respostas de cada questão//

        containerTela2.innerHTML+= `
        <div class="pergunta numero${i}">
            <div class="titulo-pergunta" style=" background-color: ${questoes[i].color}";>
                <p>${questoes[i].title}</p>
            </div>
        </div>
        `
        for (let j = 0; j < respostas.length/2; j++){
            containerTela2.querySelector(`.pergunta.numero${i}`).innerHTML+= `
            <div class="respostas">
                <div class="resposta" onclick="verificarCorreta()">
                    <div class="imagem-resposta">
                        <img src="${respostas[j*2].image}" alt="">
                    </div>
                    <div class="texto-resposta">
                        ${respostas[j*2].text}
                    </div>
                </div>
                <div class="resposta" onclick="verificarCorreta()">
                    <div class="imagem-resposta">
                        <img src="${respostas[j*2 + 1].image}" alt="">
                    </div>
                    <div class="texto-resposta">
                        ${respostas[j*2 + 1].text}
                    </div>
                </div>
            </div>
            `

        }

    }
}

function comparador(){
    return Math.random() - 0.5;
}