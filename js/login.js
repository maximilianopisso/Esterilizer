

var usuarios = [];
console.log(usuarios.length)

if (localStorage.listaUsuarios != null) {
    usuarios = recrearBD(`listaUsuarios`);
    console.log("CARGA LOCALSTORE - LISTADO USUARIOS");  //LO MUESTRO PARA QUE PUEDAN USAR LAS CREDENCIALES EN EL LOGIN
    console.log(usuarios);
}
    
else {
    console.log("CARGA POR CODIGO INICIAL");
    usuarios = loadInitialData();             //ESTE PASO PODRIA EVITARSE, PERO ES PARA USAR UN JUEGO DE USUARIOS DE PRUEBA CONOCIDOS PORQUE LO DE API SON ALEATORIOS
    console.log("SUMO USUARIOS POR API");
    concatenarUsuariosAPI();
} 




$("#formulario").submit(function (e) {
    console.log(usuarios)
    e.preventDefault();
    let email = $("#email").val();
    let pass = $("#password").val();
    //console.log(email, pass);
    validarUsuario(email, pass);
    
})
L

/**
  * Funcion para que pueda sumarse al listado local de usuarios los usuarios obtenidos por la API
  */
 async function concatenarUsuariosAPI(){
      try{
         const data = await usuariosAspi();
         usuarios = usuarios.concat(convertirUsuarios())
      }
      catch(err){
        alert("NO SE PUDO CARGAR DATOS POR API")
     }
     localStorage.setItem(`listaUsuarios`, JSON.stringify(usuarios));
     console.log(usuarios) //LO MUESTRO PARA QUE PUEDAN USAR LAS CREDENCIALES EN EL LOGIN
 }


/**
 * FUNCION PARA VALIDAR DATOS INGRESADOS EN LOGIN
 * @param {*} email : PARAMETRO PARA EL EMAIL
 * @param {*} password: PARAMETRO PARA LA CONTRASEÑA
 */
function validarUsuario(email, password) {
    let respuesta = [];
    let encontrado = false;
    let indice_error =""

    for (let i = 0; i < usuarios.length; i++) {
        // console.log(email + password + usuarios[i].email + usuarios[i].password +usuarios.length);
        //LLama a la funcion de validacion del propio usuario para chequaer su usuario y contraseña con el enviados a traves del metodo.

        respuesta = usuarios[i].validarLogin(email, password)

        if (respuesta[0] == true && respuesta[1]==0) {
            encontrado = true;
            localStorage.setItem(`listaUsuarios`, JSON.stringify(usuarios))   // la validacion resetea nro intentos, tengo que guardarla en el locallocalStore
            localStorage.setItem("userID", i);
            //Guardo informacion del usuario en el local para levantarlo en el otro js.
            break;

        }else{

            if(respuesta[0] == true && ((respuesta[1]==1) || (respuesta[1]==3))) {
               localStorage.setItem(`listaUsuarios`, JSON.stringify(usuarios))   // la comprobacion de mail resta nro intentos, tengo que guardarla en el localStore
               encontrado = false;
               indice_error =i        //esto se hace para mostrar intento fallido por usuario correcto y no contraseña
               break; 
            }
        }
    }

    // si es encotrador, muesta que se pudo validar sino no.
    if (encontrado) {
        location.href = "./esterilizer.html";

    } else {
        $("#formulario")[0].reset();
        
        switch (respuesta[1]) {

            case 1: 
                    if(usuarios[indice_error].nroIntentos == 0){
                        $("#msjerror").html(`La contraseña es incorrecta. Su usuario fue bloqueado`)
                    }else{
                        $("#msjerror").html(`La contraseña es incorrecta. Nro Intentos: ${usuarios[indice_error].nroIntentos}`)
                    }
                break;
            case 2:$("#msjerror").html(`El usuario o la contraseña son incorrectos`)
                break;
            case 3: $("#msjerror").html(`Tu usuario ha sido BLOQUEADO`)
                break;
        }
        $("#msjerror").show(100)
                      .delay(5000)
                      .hide(100)
    }
}

/**
 * FUNCION PARA ARMAR EL LISTADO DE USUARIOS CUANDO YA EXISTE EN EL LOCALSTORE
 *  @returns LISTA DE USUARIOS CARGADOS
 */

