const NUMINTENTOS = 3;
class Usuario {

    constructor(nombre, apellido, email, password, contacto, sexo, movimientos) {

        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.password = password;
        this.contacto = contacto;
        this.sexo = sexo;
        // Registros de movimientos
        this.movimientos = movimientos;
        // Control Login
        this.nroIntentos = NUMINTENTOS;
        this.habilitado = true;
    }

    /**
     * Funcion para validar los datos ingresados de login 
     * @param {*} email : parametro correspondiente al usuario
     * @param {*} password : parametro correspondiente a la contraseña
     * @returns 
     */
    validarLogin(email, password) {

        let respuesta = [false, 0]


        if (this.nroIntentos > 0) {   // Verifica condicion de nro de intentos

            if ((this.email == email) && (this.password == password)) {    // Busca coincidencia por mail y contraseña (validacion)
                respuesta = [true, 0];
                this.resetNroIntentos();  //reset de numeros de intentos del usuario
                console.log("Al usuario: " + email + " se le restauraron sus " + (this.nroIntentos) + " intentos restantes");

            } else {


                if ((this.email == email)) {   // Busca coincidencia por mail (condicion para evaluar nro intentos)
                    this.nroIntentos -= 1;
                    console.log("El usuario: " + email + " tiene " + (this.nroIntentos) + " intentos restantes");
                    respuesta = [true, 1] // error de contraseña

                } else {

                    respuesta = [false, 2];      // usuario o contraseña invalidos     
                }
            }
        } else {
            if (this.email == email) {
                respuesta = [true, 3]       //usuario bloqueado
            } else {
                respuesta = [false, 2];      //usuario bloqueado pero no el buscado
            }

        }

        return respuesta;
    }

    /**
     * Agrega un nuevo movimiento al array de movimientos del usuario
     * @param {*} lote numero de operacion gral
     * @param {*} tipoOperacion tipo de operacion (1 para deposito, 2 para transferencia)
     * @param {*} importe importe a registrar en el movimiento
     * @param {*} cuentaDestino Cuenta con la que se realiza la operacion
     */
    registrarMovimiento(puntaje, descripcion, cantDias) {

        //definir descripcion del movimiento
        let lote = JSON.parse(localStorage.getItem(`idLote`));
        //console.log(lote);
        let numUltimoMov = this.movimientos.length + 1;
        
        //fecha elaboracion
        let hoy = new Date();
        let fechaElaboracion =  formatearFecha(hoy,0);
        let fechaVencimiento = formatearFecha(hoy,cantDias);

        let movEsterilizacion = new Movimiento(numUltimoMov, fechaElaboracion, lote, descripcion, puntaje, cantDias, fechaVencimiento);
       // console.log(movEsterilizacion);
        this.movimientos.push(movEsterilizacion);

        //console.log(this.movimientos)

        lote += 1;
        localStorage.setItem(`idLote`, lote);
    }



    mostrarResultado() {

        let acumulador = ``;
        let ultimoRegistro = this.movimientos.length - 1

        acumulador += `<tr>
                    <td>${this.movimientos[ultimoRegistro].puntaje} pts</td>
                    <td>${this.movimientos[ultimoRegistro].diasEsteriles} días</td>
                    <td>${this.movimientos[ultimoRegistro].vencimiento}</td>
                </tr>`

        document.getElementById(`detalleResultadoTabla`).innerHTML = acumulador;

    }

    /**
     * Muesta Todos los movimientos que ha realizado el usuario
     */

    mostrarMovimientos() {

        let acumulador = ``;

        for (let i = 0; i < this.movimientos.length; i++) {

            acumulador += `<tr>
                <td>${i + 1}</td>
                <td>${this.movimientos[i].fecha}</td>
                <td>${this.movimientos[i].lote}</td>
                <td>${this.movimientos[i].proceso}</td>
                <td>${this.movimientos[i].puntaje} pts</td>
                <td>${this.movimientos[i].diasEsteriles} días</td>
                <td>${this.movimientos[i].vencimiento}</td>
            </tr>`
        }

        document.getElementById(`detalleMovTabla`).innerHTML = acumulador;

    }

    /**
     * Funcion que resetea el valor de numeros de intentos permitidos por usuario para realizar el login
    */
    resetNroIntentos() {
        this.nroIntentos = NUMINTENTOS;
    }
}

function formatearFecha(fecha, cantDias) {

    let dia =""
    let mes = ""
    let resultado = "";

    var diaACalcular = new Date(fecha);
    diaACalcular.setDate(diaACalcular.getDate() + cantDias);
       

    if ((diaACalcular.getMonth() + 1) < 10) {
        mes = `0${diaACalcular.getMonth() + 1}`
    } else {
        mes = `${ diaACalcular.getMonth() + 1}`;
    }

    if (diaACalcular.getdiaACalcular < 10) {
        dia = `0${diaACalcular.getDate()}`
    } else {
        dia = `${ diaACalcular.getDate()}`;
    }
    
    resultado =  (`${dia} / ${mes} / ${diaACalcular.getFullYear()}`) ;
    return resultado;
}
    
