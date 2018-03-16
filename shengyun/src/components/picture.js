// import $ from 'jquery';
// import template from './picture.html';
// import Mustache from 'mustache';
// import './picture.scss';
 var $ = require('jquery');
 var template = require('./picture.html');
 var Mustache = require('mustache');
 require('./picture.scss');
export default class Buttonl {
        constructor(link) {
            this.link = link;
        }
 
        onClick(event) {
            event.preventDefault();
            alert(this.link);
        }
 
        render(node) {
            const text = 'hshs'//$(node).text();
 
            // Render our button
            $(node).html(Mustache.render(template, {
                text
            }));
 
            // Attach our listeners
            $('.button').click(this.onClick.bind(this));
        }
    }
