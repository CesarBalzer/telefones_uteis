# Telefones Úteis

<p align="center">
  <img src="http://kdsistemasweb.com.br/telefonesuteis/img/logo.png" alt="Logo" width="200px" height="200px;"/>
</p>

## Telefones Úteis Emergência V1.0.0

O aplicativo é uma ferramenta para acesso rápido aos serviços de emergência e outros números de utilidade pública, números particulares e outros que desejar.

Crie atalhos dos números em sua tela inicial para agilizar chamadas de emergência por exemplo, ou de qualquer outro número.

## Aplicativo Híbrido desenvolvido para Android

    ** Não testado e nem disponível para IOS

## Tecnologias de código aberto utilizadas:


### Apache Cordova
- [Site Oficial Apache Cordova](https://cordova.apache.org)

- [Documentação Oficial Apache Cordova](https://cordova.apache.org/docs/en/latest/)


### Framework7
- [Site Oficial Framework7 v.4.0.0](http://framework7.io)

- [Documentação Oficial Framework7 v.4.0.0](http://framework7.io/docs)


### Plugin Call Number

- Desenvolvido por [Rofosho](https://github.com/Rohfosho/CordovaCallNumberPlugin.git)


### Código aberto à comunidade dev Cordova no telegram

- [Link para o grupo no Telegram](https://t.me/devcordova)

## Banco de dados

 Utilizando [WebSQL](https://www.w3.org/TR/webdatabase/), mas não tem uma ampla compatibilidade com navegadores.

 Para detalhes de como utilizar o WebSQL com Apache Cordova, acesse a documentação oficial no link abaixo:

- [Documentação Apache Cordova WebSQL](https://cordova.apache.org/docs/en/latest/cordova/storage/storage.html#websql)


## Instalação para desenvolvedores

 Clone o repositório em seu ambiente de desenvolvimento ou faça um fork para contribuir com melhorias no projeto.

    git clone https://github.com/CesarBalzer/telefones_uteis

 Para saber mais sobre a criação de aplicativos utilizando Apache Cordova acesse o site oficial da documentação:

- [Criando seu primeiro aplicativo com Cordova](https://cordova.apache.org/docs/en/latest/guide/cli/index.html)

### Adicione a plataforma Android

    cordova platform add android
    
### Execute o código

 Para construir

    cordova build android

 Ou para rodar no dispositivo*

    cordova run android --device

 *No meu caso já estava configurado para utilizar a flag --device

## Instalação para usuários em dispositivos

  Faça o download do aplicativo, é de livre uso, sem propagandas e totalmente gratuito.

- [Baixar aplicativo na Google Play](https://play.google.com/store/apps/details?id=br.com.telefones_uteis)

## Instruções de uso

- [ Listagem de números](#listagem-de-números)

- [ Realizando ligações](#realizando-ligações)

- [ Inserir um novo número](#inserir-um-novo-número)

- [ Pesquisa rápida](#pesquisa-rápida)

- [ Ações do item](#ações-do-item)


### Listagem de números

 A listagem dos números de emergência e outros serviços públicos estão sendo apresentadas na tela inicial do aplicativo


### Realizando ligações

 Para realizar uma ligação para quaisquer um dos números da listagem, basta clicar no ícone do "telefone com a setinha" como mostrado na imagem abaixo:

![como-ligar](http://kdsistemasweb.com.br/telefonesuteis/img/como_ligar.png)

### Inserir um novo número

 Para inserir um novo número clique na barra de menus em cima no ícone " + " mostrado na imagem abaixo:

![adicionar](http://kdsistemasweb.com.br/telefonesuteis/img/adicionar.png)

 A tela para o cadastro será mostrada com o formulário que deve ser preenchido corretamente os campos obrigatórios marcados com ( * ), em seguida clique em "Salvar".

![como-ligar](http://kdsistemasweb.com.br/telefonesuteis/img/cadastro.png)

### Pesquisa rápida

 Para pesquisar rapidamente um número, clique no ícone da "lupa" como mostrado na imagem abaixo:

![pesquisar](http://kdsistemasweb.com.br/telefonesuteis/img/pesquisar.png)

 O campo de pesquisa será aberto, comece digitando alguma letra para buscar na listagem como mostrado na imagem abaixo:

![busca](http://kdsistemasweb.com.br/telefonesuteis/img/busca.png)

### Ações do item

 Sobre o item da lista, deslize seu dedo em direção à direita, irá aparecer três ícones contendo as seguintes opções:

 [Excluir](#excluir), [Editar](#editar) e [Atalho](#atalho).

![acao](http://kdsistemasweb.com.br/telefonesuteis/img/acao_gif.gif)


### Excluir

  Para excluir um número clique sobre o ícone da "lixeira" com fundo em vermelho.

![excluir](http://kdsistemasweb.com.br/telefonesuteis/img/excluir.png)

    * Uma confirmação será solicitada para completar a exclusão do item.

### Editar

 Para editar o número clique sobre o ícone do "lápis" com fundo azul, após isso, a tela com o formulário será aberta, altere as informações de acordo e clique em "Editar"

![editar](http://kdsistemasweb.com.br/telefonesuteis/img/editar.png)

### Atalho 

 Para adicionar um atalho à tela inicial do seu dispositivo clique sobre o ícone do "dispositivo com a flecha indicadora" com fundo em laranja, como mostrado da imagem abaixo:

![atalho](http://kdsistemasweb.com.br/telefonesuteis/img/atalho.png)

    * Uma confirmação será solicitada para completar a criação do atalho.

## Licensa MIT

The MIT License (MIT). Leia o arquivo [LICENSE](LICENSE).
