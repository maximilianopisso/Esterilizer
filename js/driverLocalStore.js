
function loadInitialData() {
    console.log("Carga Inicial")
    let cargaMovimientos = [];
    //INICIALIZO CON MOVMIENTOS CARGADOS PREVIOS
    for (let i = 1; i < 4; i++) {

        let mov = new Movimiento(i, i + "/10/2020", i + 100, "Evento C.Inicial", i * 15, 15 * i, "01/" + i + "/2020")
        cargaMovimientos.push(mov);
    }

    const usuario1 = new Usuario(`Maximiliano`, `Pisso`, `mpisso@gmail.com`, `12345678`, `3413346634`, `M`, cargaMovimientos);
    const usuario2 = new Usuario(`Tamara`, `Sultano`, `tsultano@gmail.com`, `qwer1234`, `3416748545`, `F`, cargaMovimientos);
    const usuario3 = new Usuario(`Maria Laura`, `Gomez`, `mgomez@gmail.com`, `loki1374`, `3416548562`, `F`, cargaMovimientos);
    const usuario4 = new Usuario(`Emiliano`, `Cinquini`, `ecinquini@gmail.com`, `PUpi2020`, `3415493162`, `M`, cargaMovimientos);

    listadoUsuarios = [usuario1, usuario2, usuario3, usuario4];

    return listadoUsuarios    // CARGA USUARIOS CON API

}


// async function carga(){


//    var consulta = $.ajax({
//         url: 'https://randomuser.me/api/',
//         dataType: 'json',
//         data: { results: "10" },
//         success: function (data) {
//             // console.log("Resultado de lo que traigo por API")
//             // console.log(data.results)
//             localStorage.setItem(`usersAPI`, JSON.stringify(data.results));
//         }
//     })
// }



function usuariosApi() {
console.log("Carga Por Api")
   
    if (localStorage.usersAPI == null) {
       
        var consulta = $.ajax({
            url: 'https://randomuser.me/api/',
            dataType: 'json',
            data: { results: "10" },
            success: function (data) {
                //console.log(data.results)
                localStorage.setItem(`usersAPI`, JSON.stringify(data.results));
                
            }
        }) 
        
    } 
        
        userlist = JSON.parse(localStorage.getItem(`usersAPI`));
        let sexo = "";
        listadoUsuario =[];
    //ESTO DA ERROR EN LA 1era EJECUCION porque no esta listo el user.list
        for (var i = 0; i < userlist.length; i++) {

            
            (userlist[i].gender == "male") ? sexo = `M` : sexo = `F`;
            
            let usuario = new Usuario(userlist[i].name.first,userlist[i].name.last,userlist[i].email,userlist[i].login.password,userlist[i].cell,sexo,[])
            listadoUsuario.push(usuario);
        }
        
        return listadoUsuario

    }








//     //     //nombre, apellido, email, password, contacto, sexo, movimientos
//     //     for (let i = 0; i<userApi.length;i++){

//     //         (userApi[i].gender == "male") ? sexo = `M` : sexo = `F`        
//     //         usuario = new Usuario (userApi[i].name.first,userApi[i].name.last,userApi[i].email,userApi[i].login.password,userApi[i].cell,sexo,[])

//     //         listadoUsuarios.push(usuario);
//     //         console.log(usuarios)
//     //     }

//     //     return listadoUsuarios;



//FUNCIONES PARA CARGAR EL LOCAL STORE A MEMORIA




function recrearBD(idLocalStoreitem) {

    let users = JSON.parse(localStorage.getItem(`${idLocalStoreitem}`));

    let listadoUsuario = [];
    let listadoMovimientos = [];

    for (var i = 0; i < users.length; i++) {

        let movs = users[i].movimientos;

        for (var j = 0; j < movs.length; j++) {
            let movimientos = new Movimiento(movs[j].id, movs[j].fecha, movs[j].lote, movs[j].proceso, movs[j].puntaje, movs[j].diasEsteriles, movs[j].vencimiento)
            listadoMovimientos.push(movimientos);
        }

        //CREO NUEVO USUARIO CON LOS DATOS COMPLETOS
        let usuarioNuevo = new Usuario(users[i].nombre, users[i].apellido, users[i].email, users[i].password, users[i].contacto, users[i].sexo, listadoMovimientos)
        //AGREGO USUARIO A LISTA DE USUARIOS
        listadoUsuario.push(usuarioNuevo);
        //BORRO LISTADO DE MOVIMIENTOS PARA PROXIMO USUSARIO
        listadoMovimientos = [];

    }

    return listadoUsuario;

}

/**
 * FUNCION PARA GUARDAR LOS MOVIMIENTOS EN EL LOCALSTORE PARA QUE LOS REGISTROS SE MANTENGAN
 * DE FORMA CONSISTENTE
 */
function guardarMovLocalStore(idLocalStoreitem, datos) {

    //borro la lista de usuarios completamente lo que esta en el LocalStore
    //localStorage.removeItem(`${idLocalStoreitem}`);
    console.log(datos)
    //reemplazo el usuario en el conjunto de usuarios cargados en memoria
    //guardo arreglo modificado nuevamente en localStore
    localStorage.setItem(`${idLocalStoreitem}`, JSON.stringify(datos));

}

