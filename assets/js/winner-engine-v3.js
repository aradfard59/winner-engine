/* ==========================================================
   WINNER ENGINE V3
   CORE ARCHITECTURE
========================================================== */

(function(){

"use strict";


const WinnerEngine = {


    state:{

    device:"desktop",

    mobile:false,

    activeIndex:0,

    animating:false,

    expanded:false,

    viewportHeight:0,

    initialized:false

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

    this.bindEvents();

    this.state.viewportHeight =
        window.innerHeight;

    this.state.initialized = true;

    this.updateViews(
    this.state.activeIndex
);

    this.updateAccordion(
    this.state.activeIndex
);

    this.updateLayout();

    this.checkResponsive();

    console.log("Winner Engine v3 initialized");

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


},

updateViews(index){

    this.state.activeIndex = index;

    this.dom.views.forEach((view,i)=>{

        view.classList.remove(
            "winner-active",
            "winner-near"
        );

        if(i===index){

            view.classList.add(
                "winner-active"
            );

        }else if(

            i===index-1 ||
            i===index+1

        ){

            view.classList.add(
                "winner-near"
            );

        }

    });

},

updateAccordion(index){

    this.state.activeIndex = index;


    this.dom.sections.forEach((section,i)=>{


        const body =
            section.querySelector(
                ".winner-body"
            );


        if(!body) return;


        if(i===index){


            section.classList.add(
                "active"
            );


            body.style.height =
                body.scrollHeight + "px";


        }else{


            section.classList.remove(
                "active"
            );


            body.style.height =
                "0px";


        }


    });

},

goto(index){

    if(this.state.mobile) return;

    if(this.state.animating) return;

    if(index<0) return;

    if(index>=this.dom.views.length) return;

    if(index===this.state.activeIndex) return;

    this.changeView(index);

},

changeView(index){

    this.beforeChange(
        this.state.activeIndex,
        index
    );

},

beforeChange(oldIndex,newIndex){

    this.state.animating = true;

    this.state.activeIndex = newIndex;

    this.updateViews(newIndex);

    this.updateAccordion(newIndex);

    this.scrollToView(newIndex);

},

scrollToView(index){

    const view =
        this.dom.views[index];

    if(!view){

        this.afterChange();

        return;

    }

    this.dom.viewer.scrollTo({

        top:view.offsetTop,

        behavior:"smooth"

    });

    setTimeout(()=>{

        this.afterChange();

    },500);

},

afterChange(){

    this.state.animating = false;

},

updateLayout(){

    if(!this.dom.layout) return;


    this.state.viewportHeight =
        window.innerHeight;


    this.dom.layout.style.height =
        this.state.viewportHeight + "px";


    if(this.dom.viewer){

        this.dom.viewer.style.height =
            this.state.viewportHeight + "px";

    }

},

checkResponsive(){

    const mobile =
        window.innerWidth <= 767;

    if(mobile){

        if(!this.state.mobile){

            this.enableMobile();

        }

    }else{

        if(this.state.mobile){

            this.disableMobile();

        }

    }

},


enableMobile(){

    this.state.mobile = true;

    this.state.device = "mobile";

    this.dom.layout.classList.add(
        "winner-mobile"
    );

    if(this.dom.rail){

        this.dom.rail.style.display = "none";

    }

    this.dom.views.forEach(view=>{

        view.classList.remove(
            "winner-active",
            "winner-near"
        );

    });

},


disableMobile(){

    this.state.mobile = false;

    this.state.device = "desktop";

    this.dom.layout.classList.remove(
        "winner-mobile"
    );

    if(this.dom.rail){

        this.dom.rail.style.display = "";

    }

    this.updateViews(
        this.state.activeIndex
    );

    this.updateAccordion(
        this.state.activeIndex
    );

},


bindEvents(){

    window.addEventListener(
        "resize",
        ()=>this.onResize()
    );


    this.dom.sections.forEach((section,index)=>{


        const header =
            section.querySelector(
                ".winner-header"
            );


        if(!header) return;


        header.addEventListener(
            "click",
            ()=>{

                this.goto(index);

            }
        );


    });


},

onResize(){

    this.updateLayout();

    this.checkResponsive();

},


};



window.WinnerEngine = WinnerEngine;


WinnerEngine.init();



})();

