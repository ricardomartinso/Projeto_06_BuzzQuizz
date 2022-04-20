let listaQuizzes = [];
const containerQuizzes = document.querySelector(".quizz-boxes");
const containerTela1 = document.querySelector(".container");
const containerTela2 = document.querySelector(".container-tela-2");
const containerTela3 = document.querySelector(".container.tela-3");
const quizzCriado = {
    title: "",
    image: "",
    questions: [],
    levels: []
}



function pegarQuizzes() {

    const promise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
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

    const urlImagem = quizzSelecionado.image;

    const tituloQuizz = quizzSelecionado.title;

    const questoesQuizz = quizzSelecionado.questions;

    const niveisQuizz = quizzSelecionado.levels

    //Atualizando o DOM e renderizando a página//
    atualizarTela2(urlImagem, tituloQuizz, questoesQuizz, niveisQuizz);

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

function visualizarTela3() {
    containerTela1.classList.add("invisivel");
    containerTela3.classList.remove("invisivel");
}

function criarPerguntas(botao) {
    
    const tituloQuizzCriado = document.querySelector("input[name='titulo-do-quizz']").value;
    const urlQuizzCriado = document.querySelector("input[name='url-do-quizz']").value;
    const perguntasQuizzCriado = document.querySelector("input[name='quantidade-perguntas-quizz']").value;
    const niveisQuizzCriado = document.querySelector("input[name='quantidade-niveis-quizz']").value;


    if (validarInformacoesBasicas) {
        quizzCriado.title = tituloQuizzCriado;
        quizzCriado.image = urlQuizzCriado;
        quizzCriado.questions = perguntasQuizzCriado;
        quizzCriado.levels = niveisQuizzCriado;
        containerTela3.querySelector("h2").innerHTML = "Crie suas perguntas";
        botao.innerHTML = "Prosseguir para criar níveis";
        botao.attributes.onclick.value = "criarNiveis()";

}

}
function validarInformacoesBasicas() {
    const tituloQuizzCriado = document.querySelector("input[name='titulo-do-quizz']").value;
    const urlQuizzCriado = document.querySelector("input[name='url-do-quizz']").value;
    const perguntasQuizzCriado = document.querySelector("input[name='quantidade-perguntas-quizz']").value;
    const niveisQuizzCriado = document.querySelector("input[name='quantidade-niveis-quizz']").value;

    if (tituloQuizzCriado.length >= 20 && tituloQuizzCriado.length <= 65 && perguntasQuizzCriado >= 3 && niveisQuizzCriado >= 2) {
        return true;
    }
    return false;
}

function criarNiveis() {

}


function criarQuizz() {



    let promise = axios.post("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes", quizzCriado);
    promise.catch(function(){
        alert("Dados inválidos");  
    })

}



function voltarHome() {
    containerTela1.classList.remove("invisivel");

    if (containerTela2.classList.contains("invisivel") === false) {
        containerTela2.classList.add("invisivel");

    } 
    else if (containerTela3.classList.contains("invisivel") === false) {
        containerTela3.classList.add("invisivel");
    }
    
}

function comparador(){
    return Math.random() - 0.5;
}