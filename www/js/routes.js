var routes = [
    {
        path: '/',
        url: './pages/home.html',
        name: 'home',
        on: {
            pageAfterIn: function (event, page) {
                console.log("pageAfterIn - do something after page gets into the view");
                getTelefones();
            }
        }
    },
    {
        path: '/form/',
        name: '/form_fone/',
        async: function (routeTo, routeFrom, resolve, reject) {
            var add = "Adicionar telefone";
            var btn = "Salvar";
            var act = "inserir";
            if (routeTo.query.cod_fone) {
                add = "Editar telefone";
                btn = "Editar";
                act = "editar";
            }
            resolve({
                componentUrl: './pages/form.html'
            }, {context: {
                    titulo: add,
                    btn: btn,
                    url: "/",
                    back: "back",
                    action: act
                }});
        },
        on: {
            pageBeforeIn: function (event, page) {
                carregaElementosApp();
                if (page.route.query.cod_fone) {
                    editFormFone(page.route.query.cod_fone);
                }
            }
        }
    },
    {
        path: '/sobre/',
        componentUrl: './pages/sobre.html',
        name: 'sobre',
        options: {
            context: {
                versao: 'v1.0.1',
            },
        }
    },
    {
        path: '/politica/',
        componentUrl: './pages/politica.html',
        name: 'politica'
    },
    {
        path: '/termos/',
        componentUrl: './pages/termos.html',
        name: 'termos'
    },
    {
        path: '/manual/',
        componentUrl: './pages/manual.html',
        name: 'manual'
    }
];
