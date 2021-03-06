var DataStore = require("nedb");

var dbFileName = __dirname + "/rape-stats.db";

var db = new DataStore({
    filename: dbFileName,
    autoload: true
});

/******INICIAR LOS DATOS******/

module.exports.getInitialData = (request, response) => {


    //Comprueba que la base de datos no esté vacía

    if (db != null || db.length != 0) {
        //recorremos la base de datos
        db.find({}, function(error, conjunto) {
            if (error) {
                console.error(' Error from DB');
                response.sendStatus(500); //Internal server error 
            }
            else {


                /*Comprobamos que el conjunto no esté vacío*/
                if (conjunto.length !== 0) {

                    console.log("la base de datos ya está creada");
                    response.sendStatus(409); //Conflicto,la base de datos ya estaba inicializada

                }
                else {
                    db.insert([{
                        "country": "france",
                        "year": 2004,
                        "number-of-rape": 10408,
                        "rate": 17.4,
                        "total-since-two-thousand": 20914
                    }, {
                        "country": "france",
                        "year": 2009,
                        "number-of-rape": 10108,
                        "rate": 16.2,
                        "total-since-two-thousand": 71208
                    }, {
                        "country": "germany",
                        "year": 2010,
                        "number-of-rape": 7724,
                        "rate": 9.4,
                        "total-since-two-thousand": 25730
                    }, {
                        "country": "germany",
                        "year": 2005,
                        "number-of-rape": 8133,
                        "rate": 9.9,
                        "total-since-two-thousand": 12017

                    }, {
                        "country": "belgium",
                        "year": 2006,
                        "number-of-rape": 3194,
                        "rate": 30.5,
                        "total-since-two-thousand": 24319

                    }, {
                        "country": "belgium",
                        "year": 2010,
                        "number-of-rape": 2991,
                        "rate": 27.9,
                        "total-since-two-thousand": 20914

                    }, {
                        "country": "italy",
                        "year": 2004,
                        "number-of-rape": 3734,
                        "rate": 6.4,
                        "total-since-two-thousand": 6478
                    }, {
                        "country": "sweden",
                        "year": 2003,
                        "number-of-rape": 2235,
                        "rate": 25,
                        "total-since-two-thousand": 2235
                    }, {
                        "country": "sweden",
                        "year": 2010,
                        "number-of-rape": 5960,
                        "rate": 63.5,
                        "total-since-two-thousand": 34583

                    }, {
                        "country": "netherlands",
                        "year": 2007,
                        "number-of-rape": 2095,
                        "rate": 12.7,
                        "total-since-two-thousand": 10465

                    }, {
                        "country": "netherlands",
                        "year": 2008,
                        "number-of-rape": 1920,
                        "rate": 11.6,
                        "total-since-two-thousand": 12385

                    }, {
                        "country": "ukraine",
                        "year": 2009,
                        "number-of-rape": 758,
                        "rate": 1.7,
                        "total-since-two-thousand": 1048

                    }, {
                        "country": "ukraine",
                        "year": 2003,
                        "number-of-rape": 1048,
                        "rate": 2.2,
                        "total-since-two-thousand": 6445

                    }, {
                        "country": "portugal",
                        "year": 2008,
                        "number-of-rape": 392,
                        "rate": 3.7,
                        "total-since-two-thousand": 392

                    }, {
                        "country": "portugal",
                        "year": 2010,
                        "number-of-rape": 424,
                        "rate": 4,
                        "total-since-two-thousand": 2856

                    }]);

                    
                console.log("La base de datos se ha creado correctamente");
                    response.sendStatus(201);
                }
            }
        });
    }
    else {
        //TODO: Otro control más para manejar los erroes, section 2
        console.log("No se ha inicialiazado la base de datos correctamente, SECTION 2 ERROR");
        response.sendStatus(500);

    }

};



/**********************************GET***************************/
//Get a un conjunto de datos


module.exports.getAllData = (request, response) => {

    if (checkdb(db) == false) {
        response.sendStatus(500); //Algo pasa con la base de datos
    }
    else {

        db.find({}, function(error, data) {

            if (error) {
                console.log("Error en el section 2 get all data");
                response.sendStatus(500);
            }
            else {

                if (checkdb(data) == false) {
                    console.log("section 3 all data error");
                    response.sendStatus(404); // No hay datos
                }
                else {
                    
                    response.send(data);

                }
            }
        });

    }


};


//Get a un recurso en concreto por nombre y año


module.exports.getSingleDataNameYear = (request, response) => {

    //cogemos los datos que pasamos en la url como parámetros    
    var country = request.params.name;
    var year = request.params.year;
    var conjuntoAux = [];

    if (compruebaDatosURL(country, year) == false) {

        console.log("Error al introducir el nombre o el año, section 1 getSingleDataNameYear error");
        response.sendStatus(400);

    }

    if (checkdb(db) == false) {

        response.sendStatus(500);

    }
    else {


        db.find({}, function(error, datos) {
            if (checkdb(datos) == false) {
                response.sendStatus(404);
            }
            else {

                filtradoNombreAnio(datos, conjuntoAux, country, year);

            }

            if (conjuntoAux.length === 0) {

                console.log("el conjunto auxiliar no ha guardado ningún dato, luego no lo ha encontrado");
                response.sendStatus(404);

            }
            else {

                response.send(conjuntoAux);
            }

        });

    }

};


//GET a un recurso por nombre o anio 

module.exports.getData = (request, response) => {

    var parametro = request.params.name;
    var aux = [];
    var year = null;

    if (!parametro || parametro == null) {

        console.log("No has introducido correctamente los datos, get data error section 1");
        response.sendStatus(400);
    }
    else {

        if (checkdb(db) == false) {
            response.sendStatus(500);
            process.exit();
        }
        else {

            db.find({}, function(error, datos) {
                if (checkdb(datos) == false) {
                    response.sendStatus(500);
                }
                else {

                    filtradoNombreAnio(datos, aux, parametro, year);

                    if (aux.length == 0) {
                        console.log("no se ha encontrado ningún dato");
                        response.sendStatus(404);
                    }
                    else {
                        response.send(aux);

                    }

                }

            });

        }


    }


};



/***********************POST***************************/

// post a un dato en concreto no debe estar permitido
module.exports.postDenied = (request, response) => {

    console.log("hemos hecho un post a un dato en concreto, método no permitido");
    response.sendStatus(405);



};


//post al grupo completo, deberá crear el dato
module.exports.postDataGroup = (request, response) => {

    var parametros = request.body;
    var conflicto = [];
    console.log("compruebo ahora que el dato que he cogido no esté vacío");
    if (!parametros || parametros == null) {
        console.log("no hay parametros");
        response.sendStatus(400);

    }
    else {
        if (chequeaParametro(parametros) == false) {

            console.log("Bad request, algunos parámetros están mal");
            response.sendStatus(400);
        }
        else {

            if (checkdb(db) == false) {
                response.sendStatus(500);

            }
            else {

                db.find({}, function(error, datos) {
                    conflicto = datos.filter((x) => {
                        return parametros.country == x.country && parametros.year == x.year
                    }).map((x) => {
                        return conflicto.push(x);
                    });

                    if (conflicto.length != 0) {

                        console.log("El dato ya estaba creado");
                        response.sendStatus(409);

                    }
                    else {

                        db.insert(parametros);
                        console.log("dato creado correctamente");
                        response.sendStatus(201);

                    }

                });
            }
        }

    }

};


/***********************PUT****************************/

module.exports.putDenied = (request, response) => {

    console.log("no está permitido hace put a un conjunto de datos");
    response.sendStatus(405);
};

module.exports.putSingleData = (request, response) => {

    var pais = request.params.name;
    var anio = request.params.year;
    var datoActualizar = request.body;

    if (compruebaDatosURL(pais, anio) == false) {

        console.log("los datos año o país están mal introducidos");
        response.sendStatus(400);
    }
    else {

        if (checkdb(db) == false) {

            console.log("fallo base de datos en el  put single data, section 1");
            response.sendStatus(500);

        }
        else {

            if (chequeaParametro(datoActualizar) == false) {
                console.log("Algunos parámetros del dato nuevo que has introducido son incorrectos");
                response.sendStatus(400);
            }
            else {

                if (pais === datoActualizar.country && parseInt(anio) === parseInt(datoActualizar.year)) {
                    db.update({
                        country: pais,
                        year: parseInt(anio)
                    }, {
                        country: datoActualizar.country,
                        year: datoActualizar.year,
                        ["number-of-rape"]: datoActualizar["number-of-rape"],
                        rate: datoActualizar.rate,
                        ["total-since-two-thousand"]: datoActualizar["total-since-two-thousand"]

                    });
                    response.sendStatus(200); //OK

                }
                else {

                    console.log("No puedes modificar el país o el año, procura que tenga los mismos datos");
                    response.sendStatus(405);
                }
            }
        }
    }
};


/***********************DELETE****************************/

module.exports.deleteData = (request, response) => {

    var name = request.params.name;
    var yearAux = request.params.year;

    if (compruebaDatosURL(name, yearAux) == false) {

        console.log("Al hacer delete los datos de la url no se han puesto correctamente");
        response.sendStatus(400);
    }
    else {

        if (checkdb(db) == false) {

            console.log("Algo ocurre con la base de datos, error delete single data section 1");
            response.sendStatus(500);

        }
        else {

            db.remove({ country: name, year: parseInt(yearAux) }, {}, function(err, num) {
                if (err) {
                    console.error(err);
                }
                console.log("numero de datos eliminados: " + num);

                if (num == 0) {
                    console.log("No se ha podido eliminar ningún dato");
                    response.sendStatus(404);
                }
                else {
                    response.sendStatus(204);
                }
            });

        }

    }

};

module.exports.deleteAll = (request, response) => {
    var tamanio = db.length;
    if (checkdb(db) == false) {
        response.sendStatus(500);
    }
    else {


        db.remove({}, { multi: true }, function(err, num) {
            if (err) {
                console.error(err);
                response.sendStatus(500);
            }
            console.log("numero de datos eliminados: " + num);
            if (num == tamanio) {
                console.log("No se ha borrado ningún dato");
                response.sendStatus(404);

            }
            else {
                response.sendStatus(204);
            }
        });

    }

};



/************MÉTODOS AUXILIARES***********/


//Métodos auxiliares
var chequeaParametro = function(parametros) {

    if (parametros.country == null || parametros.country == "" ||
        parametros.year == null || parametros.year == "" ||
        parametros["number-of-rape"] == null || parametros["number-of-rape"] == "" ||
        parametros.rate == null || parametros.rate == "" ||
        parametros["total-since-two-thousand"] == null || parametros["total-since-two-thousand"] == "") {

        console.log("hay alguno datos nulos o vacíos");
        return false;
    }
    else {

        if (isNaN(parametros.country) == false || isNaN(parametros.year) == true ||
            isNaN(parametros["number-of-rape"]) == true || isNaN(parametros.rate) == true ||
            isNaN(parametros["total-since-two-thousand"]) == true) {
            console.log("alguno de los parámetros están mal introducidos");
            return false;
        }
        else {
            return true;
        }
    }
};

var compruebaDatosURL = function(pais, anio) {

    if (!pais || !anio || isNaN(pais) == false || isNaN(anio) == true) {
        return false;

    }
    else {
        return true;
    }
};

var filtradoNombreAnio = function(datos, aux, country, year) {

    if (year == null) {
        if (isNaN(country)) {
            datos.filter((x) => {
                return x.country == country;

            }).map((x) => {
                return aux.push(x);
            });
        }
        else {
            datos.filter((x) => {
                return x.year == parseInt(country);
            }).map((x) => {
                return aux.push(x);
            });
        }
    }
    else {
        datos.filter((x) => {
            return x.country == country && x.year == parseInt(year);
        }).map((x) => {
            return aux.push(x);
        });
    }





};

var checkdb = function(database) {

    if (!database || database == null || database.length === 0) {
        console.log("la base de datos está vacía, get all data, section 1");
        return false;
    }
    else {
        return true;
    }

};
