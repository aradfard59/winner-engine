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


    dom:{},


    init(){


        console.log(
            "Winner Engine v3 initialized"
        );


    }


};



window.WinnerEngine = WinnerEngine;


WinnerEngine.init();



})();