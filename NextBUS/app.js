
function keyEventCB(event) {
    if (event.keyName === 'back') {
        try {
            tizen.application.getCurrentApplication().exit();
        } catch (ignore) {
        }
    }
}

/* Función para obtener el tiempo en formato '3 min 20 secs.' */
function secondsToSpanish(seconds){
  var MAX_SECONDS = 999999;
  var SECONDS_PER_MINUTE = 60;
  var retorno;

  if (seconds === MAX_SECONDS) {
    retorno = '+20m';
  } else if (seconds === 0 ){
    //retorno = 'En parada.';
	  retorno = TIZEN_L10N["atstop"];
  } else if (seconds < SECONDS_PER_MINUTE) {
    retorno = seconds + ' secs.';
  } else {
    var module = seconds % SECONDS_PER_MINUTE;
    var minutes = (seconds - module) / SECONDS_PER_MINUTE;
    retorno = minutes + ' min ' + module + ' secs.';
  }
  return retorno;
}



function g(idStop){
var cultureInfo = 'es';
var emtApiIdClient = 'WEB.SERV.....@gmail.com';
var emtApiPasskey = 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';
var busItem =0;

if (idStop === 0){
	  //document.getElementById("infoPB").innerHTML=" Utiliza el Bisel <br>para escoger la parada.";
    document.getElementById("infoPB").innerHTML=TIZEN_L10N["usebezel"];
	
}else{

    /* Preparar la llamada a la API */
    var formData = new FormData();
    formData.append('cultureInfo', cultureInfo);
    formData.append('idStop', idStop);
    formData.append('idClient', emtApiIdClient);
    formData.append('passKey', emtApiPasskey);

    /*Crear XMLHttpRequest, vincular funciones de callback y enviar petición */
    var XHR = new XMLHttpRequest();

    /* Función de callback si la petición tiene éxito */
    XHR.addEventListener('load', function() {	
      var vInfoBus = document.getElementById("infoPB");
      var jsonData = JSON.parse(XHR.responseText);
      //document.getElementById("infoPB").innerHTML=XHR.responseText;
      vInfoBus.innerHTML="";
      if ( jsonData.arrives != null ){ 
          for (busItem; busItem < jsonData.arrives.length; busItem++){
        	  vInfoBus.innerHTML+=" Linea "+jsonData.arrives[busItem].lineId+" ";
        	  vInfoBus.innerHTML+=jsonData.arrives[busItem].destination+" ";
        	  vInfoBus.innerHTML+=" a "+secondsToSpanish(jsonData.arrives[busItem].busTimeLeft)+" <br> ";
          }
      }else{ // jsonData.arrives === null
    	 // vInfoBus.innerHTML="No hay información. Comprueba el número de la parada.";
    	  vInfoBus.innerHTML=TIZEN_L10N["noinfo"];
      }
});

  // Comprovando el estado de la petición.  
  XHR.onreadystatechange = function () {
	  //console.log("STATUS: "+XHR.status );
      if(XHR.readyState === XMLHttpRequest.DONE && XHR.status === 200) {
         // console.log(XHR.responseText);
      }else{
    	  if(XHR.readyState === XMLHttpRequest.DONE && XHR.status === 0){
       	  //console.log("Check Internet connection. ReadyState:"+XHR.readyState+" Status:"+XHR.status);
    		  var vInfoBus = document.getElementById("infoPB");	  
    	   	  //vInfoBus.innerHTML="Comprueba la connexión a Internet.";
    		  vInfoBus.innerHTML=TIZEN_L10N["checkinet"];
    	   	 	   
    	  }
      }
  };
  
  
 /* Enviar petición */
 XHR.open('POST', 'https://openbus.emtmadrid.es/emt-proxy-server/last/geo/GetArriveStop.php');
 XHR.send(formData);

 }
 
}


///// Rotary Event

var nParada = 0;  // número de la parada de bus.
var cont = 0; // sirve para comprovar si se ha movido el bisel. 0 no se ha movido el bisel.
var min = 0;
var max = 9;

(function(){
   var progressBar,
      progressBarWidget,
      resultDiv,
      value,
      direction,
      rotaryDetentHandler = function(e) {
	   
	   
        // Mejor si solo se ejecuta una vez.
		//document.getElementById("infoPB").innerHTML="Toca la pantalla para cambiar de dígito.<br>";
	   document.getElementById("infoPB").innerHTML=TIZEN_L10N["changedigit"];
		cont = 1; // se ha movido el bisel.
         // Get rotary direction
         direction = e.detail.direction;

         if (direction === "CW") {
            // Right direction
            if (nParada<max) {        	
            	nParada = nParada + 1; // Incrementar el contador.
            }	 
        	 
        	 
            if (parseInt(progressBarWidget.value(), 10) < 100) {
               value = parseInt(progressBarWidget.value(), 10) + 10;
            } else {
               value = 100;
               
        	 value++;
            }
            
            
         } else if (direction === "CCW") {
            // Left direction
        	if (nParada>min) {
        		nParada = nParada - 1; // Incrementar el contador.
         	}
         	 
            if (parseInt(progressBarWidget.value(), 10) > 0) {
               value = parseInt(progressBarWidget.value(), 10) - 10;
            } else {
               value = 0;
            }
            
        	 value--;
         }
                 
         document.getElementById("vnParada").innerHTML=nParada; // Parada BUS.
     	
         
         resultDiv.innerText = value + "%";
         progressBarWidget.value(value);
      };	

   document.addEventListener("pagebeforeshow", function() {
      resultDiv = document.getElementById("result");

      progressBar = document.getElementById("circleprogress");
      progressBarWidget = new tau.widget.CircleProgressBar(progressBar, {size: "large"});
      resultDiv.innerText = progressBarWidget.value() + "%";

      // Add rotarydetent handler to document
      document.addEventListener("rotarydetent", rotaryDetentHandler);
   });

   document.addEventListener("pagehide", function() {
      progressBarWidget.destroy();
      document.removeEventListener("rotarydetent", rotaryDetentHandler);
   });
}());


function vcont(){
	/*
	Si haces click 
	nParada = nParada *10;
	max = max +10;
	min = min +10;
	
	
	cont = cont + inc; // Aplicamos el incremento.
	document.getElementById("vCont").innerHTML=cont; // Actulizamos el contador.
	*/
	
    document.getElementById("vnParada").innerHTML+="_"; // Parada BUS.
    //document.getElementById("infoPB").innerHTML=" Confirma la parada con otro toque. ";
    document.getElementById("infoPB").innerHTML=TIZEN_L10N["confirm"];
	   
    //Buscamos el caràcter '_' para saber si ha movido el bisel.
    if(cont===0){
    	
    	
    	// No se ha modificado nParada -> tenemos un dbclick.
    	//alert(nParada/10);
    	if(nParada>9) {
    		nParada = nParada/10; // Para los números de más de un dígito.
    	}
    	document.getElementById("vnParada").innerHTML=nParada;
    	// Obteniendo información parada.
		//document.getElementById("infoPB").innerHTML="Obteniendo información parada.";
    	document.getElementById("infoPB").innerHTML=TIZEN_L10N["oInfo"];
    	g(nParada);
    	// Volver a inicializar.
    	nParada = 0;
    	min = 0;
    	max = 9;
    	
    		
    }else {
    	
    	nParada = nParada *10;
    	max = nParada+9;
    	min = nParada;
       // cont = nParada; // guardamos en cont el número de la parada.

    }
    cont = 0; 
}

document.addEventListener("click", vcont);



function setDefaultEvents() {
    document.addEventListener('tizenhwkey', keyEventCB);
}


function init() {
    setDefaultEvents();
    document.getElementById("vnParada").innerHTML=TIZEN_L10N["busStop"];
    document.getElementById("infoPB").innerHTML=TIZEN_L10N["usebezel"];

}

window.onload = function() {
    init();
};
