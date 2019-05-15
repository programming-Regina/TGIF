 var members = data.results[0].members;
 var parties = [];
 var seleccion = [];
 var name = "";
 var porcentaje = 0;
 var maximo = 0;
 var indice = 0;
 var cadena = ""; // PARA EL ARMADO DE TABLA innerHTML
 var engaged = false; // bandera que indica si estoy en la página de attendance 
 var paso = false; // bandera que verifica si ya cargué la tabla least... de cualquier página
 var pCampo = 0; // CAMPOS A MOSTRAR SEGÚN LA PAGINA EN QUE ESTOY
 var sCampo = 0;
 var pathname = window.location.pathname;
 var engaged = pathname.includes("attendance") ? true : false;

 ids.forEach(function (id) {
 	parties.push({
 		"idParty": id.id,
 		"party": id.party,
 		"membersP": members.filter(m => m.party == id.id),
 		"idReps": id.idReps,
 		"reps": 0,
 		"idAtt": id.idAtt,
 		"attendance": 0,
 		"idLoyal": id.idLoyal,
 		"loyalty": 0,
 		"idEngaged": "mVotes",
 		"engaged": 0,
 		"idpMissed": "pMissed",
 		"pMissed": 0,
 	})
 });


// CARGA AT GLANCE: CANTIDAD DE REPRESENTANTES Y LOYALTY DE CADA PARTIDO
 parties.forEach(function (partido) {
 	partido.reps = partido.membersP.length;
 	partido.membersP.forEach(function (votes) {
 		partido.loyalty += (votes.votes_with_party_pct);
 	});
 	!partido.loyalty == 0 ? partido.loyalty /= partido.reps : partido.loyalty = 0;
 });



 // FILTRA SEGÚN LA PÁGINA Y TABLA QUE NECESITO MOSTRAR 
 function filtra(paso, engaged) {
 	cadena = "";
 	var ordenado = members.sort(function (a, b) {
 		if (!paso && !engaged) { // SI NO PASÓ POR LEAST LOYAL / PÁGINA LOYALTY - ORDENA PARA LEAST LOYAL
 			return (a.votes_with_party_pct - b.votes_with_party_pct)
 		} else {
 			if (paso && !engaged) // SI YA PASÓ POR LEAST LOYAL / PÁGINA LOYALTY - ORDENA PARA MOST LOYAL
 				return (b.votes_with_party_pct - a.votes_with_party_pct)
 		}
 		if (!paso && engaged) { // SI NO PASÓ POR LEAST ENGAGED / PÁGINA ATTENDANCE - ORDENA PARA LEAST ENGAGED
			return (b.missed_votes_pct - a.missed_votes_pct) 			
 		} else { // SI YA PASÓ POR LEAST ENGAGED / PÁGINA ATTENDANCE - ORDENA PARA MOST ENGAGED
 			return (a.missed_votes_pct - b.missed_votes_pct)
 		}
 	});

 	var seleccion = [];
 	do {
 		seleccion[seleccion.length] = ordenado[seleccion.length];
 		porcentaje = seleccion.length / ordenado.length;
 	} while (porcentaje < 0.1 || (ordenado[seleccion.length].votes_with_party == seleccion[seleccion.length - 1].votes_with_party_pct)); // AGREGA SI EL PORCENTAJE LLEGA A 10% O EL REGISTRO ACTUAL = AL SIGUIENTE


 	//GENERA LOS REGISTROS DE LA TABLA
 	seleccion.forEach(function (i) {
 		name = i.middle_name != null ? i.last_name + ", " + i.first_name + " " + i.middle_name : i.last_name + ", " + i.first_name + " ";
 		pCampo = engaged ? i.missed_votes : i.total_votes;

 		if (engaged) {
 			sCampo = i.missed_votes_pct < 10 ? " " + i.missed_votes_pct.toFixed(2) : i.missed_votes_pct.toFixed(2);
 		} else {
 			sCampo = i.votes_with_party_pct.toFixed(2);
 		}
 		cadena += "<tr><td>" +
 			name + "</td><td class = \"rightA\">" + pCampo + "</td><td class = \"rightA\">" + sCampo + "% </td></tr>";
 	});
 	return cadena;
 }


 //CHEQUEA LAS BANDERAS, PIDE EL FILTRO QUE NECESITA Y MUESTRA TABLA
 if (!engaged) {
 	filtra(false, false);
 	document.getElementById("leastLoyal").innerHTML = cadena;
 	filtra(true, false);
 	document.getElementById("mostLoyal").innerHTML = cadena;
 } else {
 	filtra(false, true);
 	document.getElementById("leastEngaged").innerHTML = cadena;
 	filtra(true, true);
 	document.getElementById("mostEngaged").innerHTML = cadena;
 }


 // MUESTRA DATOS
 parties.forEach(function (valor) {
 	document.getElementById(valor.idReps).innerHTML = valor.reps;
 	!valor.loyalty ? document.getElementById(valor.idLoyal).innerHTML = " " + valor.loyalty.toFixed(2) + " %" : document.getElementById(valor.idLoyal).innerHTML = valor.loyalty.toFixed(2) + " %";
 });
