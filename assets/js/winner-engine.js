document.addEventListener("DOMContentLoaded", function () {


/* ==========================================================
   WINNER ENGINE v2
   CORE
========================================================== */


if(document.body.classList.contains(
    "elementor-editor-active"
)){

    return;

}


const layout =
    document.querySelector(".winner-layout");


if(!layout) return;


const viewer =
    layout.querySelector(".winner-viewer");


const accordion =
    layout.querySelector(".winner-accordion");


const rail =
    layout.querySelector(".winner-rail");


const views =
    Array.from(
        layout.querySelectorAll(".winner-view")
    );


const sections =
    Array.from(
        layout.querySelectorAll(".winner-section")
    );


if(!viewer || !views.length){

    return;

}


/* ==========================================================
   STATE
========================================================== */


let activeIndex = 0;

let expanded = false;

let animating = false;

let mobileMode = false;

const BREAKPOINT = 1024;

function updateViewerHeight(){

    const header =
        document.querySelector(
            '.site-header, header'
        );

    const headerHeight =
        header
        ? header.getBoundingClientRect().height
        : 0;

    const vh =
        window.innerHeight - headerHeight;

    document.documentElement.style.setProperty(
        '--winner-vh',
        vh + 'px'
    );

}


/* ==========================================================
   RAIL INIT
========================================================== */


if(
    rail &&
    !rail.querySelector(".winner-toggle")
){

    rail.innerHTML = `

        <div class="winner-toggle">
            ＋
        </div>

        <div class="winner-rail-bottom">

            <div class="winner-info">
                اطلاعات بیشتر
            </div>

            <div class="winner-close">
                بستن
            </div>

        </div>

    `;

}


/* ==========================================================
   RAIL ELEMENTS
========================================================== */


let toggle = null;

let info = null;

let close = null;


function refreshRail(){

    if(!rail) return;

    toggle =
        rail.querySelector(
            ".winner-toggle"
        );

    info =
        rail.querySelector(
            ".winner-info"
        );

    close =
        rail.querySelector(
            ".winner-close"
        );

}


refreshRail();


/* ==========================================================
   INDICATOR
========================================================== */


let indicator =
    accordion.querySelector(
        ".winner-indicator"
    );


if(!indicator){

    indicator =
        document.createElement("div");

    indicator.className =
        "winner-indicator";

    accordion.appendChild(
        indicator
    );

}

/* ==========================================================
   MODULE 2
   LAYOUT ENGINE
========================================================== */


function expandLayout(){

	
    if(expanded) return;


    expanded = true;


    layout.classList.add(
        "winner-expanded"
    );


    updateRail();


}



function collapseLayout(){

	
    if(!expanded) return;


    expanded = false;


    layout.classList.remove(
        "winner-expanded"
    );


    updateRail();


}



function updateRail(){


    if(!toggle) return;



    if(expanded){


        toggle.innerHTML = "−";


        if(info){

            info.style.display = "none";

        }


        if(close){

            close.style.display = "block";

        }


    }else{


        toggle.innerHTML = "＋";


        if(info){

            info.style.display = "block";

        }


        if(close){

            close.style.display = "none";

        }


    }


}





toggle.addEventListener("click", ()=>{

    expanded
        ? collapseLayout()
        : expandLayout();

});

info?.addEventListener(
    "click",
    expandLayout
);

close?.addEventListener(
    "click",
    collapseLayout
);
/* ==========================================================
   MODULE 3
   VIEW ENGINE
========================================================== */


function updateViews(index){


    activeIndex = index;


    views.forEach((view,i)=>{


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


}



function gotoView(index){


    if(mobileMode) return;


    if(animating) return;


    if(index<0) return;


    if(index>=views.length) return;


    animating = true;


    updateViews(index);

    updateVideos(index);

	expandLayout();

	setTimeout(()=>{

    updateAccordion(index);

	},180);


    viewer.scrollTo({

        top:views[index].offsetTop,

        behavior:"smooth"

    });


    setTimeout(()=>{

        animating = false;

    },500);


}



function openFromHash(){


    const hash =
        parseInt(
            location.hash.replace("#","")
        );


    if(
        isNaN(hash)
    ) return;


    if(hash<0) return;


    if(hash>=views.length) return;


    activeIndex = hash;


    updateViews(hash);

    updateVideos(hash);

expandLayout();

setTimeout(()=>{

    updateAccordion(hash);

},180);


    viewer.scrollTop =
        views[hash].offsetTop;


}

/* ==========================================================
   MODULE 4
   ACCORDION ENGINE
========================================================== */


function updateAccordion(index){


    sections.forEach((section,i)=>{


        const body =
            section.querySelector(
                ".winner-body"
            );


        if(!body) return;


        if(i===index){


            section.classList.add(
                "active"
            );


body.style.height = body.scrollHeight + 'px';

body.classList.remove('winner-body-visible');

setTimeout(() => {

    body.classList.add('winner-body-visible');

},250);


            const header =
                section.querySelector(
                    ".winner-header"
                );


            if(header){


                const accordionRect =
                    accordion.getBoundingClientRect();


                const headerRect =
                    header.getBoundingClientRect();


                indicator.style.top =
                    (headerRect.bottom -
                    accordionRect.top + 6) + "px";


                indicator.style.width =
                    header.offsetWidth + "px";


                if(
                    document.documentElement.dir==="rtl"
                ){


                    indicator.style.left =
                        (accordion.clientWidth -
                        header.offsetLeft -
                        header.offsetWidth) + "px";


                }else{


                    indicator.style.left =
                        header.offsetLeft + "px";


                }


            }


        }else{


            section.classList.remove(
                "active"
            );

body.classList.remove('winner-body-visible');

            body.style.height =
                "0px";


        }


    });


}



sections.forEach((section,index)=>{


    const header =
        section.querySelector(
            ".winner-header"
        );


    if(!header) return;


    header.addEventListener(
        "click",
        ()=>{


            gotoView(index);


        }
    );


});

/* ==========================================================
   MODULE 5
   SCROLL ENGINE
========================================================== */

window.addEventListener(
    "wheel",
    function(e){

        if(mobileMode) return;

        if(animating){

            e.preventDefault();
            return;

        }

        const scrollArea =
            e.target.closest(
                ".winner-view-scroll"
            );

        if(scrollArea){

            const atTop =
                scrollArea.scrollTop <= 0;

            const atBottom =
                scrollArea.scrollTop +
                scrollArea.clientHeight >=
                scrollArea.scrollHeight - 2;

            if(e.deltaY > 0 && !atBottom){

                return;

            }

            if(e.deltaY < 0 && !atTop){

                return;

            }

        }

        e.preventDefault();

        // اولین اسکرول فقط Layout را باز کند
if (!expanded) {

    expandLayout();

    animating = true;

    setTimeout(() => {

        updateAccordion(activeIndex);

        animating = false;

    }, 250);

    return;

}

if (e.deltaY > 0) {

    gotoView(activeIndex + 1);

} else if (e.deltaY < 0) {

    gotoView(activeIndex - 1);

}

    },
    {
        passive:false
    }
);

/* ==========================================================
   KEYBOARD
========================================================== */

window.addEventListener(
    "keydown",
    function(e){

        if(mobileMode) return;

        if(animating) return;

        switch(e.key){

            case "ArrowDown":

            case "PageDown":

                e.preventDefault();

                gotoView(
                    activeIndex+1
                );

            break;


            case "ArrowUp":

            case "PageUp":

                e.preventDefault();

                gotoView(
                    activeIndex-1
                );

            break;


            case "Home":

                e.preventDefault();

                gotoView(0);

            break;


            case "End":

                e.preventDefault();

                gotoView(
                    views.length-1
                );

            break;

        }

    }
);
	
/* ==========================================================
   MODULE 6
   RESPONSIVE ENGINE v3
========================================================== */

function buildMobileLayout(){

    if(mobileMode) return;

    mobileMode = true;

    layout.classList.add("winner-mobile");

    collapseLayout();

    if(rail){

        rail.style.display = "none";

    }

    views.forEach((view,index)=>{

        const section = sections[index];

        if(!view || !section) return;

        const body = section.querySelector(".winner-body");

        if(body){

            body.style.display = "block";
            body.style.height = "auto";
            body.style.opacity = "1";
            body.style.overflow = "visible";

        }

        section.classList.add(
            "winner-mobile-section"
        );

        view.style.height = "auto";
        view.style.minHeight = "0";
        view.style.flex = "0 0 auto";

        layout.appendChild(view);
        layout.appendChild(section);

    });

    views.forEach(view=>{

        view.classList.remove(
            "winner-active",
            "winner-near"
        );

        view.style.opacity = "1";
        view.style.pointerEvents = "auto";

    });

    updateViewportHeight();

}

function buildDesktopLayout(){

    if(!mobileMode) return;

    mobileMode = false;

    layout.classList.remove("winner-mobile");

    if(rail){

        rail.style.display = "";

    }

    views.forEach(view=>{

        viewer.appendChild(view);

        view.style.height = "";
        view.style.minHeight = "";
        view.style.flex = "";

    });

    sections.forEach(section=>{

        accordion.appendChild(section);

        section.classList.remove(
            "winner-mobile-section"
        );

        const body =
            section.querySelector(".winner-body");

        if(body){

            body.style.display = "";
            body.style.height = "";
            body.style.opacity = "";
            body.style.overflow = "";

        }

    });

    updateViewportHeight();

    updateViews(activeIndex);

    updateAccordion(activeIndex);

    updateRail();

}

function checkResponsive(){

    if(window.innerWidth <= BREAKPOINT){

        buildMobileLayout();

    }else{

        buildDesktopLayout();

    }

}

window.addEventListener("resize",()=>{

    updateViewerHeight();

    checkResponsive();

});

checkResponsive();
	
	/* ==========================================================
   MODULE 7
   VIDEO ENGINE
========================================================== */


function updateVideos(index){


    views.forEach((view,i)=>{


        const videos =
            view.querySelectorAll(
                "video"
            );


        videos.forEach(video=>{


            if(i===index){


                video.play()
                .catch(()=>{});


            }else{


                video.pause();


            }


        });


    });


}

/* ==========================================================
   MODULE 8
   VIEWPORT ENGINE
========================================================== */

function updateViewportHeight(){

    let headerHeight = 0;

    const headers = document.querySelectorAll(`
        header,
        .site-header,
        .sticky-header,
        .sticky-header-on,
        .whb-header,
        .whb-sticked-header,
        .phlox-header,
        .aux-header
    `);

    headers.forEach(header=>{

        const style = getComputedStyle(header);

        if(
            style.display === "none" ||
            style.visibility === "hidden"
        ){
            return;
        }

        const rect = header.getBoundingClientRect();

        if(rect.bottom > 0 && rect.top <= 0){

            headerHeight = Math.max(
                headerHeight,
                rect.height
            );

        }

    });

    const availableHeight =
        window.innerHeight - headerHeight;

    layout.style.height =
        availableHeight + "px";

    viewer.style.height =
        availableHeight + "px";

    views.forEach(view=>{

    if(mobileMode){

        view.style.minHeight =
            availableHeight + "px";

        view.style.height = "auto";

    }else{

        view.style.minHeight = "";

        view.style.height =
            availableHeight + "px";

    }

});

    layout.style.setProperty(
        "--winner-height",
        availableHeight + "px"
    );

}


/* ==========================================================
   INITIALIZATION
========================================================== */

updateViewportHeight();

window.addEventListener(
    "resize",
    updateViewportHeight
);

window.addEventListener(
    "scroll",
    updateViewportHeight
);

updateViews(0);

updateAccordion(0);

updateVideos(0);

/* ---------- Hash / Refresh ---------- */

const winnerInitialHash = window.location.hash;
const winnerReloaded =
    sessionStorage.getItem("winner-reloaded");

if (winnerInitialHash && !winnerReloaded) {

    openFromHash();

    updateVideos(activeIndex);

}

if (toggle) {

    updateRail();

}

window.addEventListener("beforeunload", () => {

    sessionStorage.setItem(
        "winner-reloaded",
        "1"
    );

});

window.addEventListener("pageshow", () => {

    if (sessionStorage.getItem("winner-reloaded")) {

        history.replaceState(
            null,
            "",
            window.location.pathname +
            window.location.search
        );

        sessionStorage.removeItem(
            "winner-reloaded"
        );

    }

});

updateViewerHeight();

checkResponsive();

updateViews(0);

updateAccordion(0);

updateVideos(0);

});



