"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var image_1 = require("next/image");
var menuItem_1 = require("./menuItem");
var download__1__jpeg_1 = require("../../public/image/download (1).jpeg");
var download__2__jpeg_1 = require("../../public/image/download (2).jpeg");
var client_cookies_1 = require("@/lib/client-cookies");
var router_1 = require("next/router");
var handleLogout = function () {
    client_cookies_1.removeCookie("token");
    client_cookies_1.removeCookie("id");
    client_cookies_1.removeCookie("name");
    client_cookies_1.removeCookie("role");
    router_1["default"].replace("/login");
};
var Sidebar = function (_a) {
    var children = _a.children, id = _a.id, title = _a.title, menuList = _a.menuList;
    var _b = react_1.useState(false), isShow = _b[0], setIsShow = _b[1];
    var _c = react_1.useState(false), isDropdownOpen = _c[0], setIsDropdownOpen = _c[1];
    var toggleDropdown = function () {
        setIsDropdownOpen(!isDropdownOpen);
    };
    return (React.createElement("div", { className: "w-full min-h-dvh bg-gray-400" },
        React.createElement("header", { className: "flex justify-between items-center p-4 mb-0 bg-primary shadow-md" },
            React.createElement("div", { className: "flex gap-2" },
                React.createElement("div", null,
                    React.createElement("button", { onClick: function () { return setIsShow(true); } },
                        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-6 h-6 text-white" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" })))),
                React.createElement("h1", { className: "font-bold text-xl text-white" }, title)),
            React.createElement("div", { className: "relative" },
                React.createElement("button", { onClick: toggleDropdown, className: "flex itemscenter space-x-2 text-white" },
                    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "size-6" },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25 2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" })),
                    React.createElement("span", { className: "font-bold" }, "Logout")),
                isDropdownOpen && (React.createElement("div", { className: "absolute right-0 mt-2 w-48 bg-black rounded-md shadow-lg py-1 z-10 top-full" },
                    React.createElement("a", { href: "/manager/profile", className: "block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-black" }, "Profile"),
                    React.createElement("a", { href: "/manager/setting", className: "block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-black" }, "Settings"),
                    React.createElement("a", { onClick: handleLogout, href: "/login", className: "block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-black" }, "Logout"))))),
        React.createElement("div", { className: "p-4" }, children),
        React.createElement("div", { className: "flex flex-col w-2/3 md:w-1/2 lg:w-1/4 h-full fixed top-0 right-full transition-transform z-50\n           bg-slate-600 border-r border-primary " + (isShow ? "translate-x-full" : "") },
            React.createElement("div", { className: "ml-auto p-2" },
                React.createElement("button", { onClick: function () { return setIsShow(false); } },
                    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8" },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" })))),
            React.createElement("div", { className: "mb-3 w-full flex justify-center" },
                React.createElement("div", { className: "flex items-center space-x-2" },
                    React.createElement(image_1["default"], { src: download__1__jpeg_1["default"], alt: "Logo", width: 40, height: 40 }),
                    React.createElement("h1", { className: "text-2xl font-bold text-white-500" }, "Amba Web"))),
            React.createElement("div", { className: "w-full mt-10 mb-6 bg-primary text-white p-3 flex gap-2 items-center" },
                React.createElement(image_1["default"], { src: download__2__jpeg_1["default"], alt: "Profile", width: 40, height: 40, className: "rounded-full" }),
                React.createElement("div", { className: "text-sm font-semibold" }, "AMBARUO")),
            React.createElement("div", { className: "w-full p-2 overflow-y-auto" },
                React.createElement("div", { className: "px-5" }, menuList.map(function (menu, index) { return (React.createElement(menuItem_1["default"], { icon: menu.icon, label: menu.label, path: menu.path, active: menu.id === id, key: "keyMenu" + index })); }))))));
};
exports["default"] = Sidebar;
