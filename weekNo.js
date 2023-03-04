Date.prototype.getWeekNumber = function () {

    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));

    d.setUTCDate(d.getUTCDate() - d.getUTCDay());

    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

async function addWeekNoStructureToPage() {

    const oldWeekNo = document.getElementById("weekContainer");

    // BUG-FIX: It may was showing up on bookmarks, history, and notes pages
    const managerPage = document.querySelector(".webpageview.active .sdwrapper .manager");
    if (managerPage) {
        if (oldWeekNo) oldWeekNo.remove();
        return;
    }

    // check if already exists and elements are valid
    if (oldWeekNo) return;

    const week = (new Date()).getWeekNumber();

    const WeekNoContainer = document.createElement("div");
    WeekNoContainer.id = "weekContainer";
    WeekNoContainer.classList.add('button-toolbar');
    WeekNoContainer.innerText = `Current Week : ${week}`;
    document.querySelector('.StatusInfo').insertAdjacentElement('afterend', WeekNoContainer);
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