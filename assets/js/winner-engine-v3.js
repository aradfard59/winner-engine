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

    viewportHeight:0,

    wheelLocked:false,

    targetScroll:0,

    scrollHandler:null,

    scrollTimeout:null,

    touchStartY:0,

    touchCurrentY:0,

    touchActive:false,

    swipeThreshold:60

    layoutExpanded:false,

    firstInteraction:true,

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


getActiveView(){

    return this.dom.views[
        this.state.activeIndex
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


expandLayout(){

    if(this.state.layoutExpanded) return;

    this.state.layoutExpanded = true;

    this.dom.layout.classList.add(
        "winner-expanded"
    );

},


goto(index){

    if(this.state.animating) return;

    const total =
        this.dom.views.length;


    if(index < 0){

        index = total - 1;

    }


    if(index >= total){

        index = 0;

    }


    if(index === this.state.activeIndex) return;


    this.changeView(index);

    canNavigate(direction){

    const viewer = this.dom.viewer;
    if(!viewer) return true;

    const active =
        this.dom.views[this.state.activeIndex];

    if(!active) return true;

    const scrollable =
        active.querySelector(".winner-view-scroll");

    if(!scrollable) return true;

    const top =
        scrollable.scrollTop;

    const max =
        scrollable.scrollHeight -
        scrollable.clientHeight;

    if(direction > 0){

        return top >= max - 2;

    }

    return top <= 2;

},

},



changeView(index){

    this.beforeChange(index);

},



beforeChange(newIndex){

    this.state.animating = true;

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


canChangeSection(direction){

    const view = this.getActiveView();

    if(!view) return true;


    const maxScroll =
        view.scrollHeight - view.clientHeight;


    if(direction > 0){

        return view.scrollTop >= maxScroll - 2;

    }


    return view.scrollTop <= 2;

},

scrollActiveView(delta){

    const view = this.getActiveView();

    if(!view) return;

    view.scrollBy({

        top:delta,

        behavior:"smooth"

    });

},


watchScroll(){

    if(this.state.scrollHandler){

        this.dom.viewer.removeEventListener(
            "scroll",
            this.state.scrollHandler
        );

    }

    cancelAnimationFrame(
        this.state.scrollRAF
    );

    this.state.lastScrollTop =
        this.dom.viewer.scrollTop;

    this.state.scrollHandler = ()=>{

        this.state.lastScrollTop =
            this.dom.viewer.scrollTop;

    };

    this.dom.viewer.addEventListener(

        "scroll",

        this.state.scrollHandler,

        {passive:true}

    );

    const monitor = ()=>{

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

            this.afterChange();
            return;

        }

        this.state.scrollRAF =
            requestAnimationFrame(monitor);

    };

    this.state.scrollRAF =
        requestAnimationFrame(monitor);

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

    clearTimeout(this.state.scrollTimeout);

    cancelAnimationFrame(
    this.state.scrollRAF
);

this.state.scrollRAF = null;

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

    this.updateLayout();

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

    this.dom.layout.classList.remove(
    "winner-expanded"
    );

    this.state.layoutExpanded = false;

},



disableMobile(){

    this.state.mobile = false;

    this.state.device = "desktop";

    this.updateLayout();

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

    if(this.state.firstInteraction){

    this.dom.layout.classList.remove(
        "winner-expanded"
    );

    }else{

    this.dom.layout.classList.add(
        "winner-expanded"
    );

}

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

    if(this.dom.viewer){

    this.dom.viewer.addEventListener(

        "touchstart",

        (e)=>this.onTouchStart(e),

        {passive:true}

    );

    this.dom.viewer.addEventListener(

        "touchmove",

        (e)=>this.onTouchMove(e),

        {passive:true}

    );

    this.dom.viewer.addEventListener(

        "touchend",

        ()=>this.onTouchEnd(),

        {passive:true}

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

    e.preventDefault();

    if(!this.state.layoutExpanded){

        this.expandLayout();

        return;

    }

    if(e.deltaY > 0){

        if(!this.canChangeSection(1)){

            this.scrollActiveView(e.deltaY);

        return;

        }

        this.goto(
            this.state.activeIndex + 1
        );

    }else{

        if(!this.canChangeSection(-1)){

            this.scrollActiveView(e.deltaY);

        return;

        }

        this.goto(
            this.state.activeIndex - 1
        );

    }

},

    onTouchStart(e){

    if(!this.state.mobile) return;

    if(this.state.animating) return;

    this.state.touchActive = true;

    this.state.touchStartY =
        e.touches[0].clientY;

    this.state.touchCurrentY =
        this.state.touchStartY;

},



onTouchMove(e){

    if(!this.state.touchActive) return;

    this.state.touchCurrentY =
        e.touches[0].clientY;

},



onTouchEnd(){

    if(!this.state.touchActive) return;

    this.state.touchActive = false;

    const delta =

        this.state.touchStartY -

        this.state.touchCurrentY;

    if(

        Math.abs(delta)

        <

        this.state.swipeThreshold

    ){

        return;

    }

    if(delta>0){

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