function getTelefones() {
    db.transaction(function (transaction) {
        transaction.executeSql("SELECT * FROM telefone ORDER BY nm_fone ASC", [], function (tx, results) {
            console.log(results);
            var li = "";
            if (results.rows.length > 0) {
                for (var i = 0; i < results.rows.length; i++) {
                    var img_fone = "018-bucket.png";
                    if (results.rows.item(i).img_fone)
                        img_fone = results.rows.item(i).img_fone;
                    li += '<li class="swipeout deleted-callback" id="' + results.rows.item(i).cod_fone + '">' +
                        '<div class="item-content swipeout-content">' +
                        '    <div class="item-media"><img src="./icons/' + img_fone + '" width="44"/></div>' +
                        '    <div class="item-inner">' +
                        '        <div class="item-title-row">' +
                        '            <div class="item-title text-color-teal" style="font-size:18px;font-weight: bold;">' + results.rows.item(i).nm_fone + '</div>' +
                        '            <div class="item-after"></div>' +
                        '        </div>' +
                        '        <div class="item-subtitle text-color-red" style="font-size:18px;">' + results.rows.item(i).nro_fone + '</div>' +
                        '        <div class="item-text">' + results.rows.item(i).desc_fone + '</div>' +
                        '    </div>' +
                        '    <div class="item-outer">' +
                        '        <button class="button button-big button-round button-raised color-theme-teal btn_call" value="' + results.rows.item(i).nro_fone + '"><i class="material-icons">phone_forwarded</i></button>' +
                        '    </div>' +
                        '</div>' +
                        '<div class="swipeout-actions-left">' +
                        '    <a href="#" class="swipeout-delete" data-confirm="Tem certeza que deseja excluir o telefone?" data-confirm-title="Excluir?"><i class="material-icons">delete</i></a>' +
                        '    <a href="#" class="color-blue swipeout-edit" cod="' + results.rows.item(i).cod_fone + '"><i class="material-icons">create</i></a>' +
                        '    <a href="#" class="color-orange swipeout-pinned" cod="' + results.rows.item(i).cod_fone + '"><i class="material-icons">mobile_screen_share</i></a>' +
                        '</div>' +
                        '</li>';
                }
                $("#lista_fone").html(li);
            }
        }, function (err) {
            console.log("BASE NAO CRIADA");
        });
    });
}

$(document).on("click", "#btn_reset", function (evt) {
    myapp.views.main.router.navigate("/", {
        ignoreCache: true,
        reloadAll: true,
        animate:true
    });
});

$(document).on("click", "#btn_insfone", function (e) {
    var acao = $(this).val();
    var data = myapp.form.convertToData("#frm_fone");
    image = data.img_fone;
    if (image == "./icons/padrao.png")
        data.img_fone = "padrao.png";
    else
        data.img_fone = image.replace("file:///android_asset/www/icons/", '');
    if (validaFone(data)) {
        if (acao == "editar") {
            editFone(data);
        } else {
            insFone(data);
        }
    }
});

function validaFone(data) {
    if (!data.nm_fone) {
        showDialogErroFocus("", "Informe o nome do contato!", "#frm_fone #nm_fone");
        return false;
    }
    if (!data.nro_fone) {
        showDialogErroFocus("", "Informe o número do telefone!", "#frm_fone #_nro_fone");
        return false;
    }
    return true;
}

function insFone(data) {
    db.transaction(function (transaction) {
        var executeQuery = "INSERT INTO telefone (nm_fone, nro_fone, desc_fone,img_fone) VALUES (?,?,?,?)";
        transaction.executeSql(executeQuery, [data.nm_fone, data.nro_fone, data.desc_fone, data.img_fone]
            , function (tx, result) {
                myapp.dialog.alert("Telefone adicionado com sucesso!", "", function () {
                    myapp.views.main.router.navigate("/", {
                        force: true,
                        ignoreCache: true,
                        reloadAll: true
                    });
                });
            },
            function (err) {
                alert("Error processing SQL: " + err.code + " - " + err.message);
                return false;
            });
    }, function (error) {
        console.log('transaction error: ' + error.message);
    }, function () {
        console.log('transaction ok');
    });
}

$(document).on("click", ".swipeout-edit", function (evt) {
    var cod_fone = $(this).attr("cod");
    myapp.views.main.router.navigate("/form/?cod_fone=" + cod_fone, {
        ignoreCache: true,
        reloadCurrent: true
    });
});

function editFormFone(cod_fone) {
    db.transaction(function (transaction) {
        var executeQuery = "SELECT * FROM telefone WHERE cod_fone = ?";
        transaction.executeSql(executeQuery, [cod_fone]
            , function (tx, result) {
                console.log(result);
                if (result.rows.length > 0) {
                    myapp.form.fillFromData("#frm_fone", result.rows.item(0));
                    $("#imagem_fone").attr('src', "./icons/" + result.rows.item(0).img_fone);
                    $("#btn_insfornecedor").val('editar');
                }
            }, function (err) {
            console.log("Error EDIT SQL: " + err + " - " + err.message);
            return false;
        });
    });
}
function editFone(data) {
    db.transaction(function (transaction) {
        var executeQuery = "UPDATE telefone SET nm_fone=?, nro_fone=?, desc_fone=?, img_fone=? WHERE cod_fone = ?";
        transaction.executeSql(executeQuery, [data.nm_fone, data.nro_fone, data.desc_fone, data.img_fone, data.cod_fone]
            , function (tx, result) {
                console.log(result);
                myapp.dialog.alert("Telefone editado com sucesso!", "", function () {
                    myapp.views.main.router.navigate("/", {
                        force: true,
                        ignoreCache: true,
                        reloadAll: true
                    });
                });
            }, function (err) {
            console.log("Error EDIT SQL: " + err + " - " + err.message);
            return false;
        });
    });
}

$(document).on('swipeout:deleted', '.deleted-callback', function () {
    console.log($(this).attr('id'));
    delFone($(this).attr('id'));
});

function delFone(cod_fone) {
    var db = window.openDatabase("../../../storage/extSdCard/TelefonesUteis/telefonesuteis", "1.0", "TelefonesUteis", 1000000);
    db.transaction(function (transaction) {
        var executeQuery = "DELETE FROM telefone WHERE cod_fone = ?";
        transaction.executeSql(executeQuery, [cod_fone]
            , function (tx, result) {
                //myapp.dialog.alert('Telefone excluído com sucesso!', '', null);
            },
            function (err) {

            });
    });

}

$(document).on("click", ".btn_call", function () {
    var nro = $(this).val();
    ligar(nro);
});

function ligar(nro) {
    window.plugins.CallNumber.callNumber(function (res) {
        console.log("Ligacao completada" + res);
    }, function (res) {
        console.log("Ligacao nao completada" + res);
    }, nro);
}

function showDialogErroFocus(titulo, msg, foco) {
    myapp.dialog.alert(msg, titulo, function () {
        if (foco)
            $(foco).focus();
    });
}

$(document).on("click", ".swipeout-pinned", function (evt) {
    var data = {};
    data.cod_fone = $(this).attr("cod");
    data.src = $(this).closest('li').find('img').attr("src");
    data.title = $(this).closest('li').find('.item-title').html();
    data.nro_fone = $(this).closest('li').find('.item-subtitle').html();
    myapp.dialog.confirm("Deseja criar um atalho na tela inicial com este número?", "Atalho",
        function () {
            preparaBase64(data);
            myapp.dialog.close();
        },
        function () {
            myapp.dialog.close();
        });
});

function createShortcut(data) {
    var shortcuts = {
        id: data.cod_fone,
        shortLabel: data.title,
        longLabel: 'Longer string describing the shortcut',
        iconBitmap: data.base64,
        intent: {
            action: 'android.intent.action.CALL_NUMBER',
            categories: [
                'android.intent.category.CALL', // Built-in Android category
                'MY_CATEGORY' // Custom categories are also supported
            ],
            flags: 'FLAG_ACTIVITY_CLEAR_TOP',
            data: 'myapp://telefones_uteis/index.html?param=value', // Must be a well-formed URI
            extras: {
                'android.intent.extra.SUBJECT': 'Hello world!', // Built-in Android extra (string)
                'nro_fone': data.nro_fone, // Custom extras are also supported (boolean, number and string only)
            }
        }
    };
    window.plugins.Shortcuts.addPinned(shortcuts, function () {
        myapp.dialog.alert('Atalho criado com sucesso!', '', null);
    }, function (error) {
        myapp.dialog.alert('Erro: ' + error);
    });
}
function preparaBase64(data) {
    var storage = window.localStorage;
    readImage(data.src, function (base64) {
        storage.setItem("base64", base64);
        data.base64 = base64;
        createShortcut(data);
    });
}

function readImage(url, callback) {
    var request = new XMLHttpRequest();
    request.onload = function () {
        var file = new FileReader();
        file.onloadend = function () {
            callback(file.result.split(',')[1]);
        }
        file.readAsDataURL(request.response);
    };
    request.open('GET', url);
    request.responseType = 'blob';
    request.send();
}
function getIntent() {
    window.plugins.Shortcuts.getIntent(function (intent) {
        var stringify = JSON.stringify(intent);
        var json = JSON.parse(stringify);
        var categories = json.categories;
        var extras = json.extras;
        if (json.action == 'android.intent.action.CALL_NUMBER') {
            console.log("ENTRANDO INTENT ATALHO");
            ligar(extras['br.com.telefones_uteis.nro_fone']);
        }
    });
}

$(document).on("click", "#btn_icon", function () {
    myapp.popup.open("#popup-icons");
});

function carregaElementosApp() {
    var progress = 0;
    var dialog = myapp.dialog.progress('Carregando ícones', progress);
    window.resolveLocalFileSystemURL("file:///android_asset/www/icons",
        function (fileSystem) {
            var reader = fileSystem.createReader();
            reader.readEntries(
                function (entries) {
                    dialog.setText('Carregando 1 de ' + entries.length);
                    console.log("ELEMENTOS");
                    for (var i = 0; i < entries.length; i++) {
                        entries[i].file(function (file) {
                            $("#popup-icons #icons-list").append('<div class="img-icons elevation-1"><img class="img-select" src="./icons/' + file.name + '"></div>');
                            progress += 1;
                            dialog.setProgress(progress);
                            dialog.setText('Carregando ' + ((progress)) + ' de ' + entries.length);
                            console.log('Carregando ' + ((progress)) + ' de ' + entries.length);
                            if (progress === entries.length) {
                                dialog.close();
                            }
                        });
                    }
                },
                function (err) {
                    console.log(err);
                }
            );
        },
        function (err) {
            console.log(err);
        }
    );
}

$(document).on("click", ".img-select", function (e) {
    var img = new Image();
    img.src = $(this).attr("src");
    img.onload = function () {
        $("#imagem_fone").attr("src", img.src);
        $("#img_fone").val(img.src);
        myapp.popup.close();
    };
});
$(document).on("click", "#del_icon", function (e) {
    myapp.dialog.confirm("Deseja voltar ao padrão?", "Padrão",
        function () {
            var img = new Image();
            img.src = "./icons/padrao.png";
            img.onload = function () {
                $("#imagem_fone").attr("src", "./icons/padrao.png");
                $("#img_fone").val("./icons/padrao.png");
                myapp.dialog.close();
            };
        },
        function () {
            myapp.dialog.close();
        });
});