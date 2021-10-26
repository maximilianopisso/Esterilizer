
function loadInitialData() {

    console.log("Carga Inicial LOCAL")
    let cargaMovimientos = [];

    //INICIALIZO CON MOVMIENTOS CARGADOS PREVIOS
    for (let i = 1; i < 4; i++) {
        let mov = new Movimiento(i, `xx/xx/xxxx`, 2500+i, "Proceso C. Inicial", 820, 1826, "0"+i +"/0" + i + "/2021")
        cargaMovimientos.push(mov);
    }

    const usuario1 = new Usuario(`Maximiliano`, `Pisso`, `mpisso@gmail.com`, `12345678`, `3413346634`, `M`, cargaMovimientos);
    const usuario2 = new Usuario(`Tamara`, `Sultano`, `tsultano@gmail.com`, `qwer1234`, `3416748545`, `F`, cargaMovimientos);
    const usuario3 = new Usuario(`Maria Laura`, `Gomez`, `mgomez@gmail.com`, `loki1374`, `3416548562`, `F`, cargaMovimientos);
    const usuario4 = new Usuario(`Emiliano`, `Cinquini`, `ecinquini@gmail.com`, `PUpi2020`, `3415493162`, `M`, cargaMovimientos);

    listadoUsuarios = [usuario1, usuario2, usuario3, usuario4];

    return (listadoUsuarios)
    //localStorage.setItem(`listaUsuarios`, JSON.stringify(listadoUsuarios))
}

async function usuariosApi() {

    var consulta = await $.ajax({
        
        url: 'https://randomuser.me/api/',
        dataType: 'json',
        data: { results: "20" },
        success: function (data) {

            localStorage.setItem(`usersAPI`, JSON.stringify(data.results));
        }
    })
}

/**
 * Convierte el listado de usuarios obtenidos por la API y almacenados en el localStore en un arreglo de Objetos de "Usuarios"
 */
function convertirUsuarios() {
    let userlist = JSON.parse(localStorage.getItem(`usersAPI`));
    let sexo = "";
    let listadoUsuario = [];

    for (var i = 0; i < userlist.length; i++) {

        (userlist[i].gender == "male") ? sexo = `M` : sexo = `F`;

        let usuario = new Usuario(userlist[i].name.first, userlist[i].name.last, userlist[i].email, userlist[i].login.password, userlist[i].cell, sexo, [])
        listadoUsuario.push(usuario);
    }

    return listadoUsuario;
}

/**
 * FUNCION QUE PERMITE VOLCAR LOS DATOS EN EL LOCALSTORE A MEMORIA EN UN ARREGLO PARA SER PROCESADOOS
 * @param {*} idLocalStoreitem NOMBRE DE ID EN LOCALSTORE
 * @returns 
 */
function recrearBD(idLocalStoreitem) {

    let usersLS = JSON.parse(localStorage.getItem(`${idLocalStoreitem}`));
    let listadoUsuario = [];
    let listadoMovimientos = [];

    for (var i = 0; i < usersLS.length; i++) {

        let movs = usersLS[i].movimientos;

        for (var j = 0; j < movs.length; j++) {
            let movimientos = new Movimiento(movs[j].id, movs[j].fecha, movs[j].lote, movs[j].proceso, movs[j].puntaje, movs[j].diasEsteriles, movs[j].vencimiento)
            listadoMovimientos.push(movimientos);
        }
        //CREO NUEVO USUARIO CON LOS DATOS COMPLETOS
        let usuarioNuevo = new Usuario(usersLS[i].nombre, usersLS[i].apellido, usersLS[i].email, usersLS[i].password, usersLS[i].contacto, usersLS[i].sexo, listadoMovimientos)
        usuarioNuevo.nroIntentos = usersLS[i].nroIntentos;  //Setea los intentos de inicio del usuario desde LS

        //AGREGO USUARIO A LISTA DE USUARIOS
        listadoUsuario.push(usuarioNuevo);

        //BORRO LISTADO DE MOVIMIENTOS PARA PROXIMO USUSARIO
        listadoMovimientos = [];
    }
    return listadoUsuario;
}
