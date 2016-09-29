/*'use strict';
const angular = require('angular');

class EditarComponent {
  constructor($http, $rootScope, $scope, $location, $mdDialog, $mdMedia, Auth, editarService) {
    this.$http = $http;
    this.$location = $location;
    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;
    this.ready = true;
	this.locationUpdated = false;
	  this.Auth = Auth;
		this.$scope = $scope;
		this.editarService = editarService;
		this.bodyActualizar = {};
		$rootScope.title = 'Edición de Evento';
    $rootScope.show = 2;
  }

	$onInit() {
		this.$scope.states = ('Individual,Individual de gpo.,Grupal,Prospecto')
									.split(',').map(function (state) { return { abbrev: state }; })
		
		this.bodyActualizar = {
														id:{
																cdgev:0,
																cdgclns:null,
																cdgcl:null,
																cdgns:null,
																clns:null
														},
														nombre:null,
													  direccion:null,
														localizacion:null,
														descripcion:null
													}

		// Init current data								
		this.bodyActualizar.id.cdgev = this.editarService.getCdgev();
		this.$scope.cdgcl = this.editarService.getCdgcl();
		this.$scope.cdgclns = this.editarService.getCdgclns();
		this.$scope.cdgns = this.editarService.getCdgns();
		this.$scope.nombre = this.editarService.getNombre();
		this.$scope.descripcion = this.editarService.getDescripcion();
		this.$scope.direccion = this.editarService.getDireccion();
		var location = this.editarService.getLocalizacion();
		this.latLong = location.split(',');
		this.bodyActualizar.localizacion = this.latLong[0] + "," + this.latLong[1];	
		
		if (this.editarService.getCdgcl()) {
			this.$scope.tipo = "Individual";
			document.getElementById("cdgcl").style.display = 'inline-block';
			document.getElementById("cdgclns").style.display = 'none';
			document.getElementById("cdgns").style.display = 'none';
			this.bodyActualizar.id.clns = "I";
		} else if (this.editarService.getCdgclns() && this.editarService.getCdgns()) {
			this.$scope.tipo = "Individual de gpo.";
			document.getElementById("cdgcl").style.display = 'none';
			document.getElementById("cdgclns").style.display = 'inline-block';
			document.getElementById("cdgns").style.display = 'inline-block';
			this.bodyActualizar.id.clns = "G";
		} else if (!this.editarService.getCdgcl() && this.editarService.getCdgns()) {
			this.$scope.tipo = "Grupal";
			document.getElementById("cdgcl").style.display = 'none';
			document.getElementById("cdgclns").style.display = 'none';
			document.getElementById("cdgns").style.display = 'inline-block';
			this.bodyActualizar.id.clns = "G";
		} else {
			this.$scope.tipo = "Prospecto";
			document.getElementById("cdgcl").style.display = 'none';
			document.getElementById("cdgclns").style.display = 'none';
			document.getElementById("cdgns").style.display = 'none';
			this.bodyActualizar.id.clns = null;
		}		

		this.initMap();						

  }

	initMap() {
		// Inicializar mapa
		var mapDiv = document.getElementById('map');
		var map = new google.maps.Map(mapDiv, {
				center: {lat: Number(this.latLong[0]), lng: Number(this.latLong[1])},
				zoom: 15
		});

		// This event listener will call addMarker() when the map is clicked.
		map.addListener('click', function(event) {
			addMarker(event.latLng);
		});

		var marker = new google.maps.Marker({
			position: {lat: Number(this.latLong[0]), lng: Number(this.latLong[1])},
			map: map,
			draggable:true
		});

    marker.addListener('dragend', handleEvent);

		var _this = this;

		function handleEvent(event) {
				_this.latLong = event.latLng.lat() + ", " +event.latLng.lng()
				_this.locationUpdated = true;
				console.log("location: " + _this.latLong);
		}
	}

	tipoChange() {
		console.log("Entro change select" + this.$scope.tipo);
		if (this.$scope.tipo == "Individual") {
			document.getElementById("cdgcl").style.display = 'inline-block';
			document.getElementById("cdgclns").style.display = 'none';
			document.getElementById("cdgns").style.display = 'none';
			this.$scope.cdgcl = null;
			this.$scope.cdgclns = null;
			this.$scope.cdgns = null;
			this.bodyActualizar.id.clns = "I";
		} else if (this.$scope.tipo == "Grupal") {
			document.getElementById("cdgcl").style.display = 'none';
			document.getElementById("cdgclns").style.display = 'none';
			document.getElementById("cdgns").style.display = 'inline-block';
			this.$scope.cdgcl = null;
			this.$scope.cdgclns = null;
			this.$scope.cdgns = null;
			this.bodyActualizar.id.clns = "G";
		} else if (this.$scope.tipo == "Individual de gpo.") {
			document.getElementById("cdgcl").style.display = 'none';
			document.getElementById("cdgclns").style.display = 'inline-block';
			document.getElementById("cdgns").style.display = 'inline-block';
			this.$scope.cdgcl = null;
			this.$scope.cdgclns = null;
			this.$scope.cdgns = null;
			this.bodyActualizar.id.clns = "G";
		} else {
			document.getElementById("cdgcl").style.display = 'none';
			document.getElementById("cdgclns").style.display = 'none';
			document.getElementById("cdgns").style.display = 'none';
			this.$scope.cdgcl = null;
			this.$scope.cdgclns = null;
			this.$scope.cdgns = null;
			this.bodyActualizar.id.clns = null;
		}
	}

	update(ev) {
		this.bodyActualizar.id.cdgcl = this.$scope.cdgcl;
		this.bodyActualizar.id.cdgclns = this.$scope.cdgclns;
		this.bodyActualizar.id.cdgns = this.$scope.cdgns;
		this.bodyActualizar.nombre = this.$scope.nombre;
		this.bodyActualizar.direccion = this.$scope.direccion;
		if(this.locationUpdated){
			this.bodyActualizar.localizacion = this.latLong;
		} else {
			this.bodyActualizar.localizacion = this.latLong[0] + "," + this.latLong[1];
		}
		this.bodyActualizar.descripcion = this.$scope.descripcion;
		console.log(this.bodyActualizar);
		this.$http.post("api/eventos/actualizar", this.bodyActualizar, {headers: {'Content-Type': 'application/json'} })
										.then(function (response) {
												console.log(response.data);
												window.history.back();
										})
										.catch(err => {
											this.ready = true;
											console.log(err);
											this.showAlert(ev,err);
										});
	}

	cancel(ev) {
		window.history.back();
	}

	showAlert(ev,response) {
		    // Appending dialog to document.body to cover sidenav in docs app
		    // Modal dialogs should fully cover application
		    // to prevent interaction outside of dialog
		    this.$mdDialog.show(
		      this.$mdDialog.alert()
		        .parent(angular.element(document.querySelector('#popupContainer')))
		        .clickOutsideToClose(true)
		        .title(response.title)
		        .textContent(response.message)
		        .ariaLabel('Mensaje')
		        .ok('Aceptar')
		        .targetEvent(ev)
		    );
		};
}

export default angular.module('yuniusApp.editar',[])
  .component('editar', {
    template: require('./editar.html'),
    controller: EditarComponent,
    controllerAs: 'ed'
  })
  .name;*/