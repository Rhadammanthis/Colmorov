'use strict';
const angular = require('angular');

class AgendaComponent {

	$http: any;
  $location: any;
  $mdDialog: any;
  $mdMedia: any;
  ready: boolean = true;
	Auth: any;
	$scope: any;
	editarService: any;
  constructor($http, $rootScope, $scope, $location, $mdDialog, $mdMedia, Auth, editarService) {
    this.$http = $http;
    this.$location = $location;
    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;
	  this.Auth = Auth;
		this.$scope = $scope;
		this.editarService = editarService;
		var body = {};
		var bodyDelete = {}
		var selectedItem = {};
		$rootScope.title = 'Agenda';
		$rootScope.show = 'map';

		$rootScope.mapSend = function(){
			$rootScope.temp = {};
			$rootScope.tem.fecha = $scope.fecha;
		}

$scope.selectedDate = [];
/*------- Inicio se agrega para el manejo de la 'Material Design Data Table' -------*/
	$scope.selected = [];
  $scope.limitOptions = [5, 10, 15];
  
  $scope.options = {
    rowSelection: true,
   	multiSelect: false,
    autoSelect: false,
    decapitate: false,
    largeEditDialog: false,
    boundaryLinks: false,
    limitSelect: true,
    pageSelect: true
  };
  
  $scope.query = {
    order: 'nombre',
    limit: 5,
    page: 1
  };

  $scope.fecha = new Date();


	//Obtiene los eventos
	console.log("Uno",$rootScope.tem);
	body={id:{cdgpe:$rootScope.tem.id.cdgpe}};
	body["fecha"] = $scope.fecha.getTime();
		console.log(body);
		this.$http.post("api/eventos/buscar", body, {headers: {'Content-Type': 'application/json'} })
        .then(function (response) {
            $scope.eventos = response.data;
            //var siguiente = response.data.siguiente //Para paginación
            console.log(response.data);
    });

  
  $scope.toggleLimitOptions = function () {
    $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
  };
  

  $scope.fecha = new Date();
  $scope.fHasta = new Date();
  
  $scope.tiempoRecorrido = function (registrofin, registroini):String {

  if(registrofin != null && registroini != null)
  {
    
	//La diferencia se da en milisegundos
		var milisegundos = (registrofin-registroini);

	// Se calcula la fecha en base a los milisegundos
		var fechaMili = new Date(milisegundos);

	// se define el tiempo unix como base (Tiempo Unix es un sistema para la descripción de instantes de tiempo: se define como la cantidad de milisegundos transcurridos desde las 00:00:00 UTC del 1 de enero de 1970.)
		var date = new Date('1970-01-01 12:0:00:00');
		var dateMsec = date.getTime();
	
	// se resta el tiempo en milisegundos de nuestras fechas a los milisegundos del tiempo base.
	// y se obtienen las hh:mm:ss transcurridos.
		var FechaTiempo = new Date(fechaMili.getTime()-dateMsec );

	// Se valida que el retorno sea una fecha válida.
		console.log(registroini)
		if(FechaTiempo.toString() === "Invalid Date")
		{ 
			//var date = new Date('1970-01-01 00:0:00:00');
			//return date;
			return "No definido";
		}
		else
		{
		     return FechaTiempo.toString();
		}
	}
	else
	{
		return "No definido";
	}
  };

  $scope.loadStuff = function () {
    // $scope.promise = $timeout(function () {
    //   // loading
    // }, 2000);
  }
  
  $scope.logItem = function (item) {
		selectedItem = item;
		console.log("item " + selectedItem["nombre"]);
    console.log(item.nombre, 'was selected');
  };
  
  $scope.logOrder = function (order) {
    console.log('order: ', order);
  };
  
  $scope.logPagination = function (page, limit) {
    console.log('page: ', page);
    console.log('limit: ', limit);
  }

	$scope.dateChange = function () {
		$scope.selected = [];
		body["fecha"] = $scope.fecha.getTime();
		console.log(body);
		$http.post("api/eventos/buscar", body, {headers: {'Content-Type': 'application/json'} })
        .then(function (response) {
            $scope.eventos = response.data;
            //var siguiente = response.data.siguiente //Para paginación
            console.log(response.data);
    });
	}

	$scope.eliminar = function (ev) {
		// Appending dialog to document.body to cover sidenav in docs app
		if($scope.selected.length >0){
			var confirm = $mdDialog.confirm()
						.title('¿Está seguro de eliminar el evento seleccionado?')
						.ariaLabel('Eliminar')
						.targetEvent(ev)
						.ok('Aceptar')
						.cancel('Cancelar');
			$mdDialog.show(confirm).then(function() {
				bodyDelete = {id:{cdgev:0},fecha: 0};
					bodyDelete["id"].cdgev = selectedItem["id"].cdgev;
					bodyDelete["fecha"] = selectedItem["fecha"];
					console.log(bodyDelete);
					$http.post("api/eventos/eliminar", bodyDelete, {headers: {'Content-Type': 'application/json'} })
							.then(function (response) {
									console.log(response.data);
									selectedItem = {};
									$scope.selected = [];
									$http.post("api/eventos/buscar", body, {headers: {'Content-Type': 'application/json'} })
											.then(function (response) {
													$scope.eventos = response.data;
													//var siguiente = response.data.siguiente //Para paginación
													console.log(response.data);
									});
					});
			});
		}
	}

	$scope.editar = function () {
		if($scope.selected.length >0){
			editarService.setCdgev(selectedItem["id"].cdgev);
			editarService.setCdgcl(selectedItem["id"].cdgcl);
			editarService.setCdgclns(selectedItem["id"].cdgclns);
			editarService.setCdgns(selectedItem["id"].cdgns);
			editarService.setNombre(selectedItem["nombre"]);
			editarService.setDescripcion(selectedItem["descripcion"]);
			editarService.setDireccion(selectedItem["direccion"]);
			editarService.setLocalizacion(selectedItem["localizacion"]);
			$location.path('/monitoreo/agenda/editar');
			console.log("Entro editar");
		}		
	}

	$scope.showAdvanced = function(ev) {
		if($scope.selected.length >0){
			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'app/monitoreo/agenda/dialog.html',
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			})
			.then(function(selectedDates) {
				var bodyCrear = {
													id:{
															cdgpe:null,
															cdgclns:null,
															cdgcl:null,
															cdgns:null,
															clns:null
													},
													nombre:null,
													direccion:null,
												  localizacion:null,
													descripcion:null,
													fechas:[]
												}
				bodyCrear.id.cdgpe = selectedItem["id"].cdgpe;
				bodyCrear.id.cdgclns = selectedItem["id"].cdgclns;
				bodyCrear.id.cdgcl = selectedItem["id"].cdgcl;
				bodyCrear.id.cdgns = selectedItem["id"].cdgns;
				bodyCrear.id.clns = selectedItem["id"].clns;
				bodyCrear.nombre = selectedItem["nombre"];
				bodyCrear.direccion = selectedItem["direccion"];
				bodyCrear.localizacion = selectedItem["localizacion"];
				bodyCrear.descripcion = selectedItem["descripcion"];
				bodyCrear.fechas = selectedDates;
				console.log(bodyCrear);
				$http.post("api/eventos/crear", bodyCrear, {headers: {'Content-Type': 'application/json'} })
										.then(function (response) {
												console.log(response.data);
										})
										.catch(err => {
											// ready = true;
											console.log(err);
											// showAlert(ev,err);
										});
			}, function() {
				$scope.status = 'You cancelled the dialog.';
			});
		}
  };

	function DialogController($scope, $mdDialog) {
		this.$scope = $scope;
		this.$scope.selectedDate = [];
		this.$scope.currentDate = new Date();
		$scope.replicar = function() {
			//console.log($scope.currentDate);
			for(var dates in $scope.selectedDate){
				$scope.selectedDate[dates].setHours($scope.currentDate.getHours());
				$scope.selectedDate[dates].setMinutes($scope.currentDate.getMinutes());
				$scope.selectedDate[dates] = $scope.selectedDate[dates].getTime(); 
				//console.log($scope.selectedDate[dates]);
			}
			$mdDialog.hide($scope.selectedDate);
    };
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }

/*--------- FIN se agrega para el manejo de la 'Material Design Data Table' ---------*/
  }

	$onInit() {
  }
}

export default angular.module('yuniusApp.monitoreo.agenda',[])
  .component('agenda', {
    template: require('./agenda.html'),
    controller: AgendaComponent,
    controllerAs: 'pe'
  })
  .name;