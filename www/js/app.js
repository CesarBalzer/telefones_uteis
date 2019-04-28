
var $ = Dom7;
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
    theme = document.location.search.split('theme=')[1].split('&')[0];
}
var myapp = new Framework7({
    version: "1.0.0",
    id: 'br.com.telefones_uteis',
    name: "Telefones Úteis Emergência",
    root: '#app',
    theme: theme,
    routes: routes,
    dialog: {
        buttonOk: 'Ok',
        buttonCancel: 'Cancelar',
        button: {
            color: '#025D52'
        }
    },
    touch: {
        fastClicks: false,
        tapHold: true
    },
    navbar: {
        hideOnPageScroll: true
//        iosCenterTitle: false,
    },
    statusbar: {
        enabled: true,
        overlay: false,
        iosOverlaysWebView: false,
        scrollTopOnClick: true,
        materialBackgroundColor: "#025D52",
        androidTextColor: 'white'
    },
    popup: {
        closeByBackdropClick: false
    },
    input: {
        scrollIntoViewOnFocus: true,
        scrollIntoViewCentered: false
    }
});

var mainView = myapp.views.create('.view-main', {
    url: '/'
});

function setGlobalConfig() {
    config = verConfig();
    console.log(config);
}

//keytool -genkey -v -keystore telefones_uteis.keystore -alias telefones_uteis -keyalg RSA -keysize 2048 -validity 10000
//jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore telefones_uteis.keystore platforms/android/build/outputs/apk/android-release-unsigned.apk telefones_uteis
// /Users/balzer/android-sdks/build-tools/25.0.1/zipalign -v 4 /Users/balzer/www/telefones_uteis/platforms/android/build/outputs/apk/android-release-unsigned.apk /Users/balzer/Desktop/telefones_uteis.apk
