var dataCorto = data.results[0].members; // NOMBRE CORTO ARRAY MIEMBROS
var dataTable = ""; // TABLA MIEMBROS
var partyS = Array.from(document.querySelectorAll("input[name=party]:checked")).map(elt => elt.value); // CREA ARRAY CON PARTIDOS SELECCIONADOS
var states = []; // ARRAY DE ESTADOS PARA CREAR EL SELECT
var selectS = "<option selected value=\"\"></option>"; // INICIO CADENA MENÚ SELECT
var stateS = document.querySelector("#stateFilter").value; // ESTADO SELECCIONADO


// CREA ARRAY DE ESTADOS ORDENADOS
function getState(valor, i) {
    if(!states.includes(valor.state)){
        states.push(valor.state);
    }
}
dataCorto.forEach(getState);
states.sort();


// CREA MENÚ SELECT DE ESTADOS
function createMenu() {
    states.forEach(item => {
       selectS += "<option value=\"" + item + "\">" + item + "</option>";
    });
    return selectS; 
}
createMenu();
document.getElementById("stateFilter").innerHTML = selectS;


// RECORRE ARCHIVO CON JSON Y CREA TABLA - MUESTRA MIEMBROS
function createTable(item, i){ 	    
	if (item.middle_name == null) {
		item.middle_name = "";
	}
	dataTable += "<tr><td><a href = \"" + item.url + "\" target=_blank>" + item.last_name + ", " + item.first_name + " " + item.middle_name + "</a></td><td class = \"centerT party\">" + item.party + "</td><td class = \"centerT state\">" + item.state + "</td><td class = \"centerT\">" + item.seniority + "</td><td class = \"centerT\">" + item.votes_with_party_pct + " %" + "</td></tr>";
};


// FILTRA POR ESTADO
function filterData(stateS, partyS) { 
    if (!stateS && partyS.length == 3) {           
        return dataCorto.forEach(createTable);           
    }else{ 
        filterArray = dataCorto.filter(myFilter);    
        return filterArray.forEach(createTable);
    }
}


// FILTRO COMBINADO
var myFilter = item => {
    if (partyS.indexOf(item.party) != -1 && (!stateS || stateS == item.state)) {
        return item;
    }
}


function refreshTable() { // ACTUALIZA CONTENIDOS
    dataTable = "";
    stateS = document.querySelector("#stateFilter").value;
    partyS = Array.from(document.querySelectorAll("input[name=party]:checked")).map(elt => elt.value);
    filterData(stateS, partyS);
    document.getElementById("sm").innerHTML = dataTable;
}


//CARGA DE DATOS AL INICIO
filterData(stateS, partyS);
document.getElementById("sm").innerHTML = dataTable;

