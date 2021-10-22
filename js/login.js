
let usuarios = [];
let usuarios2 = [];

if (localStorage.listaUsuarios != null) {
    console.log("LISTADO USUARIOS - SE CARGA DESDE LOCALSTORE");
    usuarios = recrearBD(`listaUsuarios`);
    

} else {
    console.log("LISTADO USUARIOS - SE CARGA CON DATOS INICIALIALES");
    usuarios = loadInitialData();
    usuarios = usuarios.concat(usuariosApi());  //Esta linea no funciona en la 1er por la demora de la consulta a la API
    localStorage.setItem(`listaUsuarios`, JSON.stringify(usuarios));
    
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