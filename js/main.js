// CARGO LA LISTA DE USUARIOS DEL LOCALSTORE
let usuarios = recrearBD(`listaUsuarios`);
console.log("MAIN - LISTADO CARGADO DESDE LOCALSTORE");
console.log(usuarios)

// SETEO INICIAL DE NUMERO DE LOTE (Si no existe en el Local, se inicializa con el valor por defecto)
const LOTEO = 2545;

if (localStorage.idLote == null) {
    localStorage.setItem(`idLote`, LOTEO)
}

// OBTENGO INDICE DEL USUARIO QUE SE LOGEO DEL LISTADO DE USUARIOS
let indexUserLogin = parseInt(localStorage.getItem("userID"));

// INICIALIZO AL USUARIO LOGEADO
let usuarioLogeado = usuarios[indexUserLogin]; // TENGO QUE VER LA FORMA DE OBTENERLO DEL LOGIN con el localStorage

// FORMATEAR FORMULARIO CON FECHA ACTUAL
let fechaHoy = new Date();
$("#dia").val(formatearFecha(fechaHoy, 0, `-`));

//SALUDO DE BIENVENIDA
if (usuarioLogeado.sexo === `M`) {
    document.getElementById(`msjBienvenida`).innerHTML = `<h1>Bienvenido, ${usuarioLogeado.nombre} ${usuarioLogeado.apellido} <h1>`;
} else {
    document.getElementById(`msjBienvenida`).innerHTML = `<h1>Bienvenida, ${usuarioLogeado.nombre} ${usuarioLogeado.apellido} <h1>`;
}

// MUESTRO LOS MOVIMIENTOS ANTERIORES
usuarioLogeado.mostrarMovimientos();


$("#formProcesamiento").submit(function (e) {
    e.preventDefault();
    let datosForm = document.querySelectorAll(".form-select")
    let fecha = convertirFecha(datosForm[5].value);

    location.href = "#puntaje";

    let resultado = calcularPuntajeProceso(datosForm[0].value, datosForm[1].value, datosForm[2].value, datosForm[3].value, datosForm[4].value);
    let diasEsteriles = calcularDiasEsterilidad(resultado[0]);

    usuarioLogeado.registrarMovimiento(fecha, resultado[0], resultado[1], diasEsteriles);
    usuarioLogeado.mostrarResultado();
    usuarioLogeado.mostrarMovimientos();

    usuarios[indexUserLogin] = usuarioLogeado; //guardo cambios del usuario en listado de usuarios en memoria

    localStorage.setItem(`listaUsuarios`, JSON.stringify(usuarios))   // guardo cambios en el local Store

    $("#formProcesamiento")[0].reset();   //reseteo formulario
    $("#dia").val(formatearFecha(fechaHoy, 0, `-`)); // vuelvo a inicializar el campo de la fecha al dia de hoy
});

//------------------------------------------------------------------------------------------------------------------------------

/**
 * Funcion que me calcula el puntaje del procesamiento escogido en el formulario
 * @param {*} envoltorio1 :tipo de envoltorio 1
 * @param {*} envoltorio2 :tipo de envoltorio 2
 * @param {*} embalaje : tipo de embalaje
 * @param {*} medioAlm : tipo madio de almacenamiento
 * @param {*} lugarAlm : tipo lugar de almacenamiento
 * @returns Devuelve el puntaje total(array[0]) y la descripcion del proceso escogido (array[1])
 */
function calcularPuntajeProceso(envoltorio1, envoltorio2, embalaje, medioAlm, lugarAlm) {

    let resultados = [];
    let proceso = ""
    let puntaje = 0;

    //PUNTAJE ESPECIAL COMBINACION DE ENVOLTORIOS 
    if ((envoltorio1 == 2) && (envoltorio2 == 6)) {
        puntaje += 210;
    } else {
        //PUNTAJE POR ENVOLTORIO 1
        switch (envoltorio1) {
            case "Bolsa de Papel":
                puntaje += 40
                proceso += "BP-"
                break;
            case "Contenedor (c/Filtro)":
                puntaje += 100
                proceso += "CcF-"
                break;
            case "Papel Crepe":
                puntaje += 20
                proceso += "PC-"
                break;
            case "Pouch Papel Grado Medico Poliester / Polipropileno":
                puntaje += 80
                proceso += "PGM-"
                break;
            case "Pouch Polietileno Prensado / Polipropileno":
                puntaje += 100
                proceso += "PPP-"
                break;
            case "Tela No Tejida":
                puntaje += 100
                proceso += "TnT-"
                break;
        }
        // PUNTAJE POR ENVOLTORIO 2
        switch (envoltorio2) {
            case "Bolsa de Papel":
                puntaje += 80
                proceso += "BP-"
                break;
            case "Contenedor (c/Filtro)":
                puntaje += 250
                proceso += "CcF-"
                break;
            case "Papel Crepe":
                puntaje += 60
                proceso += "PC-"
                break;
            case "Pouch Papel Grado Medico Poliester / Polipropileno":
                puntaje += 100
                proceso += "PGM-"
                break;
            case "Pouch Polietileno Prensado / Polipropileno":
                puntaje += 120
                proceso += "PPP-"
                break;
            case "Tela No Tejida":
                puntaje += 80
                proceso += "TnT-"
                break;
        }
    }
    //PUNTAJE EMBALAJE
    switch (embalaje) {

        case "Bolsa de polietileno sellada":
            puntaje += 400
            proceso += "BPS-"
            break;

        case "Contenedor":
            puntaje += 60
            proceso += "Cont-"
            break;

        case "No Aplica":
            puntaje += 0
            proceso += "N/A-"
            break;
    }
    //PUNTAJE MEDIO ALMACENAMIENTO
    switch (medioAlm) {
        case "Armarios Abiertos":
            puntaje += 0
            proceso += "AA-"
            break;
        case "Armarios Cerrados":
            puntaje += 100
            proceso += "AC-"
            break;
        case "Cajones":
            puntaje += 0
            proceso += "Caj-"
            break;
    }

    //PUNTAJE LUGAR ALMACENAMIENTO
    switch (lugarAlm) {
        case "Deposito en Quirófano o Esterilización":
            puntaje += 300
            proceso += "DQoE"
            break;
        case "Deposito Material":
            puntaje += 75
            proceso += "DM"
                break;
        case "Deposito Material Estéril":
            puntaje += 250
            proceso += "DME"
            break;
        case "Habitacion del Paciente":
            puntaje += 0
            proceso += "HP"
            break;
        case "Office de Enfermería":
            puntaje += 50
            proceso += "O.Ef"
            break;
       
    }
    resultados[0] = puntaje;
    resultados[1] = proceso;
  
    return resultados;
}

/**
 * FUNCION QUE DEVUELVE LA CANTIDAD DE DIAS ESTERILES EN FUNCION DEL PUNTAJE OBTENIDO
 * @param {*} puntaje 
 * @returns DIAS ESTERILES
 */

function calcularDiasEsterilidad(puntaje) {
    const listapunjates = [

        {
            puntaje: 50,
            vencimiento: 7
        },

        {
            puntaje: 100,
            vencimiento: 30
        },

        {
            puntaje: 200,
            vencimiento: 60
        },

        {
            puntaje: 300,
            vencimiento: 90
        },

        {
            puntaje: 400,
            vencimiento: 180
        },

        {
            puntaje: 600,
            vencimiento: 365
        },

        {
            puntaje: 750,
            vencimiento: 730
        },
    ]   

    let diasVenc = 0

        for (let i=0;i<listapunjates.length;i++){
            const puntajeDato = listapunjates[i]

            if (puntaje < puntajeDato.puntaje){
                diasVenc = puntajeDato.vencimiento;
                break;
            }else{
                diasVenc = 1826;
            }
        }

    return diasVenc;
}
/**
 * Tomar como paramarto una fecha en formato String y devuelve la fecha en instacianda como un objeto Date 
 * @param {*} dateString  fecha en formato String
 * @returns fecha en objeto Date
 */
function convertirFecha(dateString) {

    let dia = parseInt(dateString.substring(8, 10));
    let mes = parseInt(dateString.substring(5, 7));
    let año = parseInt(dateString.substring(0, 4));

    let date = new Date(año, mes - 1, dia)

    return date
}

/**
 * FUNCION QUE FORMATEA UN OBJETO DATE PARA QUE VISUALMENTE SE PRESENTE DE LA FOTMA dd-mm-yyyy
 * @param {*} fecha  objeto Date de entrada para formatear
 * @param {*} cantDias  parametro para sumarle dias a la fecha ingresada con el parametro anterior 
 * @param {*} tipo  seleccionar distinto tipo de formatos : separador / (mm/dd/yyy)  separador - (yyyy-mm-dd)
 * @returns 
 */
function formatearFecha(fecha, cantDias, tipo) {

    let dia = ""
    let mes = ""
    let resultado = "";

    let diaACalcular = new Date(fecha);
    diaACalcular.setDate(diaACalcular.getDate() + cantDias);

    if ((diaACalcular.getMonth() + 1) < 10) {
        mes = `0${diaACalcular.getMonth() + 1}`
    } else {
        mes = `${diaACalcular.getMonth() + 1}`;
    }

    if (diaACalcular.getDate() < 10) {
        dia = `0${diaACalcular.getDate()}`
    } else {
        dia = `${diaACalcular.getDate()}`;
    }

    switch (tipo) {

        case `/`:
            resultado = (`${dia}/${mes}/${diaACalcular.getFullYear()}`);
            break;
        case `-`:
            resultado = (`${diaACalcular.getFullYear()}-${mes}-${dia}`);
            break;
    }

    return resultado;
}
