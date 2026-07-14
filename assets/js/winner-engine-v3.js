/* ==========================================================
   WINNER ENGINE V3
   CORE ARCHITECTURE
========================================================== */

(function(){

"use strict";


const WinnerEngine = {


    state:{


        mobile:false,

        activeIndex:0,

        animating:false


    },


    dom:{


    layout:null,

    viewer:null,

    accordion:null,

    rail:null,

    indicator:null,


    views:[],


    sections:[]


},


    init(){


    this.cacheDOM();


    console.log(
        "Winner Engine v3 initialized"
    );


},


cacheDOM(){


    this.dom.layout =
        document.querySelector(
            ".winner-layout"
        );


    if(!this.dom.layout) return;


    this.dom.viewer =
        this.dom.layout.querySelector(
            ".winner-viewer"
        );


    this.dom.accordion =
        this.dom.layout.querySelector(
            ".winner-accordion"
        );


    this.dom.rail =
        this.dom.layout.querySelector(
            ".winner-rail"
        );


    this.dom.indicator =
        this.dom.layout.querySelector(
            ".winner-indicator"
        );


    this.dom.views =
        [...this.dom.layout.querySelectorAll(
            ".winner-view"
        )];


    this.dom.sections =
        [...this.dom.layout.querySelectorAll(
            ".winner-section"
        )];


}


};



window.WinnerEngine = WinnerEngine;


WinnerEngine.init();



})();