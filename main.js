// ==UserScript==
// @name         NFLSOJ helper
// @namespace    http://www.nfls.com.cn:20035/article/1197
// @version      0.4.0
// @description  Use NFLSOJ More Easily
// @author       lexiyvv & ppip & GlaceonVGC & ACrazySteve
// @match      *://www.nfls.com.cn:20035/*
// @match      *://192.168.188.77/*
// @grant        GM_setClipboard
// @icon         https://raw.githubusercontent.com/NFLSCode/nflsoj-helper/master/icon.png
// @icon64       https://raw.githubusercontent.com/NFLSCode/nflsoj-helper/master/icon.png
// ==/UserScript==

// full-white-picture: https://cdn.luogu.com.cn/upload/image_hosting/qrtxpnch.png
var yourBackground = "null"; // nothing
var yourProfilePicture = "https://cdn.luogu.com.cn/upload/usericon/150522.png"; // white
localStorage.setItem("bgurl", yourBackground);
function getElement(request) {
    return document.getElementsByClassName(request);
}
function getColor(request) {
    let fir = request.match(/(?<=##)#[0-9a-fA-F]{6}/),
        res = request.match(/(?<=(?<!#)#)#[0-9a-fA-F]{6}/);
    res = res ? res[0] : "black";
    return [fir ? fir[0] : res, res];
}
function genColorHTML(t, data, name, color) {
    return `<${t} ${data}><span style="color:${color[0]}">${name[0]}</span><span style="color:${color[1]};">${name.slice(1)}</span></${t}>`;
}
function getUserIcon(request) {
    let icon = request.match(/##\{(\w+ icon)\}/);
    return icon ? `<i class="${icon[1]}"></i>` : null;
}
function betterBorder(p) {
    p.style.backgroundColor = "rgba(255,255,255)";
    p.style.border = "thin solid rgba(200,200,200,0.5)";
}
let domain = window.location.pathname;
if (/contests/.test(domain)) {
    betterBorder(getElement("padding")[0].childNodes[1]);
} else if (/submissions|discussion|(contest\/[0-9]+\/ranklist)/.test(domain)) {
    betterBorder(getElement("padding")[0].childNodes[3]);
} else if (/cp/.test(domain)) {
    betterBorder(getElement("fixed-table-body")[0]);
}
if (!localStorage.getItem("bgurl")) {
    localStorage.setItem("bgurl", yourBackground);
}
document.body.style.backgroundImage=`url(${localStorage.getItem("bgurl")})`;
document.body.style.backgroundSize="cover";
if (!localStorage.getItem("fgopacity")) {
    localStorage.setItem("fgopacity", "0.8");
}
document.body.style.opacity = localStorage.getItem("fgopacity");
function add_copy(button, code) {
    button.addEventListener("click", function() {
        GM_setClipboard(code.textContent, "text"); // eslint-disable-line no-undef
        button.textContent = "Copied!";
        setTimeout(function() {
            button.textContent = "Copy";
        }, 1000);
    })
}
if (/^\/submission\/\d+$/.test(domain)) {
    let value = getElement("ui existing segment")[0];
    value.firstChild.style.borderRadius = "0 0.28571429rem 0 0";
    value.firstChild.style.position = "unset";
    let position = value.innerHTML.search(/<\/a>/) + 4;
    value.innerHTML = `<span style="position:absolute;top:0px;right:-4px;"><div class="ui button" style="position:relative;left:4px;border-right: 1px solid rgba(0,0,0,0.6);border-radius: 0 0 0 .28571429rem;">Copy</div>${value.innerHTML.slice(0, position)}</span>${value.innerHTML.slice(position)}`;
    add_copy(value.firstChild.firstChild, value.lastChild);
} else {
    for (let i = 0, e; i < (e = getElement("ui existing segment")).length; i++) {
        if (/\/problem\//.test(domain)) {
            e[i].parentNode.style.width = "50%";
        }
        e[i].innerHTML = `<div class="ui button" style="position:absolute;top:0px;right:-4px;border-top-left-radius:0;border-bottom-right-radius:0;">Copy</div>` + e[i].innerHTML;
        add_copy(e[i].firstChild, e[i].childNodes[e[i].childNodes.length / 2]);
    }
}
if (domain == "/") {
    let tourist = {"20200131": ["black", "red"], "sszcdjr": ["black", "red"]};
    for (var i = 1; i < 40; i += 2) {
        let td = getElement("ui very basic center aligned table")[0].tBodies[0].childNodes[i], name = td.childNodes[3].innerText;
        td.childNodes[3].innerHTML = genColorHTML(
            "a", `href=${td.childNodes[3].childNodes[0].getAttribute("href")}`, name,
            Object.prototype.hasOwnProperty.call(tourist, name) ? tourist[name] : getColor(td.childNodes[9].textContent));
    }
    let board = getElement("ui very basic table")[0];
    board.innerHTML += `<text>NFLSOJ helper 公告</text><hr>
                        <a href='/article/1197'>NFLSOJ helper 发布帖</a><hr>
                        <text style='border:1px solid black;border-radius:4px;'>延长登录时间</text>`;
    board.childNodes[9].addEventListener("click", function() {
        document.cookie = `${document.cookie.match(/(^| )(login=[^;]*)(;|$)/)[2]};expires=Wed, 04 Aug 2077 01:00:00 GMT`;
        alert("Success");
    });
} else if (/(?<!cp)\/user\/[0-9]+(\/(?!edit)|$)/.test(domain)) {
    var imageurl2=yourProfilePicture;
    if (getElement("blurring dimmable image")[0].childNodes[3]) {
        getElement("blurring dimmable image")[0].childNodes[3].src=imageurl2;
    }
    let mainpage = getElement("ui bottom attached segment"),
        nameColor = genColorHTML("nobr", "", mainpage[0].innerHTML, getColor(mainpage[3].innerHTML)),
        backup = getElement("icon")[14].outerHTML,
        customIcon = getUserIcon(mainpage[3].innerHTML);
    backup = customIcon ? customIcon : /(man|woman) icon/.test(backup) ? backup : "";
    mainpage[0].innerHTML = nameColor;
    getElement("header")[1].innerHTML = nameColor + " " + backup;
}