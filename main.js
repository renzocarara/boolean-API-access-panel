$(document).ready(function() {

    // elenco endpoint API disponibili
    var menuList = {
        intero: 'https://flynn.boolean.careers/exercises/api/random/int',
        nome: 'https://flynn.boolean.careers/exercises/api/random/name',
        parola: 'https://flynn.boolean.careers/exercises/api/random/word',
        email: 'https://flynn.boolean.careers/exercises/api/random/mail',
        telefono: 'https://flynn.boolean.careers/exercises/api/random/phone',
        frase: 'https://flynn.boolean.careers/exercises/api/random/sentence',
        booleano: 'https://flynn.boolean.careers/exercises/api/random/boolean',
        array: 'https://flynn.boolean.careers/exercises/api/array/integers?min=n&max=n&items=n'
    };

    // intercetto click su una voce del menu
    $('ul li').click(function() {

        // recupero l'attributo data-endpoint della voce menu cliccata
        var menuItem = $(this).attr('data-endpoint');
        // attraverso l'attributo data-endpoint accedo all'oggetto che contiene gli indirizzi http
        var choice = menuList[menuItem];

        // se la voce menu selezionata è l'ultima, "array di valori...", allora devo chiedere ulteriori dati all'utente
        if (menuItem == 'array') {
            // recupera i 3 dati mancanti (n: lunghezza array, min e max: range dei numeri che popolano l'array)
            var arrayFeatures = askArrayFeaturs();
            // aggiorno il link che serve per la chiamata AJAX, inserendo nella stringa i 3 dati raccolti
            choice = updateLink(arrayFeatures, menuList.array);
        }

        // eseguo una chiamata AJAX verso l'URL dell'endpoint selezionato dall'utente
        $.ajax({
            // richiedo l'url dell'endpoint scelto dall'utente
            url: choice,
            // sono io client che richiedo dei dati
            method: 'GET',
            // la chiamata è andata bene, utilizzo i dati ritornati
            success: function(data) {
                // chiamo una funzione che utilizza i dati recuperati
                // gli passo il riferimento all'elemento cliccato e il dato restituito dal server
                updatePage(choice, data.response);
            },
            // qui sotto ci arrivo se la API da' errore
            error: function(error) {
                alert("Errore dalla chiamata API");
            }
        }); // fine chiamata AJAX
    }); // fine click su voce menu


    // intercetto click sui bottoncini "Copy"
    $('.copy-btn').click(function() {

        var panelText = $(this).siblings('.panel'); // seleziono la textarea relativa al clic
        panelText.select(); // seleziono il testo corrente all'interno della textarea
        document.execCommand("copy"); // copio il testo selezionato nella Clipboard
        // alert("Testo copiato nella Clipboard");

        var copiedBox = $(this).siblings('.copied-message');
        copiedBox.addClass('box-disappearing');
        setTimeout(function() {
            copiedBox.removeClass('box-disappearing');
        }, 3000);

    });


}); // fine document ready

// ---------------------------- FUNCTIONs --------------------------------------
function askArrayFeaturs() {
    // SCOPO: recupera i 3 dati mancanti (n: lunghezza array, min e max: range dei numeri che popolano l'array)
    // li inserisce in un oggetto e lo ritorna

    var arrayInfo = {}; // oggetto per contenere le 3 caratteristiche dell'array da creare
    do {
        arrayInfo.size = prompt("Per creare un array random occorrono:\n- numero di elementi che lo compongono\n- range numerico degli elementi dell'array (min e max)\n\nInserisci numero di elementi dell'array:", "10");
    } while (isNaN(arrayInfo.size));

    do {
        arrayInfo.min = prompt("Inserisci il valore minimo degli elementi dell'array (min):", "1");
    } while (isNaN(arrayInfo.min));

    do {
        arrayInfo.max = prompt("Inserisci il valore massimo degli elementi dell'array (max)", "10");
    } while (isNaN(arrayInfo.max));

    return arrayInfo;
}


function updateLink(arrayProperties, endpoint) {
    // SCOPO: aggiorna il link che serve per la chiamata AJAX, inserendo nella stringa i 3 dati raccolti
    // riceve in ingresso 2 parametri:
    // 'arrayProperties': un oggetto con i 3 dati da utilizzare per aggiornare il link
    // 'endpoint': il link originale da aggiornare

    // link da aggiornare: 'https://flynn.boolean.careers/exercises/api/array/integers?min=n&max=n&items=n'

    endpoint = endpoint.replace("=n", "=" + arrayProperties.min);
    endpoint = endpoint.replace("=n", "=" + arrayProperties.max);
    endpoint = endpoint.replace("=n", "=" + arrayProperties.size);

    return endpoint; // ritorno il link aggiornato
}

function updatePage(endpointLink, data) {
    // SCOPO: aggiorna la pagina HTML con l'output della chiamata e il link relativo
    // in endpointLink ho la stirnga che identifica l'indirizzo http dell'endpoint
    // in data ho i dati restituiti dal server interpellato con la chiamata AJAX

    //scrivo sulla pagina HTML
    $('.output-panel').text(data);
    $('.link-panel').text(endpointLink);

}