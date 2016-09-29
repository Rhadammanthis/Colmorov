'use strict'
import Base from './Base';
/**
 * @class Clase base que ayuda a realizar las funciones bases de cualquier pagina web
 */
export default class CookiesBase extends Base{

    /**
     * @field _$cookies
     */
    private _$cookies: any;

    /**
     * @constructor 
     * @param $rootScope
     * @param $cookies
     */
    constructor($rootScope:any,$cookies:any){
        'ngInject';
        super($rootScope);
        this._$cookies = $cookies;
    }

    /**
     * Guarda los datos a enviar entre paginas
     * @param data
     * @type any
     */
    public saveDataTemp(data:any){
        this._$cookies.put('temp',data);
    }

    /**
     * Regresa los datos guardados
     */
    public getDataTemp():any{
        return this._$cookies.get('temp');
    }

}