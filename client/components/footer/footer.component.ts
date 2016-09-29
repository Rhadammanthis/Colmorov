const angular = require('angular');

import Base from '../object/base/Base';

/**
 * @class Todo el contenido del pie de pagina
 */
export class FooterComponent extends Base{

  /*@ngInject*/
  constructor($rootScope){
    super($rootScope);
  }
}

export default angular.module('directives.footer', [])
  .component('footer', {
    template: require('./footer.html'),
    controller: FooterComponent,
    controllerAs: 'fc'
  })
  .name;
