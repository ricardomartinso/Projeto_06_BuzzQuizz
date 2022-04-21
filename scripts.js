let listaQuizzes = [];
let listaPerguntasQuizz = [];
let numeroDaPergunta;
const containerQuizzes = document.querySelector(".quizz-boxes");
const containerTela1 = document.querySelector(".container");
const containerTela2 = document.querySelector(".container-tela-2");
const containerTela3 = document.querySelector(".container.tela-3");
const quizzCriado = {
  title: "",
  image: "",
  questions: [],
  levels: [],
};

function pegarQuizzes() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes"
  );
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
        `;
  }
}

function selecionarQuizz(elemento) {
  //Definindo variáveis do quizz que serão usadas ao renderizar a tela 2//
  const posicaoNoArray = Number(elemento.id);

  const quizzSelecionado = listaQuizzes[posicaoNoArray];

  const urlImagem = quizzSelecionado.image;

  const tituloQuizz = quizzSelecionado.title;

  const questoesQuizz = quizzSelecionado.questions;

  const niveisQuizz = quizzSelecionado.levels;

  //Atualizando o DOM e renderizando a página//
  atualizarTela2(urlImagem, tituloQuizz, questoesQuizz, niveisQuizz);

  visualizarTela2();

  console.log(questoesQuizz[0].answers);
  listaPerguntasQuizz = questoesQuizz;
}

function verificarCorreta(elemento) {
  const conjuntoRespostas = elemento.parentNode.parentNode;
  numeroDaPergunta = Number(
    conjuntoRespostas.classList[1].replace("numero", "")
  );
  console.log(numeroDaPergunta);
  conjuntoRespostas
    .querySelectorAll(".resposta")
    .forEach(esbranquicarRespostas);
  elemento.classList.remove("outras-respostas");
  setTimeout(rolarParaPerguntaSeguinte, 2000);
}

function rolarParaPerguntaSeguinte() {
  if (numeroDaPergunta !== listaPerguntasQuizz.length - 1) {
    document.querySelector(`.numero${numeroDaPergunta + 1}`).scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "center",
    });
  }
}

function esbranquicarRespostas(item, index) {
  item.classList.add("outras-respostas");
  item.onclick = "";
  if (listaPerguntasQuizz[numeroDaPergunta].answers[index].isCorrectAnswer) {
    item.classList.add("resposta-certa");
  } else {
    item.classList.add("resposta-errada");
  }
}

function visualizarTela2() {
  containerTela1.classList.add("invisivel");

  containerTela2.classList.remove("invisivel");

  document.querySelector(".imagem-titulo").scrollIntoView(false);
}

function atualizarTela2(url, titulo, questoes, niveis) {
  containerTela2.innerHTML = `
    <div class="imagem-titulo">
        <img src="${url}" alt="">
        <h3>${titulo}</h3>
    </div>
    `;

  for (let i = 0; i < questoes.length; i++) {
    let respostas = questoes[i].answers;
    respostas.sort(comparador);

    //Embaralhar array de respostas de cada questão//

    containerTela2.innerHTML += `
        <div class="pergunta numero${i}">
            <div class="titulo-pergunta" style=" background-color: ${questoes[i].color}";>
                <p>${questoes[i].title}</p>
            </div>
        </div>
        `;
    if (respostas.length % 2 === 0) {
      for (let j = 0; j < respostas.length / 2; j++) {
        containerTela2.querySelector(`.pergunta.numero${i}`).innerHTML += `
                <div class="respostas">
                    <div class="resposta" onclick="verificarCorreta(this)">
                        <div class="imagem-resposta">
                            <img src="${respostas[j * 2].image}" alt="">
                        </div>
                        <div class="texto-resposta">
                            ${respostas[j * 2].text}
                        </div>
                    </div>
                    <div class="resposta" onclick="verificarCorreta(this)">
                        <div class="imagem-resposta">
                            <img src="${respostas[j * 2 + 1].image}" alt="">
                        </div>
                        <div class="texto-resposta">
                            ${respostas[j * 2 + 1].text}
                        </div>
                    </div>
                </div>
                `;
      }
    } else {
      containerTela2.querySelector(`.pergunta.numero${i}`).innerHTML += `
            <div class="respostas">
                <div class="resposta" onclick="verificarCorreta(this)">
                    <div class="imagem-resposta">
                        <img src="${respostas[0].image}" alt="">
                    </div>
                    <div class="texto-resposta">
                        ${respostas[0].text}
                    </div>
                </div>
                <div class="resposta" onclick="verificarCorreta(this)">
                    <div class="imagem-resposta">
                        <img src="${respostas[1].image}" alt="">
                    </div>
                    <div class="texto-resposta">
                        ${respostas[1].text}
                    </div>
                </div>
            </div>
            <div class="respostas">
                <div class="resposta" onclick="verificarCorreta(this)">
                    <div class="imagem-resposta">
                        <img src="${respostas[2].image}" alt="">
                    </div>
                    <div class="texto-resposta">
                        ${respostas[2].text}
                    </div>
                </div>
            </div>
            `;
    }
  }
}

function visualizarTela3() {
  containerTela1.classList.add("invisivel");
  containerTela3.classList.remove("invisivel");
}

function criarPerguntas(botao) {
  const tituloQuizzCriado = document.querySelector(
    "input[name='titulo-do-quizz']"
  ).value;
  const urlQuizzCriado = document.querySelector(
    "input[name='url-do-quizz']"
  ).value;
  const perguntasQuizzCriado = document.querySelector(
    "input[name='quantidade-perguntas-quizz']"
  ).value;
  const niveisQuizzCriado = document.querySelector(
    "input[name='quantidade-niveis-quizz']"
  ).value;

  let criacaoPerguntas = document.querySelector(".criacao-perguntas");
  criacaoPerguntas.innerHTML = "";

  quizzCriado.title = tituloQuizzCriado;
  quizzCriado.image = urlQuizzCriado;
  quizzCriado.questions = perguntasQuizzCriado;
  quizzCriado.levels = niveisQuizzCriado;

  if (
    quizzCriado.title.length >= 20 &&
    quizzCriado.title.length <= 65 &&
    quizzCriado.questions >= 3 &&
    quizzCriado.levels >= 2 &&
    isValidUrl(quizzCriado.image)
  ) {
    containerTela3.querySelector("h2").innerHTML = "Crie suas perguntas";
    botao.innerHTML = "Prosseguir para criar níveis";
    botao.attributes.onclick.value = "criarNiveis(this)";
    document.querySelector(".form-criacao").classList.add("invisivel");
    document.querySelector(".criacao-perguntas").classList.remove("invisivel");

    for (let i = 0; i < perguntasQuizzCriado; i++) {
      criacaoPerguntas.innerHTML += `
            <div class="pergunta-criacao" onclick="abrirPergunta(this)">
            <p>Pergunta ${i + 1}</p>
            <ion-icon name="mail"></ion-icon>
            </div>
            <div class="criar-perguntas invisivel">
                <h2 style="display: flex;" onclick="fecharPergunta(this)">Pergunta ${
                  i + 1
                }</h2>
                <input type="text" name="texto-da-pergunta" placeholder="Texto da pergunta">
                <input type="text" name="cor-da-pergunta" placeholder="Cor de fundo da pergunta">
                
                <div class="respostas-da-pergunta">
                    <h2>Resposta correta</h2>
                    <div class="resposta-correta">
                        <input type="text" name="resposta-correta" placeholder="Resposta correta">
                        <input type="url" name="url-resposta-correta" placeholder="Url da imagem">
                    </div>
                    <h2>Respostas incorretas</h2>
                    <div class="respostas-incorreta">
                        <div class="resposta-incorreta">
                            <input type="text" name="resposta1" placeholder="Resposta incorreta 1">
                            <input type="url" name="url-resposta1" placeholder="Url da imagem">
                        </div>
                        <div class="resposta-incorreta">
                            <input type="text" name="resposta2" placeholder="Resposta incorreta 2">
                            <input type="url" name="url-resposta2" placeholder="Url da imagem">
                        </div>
                        <div class="resposta-incorreta">
                            <input type="text" name="resposta3" placeholder="Resposta incorreta 3">
                            <input type="url" name="url-resposta3" placeholder="Url da imagem">
                        </div>
                    </div>
                </div>
            </div>
            `;
    }
  } else {
    alert("Por favor preencha os dados corretamente");
  }
}

function abrirPergunta(pergunta) {
  pergunta.classList.toggle("invisivel");
  pergunta.nextElementSibling.classList.toggle("invisivel");
}
function fecharPergunta(pergunta) {
  pergunta.parentNode.previousElementSibling.classList.remove("invisivel");
  pergunta.parentNode.classList.add("invisivel");
}

function criarNiveis(botao) {
  containerTela3.querySelector("h2").innerHTML = "Agora, decida os níveis";
  document.querySelector(".criacao-perguntas").classList.add("invisivel");
  botao.innerHTML = "Finalizar Quizz";
  botao.attributes.onclick.value = "criarQuizz()";
}
function isValidUrl(_string) {
  const matchpattern =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
  return matchpattern.test(_string);
}

function criarQuizz() {
  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes",
    quizzCriado
  );
  promise.catch(function () {
    alert("Dados inválidos");
  });
}

function voltarHome() {
  containerTela1.classList.remove("invisivel");

  if (containerTela2.classList.contains("invisivel") === false) {
    containerTela2.classList.add("invisivel");
  } else if (containerTela3.classList.contains("invisivel") === false) {
    containerTela3.classList.add("invisivel");
  }
}

function comparador() {
  return Math.random() - 0.5;
}
