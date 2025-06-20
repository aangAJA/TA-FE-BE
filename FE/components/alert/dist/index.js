"use strict";
exports.__esModule = true;
exports.AlertDangger = exports.AlertWarning = exports.AlertSuccess = exports.AlertInfo = void 0;
exports.AlertInfo = function (_a) {
    var children = _a.children, title = _a.title;
    return (React.createElement("div", { className: "my-2 bg-sky-200 rounded-md text-sky-800 px-4 py-3 shadow-md border-l-4 border-sky-800", role: "alert" },
        React.createElement("div", { className: "flex gap-1" },
            React.createElement("div", null,
                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-7 h-7" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" }))),
            React.createElement("div", null,
                React.createElement("p", { className: "font-bold text-lg" }, title),
                React.createElement("div", { className: "text-sm" }, children)))));
};
exports.AlertSuccess = function (_a) {
    var children = _a.children, title = _a.title;
    return (React.createElement("div", { className: "my-2 bg-green-200 rounded-md text-green-800 px-4 py-3 shadow-md border-l-4 border-green-800", role: "alert" },
        React.createElement("div", { className: "flex gap-1" },
            React.createElement("div", null,
                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "size-6" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" }))),
            React.createElement("div", null,
                React.createElement("p", { className: "font-bold text-lg" }, title),
                React.createElement("div", { className: "text-sm" }, children)))));
};
exports.AlertWarning = function (_a) {
    var children = _a.children, title = _a.title;
    return (React.createElement("div", { className: "my-2 bg-yellow-200 rounded-md text-yellow-800 px-4 py-3 shadow-md border-l-4 border-yellow-800", role: "alert" },
        React.createElement("div", { className: "flex gap-1" },
            React.createElement("div", null,
                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "size-6" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" }))),
            React.createElement("div", null,
                React.createElement("p", { className: "font-bold text-lg" }, title),
                React.createElement("div", { className: "text-sm" }, children)))));
};
exports.AlertDangger = function (_a) {
    var children = _a.children, title = _a.title;
    return (React.createElement("div", { className: "my-2 bg-red-200 rounded-md text-red-800 px-4 py-3 shadow-md border-l-4 border-red-800", role: "alert" },
        React.createElement("div", { className: "flex gap-1" },
            React.createElement("div", null,
                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "size-6" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" }))),
            React.createElement("div", null,
                React.createElement("p", { className: "font-bold text-lg" }, title),
                React.createElement("div", { className: "text-sm" }, children)))));
};
