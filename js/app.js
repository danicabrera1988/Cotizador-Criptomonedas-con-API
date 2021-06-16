// VARIABLES //
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');


// OBJETOS //
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};


// PROMISE //
const obtenerCriptomonedas = criptomonedas => new Promise (resolve => {
    resolve(criptomonedas);
})


// EVENTOS //
document.addEventListener('DOMContentLoaded', consultarCriptomodenas);
formulario.addEventListener('submit', submitFormulario);
criptomonedasSelect.addEventListener('change', leerValor);
monedaSelect.addEventListener('change', leerValor);


// FUNCIONES //
function consultarCriptomodenas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => obtenerCriptomonedas(resultado.Data))
        .then( criptomonedas => selectCriptomonedas(criptomonedas))
        //.catch( error => console.log(error))
}

function selectCriptomonedas(criptomonedas){

    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function submitFormulario(e){
    e.preventDefault();

    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios');
        return
    }

    // Consultar API
    consultarAPI();
}

function consultarAPI(){

    const { moneda, criptomoneda} = objBusqueda;
    
    const url= `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner();

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarSpinner(){

    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);
}

function mostrarCotizacionHTML(cotizacion){
    
    limpiarHTML();
    
    const {CHANGEPCT24HOUR, HIGHDAY, PRICE, LOWDAY, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: ${PRICE}`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `El Precio más alto del día es: ${HIGHDAY}`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `El Precio más bajo del día es: ${LOWDAY}`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Variacion ultimas 24 horas: ${CHANGEPCT24HOUR} %`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `Última actualizacion: ${LASTUPDATE}`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML(){
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}

function mostrarAlerta(mensaje){
    const alerta = document.querySelector('.alerta');

    if(!alerta){
        const alertaDiv = document.createElement('p');
        alertaDiv.classList.add('alerta', 'error');
        alertaDiv.innerHTML = `${mensaje}`;
        resultado.appendChild(alertaDiv);

        setTimeout(() => {
            alertaDiv.remove();
        }, 3000);    
    }

}

