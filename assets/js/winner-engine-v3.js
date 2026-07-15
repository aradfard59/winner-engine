/* ==========================================================
   WINNER ENGINE V3.0.5
========================================================== */

(function(){

"use strict";

const WinnerEngine = {

config:{

    accordionDelay:180,

    scrollTolerance:2

},

state:{

    device:"desktop",

    mobile:false,

    activeIndex:0,

    animating:false,

    expanded:false,

    viewportHeight:0,

    initialized:false,

    wheelLocked:false,

    targetScroll:0,

    scrollHandler:null

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

    if(!this.dom.layout) return;

    this.bindEvents();

    this.state.viewportHeight =
        window.innerHeight;

    this.state.initialized = true;

    this.updateLayout();

    this.updateViews(
        this.state.activeIndex
    );

    this.updateAccordion(
        this.state.activeIndex
    );

    this.checkResponsive();

    console.log(
        "Winner Engine v3.0.5"
    );

},

cacheDOM(){

    this.dom.layout =
        document.querySelector(".winner-layout");

    if(!this.dom.layout) return;

    this.dom.viewer =
        this.dom.layout.querySelector(".winner-viewer");

    this.dom.accordion =
        this.dom.layout.querySelector(".winner-accordion");

    this.dom.rail =
        this.dom.layout.querySelector(".winner-rail");

    this.dom.indicator =
        this.dom.layout.querySelector(".winner-indicator");

    this.dom.views = [
        ...this.dom.layout.querySelectorAll(".winner-view")
    ];

    this.dom.sections = [
        ...this.dom.layout.querySelectorAll(".winner-section")
    ];

},



updateViews(index){

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

    this.dom.sections.forEach((section,i)=>{

        const body =
            section.querySelector(".winner-body");

        if(!body) return;

        if(i===index){

            section.classList.add("active");

            body.style.height =
                body.scrollHeight+"px";

        }else{

            section.classList.remove("active");

            body.style.height="0px";

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

    this.state.wheelLocked = true;

    this.state.activeIndex = newIndex;

    this.updateViews(newIndex);

    this.updateAccordion(newIndex);

    this.scrollToView(newIndex);

},



scrollToView(index){

    const view = this.dom.views[index];

    if(!view){

        this.afterChange();

        return;

    }


    const rect =
        view.getBoundingClientRect();


    const viewerRect =
        this.dom.viewer.getBoundingClientRect();


    this.state.targetScroll =
        this.dom.viewer.scrollTop +
        (rect.top - viewerRect.top);



    this.dom.viewer.scrollTo({

        top:this.state.targetScroll,

        behavior:"smooth"

    });


    this.watchScroll();

},



watchScroll(){

    this.dom.viewer.addEventListener(

    "scroll",

    this.state.scrollHandler,

    {passive:true}

);

},


    this.state.scrollHandler = ()=>{

        if(!this.state.animating){

        return;

    }

        const current =
            this.dom.viewer.scrollTop;


        const target =
            this.state.targetScroll;



        if(

            Math.abs(current-target)

            <=

            this.config.scrollTolerance

        ){

            this.dom.viewer.removeEventListener(

                "scroll",

                this.state.scrollHandler

            );


            this.state.scrollHandler = null;


            this.afterChange();

        }


    };


    if(this.state.scrollHandler){

    this.dom.viewer.removeEventListener(

        "scroll",

        this.state.scrollHandler

    );

    this.state.scrollHandler = null;

}

},



afterChange(){

    this.state.animating = false;

    this.state.wheelLocked = false;

    if(this.state.scrollHandler){

    this.dom.viewer.removeEventListener(

        "scroll",

        this.state.scrollHandler

    );

    this.state.scrollHandler = null;

}

},

updateLayout(){

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

    if(this.dom.viewer){
    
    this.dom.viewer.addEventListener(

        "wheel",

        (e)=>this.onWheel(e),

        {passive:false}

    );
    }

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



onWheel(e){

    if(this.state.mobile) return;

    if(this.state.animating) return;

    if(this.state.wheelLocked) return;

    e.preventDefault();

    if(e.deltaY>0){

        this.goto(

            this.state.activeIndex+1

        );

    }else{

        this.goto(

            this.state.activeIndex-1

        );

    }

},


};



window.WinnerEngine =
    WinnerEngine;



WinnerEngine.init();



})();