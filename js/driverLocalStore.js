
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

    return(listadoUsuarios)
    //localStorage.setItem(`listaUsuarios`, JSON.stringify(listadoUsuarios))
}


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
}

function convertirUsuarios(){
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
