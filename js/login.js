
let usuarios = [];


if (localStorage.listaUsuarios != null) {
    usuarios = recrearBD(`listaUsuarios`);
    console.log("CARGA LOCALSTORE - LISTADO USUARIOS");
   
} else {
    
    console.log("CARGA POR CODIGO INICIAL");
    usuarios = loadInitialData();
    // localStorage.setItem(`listaUsuarios`, JSON.stringify(usuarios));
    // usuarios = recrearBD(`listaUsuarios`)
    console.log(usuarios)

    console.log("SUMO USUARIOS POR API");
    usuarios = usuarios.concat(convertirUsuarios(usuariosApi()));
    localStorage.setItem(`listaUsuarios`, JSON.stringify(usuarios));
   
    console.log(usuarios)
}



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

