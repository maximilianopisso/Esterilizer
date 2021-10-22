// CARGO LA LISTA DE USUARIOS DEL LOCALSTORE
let usuarios = recrearBD(`listaUsuarios`);
console.log("CARGA LOCAL STORE - LISTADO USUARIOS");
console.log(usuarios, usuarios.length)

const LOTEO =2545;
// SETEO INICIAL DE NUMERO DE LOTE (Si no existe en el Local, se inicializa con el valor por defecto)

if (localStorage.idLote == null) {
    localStorage.setItem(`idLote`,LOTEO) 
}
// DEFINO POSICION DEL USUARIO LOGEADO DENTRO DEL LISTADO DE USUARIOS
let indexUserLogin = parseInt(localStorage.getItem("userID"));

//Usuario logeado 
let usuarioLogeado = usuarios[indexUserLogin]; // TENGO QUE VER LA FORMA DE OBTENERLO DEL LOGIN con el localStorage


//Inicio del Usuario

if (usuarioLogeado.sexo === `M`) {
    document.getElementById(`msjBienvenida`).innerHTML = `<h1>Bienvenido, ${usuarioLogeado.nombre} ${usuarioLogeado.apellido} <h1>`;
} else {
    document.getElementById(`msjBienvenida`).innerHTML = `<h1>Bienvenida, ${usuarioLogeado.nombre} ${usuarioLogeado.apellido} <h1>`;
}

usuarioLogeado.mostrarMovimientos();

$("#formProcesamiento").submit(function (e) {
    e.preventDefault();
    let env1 = $("#envoltorio1").val();
    let env2 = $("#envoltorio2").val();
    let emb = $("#embalaje").val();
    let mAlm = $("#mAlmacenamiento").val();
    let lAlm = $("#lAlmacenamiento").val();
    
    console.log(env1, env2, emb, mAlm, lAlm);
    location.href = "#puntaje";
    
    let resultado = calcularPuntajeProceso(env1, env2, emb, mAlm, lAlm);
    let diasEsteriles = calcularDiasEsterilidad(resultado[0]);
    
    usuarioLogeado.registrarMovimiento(resultado[0], resultado[1], diasEsteriles);
    usuarioLogeado.mostrarResultado();
    usuarioLogeado.mostrarMovimientos();

    usuarios[indexUserLogin]=usuarioLogeado; //guardo cambios del usuario en listado de usuarios en memoria
    console.log(usuarios);
    guardarMovLocalStore(`listaUsuarios`, usuarios);  //guardos cambios en localStore
       
    $("#formProcesamiento")[0].reset();   //reseteo formulario
});

/**
 * Funcion que me calcula el puntaje del procesamiento escogido en el formulario
 * @param {*} envoltorio1 :tipo de envoltorio 1
 * @param {*} envoltorio2 :tipo de envoltorio 2
 * @param {*} embalaje : tipo de embalaje
 * @param {*} medioAlm : tipo madio de almacenamiento
 * @param {*} lugarAlm : tipo lugar de almacenamiento
 * @returns Devuelve el puntaje total
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
            puntaje += 90
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
        case "Habitacion del Paciente":
            puntaje += 300
            proceso += "HP"
            break;
        case "Office de Enfermería":
            puntaje += 75
            proceso += "O.Ef"
            break;
        case "Deposito Material":
            puntaje += 250
            proceso += "DM"
            break;
        case "Deposito Material Estéril":
            puntaje += 0
            proceso += "DME"
            break;
        case "Deposito en Quirófano o Esterilización":
            puntaje += 50
            proceso += "DQoE"
            break;
    }
    resultados[0] = puntaje;
    resultados[1] = proceso;
    // console.log(resultados[0], resultados[1])
    return resultados;
}

/**
 * FUNCION QUE DEVUELVE LA CANTIDAD DE DIAS ESTERILES EN FUNCION DEL PUNTAJE OBTENIDO
 * @param {*} puntaje 
 * @returns DIAS ESTERILES
 */

function calcularDiasEsterilidad(puntaje) {

    let diasVenc = 0

    if (puntaje < 50) {
        diasVenc = 7;
    } else {
        if (puntaje < 100) {
            diasVenc = 30;
        } else {
            if (puntaje < 200) {
                diasVenc = 60;
            } else {
                if (puntaje < 300) {
                    diasVenc = 90;
                } else {
                    if (puntaje < 400) {
                        diasVenc = 180;
                    } else {
                        if (puntaje < 600) {
                            diasVenc = 365;
                        } else {
                            if (puntaje < 750) {
                                diasVenc = 730;
                            } else {
                                diasVenc = 1826;
                            }
                        }
                    }
                }
            }
        }
    }


    return diasVenc;
}
// //FUNCIONES PARA CARGAR EL LOCAL STORE A MEMORIA


// function recrearBD(idLocalStoreitem) {

//     let users = JSON.parse(localStorage.getItem(`${idLocalStoreitem}`));
    
//     let listadoUsuario = [];
//     let listadoMovimientos = [];
    
//     for (var i = 0; i < users.length; i++) {
        
//         let movs = users[i].movimientos;

//         for (var j = 0; j < movs.length; j++) {
//             let movimientos = new Movimiento(movs[j].id, movs[j].fecha, movs[j].lote, movs[j].proceso, movs[j].puntaje, movs[j].diasEsteriles, movs[j].vencimiento)
//             listadoMovimientos.push(movimientos);
//         }
           
//         //CREO NUEVO USUARIO CON LOS DATOS COMPLETOS
//         let usuarioNuevo = new Usuario(users[i].nombre, users[i].apellido, users[i].email, users[i].password, users[i].contacto, users[i].sexo, listadoMovimientos)
//         //AGREGO USUARIO A LISTA DE USUARIOS
//         listadoUsuario.push(usuarioNuevo);
//         //BORRO LISTADO DE MOVIMIENTOS PARA PROXIMO USUSARIO
//         listadoMovimientos =[];
        
//     }
//     console.log(listadoUsuario);
//     return listadoUsuario;

// }

// /**
//  * FUNCION PARA GUARDAR LOS MOVIMIENTOS EN EL LOCALSTORE PARA QUE LOS REGISTROS SE MANTENGAN
//  * DE FORMA CONSISTENTE
//  */
// function guardarMovLocalStore(){
   
//    //borro la lista de usuarios completamente lo que esta en el LocalStore
//     localStorage.removeItem(`listaUsuarios`);
//     //reemplazo el usuario en el conjunto de usuarios cargados en memoria
//     usuarios[indexUserLogin]=usuarioLogeado;
//     //guardo arreglo modificado nuevamente en localStore
//     localStorage.setItem(`listaUsuarios`, JSON.stringify(usuarios));
    
// }

