function getWeek() {

    currentDate = new Date();

    startDate = new Date(currentDate.getFullYear(), 0, 1);

    var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

    return Math.ceil(days / 7);
}

Date.prototype.getWeekNumber = function () {

    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));

    d.setUTCDate(d.getUTCDate() - d.getUTCDay());

    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

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

    // const c = new Date(2023, 2 - 1, 25).getWeekNumber();
    // const d = new Date(2023, 2 - 1, 26).getWeekNumber();

    const week = getWeek();
    const sup = getSup(week);

    const WeekNoContainer = document.createElement("div");
    WeekNoContainer.id = "weekContainer";
    WeekNoContainer.innerHTML = `${week}<sup>${sup}</sup> week`;

    refrenceElement.insertAdjacentElement(position, WeekNoContainer);
}
function getSup(week) {
    if (week >= 4 && week <= 20) return 'th';

    const num = week % 10;
    const i = {
        1: "st",
        2: "nd",
        3: "rd"
    }
    return i[num] ? i[num] : 'th';
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