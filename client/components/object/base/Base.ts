'use strict'
/**
 * @class Clase base que ayuda a realizar las funciones bases de cualquier pagina web
 */
export default class Base{

    /**
     * @field _$rootScope
     */
    public _$rootScope: any;

    /**
     * @constructor 
     * @param _$rootScope
     */
    constructor($rootScope:any){
        'ngInject';
        this._$rootScope = $rootScope;
    }

    /**
     * Agrega el titulo al toolbar
     * @param title
     * @type String
     */
    public setTitle(title:String){
        this._$rootScope.title = title;
    }

    /**
     * Activa el toolbar adecuado para la pagina
     * @param mode
     * @type ModeToolbar
     */
    public setModeToolbar(mode:ModeToolbar){
        this._$rootScope.show = mode;
    }

    /**
     * Seleccionar el menu tipo acreditado/cliente
     */
    public setMenuCl(){
        this._$rootScope.menu = 'cl';
    }

    /**
     * Seleccionar el menu tipo apersonal empresa
     */
    public setMenuPe(){
        this._$rootScope.menu = 'pe';
    }

    /**
     * Sets the toolbar mode to use
     */
    public setToolbarMode(mode){
        this._$rootScope.toolbarMode = mode;
    }

}

/**
 * @class Enum que permite saber el Modo del Tolbar a mostar
 */
export const enum ModeToolbar{
    /**
     * Ocultar el toolbar
     */
    OFF = 0,
    /**
     * Mostrar el toolbar simple
     */
    NORMAL = 1
}