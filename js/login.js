
let usuarios = [];
let usuarios2 = [];

if (localStorage.listaUsuarios != null) {
    usuarios = recrearBD(`listaUsuarios`);
    console.log("CARGA LOCALSTORE - LISTADO USUARIOS");

} else {
    usuarios = loadInitialData();
    usuarios = usuarios.concat(usuariosApi());  //Esta linea no funciona en la 1er por la demora de la consulta a la API
    localStorage.setItem(`listaUsuarios`, JSON.stringify(usuarios));
    console.log("CARGA POR CODIGO INICIAL  - LISTADO USUARIOS");
}

console.log(usuarios)

$("#formulario").submit(function (e) {
    e.preventDefault();
    let email = $("#email").val();
    let pass = $("#password").val();
    console.log(email, pass);
    validarUsuario(email, pass);
})


/**
 * FUNCION PARA VALIDAR DATOS INGRESADOS EN LOGIN
 * @param {*} email : PARAMETRO PARA EL EMAIL
 * @param {*} password: PARAMETRO PARA LA CONTRASEÑA
 */
function validarUsuario(email, password) {

    let encontrado = false;

    for (let i = 0; i < usuarios.length; i++) {
        // console.log(email + password + usuarios[i].email + usuarios[i].password +usuarios.length);
        //LLama a la funcion de validacion del propio usuario para chequaer su usuario y contraseña con el enviados a traves del metodo.
        if (usuarios[i].validarLogin(email, password)) {
            encontrado = true;
            localStorage.setItem("userLogin", JSON.stringify(usuarios[i]));
            localStorage.setItem("userID", i);
            //Guardo informacion del usuario en el local para levantarlo en el otro js.
            break;
        }
    }

    // si es encotrador, muesta que se pudo validar sino no.
    if (encontrado) {

        console.log("EL USUARIO FUE VALIDADO");
        location.href = "./esterilizer.html";


    } else {
        alert("EL USUARIO NO PUDO SER VALIDADO");
    }
}

/**
 * FUNCION PARA ARMAR EL LISTADO DE USUARIOS CUANDO YA EXISTE EN EL LOCALSTORE
 *  @returns LISTA DE USUARIOS CARGADOS
 */
function recrearBD(idLocalStoreitem) {

    let users = JSON.parse(localStorage.getItem(`${idLocalStoreitem}`));
    //console.log(users[0].movimientos[0].id);
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
    // console.log(listadoUsuario);
    return listadoUsuario;

}

function cargaInternaUsuarios() {

    let listaUsers = [];
    let cargaMovimientos = [];

    for (let i = 1; i < 4; i++) {

        let mov = new Movimiento(i, i + "/10/2020", i + 100, "Evento C.Inicial", i * 15, 15 * i, "01/" + i + "/2020")
        cargaMovimientos.push(mov);
    }

    const usuario1 = new Usuario(`Maximiliano`, `Pisso`, `mpisso@gmail.com`, `12345678`, `3413346634`, `M`, cargaMovimientos);
    const usuario2 = new Usuario(`Tamara`, `Sultano`, `tsultano@gmail.com`, `qwer1234`, `3416748545`, `F`, cargaMovimientos);
    const usuario3 = new Usuario(`Maria Laura`, `Gomez`, `mgomez@gmail.com`, `loki1374`, `3416548562`, `F`, cargaMovimientos);
    const usuario4 = new Usuario(`Emiliano`, `Cinquini`, `ecinquini@gmail.com`, `PUpi2020`, `3415493162`, `M`, cargaMovimientos);
    listaUsers = [usuario1, usuario2, usuario3, usuario4];

    return listaUsers
}
