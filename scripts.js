let listaQuizzes = [];
let posicaoNoArray;
let listaPerguntasQuizz = [];
let numeroDaPergunta;
let numeroDeAcertos = 0;
let numeroPerguntasRespondidas = 0;
let porcentagemDeAcerto;
let niveisQuizz = [];
let quizzSelecionado;
let verificarRespostas;
let verificarPerguntas;
let verificarCor;
let verificarPorcentagem = 0;
let verificarNiveis;
let urlImagem;
const criacaoPerguntas = document.querySelector(".criacao-perguntas");
const criacaoNiveis = document.querySelector(".criacao-niveis");
const criacaoQuizzFinalizado = document.querySelector(".quizz-finalizado");
let tituloQuizz;

let idsUsuario = [];

carregarIdsUsuario();
if (idsUsuario.length >= 1) {
  quizzesDoUsuario();
}

let questoesQuizz;
const containerQuizzes = document.querySelector(".quizz-boxes");
const containerTela1 = document.querySelector(".container");
const containerTela2 = document.querySelector(".container-tela-2");
const containerTela3 = document.querySelector(".container.tela-3");
let quizzCriado = {
  title: "",
  image: "",
  questions: [],
  levels: [],
};
let numeroQuestoesQuizz;
let numeroNiveisQuizz;

let numeroDePerguntas;
let numeroDeNiveis;

function pegarQuizzes() {
  const promise = axios.get(
    "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes"
  );
  promise.then(renderizarQuizzes);
}

pegarQuizzes();

// if (idsUsuario.length !== 0) {
//   quizzesDoUsuario();
// }

function retirarQuizzRepetido() {
  for (let i = 0; i < idsUsuario.length; i++) {
    let idQuizzRepetido = idsUsuario[i];
    let elementoRepetido = document
      .querySelector(".todos-os-quizzes")
      .querySelector(`.quizz-box[data-id-do-quizz='${idQuizzRepetido}']`);
    if (elementoRepetido !== null) {
      elementoRepetido.classList.add("invisivel");
    }
  }
}

function renderizarQuizzes(resposta) {
  listaQuizzes = resposta.data;
  containerQuizzes.innerHTML = "";
  povoarDomQuizzes();
}

function povoarDomQuizzes() {
  for (let i = 0; i < listaQuizzes.length; i++) {
    let quizz = listaQuizzes[i];
    containerQuizzes.innerHTML += `
        <div id="${i}" class="quizz-box" onclick="selecionarQuizz(this)" data-id-do-quizz="${quizz.id}">

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
  retirarQuizzRepetido();
}

function quizzesDoUsuario() {
  let seusQuizzes = document.querySelector(".quizzes-do-usuario");
  const naoCriouQuizz = document.querySelector(".nao-criou-quizz");
  const seusQuizzesH2 = document.querySelector(".criar-quizz h2");
  seusQuizzes.innerHTML = "";

  for (let i = 0; i < idsUsuario.length; i++) {
    let promise = axios.get(
      `https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${idsUsuario[i]}`
    );
    promise.then(function (resposta) {
      let quizz = resposta.data;
      seusQuizzesH2.classList.remove("invisivel");
      seusQuizzes.classList.remove("invisivel");
      naoCriouQuizz.classList.add("invisivel");
      seusQuizzes.innerHTML += `
    <div class="quizz-box" onclick="selecionarQuizzUsuario(this)" data-id-do-quizz="${quizz.id}">

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
    });
  }
}

function selecionarQuizzUsuario(elemento) {
  let idDoQuizz = elemento.getAttribute("data-id-do-quizz");
  const promessa = axios.get(
    `https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${idDoQuizz}`
  );

  promessa.then(function (response) {
    quizzSelecionado = response.data;

    urlImagem = quizzSelecionado.image;

    tituloQuizz = quizzSelecionado.title;

    questoesQuizz = quizzSelecionado.questions;

    niveisQuizz = quizzSelecionado.levels;

    //Atualizando o DOM e renderizando a página//
    atualizarTela2(urlImagem, tituloQuizz, questoesQuizz, niveisQuizz);

    visualizarTela2();

    console.log(questoesQuizz[0].answers);
    listaPerguntasQuizz = questoesQuizz;
  });
}

function selecionarQuizz(elemento) {
  //Definindo variáveis do quizz que serão usadas ao renderizar a tela 2//
  posicaoNoArray = Number(elemento.id);

  quizzSelecionado = listaQuizzes[posicaoNoArray];

  urlImagem = quizzSelecionado.image;

  tituloQuizz = quizzSelecionado.title;

  questoesQuizz = quizzSelecionado.questions;

  niveisQuizz = quizzSelecionado.levels;

  //Atualizando o DOM e renderizando a página//
  atualizarTela2(urlImagem, tituloQuizz, questoesQuizz, niveisQuizz);

  visualizarTela2();

  console.log(questoesQuizz[0].answers);
  listaPerguntasQuizz = questoesQuizz;
}

function verificarCorreta(elemento) {
  numeroPerguntasRespondidas++;
  const conjuntoRespostas = elemento.parentNode.parentNode;
  numeroDaPergunta = Number(
    conjuntoRespostas.classList[1].replace("numero", "")
  );
  console.log(numeroDaPergunta);
  conjuntoRespostas
    .querySelectorAll(".resposta")
    .forEach(esbranquicarRespostas);
  elemento.classList.remove("outras-respostas");
  if (elemento.classList.contains("resposta-certa")) {
    numeroDeAcertos++;
  }
  if (numeroPerguntasRespondidas === listaPerguntasQuizz.length) {
    porcentagemDeAcerto = Math.round(
      (numeroDeAcertos / numeroPerguntasRespondidas) * 100
    );
    nivelAtingido(niveisQuizz);
  }
  setTimeout(rolarParaPerguntaSeguinte, 2000);
}

function rolarParaPerguntaSeguinte() {
  if (numeroDaPergunta !== listaPerguntasQuizz.length - 1) {
    document.querySelector(`.numero${numeroDaPergunta + 1}`).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "center",
    });
  } else if (numeroPerguntasRespondidas === listaPerguntasQuizz.length) {
    document.querySelector(".pergunta.nivel").scrollIntoView({
      behavior: "smooth",
      block: "center",
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
  containerTela3.classList.add("invisivel");

  containerTela1.classList.add("invisivel");

  containerTela2.classList.remove("invisivel");

  document.querySelector(".imagem-titulo").scrollIntoView(false);

  numeroDeAcertos = 0;
  numeroPerguntasRespondidas = 0;
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

function nivelAtingido(niveis) {
  let aux;
  for (let i = 0; i < niveis.length; i++) {
    for (let j = i + 1; j < niveis.length; j++) {
      if (niveis[i].minValue < niveis[j].minValue) {
        aux = niveis[i];
        niveis[i] = niveis[j];
        niveis[j] = aux;
      }
    }
  }
  console.log(niveis);
  for (let k = 0; k < niveis.length; k++) {
    let nivel = niveis[k];
    if (porcentagemDeAcerto >= nivel.minValue) {
      containerTela2.innerHTML += `
      <div class="pergunta nivel">
        <div class="titulo-nivel">
          <h3>${porcentagemDeAcerto}% de acerto: ${nivel.title}</h3>
        </div>
        <div class="conteudo-nivel">
          <div class="imagem-nivel">
            <img
              src="${nivel.image}"
              alt=""
            />
          </div>
          <div class="texto-nivel">
            <span
              >${nivel.text}</span
            >
          </div>
        </div>
      </div>
      <div class="botoes-final-quizz">
        <button class="reiniciar-quizz" onclick="reiniciarQuizz()">
          Reiniciar Quizz
        </button>
        <div class="voltar-home" onclick="voltarHome()">Voltar pra home</div>
      </div>
      `;
      return;
    }
  }
}

function reiniciarQuizz() {
  atualizarTela2(urlImagem, tituloQuizz, questoesQuizz, niveisQuizz);
  visualizarTela2();
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

  criacaoPerguntas.innerHTML = "";

  quizzCriado.title = tituloQuizzCriado;
  quizzCriado.image = urlQuizzCriado;
  numeroDePerguntas = perguntasQuizzCriado;
  numeroDeNiveis = niveisQuizzCriado;
  console.log(perguntasQuizzCriado);
  if (
    quizzCriado.title.length >= 20 &&
    quizzCriado.title.length <= 65 &&
    numeroDePerguntas >= 3 &&
    numeroDeNiveis >= 2 &&
    isValidUrl(quizzCriado.image)
  ) {
    containerTela3.querySelector("h2").innerHTML = "Crie suas perguntas";
    botao.innerHTML = "Prosseguir para criar níveis";
    botao.attributes.onclick.value = "criarNiveis(this)";
    document.querySelector(".form-criacao").classList.add("invisivel");
    document.querySelector(".criacao-perguntas").classList.remove("invisivel");

    criacaoPerguntas.innerHTML += `<div class="criar-perguntas">
              <h2 style="display: flex;" onclick="fecharPergunta(this)">Pergunta 1</h2>
              <input type="text" name="texto-da-pergunta" placeholder="Texto da pergunta">
              <input type="text" name="cor-da-pergunta" placeholder="Cor de fundo da pergunta" maxlength="7">
              
              <div class="respostas-da-pergunta">
                  <h2>Resposta correta</h2>
                  <div class="resposta-correta">
                      <input type="text" name="resposta-correta" placeholder="Resposta correta">
                      <input type="url" name="url-resposta-correta" placeholder="Url da imagem">
                  </div>
                  <h2>Respostas incorretas</h2>
                  <div class="respostas-incorretas">
                      <div class="resposta-incorreta">
                          <input type="text" name="resposta-incorreta" placeholder="Resposta incorreta 1">
                          <input type="url" name="url-resposta-incorreta" placeholder="Url da imagem">
                      </div>
                      <div class="resposta-incorreta">
                          <input type="text" name="resposta-incorreta" placeholder="Resposta incorreta 2">
                          <input type="url" name="url-resposta-incorreta" placeholder="Url da imagem">
                      </div>
                      <div class="resposta-incorreta">
                          <input type="text" name="resposta-incorreta" placeholder="Resposta incorreta 3">
                          <input type="url" name="url-resposta-incorreta" placeholder="Url da imagem">
                      </div>
                  </div>
              </div>
          </div>
          `;
    for (let i = 0; i < perguntasQuizzCriado - 1; i++) {
      criacaoPerguntas.innerHTML += `
            <div class="pergunta-criacao" onclick="abrirPergunta(this)">
              <p>Pergunta ${i + 2}</p>
              <ion-icon name="mail"></ion-icon>
            </div>
            <div class="criar-perguntas invisivel">
                <h2 style="display: flex;" onclick="fecharPergunta(this)">Pergunta ${
                  i + 2
                }</h2>
                <input type="text" name="texto-da-pergunta" placeholder="Texto da pergunta">
                <input type="text" name="cor-da-pergunta" placeholder="Cor de fundo da pergunta" maxlength="7">
                
                <div class="respostas-da-pergunta">
                    <h2>Resposta correta</h2>
                    <div class="resposta-correta">
                        <input type="text" name="resposta-correta" placeholder="Resposta correta">
                        <input type="url" name="url-resposta-correta" placeholder="Url da imagem">
                    </div>
                    <h2>Respostas incorretas</h2>
                    <div class="respostas-incorretas">
                        <div class="resposta-incorreta">
                            <input type="text" name="resposta-incorreta" placeholder="Resposta incorreta 1">
                            <input type="url" name="url-resposta-incorreta" placeholder="Url da imagem">
                        </div>
                        <div class="resposta-incorreta">
                            <input type="text" name="resposta-incorreta" placeholder="Resposta incorreta 2">
                            <input type="url" name="url-resposta-incorreta" placeholder="Url da imagem">
                        </div>
                        <div class="resposta-incorreta">
                            <input type="text" name="resposta-incorreta" placeholder="Resposta incorreta 3">
                            <input type="url" name="url-resposta-incorreta" placeholder="Url da imagem">
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

function coletarInfoPerguntas(i) {
  const perguntasTexto = document.querySelectorAll(
    "input[name='texto-da-pergunta']"
  )[i].value;
  if (perguntasTexto.length >= 20) {
    verificarPerguntas = true;
    return perguntasTexto;
  } else {
    alert(`Dados inválidos para Pergunta ${i + 1}`);
    verificarPerguntas = false;
  }
}
function coletarInfoCor(i) {
  const cor = document.querySelectorAll("input[name='cor-da-pergunta']")[i]
    .value;
  if (isValidColor(cor)) {
    verificarCor = true;
    return cor;
  } else {
    alert("Dados inválidos para cor da pergunta " + (i + 1));
    verificarCor = false;
  }
}
function coletarInfoRespostasCorretas(i) {
  const answers = [];

  for (let i = 0; i < numeroDePerguntas; i++) {
    const answer = {};
    answer.text = document.querySelectorAll("input[name='resposta-correta']")[
      i
    ].value;
    answer.image = document.querySelectorAll(
      "input[name='url-resposta-correta']"
    )[i].value;
    answer.isCorrectAnswer = true;
    answers.push(answer);
  }
  return answers[i];
}
function pegarRespostas(i) {
  const answers = [];

  let criarPerguntasNl = document.querySelectorAll(".criar-perguntas");
  let respostaCorreta = criarPerguntasNl[i].querySelector(
    "input[name='resposta-correta']"
  );
  let urlCorreta = criarPerguntasNl[i].querySelector(
    "input[name='url-resposta-correta']"
  );
  let respostasIncorretas = criarPerguntasNl[i].querySelectorAll(
    "input[name='resposta-incorreta']"
  );
  let urlsIncorretas = criarPerguntasNl[i].querySelectorAll(
    "input[name='url-resposta-incorreta']"
  );
  quizzCriado.questions.answers;

  if (
    respostaCorreta.value !== "" &&
    urlCorreta.value !== "" &&
    isValidUrl(urlCorreta.value)
  ) {
    const rightAnswer = {};
    rightAnswer.text = respostaCorreta.value;
    rightAnswer.image = urlCorreta.value;
    rightAnswer.isCorrectAnswer = true;
    answers.push(rightAnswer);
  } else {
    alert("Dados inválidos em resposta correta da pergunta " + (i + 1));
    verificarRespostas = false;
  }
  let contadorDeRespostas = 0;

  for (let index = 0; index < respostasIncorretas.length; index++) {
    if (
      respostasIncorretas[index].value !== "" &&
      urlsIncorretas[index].value !== "" &&
      isValidUrl(urlsIncorretas[index].value)
    ) {
      const answer = {};
      answer.text = respostasIncorretas[index].value;
      answer.image = urlsIncorretas[index].value;
      answer.isCorrectAnswer = false;
      answers.push(answer);
    }
    if (
      respostasIncorretas[index].value !== "" ||
      urlsIncorretas[index].value !== ""
    ) {
      contadorDeRespostas++;
    }

    if (contadorDeRespostas === 0) {
      alert("Dados inválidos em Respostas Incorretas da pergunta " + (i + 1));
      verificarRespostas = false;
      return;
    }

    for (let k = 0; k < contadorDeRespostas; k++) {
      if (
        !isValidUrl(urlsIncorretas[k].value) ||
        respostasIncorretas[k].value === ""
      ) {
        alert("Dados inválidos em Respostas Incorretasda pergunta " + (i + 1));
        verificarRespostas = false;
        return;
      } else {
        verificarRespostas = true;
      }
    }
  }

  quizzCriado.questions.answers = answers;
  return answers;
}
function pegarNiveis(i) {
  const niveisNodeList = document.querySelectorAll(".criar-nivel");
  const tituloNivel = niveisNodeList[i].querySelector(
    "input[name='titulo-nivel']"
  ).value;
  const porcentagemNivel = niveisNodeList[i].querySelector(
    "input[name='porcentagem-nivel']"
  ).value;
  const imagemNivel = niveisNodeList[i].querySelector(
    "input[name='url-nivel']"
  ).value;
  const descricaoNivel = niveisNodeList[i].querySelector(
    "input[name='descricao-nivel']"
  ).value;

  const level = {};

  for (let index = 0; index < niveisNodeList.length; index++) {
    let checarPorcentagem = niveisNodeList[index].querySelector(
      "input[name='porcentagem-nivel']"
    ).value;
    if (checarPorcentagem === "0") {
      verificarPorcentagem++;
    }
  }

  if (
    tituloNivel.length >= 10 &&
    porcentagemNivel >= 0 &&
    porcentagemNivel <= 100 &&
    isValidUrl(imagemNivel) &&
    descricaoNivel.length >= 30 &&
    verificarPorcentagem >= 1
  ) {
    level.title = tituloNivel;
    level.image = imagemNivel;
    level.text = descricaoNivel;
    level.minValue = Number.parseInt(porcentagemNivel);

    quizzCriado.levels.push(level);
    verificarNiveis = true;
    verificarPorcentagem = 0;
  } else {
    alert("dados inválidos, por favor preencha novamente");
    verificarNiveis = false;
  }
}

function criarNiveis(botao) {
  let quizzNiveis = containerTela3.querySelector(".criacao-niveis");
  const questions = [];
  for (let index = 0; index < numeroDePerguntas; index++) {
    const question = {};
    question.title = coletarInfoPerguntas(index);
    question.color = coletarInfoCor(index);
    question.answers = pegarRespostas(index);
    questions.push(question);
    if (
      verificarPerguntas === false ||
      verificarCor === false ||
      verificarRespostas === false
    ) {
      return;
    }
  }
  if (
    verificarRespostas === true &&
    verificarPerguntas === true &&
    verificarCor === true
  ) {
    criacaoNiveis.innerHTML = "";
    quizzCriado.questions = questions;
    containerTela3.querySelector("h2").innerHTML = "Agora, decida os níveis";
    quizzNiveis.classList.remove("invisivel");
    criacaoPerguntas.classList.add("invisivel");
    criacaoNiveis.classList.remove("invisivel");
    botao.innerHTML = "Finalizar Quizz";
    botao.attributes.onclick.value = "criarQuizz(this)";

    criacaoNiveis.innerHTML += `<div class="criar-nivel">
    <h2>Nível 1</h2>
    <input
      type="text"
      name="titulo-nivel"
      placeholder="Título do nível"
    />
    <input
      type="text"
      name="porcentagem-nivel"
      placeholder="% de acerto mínima"
    />
    <input
      type="text"
      name="url-nivel"
      placeholder="URL da imagem do nível"
    />
    <input
      type="text"
      name="descricao-nivel"
      placeholder="Descrição do nível"
    />
  </div>`;

    for (let i = 0; i < numeroDeNiveis - 1; i++) {
      criacaoNiveis.innerHTML += `<div class="criar-nivel">
      <h2>Nível ${i + 2}</h2>
      <input
        type="text"
        name="titulo-nivel"
        placeholder="Título do nível"
      />
      <input
        type="text"
        name="porcentagem-nivel"
        placeholder="% de acerto mínima"
      />
      <input
        type="text"
        name="url-nivel"
        placeholder="URL da imagem do nível"
      />
      <input
        type="text"
        name="descricao-nivel"
        placeholder="Descrição do nível"
      />
    </div>`;
    }
  }
}

function criarQuizz(botao) {
  quizzCriado.levels = [];
  for (let i = 0; i < numeroDeNiveis; i++) {
    pegarNiveis(i);
  }
  console.log(quizzCriado);
  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes",
    quizzCriado
  );
  promise.then(function () {
    containerTela3.querySelector("h2").innerHTML = "Seu quizz está pronto!";
    criacaoNiveis.classList.add("invisivel");
    criacaoQuizzFinalizado.classList.remove("invisivel");
    criacaoQuizzFinalizado.innerHTML = `<div class="quizz-finalizado">
    <div class="quizz-box" data-id-do-quizz="" onclick="acessarQuizz()">
      <div class="linear-gradient"></div>

      <div class="quizz-imagem">
        <img
          src="${quizzCriado.image}"
          style="width: 500px; height: 266px; object-fit: fill"
        />
      </div>

      <div class="quizz-titulo">
        <p>${quizzCriado.title}</p>
      </div>
    </div>
  </div>`;
    botao.innerHTML = "Acessar quizz";
    botao.attributes.onclick.value = "acessarQuizz()";
  });

  promise.then(function (resposta) {
    idsUsuario.push(resposta.data.id);
    let idsSerializados = JSON.stringify(idsUsuario);
    localStorage.setItem("ids", idsSerializados);
  });

  promise.catch(function () {
    alert("Falha ao enviar o quizz fornecido");
  });
}

function acessarQuizz() {
  quizzSelecionado = quizzCriado;

  urlImagem = quizzSelecionado.image;

  tituloQuizz = quizzSelecionado.title;

  questoesQuizz = quizzSelecionado.questions;

  niveisQuizz = quizzSelecionado.levels;

  //Atualizando o DOM e renderizando a página//
  atualizarTela2(urlImagem, tituloQuizz, questoesQuizz, niveisQuizz);

  visualizarTela2();

  console.log(questoesQuizz[0].answers);
  listaPerguntasQuizz = questoesQuizz;
}

function abrirPergunta(pergunta) {
  pergunta.classList.toggle("invisivel");
  pergunta.nextElementSibling.classList.toggle("invisivel");
}
function fecharPergunta(pergunta) {
  pergunta.parentNode.previousElementSibling.classList.remove("invisivel");
  pergunta.parentNode.classList.add("invisivel");
}

function isValidUrl(_string) {
  const matchpattern =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm;
  return matchpattern.test(_string);
}

function isValidColor(string) {
  const hexColor = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
  return hexColor.test(string);
}

function voltarHome() {
  window.location.reload();
}

function carregarIdsUsuario() {
  if (localStorage.getItem("ids") !== null) {
    idsUsuario = JSON.parse(localStorage.getItem("ids"));
  }
}

function comparador() {
  return Math.random() - 0.5;
}
