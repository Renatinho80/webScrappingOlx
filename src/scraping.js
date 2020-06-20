/**
 * Site Alvo: https://sp.olx.com.br/sao-paulo-e-regiao?q=notebooks%20Dell%20I7
 * Nome: Core i7
 * Valor R$: R$ 1.000
 * Divulgação: Publicado em 27/04 às 10:26
 * Código: cód. 730219598
 * Link: https://sp.olx.com.br/sao-paulo-e-regiao/computadores-e-acessorios/notebooks-dell-core-i7-5-geracao-730219598
 */

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const siteAlvo =
  "https://sp.olx.com.br/sao-paulo-e-regiao?q=dell";

const dados = [];

const dadosBrutos = async () => {
  try {
    const res = await axios.get(siteAlvo);
    return res.data;
  } catch (error) {
    console.log("Não foi possível extrair os DADOS BRUTOS!: " + error);
  }
};

const listaLinks = async () => {
  const html = await dadosBrutos();
  const $ = await cheerio.load(html);
  $('.OLXad-list-link').each((index, link) => {
    dados[index] = $(link).attr("href");
  });
  console.log(dados)
  
  return dados;
};

const coletaDados = async (pg) => {
  try {
    const res = await axios.get(pg);
    const html = res.data;
    const $ = await cheerio.load(html);

    let nomeProduto = $(
      "#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.jAHFXn > div.h3us20-5.heHIon > h1"
    ).text();
    let valor = $(
      "#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.cpscHx > div.h3us20-5.kXGTwk > div > div.sc-jTzLTM.sc-ksYbfQ.WCwBE > div.sc-jTzLTM.sc-ksYbfQ.sc-12l420o-0.chjgRM > h2"
    ).text();
    let publicacao = $(
      "#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.jAHFXn > div.h3us20-5.eeNNeS > div.h3us20-2.bdQAUC > div > span.sc-ifAKCX.sc-1oq8jzc-0.drrPdv"
    ).text();
    let codigo = $(
      "#content > div.sc-1d7g5sb-3.jyDaIy > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.sc-1ys3xot-0.h3us20-0.jAHFXn > div.h3us20-5.eeNNeS > div.h3us20-2.bdQAUC > div > span.sc-ifAKCX.sc-16iz3i7-0.fxfcRz"
    ).text();

    const resultado = `
      <h1>Produto: ${nomeProduto}</h1>
      <h3>Valor: ${valor}</h3>
      <h3>${publicacao}</h3>
      <h3>${codigo}</h3>
      <h3>Link: <a href="${pg}">Produto</a></h3>
      <br>
    `;

    gravaHTML(resultado);
  } catch (error) {
    console.log("Deu problema na extração de dados: " + error);
  }
};

const gravaHTML = async (result) => {
  fs.writeFileSync("./index.html", result, { flag: "a+" }, (err) => {
    if (err) console.log("Deu erro na geração do HTML: " + err);
  });
};

const apresentaDados = async () => {
  const todosLinks = await listaLinks();
  todosLinks.map((linksFilhos) => {
    coletaDados(linksFilhos);
  });
};

const main = async () => {
  await apresentaDados();
};

main();
