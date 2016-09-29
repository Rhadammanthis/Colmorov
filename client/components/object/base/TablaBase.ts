'use strict'

import CookiesBase from '../base/CookiesBase';
/**
 * @class Clase base que ayuda a realizar las funciones bases de cualquier pagina web
 */
export default class TablaBase extends CookiesBase{

    /**
     * Variable que contiene la ruta para realizar la petición
     * @field url
     * @type String
     */
    private url:String;
    /**
     * Variable que contiene los datos a evnviar para la petición
     * @field json
     * @type any
     */
    private json:any;
    /**
     * Variable que contiene los datos que regresa la petición
     * @field data
     * @type any
     */
    private data:any;
    /**
     * Variable que contiene el scope del componente
     * @field $scope
     * @type any
     */
    private _$scope:any;
    /**
     * Funcion para realizar las peticiones mediante http
     * @field $http
     * @type any
     */
    private _$http:any;
    /**
     * Variable que indica el nombre del array en el resultado
     * @field nameArray 
     */
    private nameArray:string = '';
    /**
     * Variable que guarda el promise para mostrar el loading en la tabla
     * @field promise
     * @type any
     */
    public _promise:any;
    /**
     * Variable que guarda el array de elementos
     * @field lista
     * @type any
     */
    public _lista:any = [];
    /**
     * Variable que guarda el array de elementos
     * @field lista
     * @type any
     */
    public _total:number = 0;
    /**
     * 
     * @field selected
     * @type any
     */
    public _selected:any = [];
    /**
     * Variable que contiene el nombre del campo a ordenar
     * @field order
     * @type String
     */
    public _order:String = '';
    /**
     * Variable que contiene el numero de elementos por pagina
     * @field limit
     * @type number
     */
    public _limit:number = 20;
    /**
     * Variable que contiene el numero de elementos por pagina
     * @field limit
     * @type number
     */
    private oldlimit:number = 20;
    /**
     * Variable que contiene el numero de pagina por default
     * @field page
     * @type number
     */
    public _page:number = 1;
    /**
     * Objeto que tiene la información para las etiquetas de la paginación
     * @field label
     * @type any
     */
    public _label:any = {
                            page: 'Página:', 
                            rowsPerPage: 'Registros por página:', 
                            of: 'de'
                       };
    /**
     * Array donde se guarda el numero de limites por pagina
     * @field limitOption
     * @type Array<any>
     */
    public _limitOption:Array<any> = [20,60,100];
    /**
     * Variable que indica si se muestran los link de inicio y fin en la tabla, por default esta desactivado
     * @field boundary true si se muestra, false para ocultarlo
     */
    public _boundary:boolean = false;
    /**
     * Variable que indica si se muestran las lista de paginas, por default lo muestra
     * @field selectedPage true si se muestra, false para ocultarlo
     */
    public _selectedPage:boolean = true;
    /**
     * Variable que indica si se deshabilitan los controles de paginación, por default estan habilitados
     * @field disable true si se muestra, false para ocultarlo
     */
    public _disable:boolean = false;
    /**
     * Variable que indica si se habilita la seleccion, por default estan habilitado
     * @field selection true si se habilita, false se deshabilita
     */
    public _selection:boolean = true;
    /**
     * Variable que indica si se habilita la multi seleccion, por default esta deshabilitado
     * @field selection true si se habilita, false se deshabilita
     */
    public _multiSelection:boolean = false;
    /**
     * Variable que indica el row es seleccionable
     * @field rowSelection true si es seleccionable, false se no, por defaul es seleccionable
     */
    public _rowSelection:boolean = true;
    /**
     * Variable que indica el row completo es seleccionable
     * @field autoSelection true si es seleccionable, false se no, por defaul es seleccionable
     */
    public _autoSelection:boolean = true;
    /**
     * Variable que guarda temporalmente los elementos descargados
     * @field dataSaveTemp
     */
    private dataSaveTemp:Array<any>;
    /**
     * Callback que se llama cuando cambia la pagina o los limites de la paginación
     */
    public _onPage:Function;
    /**
     * Callback que se llama cuando se selecciona un item
     */
    public _onSelect:Function;
    /**
     * Callback que se llama cuando los datos se cargan correctamente
     * @field ready
     */
    public ready:Function = ()=>null;
    /**
     * Callback que se llama cuando no se cargarón los datos correctamente
     * @field error
     */
    public error:Function = ()=>null;
    /**
     * Callback que se llama cuando se selecciona un elemento
     * @field onSelected
     */
    public selectF:Function = ()=>null;

    /**
     * @constructor 
     * @param $rootScope
     * @param $scope
     * @param $cookies
     * @param url La ruta para realizar la petición
     * @param json los datos a enviar
     * @param $http
     * @param nameArray Nombre de la propiedad donde se encuentra el resultado
     */
    constructor($rootScope:any,$scope:any,$cookies:any,url:String,json:any,$http:any,nameArray:string){
        'ngInject';
        super($rootScope,$cookies);
        this._$scope = $scope;
        this.url = url;
        this.json = json;
        this._$http = $http;
        this.nameArray = nameArray;
        this.dataSaveTemp;
        this._$scope.me = this;
        
        this._onPage = function(page:number,limit:number){
            $scope.me.update();
        }

        this._onSelect = function(item:any){
            $scope.me.selectF(item);
        }
    }

    $onInit(){
        
    }

    public update(){
        if(this._limit === this.oldlimit){
            // if(this.dataSaveTemp[this._page]===undefined || this.dataSaveTemp[this._page]===null){
                if(this.json===undefined || this.json===null){
                    this.json = {};
                }
                this.json.siguiente = ((this._page-1) * this._limit) + 1;
                this.onNext();
            // }else{
            //     this._lista = this.dataSaveTemp[this._page];
            // }
        }else{
            this.dataSaveTemp = [];
            if(this.json===undefined || this.json===null){
                    this.json = {};
            }
            this.json.limite = this._limit;
            this.json.siguiente = ((this._page-1) * this._limit) + 1;
            this.oldlimit = this._limit;
            this.onNext();
        }
    }

    /**
     * Funcion que realiza la petición de los datos
     * @fun funcion que se ejecuta cuando se obtienen los elementos
     */
    public on(fun:Function){
        let _this = this;
        this._promise = this._$http.post(this.url,this.json).then(function(respuesta){
            _this._lista = respuesta.data[_this.nameArray];
            // _this.dataSaveTemp[_this._page.toString()] = respuesta.data[_this.nameArray];
            if(respuesta.data.hasOwnProperty('total')){
                _this._setTotal(respuesta.data.total);
            }else{
                _this._setTotal(_this._lista.length);
            }
            fun(respuesta);
        }).catch(function(err){
            console.log(err);
            _this.error(err);
        });
    }

    /**
     * Funcion que realiza la petición de los datos siguientes o por actualización
     * @fun funcion que se ejecuta cuando se obtienen los elementos
     */
    public onNext(){
        let _this = this;
        this._lista = [];
        this._promise = this._$http.post(this.url,this.json).then(function(respuesta){
            _this._lista = respuesta.data[_this.nameArray];
            _this.ready(respuesta);
            // _this.dataSaveTemp[_this._page] = respuesta.data[_this.nameArray];
        }).catch(function(err){
            console.log(err);
            _this.error(err);
        });
    }

    /**
     * Funcion que muestra u oculta los botones de inicio o de fin en la paginación
     * @param boundary true para mostrar, false para occultar
     */
    public _setBotonesIniFin(boundary:boolean){
        this._boundary = boundary;
    }

    /**
     * Funcion que muestra u oculta los botones de inicio o de fin en la paginación
     * @param boundary true para mostrar, false para occultar
     */
    public _setSelectedPage(selectedPage:boolean){
        this._selectedPage = selectedPage;
    }

    /**
     * Asignación del total de elementos
     * @param total
     */
    public _setTotal(total:number){
        this._total = total;
    }

    /**
     * Funcion que muestra u oculta los botones de inicio o de fin en la paginación
     * @param disable true para mostrar, false para occultar
     */
    public _setDisable(disable:boolean){
        this._disable = disable;
    }

    /**
     * Funcion que permite la multi seleccion
     * @param multiSelection true para permitir, false para occultar
     */
    public _setMultiSelected(multiSelection:boolean){
        this._multiSelection = multiSelection;
    }

    /**
     * Funcion que permite la seleccion del row
     * @param multiSelection true para permitir, false para occultar
     */
    public _setRowSelection(rowSelection:boolean){
        this._rowSelection = rowSelection;
    }

    /**
     * Funcion que permite la seleccion del row
     * @param autoSelection true para permitir, false para occultar
     */
    public _setAutoSelection(autoSelection:boolean){
        this._autoSelection = autoSelection;
    }

    /**
     * Asigana una funcion como Callback para cuando esten lisos los datos
     * @field ready la funcion
     */
    public setReadyF(ready:Function){
        this.ready = ready;
    }

    /**
     * Asigana una funcion como Callback para cuando existe error
     * @field error la funcion
     */
    public setErrorF(error:Function){
        this.error = error;
    }

    /**
     * Asigana una funcion como Callback para cuando se selecciona una fila
     * @field select la funcion
     */
    public setSelectF(select:Function){
        this.selectF = select;
    }

    /**
     * Funcion que agrega los campos a enviar en la petición
     * @field data el json a enviar
     */
    public setData(data:any){
        this.json = data;
    }

}