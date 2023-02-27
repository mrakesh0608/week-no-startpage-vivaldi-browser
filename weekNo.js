function getWeek() {

    currentDate = new Date();

    startDate = new Date(currentDate.getFullYear(), 0, 1);

    var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

    return Math.ceil(days / 7);
}

async function addWeekNoStructureToPage() {

    const startpage = document.querySelector(".startpage");
    const oldWeekNo = document.getElementById("weekContainer");

    // BUG-FIX: It may was showing up on bookmarks, history, and notes pages
    const managerPage = document.querySelector(".webpageview.active .sdwrapper .manager");
    if (managerPage) {
        if (oldWeekNo) oldWeekNo.remove();
        return;
    }

    // check if already exists and elements are valid
    if (oldWeekNo || !startpage) return;

    const startpageNav = document.querySelector(".startpage .startpage-navigation");
    let refrenceElement, position;

    if (startpageNav) {
        refrenceElement = startpageNav;
        position = "afterbegin";
    }
    else {
        refrenceElement = startpage;
        position = "afterend";
    }

    const WeekNoContainer = document.createElement("div");
    WeekNoContainer.id = "weekContainer";
    WeekNoContainer.innerHTML = `
       ${getWeek()}<sup>th</sup> Week
    `;

    refrenceElement.insertAdjacentElement(position, WeekNoContainer);
}

function weekNoToSpeeddial() {

    // only reliable way to detect new tabs including new windows with a single startpage tab
    vivaldi.tabsPrivate.onTabUpdated.addListener(addWeekNoStructureToPage);

    // catches all redrawings of the startpage including theme changes and switching back to a tab
    const appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function () {
        if (arguments[0].tagName === "DIV") {
            setTimeout(
                function () {
                    if (this.classList.contains("startpage")) {
                        addWeekNoStructureToPage();
                    }
                }.bind(this, arguments[0])
            );
        }
        return appendChild.apply(this, arguments);
    };
}

let intervalweekNo = setInterval(() => {
    const browser = document.getElementById("browser");

    if (!browser) return;

    clearInterval(intervalweekNo);
    weekNoToSpeeddial();
}, 100);