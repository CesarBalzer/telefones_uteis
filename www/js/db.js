let db = window.openDatabase("../../../storage/extSdCard/TelefonesUteis/telefonesuteis", "1.0", "TelefonesUteis", 1000000);;
/**
 * Verifica se ja existe um banco de dados criado
 */
function verConfig() {
    return (() => {
        let resolve;
        let reject;
        let p = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        db.transaction(function (transaction) {
            transaction.executeSql("select * from config", [], function (tx, results) {
                console.log(results);
                if (results.rows.length > 0) {
                    resolve(results.rows.item(0));
                }
            }, function (err) {
                console.log("BASE INEXISTENTE: " + err.code + " - " + err.message);
                reject;
                initDB();
            });
        });
        return {
            promise: p,
            reject,
            resolve
        };
    })();
}
/**
 * Iniciar um novo banco
 */
function initDB() {
    var db = window.openDatabase("../../../storage/extSdCard/TelefonesUteis/telefonesuteis", "1.0", "TelefonesUteis", 1000000);
    db.transaction(createBase, errorBase, successBase);
}
/**
 * Criacao das tabelas
 * @param {type} tx transaction
 */
function createBase(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS config(cod_config INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,configdb TEXT)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS telefone(cod_fone INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,nm_fone TEXT,nro_fone TEXT, desc_fone TEXT,img_fone TEXT)');
    populateUtil(tx);
}

/**
 * Funcao de sucesso para a criacao das tabelas
 * @param {type} tx
 */
function successBase(tx) {
    console.log("BASE CRIADA");
    updConfig();
}
/**
 * Funcao de erro para a criacao das tabelas
 * @param {type} err
 */
function errorBase(err) {
    console.log("ERRO BASE NAO CRIADA");
    console.log(err.code);
    console.log(err.message);
    myapp.dialog.alert("Não foi possível finalizar a configuração inicial.", "Atenção", null);
}
/**
 * Popula as tabelas criadas com os numeros padrao
 * @param {type} tx
 */
function populateUtil(tx) {
    tx.executeSql("INSERT INTO telefone (cod_fone,nm_fone,nro_fone,desc_fone,img_fone) VALUES (1,'Bombeiros','193','Corpo de bombeiros - SIATE/SAMU','015-fire-truck.png')");
    tx.executeSql("INSERT INTO telefone (cod_fone,nm_fone,nro_fone,desc_fone,img_fone) VALUES (2,'Ambulância','192','Corpo de bombeiros - Ambulância','040-ambulance.png')");
    tx.executeSql("INSERT INTO telefone (cod_fone,nm_fone,nro_fone,desc_fone,img_fone) VALUES (3,'Polícia Militar','190','Serviço de emergência  da Polícia Militar que atende aos cidadãos em casos de riscos e ameaças contra a vida','016-police-badge.png')");
    tx.executeSql("INSERT INTO telefone (cod_fone,nm_fone,nro_fone,desc_fone,img_fone) VALUES (4,'Defesa Civil','199','A Defesa Civil é responsável em precaver, socorrer, assistir e ajudar na recuperação da população em caso de desastres, sejam chuvas ou outras situações de risco','defesa_civil.png')");
    tx.executeSql("INSERT INTO telefone (cod_fone,nm_fone,nro_fone,desc_fone,img_fone) VALUES (5,'Polícia Rodoviária Estadual','198','Atende a sociedade em casos de ocorrências em rodovias estaduais como pedidos de socorro e reclamações','016-police-badge.png')");
    tx.executeSql("INSERT INTO telefone (cod_fone,nm_fone,nro_fone,desc_fone,img_fone) VALUES (6,'Polícia Rodoviária Federal','191','As atribuições da Polícia Rodoviária Federal são definidas pelo Código de Trânsito Brasileiro (polícia de trânsito). Fiscaliza diariamente rodovias e estradas federais para exercício do direito de locomoção de veículos','prf.png')");
    tx.executeSql("INSERT INTO telefone (cod_fone,nm_fone,nro_fone,desc_fone,img_fone) VALUES (7,'Narcodenúncia','181','Narcodenúncia','039-gas-mask.png')");
    tx.executeSql("INSERT INTO telefone (cod_fone,nm_fone,nro_fone,desc_fone,img_fone) VALUES (8,'Atendimento a mulher','180','Criado para dar mais informações sobre direitos femininos e apoio psicológico à mulheres em situação de violência, além de receber denúncias específicas sobre cárcere privado e tráfico de mulheres','brainstorming.png')");
    tx.executeSql("INSERT INTO telefone (cod_fone,nm_fone,nro_fone,desc_fone,img_fone) VALUES (9,'Correios Nacional','08007257282','Correios do Brasil','correios.png')");
    tx.executeSql("INSERT INTO telefone (cod_fone,nm_fone,nro_fone,desc_fone,img_fone) VALUES (10,'Direitos Humanos','100','Criado para denúncias contra violência, abuso sexual, agressões físicas e/ou psicológicas cometidas contra crianças e adolescentes, denúncias de pessoas em situação de rua, da população LGBT, de pessoas com deficiência e idosos','direitos_humanos.png')");
    tx.executeSql("INSERT INTO telefone (cod_fone,nm_fone,nro_fone,desc_fone,img_fone) VALUES (11,'Receita Federal','146','Esse telefone é de atendimento aos contribuintes para sanar dúvidas e dar esclarecimentos','receita_federal.png')");
    tx.executeSql("INSERT INTO telefone (cod_fone,nm_fone,nro_fone,desc_fone,img_fone) VALUES (12,'Procon','151','Órgão público responsável pela proteção e defesa dos direitos e interesses dos consumidores','procon.png')");
    console.log("POPULA UTIL");
}
/**
 * Atualiza a tabela config
 */
function updConfig() {
    console.log("UPDATE CONFIG");
    var db = window.openDatabase("../../../storage/extSdCard/TelefonesUteis/telefonesuteis", "1.0", "TelefonesUteis", 1000000);
    db.transaction(function (transaction) {
        transaction.executeSql("INSERT INTO config (cod_config,configdb) VALUES(?,?) ", [1, 'T'], function (tx, results) {
            console.log(results);
            console.log("CONFIG ATUALIZADO");
            getTelefones();
        }, function (err) {
            console.log("ERROR INSERT CONFIG");
            console.log(err.code);
            console.log(err.message);
        });
    }, function (error) {
        console.log('BASE ERROR: ' + error.message);
    }, function () {

    });
}