var _fileIncluded_control = true;
var _init_flag = true;
function initDataPilot(_aO) {
    var dataset = getElementDataset(_aO);
    if (!_aO.getAttribute("pageSize")) {
        if (dataset) _aO.pageSize = dataset.pageSize;
    }
    var pageSize = _aO.getAttribute("pageSize");
    for (var i = 0; i < _aO.tBodies[0].rows.length; i++) {
        var row = _aO.tBodies[0].rows[i];
        row.removeNode(true);
    }
    var buttons_str = getValidStr(_aO.getAttribute("buttons"));
    if (buttons_str == "" || compareText(buttons_str, "default")) buttons_str = "movefirst,prevpage,moveprev,movenext,nextpage,movelast,appendrecord,deleterecord,cancelrecord,updaterecord";
    else if (compareText(buttons_str, "readonly")) buttons_str = "movefirst,prevpage,moveprev,movenext,nextpage,movelast";
    buttons_str = buttons_str.toLowerCase();
    var buttons = buttons_str.split(",");
    var row = _aO.tBodies[0].insertRow();
    row.align = "center";
    for (var i = 0; i < buttons.length; i++) {
        btn = document.createElement("<input type=button class=button hideFocus=true style=\"height: 22px\">");
        btn.style.backgroundImage = "url(" + _theme_root + "/button.gif)";
        btn.tabIndex = -1;
        btn.onmouseover = _button_onmouseover;
        btn.onmouseout = _button_onmouseout;
        btn.onclick = _datapilot_onclick;
        btn.dataset = _aO.getAttribute("dataset");
        btn.buttonType = buttons[i];
        btn.datapiolt = _aO;
        switch (buttons[i]) {
        case "movefirst":
            {
                btn.style.fontFamily = "Webdings";
                btn.value = "9";
                btn.title = constDatasetMoveFirst;
                btn.style.width = 30;
                break;
            }
        case "prevpage":
            {
                btn.style.fontFamily = "Webdings";
                btn.value = "7";
                btn.title = constDatasetPrevPage;
                btn.style.width = 30;
                break;
            }
        case "moveprev":
            {
                btn.style.fontFamily = "Webdings";
                btn.value = "3";
                btn.title = constDatasetMovePrev;
                btn.style.width = 30;
                break;
            }
        case "movenext":
            {
                btn.style.fontFamily = "Webdings";
                btn.value = "4";
                btn.title = constDatasetMoveNext;
                btn.style.width = 30;
                break;
            }
        case "nextpage":
            {
                btn.style.fontFamily = "Webdings";
                btn.value = "8";
                btn.title = constDatasetNextPage;
                btn.style.width = 30;
                break;
            }
        case "movelast":
            {
                btn.style.fontFamily = "Webdings";
                btn.value = ":";
                btn.title = constDatasetMoveLast;
                btn.style.width = 30;
                break;
            }
        case "insertrecord":
            {
                btn.value = constBtnInsertRecord;
                btn.title = constDatasetInsertRecord;
                btn.style.width = 45;
                break;
            }
        case "appendrecord":
            {
                btn.value = constBtnAppendRecord;
                btn.title = constDatasetAppendRecord;
                btn.style.width = 45;
                break;
            }
        case "deleterecord":
            {
                btn.value = constBtnDeleteRecord;
                btn.title = constDatasetDeleteRecord;
                btn.style.width = 45;
                break;
            }
        case "editrecord":
            {
                btn.value = constBtnEditRecord;
                btn.title = constDatasetEditRecord;
                btn.style.width = 45;
                break;
            }
        case "cancelrecord":
            {
                btn.value = constBtnCancelRecord;;
                btn.title = constDatasetCancelRecord;
                btn.style.width = 45;
                break;
            }
        case "updaterecord":
            {
                btn.value = constBtnUpdateRecord;
                btn.title = constDatasetUpdateRecord;
                btn.style.width = 45;
                break;
            }
        }
        btn.id = _aO.id + "_" + btn.buttonType;
        row.insertCell().appendChild(btn);
    }
    refreshDataPilot(_aO);
};
function setDataPilotButtons(_aO, buttons) {
    _aO.buttons = buttons;
    initDataPilot(_aO);
};
function refreshDataPilot(_aO) {
    function _t(btn, enable) {
        btn.disabled = !enable;
        refreshButtonColor(btn);
    };
    var dataset = getElementDataset(_aO);
    var row = _aO.rows[0];
    for (var i = 0; i < row.cells.length; i++) {
        var btn = row.cells[i].children[0];
        switch (btn.buttonType) {
        case "movefirst":
            ;
        case "moveprev":
            {
                _t(btn, (dataset && !dataset.bof));
                break;
            }
        case "prevpage":
            {
                _t(btn, (dataset && dataset.record && dataset.record.pageIndex > 1));
                break;
            }
        case "movenext":
            ;
        case "movelast":
            {
                _t(btn, (dataset && !dataset.eof));
                break;
            }
        case "nextpage":
            {
                _t(btn, (dataset && dataset.record && dataset.record.pageIndex < dataset.pageCount));
                break;
            }
        case "insertrecord":
            ;
        case "appendrecord":
            {
                _t(btn, (dataset && !dataset.readOnly));
                break;
            }
        case "editrecord":
            {
                _t(btn, (dataset && !(dataset.bof && dataset.eof) && !dataset.readOnly));
                break;
            }
        case "deleterecord":
            {
                _t(btn, (dataset && !(dataset.bof && dataset.eof) && !dataset.readOnly));
                break;
            }
        case "cancelrecord":
            ;
        case "updaterecord":
            {
                _t(btn, (dataset && (dataset.state == "insert" || dataset.state == "modify") && !dataset.readOnly));
                break;
            }
        }
        fireUserEvent(getElementEventName(_aO, "onRefreshButton"), [_aO, btn, btn.buttonType, dataset]);
    }
};
function _datapilot_onclick() {
    if (event.srcElement.disabled) return;
    var datapiolt = event.srcElement.datapiolt;
    var dataset = getElementDataset(datapiolt);
    var _ad = getElementEventName(datapiolt, "onButtonClick");
    if (isUserEventDefined(_ad)) {
        var _bI = fireUserEvent(_ad, [datapiolt, event.srcElement, event.srcElement.buttonType, dataset]);
        if (!_bI) return;
    }
    var pageSize = datapiolt.getAttribute("pageSize");
    switch (event.srcElement.buttonType) {
    case "movefirst":
        {
            dataset.moveFirst();
            break;
        }
    case "prevpage":
        {
            var pageIndex = (dataset.record) ? dataset.record.pageIndex - 1 : 1;
            dataset.moveToPage(pageIndex);
            break;
        }
    case "moveprev":
        {
            dataset.movePrev();
            break;
        }
    case "movenext":
        {
            dataset.moveNext();
            break;
        }
    case "nextpage":
        {
            var pageIndex = (dataset.record) ? dataset.record.pageIndex + 1 : 1;
            dataset.moveToPage(pageIndex);
            break;
        }
    case "movelast":
        {
            dataset.moveLast();
            break;
        }
    case "insertrecord":
        {
            dataset.insertRecord("before");
            break;
        }
    case "appendrecord":
        {
            dataset.insertRecord("end");
            break;
        }
    case "editrecord":
        {
            dataset_setState(dataset, "modify");
            break;
        }
    case "deleterecord":
        {
            if (isTrue(datapiolt.getAttribute("confirmDelete"))) {
                if (confirm(constDatasetDeleteRecord)) dataset.deleteRecord();
            } else dataset.deleteRecord();
            break;
        }
    case "cancelrecord":
        {
            if (isTrue(datapiolt.getAttribute("confirmCancel"))) {
                if (confirm(constDatasetCancelRecord)) dataset.cancelRecord();
            } else dataset.cancelRecord();
            break;
        }
    case "updaterecord":
        {
            dataset.updateRecord();
            break;
        }
    }
};
function initTabSet(tabset) {
    tabset._imagePrefix = _theme_root + "/tabset/" + tabset.tabPlacement + "_";
    var _bG = tabset.parentElement;
    _bG.style.width = _bG.offsetWidth;
    var tabs = tabset.getAttribute("tabs");
    if (tabs.length > 0 && tabs.substring(tabs.length - 1, tabs.length) == ";") tabs = tabs.substring(0, tabs.length - 1);
    if (!tabs) return;
    var tabs = tabs.split(";");
    for (var i = 0; i < tabset.tBodies[0].rows.length; i++) {
        var row = tabset.tBodies[0].rows[i];
        row.removeNode(true);
    }
    var row = tabset.tBodies[0].insertRow();
    var cell = row.insertCell();
    cell.firstCell = true;
    cell.innerHTML = "<img src=\"" + tabset._imagePrefix + "start_tab.gif\">";
    var label, tabname, index;
    for (i = 0; i < tabs.length; i++) {
        props = tabs[i].split(",");
        cell = row.insertCell();
        cell.background = tabset._imagePrefix + "tab_button.gif";
        cell._tabIndex = i;
        label = props[0];
        tabname = props[1];
        cell.tabName = tabname;
        cell.label = label;
        cell.targetUrl = getDecodeStr(props[2]);
        btn = document.createElement("<DIV hideFocus=true nowrap class=tab></DIV>");
        btn.innerText = getDecodeStr(props[0]);
        btn._tabIndex = -1;
        btn.onclick = _tabset_onclick;
        btn.onmouseover = _tabset_onmouseover;
        btn.onmouseout = _tabset_onmouseout;
        btn.tab = cell;
        cell.appendChild(btn);
        cell = row.insertCell();
        if (i != tabs.length - 1) {
            cell.innerHTML = "<img src=\"" + tabset._imagePrefix + "tab.gif\">";
        } else {
            cell.lastCell = true;
            cell.innerHTML = "<img src=\"" + tabset._imagePrefix + "end_tab.gif\">";
        }
        eval("var tabsetBody=_body_" + tabset.id + ";");
        eval("if (typeof(" + tabset.id + "_" + tabname + ")!=\"undefined\") var tab=" + tabset.id + "_" + tabname + ";");
        if (typeof(tab) != "undefined") {
            tab.extra = "tab";
            tab.style.visibility = "hidden";
            _setChildTableVisibility(tab, "hidden");
            tab.style.overflow = "auto";
            tab.style.position = "absolute";
            tab.style.left = 0;
            tab.style.top = 0;
            tab.style.width = tabsetBody.clientWidth - 4;
            tab.style.height = tabsetBody.clientHeight - 4;
            tab.style.margin = 2;
        }
    }
    cell = row.insertCell();
    cell.width = "100%";
    cell.background = tabset._imagePrefix + "tab_blank.gif";
    if (v_currentTab) {
        setActiveTab(tabset, v_currentTab);
    } else {
        setActiveTabIndex(tabset, getInt(tabset.getAttribute("tabIndex")));
    }
    if (tabset.offsetWidth > _bG.clientWidth) {
        var buttonPane = document.createElement("<div style=\"width:30; cursor:hand; z-index:1000\"></div>");
        buttonPane.innerHTML = "<img width=\"15\" height=\"15\" src=\"" + _theme_root + "/tabset/scroll_button1.gif\" " + "onmousedown=\"_tabpane_" + tabset.id + ".scrollLeft=_tabpane_" + tabset.id + ".scrollLeft-50\">" + "<img width=\"15\" height=\"15\" src=\"" + _theme_root + "/tabset/scroll_button2.gif\" " + "onmousedown=\"_tabpane_" + tabset.id + ".scrollLeft=_tabpane_" + tabset.id + ".scrollLeft+50\">";
        buttonPane.style.position = "absolute";
        eval("var pos=getAbsPosition(_tabpane_" + tabset.id + ");");
        buttonPane.style.left = pos[0];
        buttonPane.style.top = pos[1] + 4;
        eval("_tabdiv_" + tabset.id + ".appendChild(buttonPane);");
    }
    eval("var tabsetPane=_tabsetpane_" + tabset.id + ";");
    tabsetPane.tabPane = _bG;
    tabsetPane.onresize = tabSet_onResize;
};
function tabSet_onResize() {
    var tabsetPane = event.srcElement;
    var tabPane = tabsetPane.tabPane;
    tabPane.style.width = tabsetPane.offsetWidth;
};
function setTabs(tabset, tabs) {
    tabset.tabs = tabs;
    initTabSet(tabset);
};
function _setChildTableVisibility(_aV, vis) {
    for (var i = 0; i < _aV.children.length; i++) {
        var obj = _aV.children[i];
        if (compareText(obj.getAttribute("extra"), "datatable")) {
            obj.style.visibility = vis;
            if (!compareText(vis, "hidden") && obj.needRefresh) {
                obj.refreshData();
            }
        }
        _setChildTableVisibility(obj, vis);
    }
};
function _setActiveTab(cell) {
    try {
        var row = getRowByCell(cell);
        var tabset = getTableByRow(row);
        var selectCell = tabset.selectTab;
        if (selectCell == cell) return;
        var _az = (selectCell) ? selectCell.tabName: "";
        var newName = cell.tabName;
        var _ad = getElementEventName(tabset, "beforeTabChange");
        var _bI = fireUserEvent(_ad, [tabset, _az, newName]);
        if (_bI) throw _bI;
        eval("var tabsetBody=_body_" + tabset.id + ";");
        if (selectCell) {
            var _cF = row.cells[selectCell.cellIndex - 1];
            var _ac = row.cells[selectCell.cellIndex + 1];
            selectCell.background = tabset._imagePrefix + "tab_button.gif";
            if (_cF.firstCell) _cF.firstChild.src = tabset._imagePrefix + "start_tab.gif";
            else _cF.firstChild.src = tabset._imagePrefix + "tab.gif";
            if (_ac.lastCell) _ac.firstChild.src = tabset._imagePrefix + "end_tab.gif";
            else _ac.firstChild.src = tabset._imagePrefix + "tab.gif";
            var tab = null;
            eval("if (typeof(" + tabset.id + "_" + _az + ")!=\"undefined\") tab=" + tabset.id + "_" + _az + ";");
            if (tab) {
                _stored_element = tab;
                _setChildTableVisibility(tab, "hidden");
                document.body.appendChild(tab);
                var s = "_stored_element.style.position=\"absolute\";" + "_stored_element.style.visibility=\"hidden\";";
                setTimeout(s, 0);
            }
        }
        var _cF = row.cells[cell.cellIndex - 1];
        var _ac = row.cells[cell.cellIndex + 1];
        cell.background = tabset._imagePrefix + "active_tab_button.gif";
        if (_cF.firstCell) _cF.firstChild.src = tabset._imagePrefix + "active_start_tab.gif";
        else _cF.firstChild.src = tabset._imagePrefix + "active_tab1.gif";
        if (_ac.lastCell) _ac.firstChild.src = tabset._imagePrefix + "active_end_tab.gif";
        else _ac.firstChild.src = tabset._imagePrefix + "active_tab2.gif";
        var tab = null;
        eval("if (typeof(" + tabset.id + "_" + newName + ")!=\"undefined\") tab=" + tabset.id + "_" + newName + ";");
        if (tab) {
            tabsetBody.appendChild(tab);
            tab.style.position = "";
            tab.style.visibility = "";
            _setChildTableVisibility(tab, "");
        }
        tabset.selectTab = cell;
        tabset.selectName = cell.tabName;
        tabset.selectIndex = cell._tabIndex;
        if (cell.targetUrl) {
            open(cell.targetUrl, tabset.targetFrame);
        }
        var _ad = getElementEventName(tabset, "afterTabChange");
        fireUserEvent(_ad, [tabset, _az, newName]);
    } catch(e) {
        processException(e);
    }
};
function setActiveTab(table, tabname) {
    if (!tabname) return;
    for (var i = 0; i < table.cells.length; i++) {
        if (table.cells[i].tabName == tabname) {
            _setActiveTab(table.cells[i]);
            break;
        }
    }
};
function setActiveTabIndex(table, index) {
    for (var i = 0; i < table.cells.length; i++) {
        if (table.cells[i]._tabIndex == index) {
            _setActiveTab(table.cells[i]);
            if (index > 10) {
                temp = document.getElementById("_tabpane_" + table.id);
                temp.scrollLeft = temp.scrollLeft + 500;
            }
            break;
        }
    }
};
function setActiveTabIndex_new(table, index) {
    for (var i = 0; i < table.cells.length; i++) {
        if (table.cells[i]._tabIndex == index) {
            _setActiveTab_new(table.cells[i]);
            if (index > 10) {
                temp = document.getElementById("_tabpane_" + table.id);
                temp.scrollLeft = temp.scrollLeft + 500;
            }
            break;
        }
    }
};
function _setActiveTab_new(cell) {
    try {
        var row = getRowByCell(cell);
        var tabset = getTableByRow(row);
        var selectCell = tabset.selectTab;
        if (selectCell == cell) return;
        var _az = (selectCell) ? selectCell.tabName: "";
        var newName = cell.tabName;
        var _ad = getElementEventName(tabset, "beforeTabChange");
        var _bI = fireUserEvent(_ad, [tabset, _az, newName]);
        if (_bI) throw _bI;
        eval("var tabsetBody=_body_" + tabset.id + ";");
        if (selectCell) {
            var _cF = row.cells[selectCell.cellIndex - 1];
            var _ac = row.cells[selectCell.cellIndex + 1];
            selectCell.background = tabset._imagePrefix + "tab_button.gif";
            if (_cF.firstCell) _cF.firstChild.src = tabset._imagePrefix + "start_tab.gif";
            else _cF.firstChild.src = tabset._imagePrefix + "tab.gif";
            if (_ac.lastCell) _ac.firstChild.src = tabset._imagePrefix + "end_tab.gif";
            else _ac.firstChild.src = tabset._imagePrefix + "tab.gif";
            var tab = null;
            eval("if (typeof(" + tabset.id + "_" + _az + ")!=\"undefined\") tab=" + tabset.id + "_" + _az + ";");
            if (tab) {
                _stored_element = tab;
                _setChildTableVisibility(tab, "hidden");
                document.body.appendChild(tab);
                var s = "_stored_element.style.position=\"absolute\";" + "_stored_element.style.visibility=\"hidden\";";
                setTimeout(s, 0);
            }
        }
        var _cF = row.cells[cell.cellIndex - 1];
        var _ac = row.cells[cell.cellIndex + 1];
        cell.background = tabset._imagePrefix + "active_tab_button.gif";
        if (_cF.firstCell) _cF.firstChild.src = tabset._imagePrefix + "active_start_tab.gif";
        else _cF.firstChild.src = tabset._imagePrefix + "active_tab1.gif";
        if (_ac.lastCell) _ac.firstChild.src = tabset._imagePrefix + "active_end_tab.gif";
        else _ac.firstChild.src = tabset._imagePrefix + "active_tab2.gif";
        var tab = null;
        eval("if (typeof(" + tabset.id + "_" + newName + ")!=\"undefined\") tab=" + tabset.id + "_" + newName + ";");
        if (tab) {
            tabsetBody.appendChild(tab);
            tab.style.position = "";
            tab.style.visibility = "";
            _setChildTableVisibility(tab, "");
        }
        tabset.selectTab = cell;
        tabset.selectName = cell.tabName;
        tabset.selectIndex = cell._tabIndex;
        if (cell.targetUrl) {}
        var _ad = getElementEventName(tabset, "afterTabChange");
        fireUserEvent(_ad, [tabset, _az, newName]);
    } catch(e) {
        processException(e);
    }
};
function _tabset_onclick() {
    var tab = event.srcElement.tab;
    _setActiveTab(tab);
};
function _tabset_onmouseover() {
    event.srcElement.style.color = "blue";
    event.srcElement.style.textDecorationUnderline = true;
};
function _tabset_onmouseout() {
    event.srcElement.style.color = "black";
    event.srcElement.style.textDecorationUnderline = false;
};
function initButton(button) {
    button.hideFocus = true;
    setButtonDown(button, button.getAttribute("down"));
    button.onmousedown = function() {
        _button_onmousedown(button);
    };
    button.onmouseup = function() {
        _button_onmouseup(button);
    };
    button.onmouseover = function() {
        _button_onmouseover(button);
    };
    button.onmouseout = function() {
        _button_onmouseout(button);
    };
    button.title = getDecodeStr(button.toolTip);
};
function setButtonDown(button, down) {
    button.down = isTrue(down);
};
function _button_onmousedown(button) {
    fireUserEvent(getElementEventName(button, "onMouseDown"), [button]);
};
function _button_onmouseup(button) {
    if (isTrue(button.getAttribute("allowPushDown"))) {
        var down = button.getAttribute("down");
        setButtonDown(button, !down);
    }
    fireUserEvent(getElementEventName(button, "onMouseUp"), [button]);
};
function _button_onmouseover(button) {
    try {
        if (button.disabled || button.down) return;
        fireUserEvent(getElementEventName(button, "onMouseEnter"), [button]);
    } catch(e) {}
};
function _button_onmouseout(button) {
    try {
        if (button.disabled) return;
        fireUserEvent(getElementEventName(button, "onMouseLeave"), [button]);
    } catch(e) {}
};
function initGroupBox(_aV) {
    var expand = _aV.expand;
    var outerContainer = _aV.getElementsByTagName('DIV')[0];
    if (outerContainer) {
        var innerContainer = outerContainer.getElementsByTagName('DIV')[0];
        if (innerContainer) {
            if (expand != "true") {
                outerContainer.style["height"] = "5px";
                innerContainer.style["display"] = "none";
            } else {
                outerContainer.style["height"] = "";
                innerContainer.style["display"] = "";
            }
        }
    }
};
function initGroupBoxTitle(_aV) {
    var expand = _aV.parentElement.expand;
    var imgUrl;
    var alt;
    if (expand == "true") {
        imgUrl = _theme_root + "/group_expand.gif";
        alt = constGroupBoxCollapseAlt;
    } else {
        imgUrl = _theme_root + "/group_collapse.gif";
        alt = constGroupBoxExpandAlt;
    }
    _aV.innerHTML += "<img expand='" + expand + "' alt='" + alt + "' src='" + imgUrl + "' onclick='_groupboxtitle_onClick(this)' style='cursor: hand;'/>";
};
function _groupboxtitle_onClick(img) {
    var outerContainer = img.parentElement.parentElement.getElementsByTagName('DIV')[0];
    if (!outerContainer) return;
    var innerContainer = outerContainer.getElementsByTagName('DIV')[0];
    if (!innerContainer) return;
    if (img.expand == "true") {
        outerContainer.style["height"] = "5px";
        outerContainer.style["width"] = outerContainer.offsetWidth;
        innerContainer.style["display"] = "none";
        img.src = _theme_root + "/group_collapse.gif";
        img.alt = constGroupBoxExpandAlt;
        img.expand = "false";
    } else {
        outerContainer.style["height"] = "";
        outerContainer.style["width"] = "";
        innerContainer.style["display"] = "";
        img.src = _theme_root + "/group_expand.gif";
        img.alt = constGroupBoxCollapseAlt;
        img.expand = "true";
    }
};
function initSubWindow(_aV) {
    var zoom = _aV.defaultZoom;
    var innerContainer = getSubWindowContainer(_aV);
    if (!innerContainer) return;
    if (zoom == "min") {
        innerContainer.style["display"] = "none";
    } else if (zoom == "max") {} else {
        innerContainer.style["display"] = "";
    }
};
function initSubWindowTitle(_aV) {
    var innerContainer = _aV.children[0];
    var zoom = _aV.defaultZoom;
    var minimize = _aV.minimize;
    var maximize = _aV.maximize;
    if (minimize == "true") {
        var _aK = innerContainer.rows[0].insertCell();
        _aK.innerHTML = "<img src='' onclick='_subwindowtitle_min_onClick(this)' style='cursor: hand;'/>";
    }
    if (maximize == "true") {
        var _aK = innerContainer.rows[0].insertCell();
        _aK.innerHTML = "<img src='' onclick='_subwindowtitle_max_onClick(this)' style='cursor: hand;'/>";
    }
    zoomSubWindow(_aV, zoom);
};
function getSubWindowFromTitle(title) {
    return title.parentElement.parentElement.parentElement.parentElement;
};
function getSubWindowContainer(subWindow) {
    return subWindow.children[0].rows[1].cells[0].children[0];
};
function getSubWindowTitleFromImg(img) {
    return img.parentElement.parentElement.parentElement.parentElement.parentElement;
};
function getSubWindowMinImg(title) {
    return title.children[0].rows[0].cells[1].children[0];
};
function getSubWindowMaxImg(title) {
    return title.children[0].rows[0].cells[2].children[0];
};
function _subwindowtitle_min_onClick(img) {
    var title = getSubWindowTitleFromImg(img);
    var zoom;
    if (title.currentZoom == "min") {
        zoomSubWindow(title, "normal");
    } else {
        zoomSubWindow(title, "min");
    }
};
function _subwindowtitle_max_onClick(img) {
    var title = getSubWindowTitleFromImg(img);
    if (title.currentZoom == "max") {
        zoomSubWindow(title, "normal");
    } else {
        zoomSubWindow(title, "max");
    }
};
function zoomSubWindow(title, zoom) {
    var subWindow = getSubWindowFromTitle(title);
    var innerContainer = getSubWindowContainer(subWindow);
    var minImg = null;
    if (title.minimize == "true") minImg = getSubWindowMinImg(title);
    var maxImg = null;
    if (title.maximize == "true") maxImg = getSubWindowMaxImg(title);
    title.currentZoom = zoom;
    if (zoom == "normal") {
        if (minImg) minImg.src = _theme_root + "/subwindow_minimize.gif";
        if (maxImg) maxImg.src = _theme_root + "/subwindow_maximize.gif";
        innerContainer.style["display"] = "";
        subWindow.style["height"] = subWindow.defaultHeight;
    } else if (zoom == "min") {
        if (minImg) minImg.src = _theme_root + "/subwindow_normal.gif";
        if (maxImg) maxImg.src = _theme_root + "/subwindow_maximize.gif";
        innerContainer.style["display"] = "none";
        subWindow.style["height"] = "";
    } else if (zoom == "max") {
        if (minImg) minImg.src = _theme_root + "/subwindow_minimize.gif";
        if (maxImg) maxImg.src = _theme_root + "/subwindow_normal.gif";
        innerContainer.style["display"] = "";
    }
};
function _initButton(id, targetDataset, url, updateClass, resultDataset, submitDataset, targetFrame, defaultOperation) {
    var _aV = $("#" + id);
    _aV = _aV.get(0);
    _aV.onclick = function() {
        _button_onclick_new(id);
    };
    _aV.componentDataset = targetDataset;
    _aV.url = url;
    _aV.updateclass = updateClass;
    _aV.resultDataset = resultDataset;
    _aV.submitDataset = submitDataset;
    _aV.targetFrame = targetFrame;
    _aV.defaultOperation = defaultOperation;
};
function initEasyTabSet(tabset) {
    var _bX = $(tabset).attr("id");
    var _cL = $(tabset).attr("tabs");
    _jtabset_list[_jtabset_list.length] = $(tabset).tabs({
        onBeforeSelect: function(id, title) {
            id = id.substring(_bX.length + 1);
            if (!v_curretnTabId) {
                v_curretnTabId = id;
                return true;
            }
            if (id == v_curretnTabId) {
                return true;
            }
            var _bk = $(this).tabs('selectHis');
            var p = $(this).tabs("getTab", _bk[_bk.length - 1]);
            var ifr = p.find('iframe')[0].contentWindow;
            var _ad = getElementEventName(tabset, "beforeTabChange");
            try {
                var _bI = ifr.fireUserEvent(_ad, [tabset, v_curretnTabId, id]);
                if (_bI) {
                    if (_bI != false) {
                        alert(_bI);
                    }
                    return false;
                }
            } catch(e) {}
            return true;
        },
        onSelect: function(title) {
            var p = $(this).tabs("getTab", title);
            var ifr = p.find('iframe');
            if (ifr.attr("src") == "") {
                ifr.attr("src", ifr.attr("url"));
            }
        },
        onAfterSelect: function(id, title) {
            id = id.substring(_bX.length + 1);
            if (!v_curretnTabId) {
                v_curretnTabId = id;
                return;
            }
            if (id == v_curretnTabId) {
                return;
            }
            var _bk = $(this).tabs('selectHis');
            var p = $(this).tabs('getTab', _bk[_bk.length - 2]);
            var ifr = p.find('iframe')[0].contentWindow;
            var _ad = getElementEventName(tabset, "afterTabChange");
            try {
                ifr.fireUserEvent(_ad, [tabset, v_curretnTabId, id]);
            } catch(e) {}
            v_curretnTabId = id;
        }
    });
};
function getTabSetById(_bX) {
    var _tabset_list = window.parent._tabset_list;
    for (var i = 0; i < _tabset_list.length; i++) {
        if (_tabset_list[i].id == _bX) {
            return _tabset_list[i];
        }
    }
};
function setTabSetById(_bX, tabset) {
    var _tabset_list = window.parent._tabset_list;
    for (var i = 0; i < _tabset_list.length; i++) {
        if (_tabset_list[i].id == _bX) {
            _tabset_list[i] = tabset;
        }
    }
};
function getJTabSetById(_bX) {
    var _jtabset_list = window.parent._jtabset_list;
    for (var i = 0; i < _jtabset_list.length; i++) {
        if (_jtabset_list[i].attr("id") == _bX) {
            return _jtabset_list[i];
        }
    }
};
function setActiveTab(tabset, name) {
    if (!name) return;
    tabset.setActiveTab(name);
};
function setActiveTabIndex(table, index) {
    if (index < 0) return;
    tabset.setActiveTabIndex(index);
};
var _fileIncluded_dropdown = true;
var _dropdown_parentwindow = null;
var _dropdown_parentbox = null;
var _dropdown_box = null;
var _dropdown_table = null;
var _dropdown_frame = null;
var _dropdown_dataset = null;
var _date_dropdown_box = null;
var _array_dropdown = new Array();
var _calendarControl = null;
var _tmp_dataset_date = null;
function createDropDown(id) {
    var dropdown = new Object();
    dropdown.id = id;
    dropdown.clearCache = dropdown_clearCache;
    return dropdown;
};
function initDropDown(dropdown) {
    _array_dropdown[_array_dropdown.length] = dropdown;
};
function getDropDownByID(ID) {
    for (var i = 0; i < _array_dropdown.length; i++) {
        if (_array_dropdown[i].id == ID) return _array_dropdown[i];
    }
    var result = null;
    eval("if (typeof(" + ID + ")!=\"undefined\") result=" + ID + ";");
    return result;
};
function getDropDowns() {
    return _array_dropdown;
};
function dropdown_clearCache() {
    var dropdown = this;
    dropdown.dropdownbox = null;
};
function initDropDownBox(_aQ) {
    try {
        _isDropDownPage = true;
        if (typeof(_dropdown_succeed) != "undefined" && !isTrue(_dropdown_succeed)) {
            throw getDecodeStr(_dropdown_error);
        } else {
            if (_aQ == "dynamic") {
                if (typeof(datasetDropDown) != "undefined") _dropdown_dataset = datasetDropDown;
            }
            initDocument();
            _initDropDownBox(_aQ);
        }
        return true;
    } catch(e) {
        processException(e);
        hideDropDown();
        hideStatusLabel(window.parent);
        return false;
    }
};
function _initDropDownBox(_aQ) {
    _document_loading = true;
    switch (_aQ) {
    case "dynamic":
        {
            _v.onkeydown = _dropdown_onkeydown;
        }
    case "custom":
        {
            _dropdown_parentwindow = window.parent;
            _dropdown_parentbox = _dropdown_parentwindow._dropdown_box;
            if (_dropdown_parentbox == null) return;
            _dropdown_parentwindow._dropdown_window = window;
            if (!_dropdown_parentbox || _dropdown_parentbox.style.visibility == "hidden") return;
            var editor = _dropdown_parentbox.editor;
            _v.style.width = (_dropdown_parentbox.offsetWidth > editor.offsetWidth) ? _dropdown_parentbox.offsetWidth: editor.offsetWidth;
            _dropdown_parentwindow.sizeDropDownBox();
            with(_dropdown_parentwindow._dropdown_frame) {
                width = "100%";
                if (filters.blendTrans.status != 2) {
                    if (getIEVersion() < "5.5") {
                        style.visibility = "visible";
                    } else {
                        filters.blendTrans.apply();
                        style.visibility = "visible";
                        filters.blendTrans.play();
                    }
                }
            }
            _dropdown_parentbox.dropDown.dropdownbox = _dropdown_parentbox;
            hideStatusLabel(_dropdown_parentwindow);
            break;
        }
    case "predate":
        ;
    case "postdate":
        ;
    case "date":
        {
            _dropdown_parentwindow = window;
            _dropdown_parentbox = _dropdown_parentwindow._dropdown_box;
            _dropdown_parentwindow._dropdown_window = window;
            sizeDropDownBox();
            if ((getIEVersion() >= "5.5") && _dropdown_parentbox.filters.blendTrans.status != 2) _dropdown_parentbox.filters.blendTrans.play();
            break;
        }
    default:
        {
            _dropdown_parentwindow = window;
            _dropdown_parentbox = _dropdown_parentwindow._dropdown_box;
            _dropdown_parentwindow._dropdown_window = window;
            _dropdown_dataset = getElementDataset(_dropdown_table);
            sizeDropDownBox();
            if ((getIEVersion() >= "5.5") && _dropdown_parentbox.filters.blendTrans.status != 2) _dropdown_parentbox.filters.blendTrans.play();
            break;
        }
    }
    _dropdown_parentbox.prepared = true;
    var editor = _dropdown_parentbox.editor;
    if (editor) dropDownLocate();
    _document_loading = false;
};
function sizeDropDownBox() {
    function _K(_bK, _bE) {
        with(_dropdown_box) {
            var editor = _dropdown_box.editor;
            var dropdown = _dropdown_box.dropDown;
            var maxHeight = parseInt(dropdown.height);
            if (isNaN(maxHeight) || maxHeight < 20) maxHeight = 300;
            var pos = getAbsPosition(editor, document.body);
            var _n = pos[0];
            var _A = pos[1] + editor.offsetHeight + 1;
            if (_bE > maxHeight && !(dropdown.type == "dynamic" && getInt(dropdown.pageSize) > 0)) {
                _bE = maxHeight;
                _bK += 16;
                if (! (getIEVersion() < "5.5")) style.overflowY = "scroll";
                else style.overflowY = "visible";
            } else {
                style.overflowY = "hidden";
            }
            var _bS = document.body.clientWidth + document.body.scrollLeft;
            var _by = document.body.clientHeight + document.body.scrollTop;
            if (_n + _bK > _bS && _bS > _bK) _n = _bS - _bK;
            if (_A + _bE > _by && pos[1] > _bE) _A = pos[1] - _bE - 5;
            style.posLeft = _n;
            style.posTop = _A;
            style.posHeight = _bE + 4;
            if (Math.abs(_bK + 4 - style.posWidth) > 4) style.posWidth = _bK + 4;
            style.borderWidth = "2px";
        }
    };
    if (!isDropdownBoxVisible()) return;
    try {
        var _bT, _D;
        switch (_dropdown_box.dropDown.type) {
        case "dynamic":
            ;
        case "custom":
            {
                with(_dropdown_frame) {
                    _D = _dropdown_window._v.offsetHeight;
                    _bT = _dropdown_window._v.offsetWidth;
                    style.posWidth = _bT;
                    style.posHeight = _D;
                }
                break;
            }
        case "predate":
            ;
        case "postdate":
            ;
        case "date":
            {
                _bT = CalendarTable.offsetWidth;
                _D = CalendarTable.offsetHeight;
                break;
            }
        default:
            {
                _bT = _dropdown_table.offsetWidth;
                _D = _dropdown_table.offsetHeight;
                break;
            }
        }
        _K(_bT, _D);
    } catch(e) {}
};
function canDropDown(editor) {
    var field = getElementField(editor);
    var _aE = ((field && field.dropDown) || editor.getAttribute("dropDown"));
    return (_aE && !compareText(editor.type, "checkbox"));
};
function getDropDownBox(dropdown) {
    var box = null;
    if (dropdown.cached == false) {
        if (dropdown.cache) {
            dropdown.clearCache();
        }
    }
    if (dropdown.cache) {
        box = dropdown.dropdownbox;
    }
    if (!box) {
        box = document.createElement("<DIV class=\"dropdown_frame\" style=\"overflow-X: hidden; position: absolute; visibility: hidden; z-index: 10000\"></DIV>");
        document.body.appendChild(box);
        box.dropDown = dropdown;
    }
    _dropdown_box = box;
};
function getDropDownBtn() {
    if (typeof(_dropdown_btn) == "undefined") {
        obj = document.createElement("<INPUT class=\"dropdown_button\" id=_dropdown_btn type=button tabindex=-1 value=6 hidefocus=true" + " style=\"position: absolute; visibility: hidden; z-index: 9999\"" + " LANGUAGE=javascript onmousedown=\"return _dropdown_btn_onmousedown(this)\" onfocus=\"return _dropdown_btn_onfocus(this)\">");
        obj.style.background = "url(" + _theme_root + "/dropdown_button.gif)";
        document.body.appendChild(obj);
        return obj
    } else {
        return _dropdown_btn;
    }
};
function showDropDownBox(_d) {
    try {
        if (!canDropDown(_d)) return;
        if (!isDropdownBoxVisible()) {
            var dropDownId = _d.getAttribute("dropDown");
            if (!dropDownId) {
                var field = getElementField(_d);
                if (field) dropDownId = field.dropDown;
            }
            eval("var dropdown=" + dropDownId);
            var _ad = getElementEventName(dropdown, "beforeOpen");
            var _bI = fireUserEvent(_ad, [dropdown]);
            if (_bI) throw _bI;
            getDropDownBox(dropdown);
            _dropdown_box.editor = _d;
            _dropdown_box.prepared = false;
            if (_dropdown_box.filters.blendTrans.status == 2) return;
            var dataset = getElementDataset(_d);
            if (dataset) {
                if (!dataset.record) dataset.insertRecord();
            }
            with(_dropdown_box) {
                style.overflowY = "hidden";
                switch (dropdown.type) {
                case "dynamic":
                    ;
                case "custom":
                    {
                        style.visibility = "visible";
                        style.length = "1";
                        if (_d.offsetWidth > 128) style.width = editor.offsetWidth;
                        else style.width = 128;
                        break;
                    }
                default:
                    {
                        if (filters.blendTrans.status != 2) {
                            if (! (getIEVersion() < "5.5")) filters.blendTrans.apply();
                            style.visibility = "visible";
                        }
                        break;
                    }
                }
                if (!_dropdown_box.cached) {
                    switch (dropdown.type) {
                    case "dynamic":
                        {
                            showStatusLabel(window, constDownLoadingData, _d);
                            if (dropdown.sessionKey) {
                                var _bt = _dynamicDropDownUrl;
                                if (dropdown.viewType == "table") {
                                    _bt = _dynamicDropDownUrl;
                                } else if (dropdown.viewType == "tree") {
                                    _bt = _dynamicDropDownTreeUrl;
                                } else {
                                    _bt = _dynamicDropDownUrl;
                                }
                                var _url = _extra_library + _bt + "?sessionkey=" + dropdown.sessionKey + "&fields=" + getValidStr(dropdown.fields) + "&showheader=" + ((dropdown.showHeader) ? "1": "0") + "&fieldmeta=" + dropdown.fieldMeta;
                                var _dataset = dropdown.dataset;
                                if (typeof(_dataset) == "string") _dataset = getDatasetByID(_dataset);
                                if (_dataset) {
                                    _url += "&" + "paramstr=" + converDateSetParameter2Str(_dataset);
                                    _url += "&CQId=" + _dataset.getParameter("CQId");
                                    _url += "&init=" + _dataset.init;
                                    _url += "&require=" + _dataset.require;
                                    _url += "&viewField=" + dropdown.fields;
                                }
                                _dropdown_box.innerHTML = "<IFRAME height=0 frameborder=0 marginheight=0 marginwidth=0 scrolling=no" + " src=\"" + _url + "\"" + " style=\"position:_absolute;visibility:hidden;border-style: none\"></IFRAME>";
                                _dropdown_frame = _dropdown_box.firstChild;
                            }
                            break;
                        }
                    case "custom":
                        {
                            showStatusLabel(window, constDownLoadingData, _d);
                            var _url = dropdown.url;
                            if (_url.substring(0, 1) == "/") {
                                _url = _application_root + _url;
                            }
                            var fieldMapStr = dropdown.fieldMap;
                            var viewField = dropdown.fields;
                            var fieldId = dropdown.fieldId;
                            if (_url.lastIndexOf("?") != -1) {
                                _url += "&sessionkey=" + dropdown.sessionKey + "&fieldMapStr=" + fieldMapStr + "&viewField=" + viewField + "&fieldId=" + fieldId;
                            } else {
                                _url += "?sessionkey=" + dropdown.sessionKey + "&fieldMapStr=" + fieldMapStr + "&viewField=" + viewField + "&fieldId=" + fieldId;
                            }
                            var _bl = dropdown.targetDataset;
                            if (typeof(_bl) == "string") _bl = getDatasetByID(_bl);
                            if (_bl) {
                                var targetFieldStr = converDateSet2Str(_bl);
                                _url += "&targetFieldStr=" + targetFieldStr;
                            }
                            var _dataset = dropdown.dataset;
                            if (typeof(_dataset) == "string") _dataset = getDatasetByID(_dataset);
                            if (_dataset) {
                                var paramStr = converDateSetParameter2Str(_dataset);
                                _url += "&paramStr=" + paramStr;
                            }
                            _dropdown_box.innerHTML = "<IFRAME height=0 frameborder=0 marginheight=0 marginwidth=0 scrolling=no" + " src=\"" + _url + "\"" + " style=\"overflow: hidden; position:_absolute; visibility:hidden; border-style: none\"></IFRAME>";
                            _dropdown_frame = _dropdown_box.firstChild;
                            break;
                        }
                    case "predate":
                        ;
                    case "postdate":
                        ;
                    case "date":
                        {
                            var field = getElementField(_d);
                            createCalendar(_dropdown_box, field, _d);
                            _initDropDownBox(dropdown.type);
                            _dropdown_box.onkeydown = _calendar_onkeydown;
                            break;
                        }
                    default:
                        {
                            style.width = _d.offsetWidth;
                            createListTable(_dropdown_box);
                            _dropdown_table.onkeydown = _dropdown_onkeydown;
                            var _dataset;
                            if (dropdown.type == "list") {
                                _dataset = getDropDownItems(dropdown);
                                if (!dropdown.fields) {
                                    if (isTrue(dropdown.mapValue)) dropdown.fields = "label";
                                    else dropdown.fields = "value";
                                }
                            } else {
                                _dataset = dropdown.dataset;
                                if (typeof(_dataset) == "string") _dataset = getDatasetByID(_dataset);
                            }
                            if (_dataset) {
                                setElementDataset(_dropdown_table, _dataset);
                                _dropdown_table.fields = dropdown.fields;
                                initElements(_dropdown_table);
                                refreshTableData(_dropdown_table);
                            }
                            _initDropDownBox(dropdown.type);
                            break;
                        }
                    }
                } else {
                    switch (dropdown.type) {
                    case "dynamic":
                        ;
                    case "custom":
                        {
                            _dropdown_frame = _dropdown_box.firstChild;
                            dropdown.dropdown_window._initDropDownBox(dropdown.type);
                            break;
                        }
                    default:
                        {
                            for (var i = 0; i < _dropdown_box.children.length; i++) {
                                var obj = _dropdown_box.children[i];
                                obj.style.visibility = "visible";
                                if (compareText(obj.getAttribute("extra"), "datatable")) {
                                    if (obj.needRefresh) {
                                        obj.refreshData();
                                    }
                                }
                            }
                            _dropdown_table = dropdown.dropdown_table;
                            _initDropDownBox(dropdown.type);
                            break;
                        }
                    }
                }
            }
            _d.dropDownVisible = true;
            if (typeof(_dropdown_btn) != "undefined") _dropdown_btn.value = "5";
        }
    } catch(e) {
        processException(e);
    }
};
function hideDropDownBox() {
    if (!_dropdown_box) return;
    if (isDropdownBoxVisible()) {
        _skip_activeChanged = true;
        var editor = _dropdown_box.editor;
        var dropdown = _dropdown_box.dropDown;
        if (_dropdown_box.prepared && dropdown.cache) {
            dropdown.dropdown_box = _dropdown_box;
            _dropdown_box.cached = true;
            switch (dropdown.type) {
            case "list":
                ;
            case "dataset":
                {
                    dropdown.dropdown_table = _dropdown_table;
                    break;
                }
            case "dynamic":
                ;
            case "custom":
                {
                    dropdown.dropdown_window = _dropdown_window;
                    break;
                }
            }
            for (var i = 0; i < _dropdown_box.children.length; i++) {
                _dropdown_box.children[i].style.visibility = "hidden";
            }
            _dropdown_box.style.visibility = "hidden";
            _dropdown_window = null;
        } else {
            _dropdown_box.editor = null;
            switch (_dropdown_box.dropDown.type) {
            case "list":
            case "dataset":
                {
                    setElementDataset(_dropdown_table, null);
                    break;
                }
            case "dynamic":
                ;
            case "custom":
                {
                    if (typeof(_dropdown_frame) != "undefined") {
                        _dropdown_frame.style.visibility = "hidden";
                        _dropdown_frame.removeNode(true);
                    }
                    break;
                }
            }
            _dropdown_window = null;
            for (var i = 0; i < _dropdown_box.children.length; i++) {
                _dropdown_box.children[i].style.visibility = "hidden"
            }
            _dropdown_box.style.visibility = "hidden";
            _dropdown_box.removeNode(true);
            _dropdown_box = null;
        }
        editor.dropDownVisible = false;
        if (typeof(_dropdown_btn) != "undefined") _dropdown_btn.value = "6";
    }
};
function isDropDownBtnVisible() {
    if (typeof(_dropdown_btn) != "undefined") return (_dropdown_btn.style.visibility == "visible");
    else return false;
};
function sizeDropDownBtn(_d) {
    if (!isDropDownBtnVisible()) return;
    with(_dropdown_btn) {
        var pos = getAbsPosition(_d);
        style.height = _d.offsetHeight - 2;
        style.width = 16;
        style.posLeft = pos[0] + _d.offsetWidth - offsetWidth - 1;
        style.posTop = pos[1] + 1;
    }
};
function showDropDownBtn(_d) {
    if (!canDropDown(_d)) return;
    getDropDownBtn();
    if (typeof(_dropdown_btn) == "undefined") return;
    with(_dropdown_btn) {
        if (!isDropDownBtnVisible()) {
            setAttribute("editor", _d);
            style.visibility = "visible";
            sizeDropDownBtn(_d);
            var _bu = _d.offsetWidth;
            _d.style.borderRightWidth = 18;
            _d.style.width = _bu;
        }
    }
};
function hideDropDownBtn() {
    if (typeof(_dropdown_btn) == "undefined") return;
    if (isDropDownBtnVisible()) {
        var editor = _dropdown_btn.editor;
        if (editor) {
            var _bu = editor.offsetWidth;
            editor.style.borderRightWidth = 1;
            editor.style.width = _bu;
        }
        _dropdown_btn.style.visibility = "hidden";
        _dropdown_btn.editor = null;
    }
};
function _dropdown_btn_onmousedown(button) {
    var obj = button.editor;
    if (!isDropdownBoxVisible()) {
        if (obj) showDropDownBox(obj);
    } else hideDropDownBox();
};
function _dropdown_btn_onfocus(button) {
    var obj = button.editor;
    if (obj) obj.focus();
};
function createListTable(_ba) {
    _dropdown_table = document.createElement("<table extra=datatable isDropDownTable=true readOnly=true width=100% " + " cellspacing=0 cellpadding=2 rules=all></table>");
    if (_ba) _ba.appendChild(_dropdown_table);
    else document.body.appendChild(_dropdown_table);
};
function dropDownLocate() {
    var editor = _dropdown_parentbox.editor;
    var dropdown = _dropdown_parentbox.dropDown;
    switch (dropdown.type) {
    case "predate":
        ;
    case "postdate":
        ;
    case "date":
        {
            var _h = convertStr2Date_new(editor.value);
            if (!isNaN(_h)) setCalendarDate(_h);
            break;
        }
    default:
        {
            if (_dropdown_dataset) {
                var fieldName;
                if (dropdown.type == "list") {
                    fieldName = (isTrue(dropdown.mapValue)) ? "label": "value";
                } else {
                    fieldName = dropdown.dataField;
                    if (!fieldName) fieldName = editor.getAttribute("dataField");
                }
                var value = editor.value;
                var record = _dropdown_dataset.locate(fieldName, value);
                if (record) _dropdown_dataset.setRecord(record);
            }
            break;
        }
    }
};
function hideDropDown() {
    var editor = _dropdown_parentbox.editor;
    _dropdown_parentwindow.hideDropDownBox();
    editor.focus();
};
function _standard_dropdown_keyDown(keycode) {
    switch (keycode) {
    case 33:
        {
            if (_dropdown_dataset) {
                var pageIndex = (_dropdown_dataset.record) ? _dropdown_dataset.record.pageIndex - 1 : 1;
                _dropdown_dataset.moveToPage(pageIndex);
            }
            break;
        }
    case 34:
        {
            if (_dropdown_dataset) {
                var pageIndex = (_dropdown_dataset.record) ? _dropdown_dataset.record.pageIndex + 1 : 1;
                _dropdown_dataset.moveToPage(pageIndex);
            }
            break;
        }
    case 38:
        {
            if (_dropdown_dataset) {
                _dropdown_dataset.movePrev();
            }
            break;
        }
    case 40:
        {
            if (_dropdown_dataset) {
                _dropdown_dataset.moveNext();
            }
            break;
        }
    }
};
function processDropDownKeyDown(keycode) {
    switch (keycode) {
    case 13:
        {
            if (_dropdown_parentbox.dropDown.type == "date" || _dropdown_parentbox.dropDown.type == "predate" || _dropdown_parentbox.dropDown.type == "postdate") {
                var validateResult = validateCalendarDateValue();
                if (validateResult[0] == false) {
                    alert(validateResult[1]);
                    return;
                }
            }
            dropDownSelected();
            break;
        }
    case 27:
        {
            hideDropDown();
            break;
        }
    case 113:
        {
            hideDropDown();
            break;
        }
    case 118:
        {
            hideDropDown();
            break;
        }
    default:
        {
            switch (_dropdown_parentbox.dropDown.type) {
            case "list":
            case "dataset":
            case "dynamic":
                {
                    _standard_dropdown_keyDown(keycode);
                    break;
                }
            case "predate":
                ;
            case "postdate":
                ;
            case "date":
                {
                    _calendar_onkeydown();
                    break;
                }
            default:
                {
                    if (typeof(dropDown_onKeyDown) != "undefined") dropDown_onKeyDown(keycode);
                    break;
                }
            }
        }
    }
};
function dropDownSelected() {
    var record;
    switch (_dropdown_parentbox.dropDown.type) {
    case "list":
    case "dataset":
    case "dynamic":
        {
            if (_dropdown_dataset) record = _dropdown_dataset.record;
            if (typeof(record) == "undefined") {
                hideDropDown();
                break;
            }
            if (_dropdown_parentbox.editor.value == record.getValue(0)) {
                hideDropDown();
                return;
            }
            break;
        }
    case "predate":
        ;
    case "postdate":
        ;
    case "date":
        {
            _tmp_dataset_date = createDataset("_tmp_dataset_date");
            _tmp_dataset_date.addField("value");
            initDataset(_tmp_dataset_date);
            _tmp_dataset_date.insertRecord();
            _tmp_dataset_date.setValue("value", new Date(_calendarControl.year, _calendarControl.month, _calendarControl.day));
            _tmp_dataset_date.updateRecord();
            record = _tmp_dataset_date.record;
            break;
        }
    default:
        {
            if (typeof(dropDown_onGetRecord) != "undefined") record = dropDown_onGetRecord();
            break;
        }
    }
    if (record) {
        _dropdown_parentwindow.processDropDownSelected(_dropdown_parentbox.editor, record, false);
        hideDropDown();
    }
    if (_tmp_dataset_date) freeDataset(_tmp_dataset_date);
};
function _dropdown_onkeydown() {
    processDropDownKeyDown(event.keyCode);
};
function getDropDownItems(dropdown) {
    var items = dropdown._items;
    if (!items) {
        initDropDownItems(dropdown);
        items = dropdown._items;
    }
    return items;
};
function _initDropDownItems(itemsStr, mapValue) {
    if (!itemsStr) return null;
    var _cX = ";";
    var _aj = createDataset();
    _aj.id = "_dropDown_items";
    _aj.readOnly = true;
    if (mapValue) {
        var field;
        field = _aj.addField("label");
        field = _aj.addField("value");
        field.visible = false;
        var tmp = itemsStr.split(_cX);
        var index;
        for (var i = 0; i < tmp.length; i++) {
            index = tmp[i].indexOf("=");
            record = new Array();
            record[0] = getDecodeStr(tmp[i].substr(0, index));
            record[1] = getDecodeStr(tmp[i].substr(index + 1));
            pArray_insert(_aj, "end", null, record);
        }
    } else {
        _aj.addField("value");
        var tmp = itemsStr.split(_cX);
        for (var i = 0; i < tmp.length; i++) {
            record = new Array();
            record[0] = getDecodeStr(tmp[i]);
            pArray_insert(_aj, "end", null, record);
        }
    }
    return _aj;
};
function initDropDownItems(dropdown) {
    if (!dropdown.items) return;
    var items = _initDropDownItems(dropdown.items, isTrue(dropdown.mapValue));
    if (!items) return;
    initDataset(items);
    dropdown._items = items;
};
var _calendar_days;
function _calendar_year_onpropertychange() {
    if (!_calender_year.processing && event.propertyName == "value") {
        if (_calender_year.value.length == 4) {
            _calender_year.processing = true;
            changeCalendarDate(getInt(_calender_year.value), _calendarControl.month);
            _calender_year.processing = false;
        }
    }
};
function _calendar_month_onpropertychange() {
    if (!_calender_month.processing && _activeElement == _calender_month && event.propertyName == "value") {
        if (_calender_month.value.length > 0) {
            _calender_month.processing = true;
            changeCalendarDate(_calendarControl.year, getInt(_calender_month.value - 1));
            _calender_month.processing = false;
        }
    }
};
function createCalendar(_ba, field, editor) {
    function calendar() {
        var today = NaN;
        var _bR = NaN;
        if (editor) {
            _bR = convertStr2Date_new(editor.value);
        }
        if (typeof(_today_date) == "object") {
            today = _today_date;
        } else {
            today = new Date();
        }
        if (isNaN(_bR)) {
            _bR = today;
        }
        this.todayDay = today.getDate();
        this.todayMonth = today.getMonth();
        this.todayYear = today.getFullYear();
        this.activeCellIndex = 0;
        this._bR = _bR;
    };
    if (typeof(CalendarTable) == "object") {
        CalendarTable.removeNode(true);
    }
    _calendar_days = new Array(constSunday, constMonday, constTuesday, constWednesday, constThursday, constFriday, constSaturday);
    _calendarControl = new calendar();
    _calendarControl.minDate = NaN;
    _calendarControl.maxDate = NaN;
    _calendarControl.editor = null;
    if (editor) {
        _calendarControl.editor = editor;
    }
    if (field && field.dataType) {
        if (field.dataType == "predate") {
            _calendarControl.maxDate = new Date(_calendarControl.todayYear, _calendarControl.todayMonth, _calendarControl.todayDay - 1);
        } else if (field.dataType == "postdate") {
            _calendarControl.minDate = new Date(_calendarControl.todayYear, _calendarControl.todayMonth, _calendarControl.todayDay + 1);
        }
    }
    if (field && field.name && field.dataset && field.dataset.id) {
        var _ad = field.dataset.id + "_" + field.name + "_onInitCalendar";
        var _bI = fireUserEvent(_ad, [_calendarControl, field]);
        if (_bI) throw _bI;
    }
    var _ch = "";
    _ch += "<TABLE id=\"CalendarTable\" class=\"calendar\" width=200px cellspacing=0 cellpadding=1 rule=all>";
    _ch += "<TR class=\"title\" valign=top><TD>";
    _ch += "<TABLE WIDTH=100% CELLSPACING=1 CELLPADDING=0>";
    _ch += "<TR><TD align=right>";
    _ch += "<INPUT type=button extra=button value=3 title=\"" + constLastYear + "\" style=\"FONT-SIZE:8;FONT-FAMILY:webdings;WIDTH:18px;HEIGHT:20px\" onclick=\"changeCalendarDate(_calendarControl.year-1,_calendarControl.month)\">";
    _ch += "</TD><TD width=1>";
    _ch += "<INPUT id=\"_calender_year\" type=text class=editor size=4 maxlength=4 onpropertychange=\"return _calendar_year_onpropertychange()\">";
    _ch += "</TD><TD align=left width=20px>";
    _ch += "<INPUT type=button extra=button value=4 title=\"" + constNextYear + "\" style=\"FONT-SIZE:8;FONT-FAMILY:webdings;WIDTH:18px;HEIGHT:20px\" onclick=\"changeCalendarDate(_calendarControl.year+1,_calendarControl.month)\">";
    _ch += "</TD>";
    _ch += "<TD align=right width=20px>";
    _ch += "<INPUT type=button extra=button value=3 title=\"" + constLastMonth + "\" style=\"FONT-SIZE:8;FONT-FAMILY:webdings;WIDTH:18px;HEIGHT:20px\" onclick=\"changeCalendarDate(_calendarControl.preYear,_calendarControl.preMonth)\">";
    _ch += "</TD><TD width=1>";
    _ch += "<INPUT id=\"_calender_month\" type=text class=editor size=2 maxlength=2 onpropertychange=\"return _calendar_month_onpropertychange()\">";
    _ch += "</TD><TD align=left>";
    _ch += "<INPUT type=button extra=button value=4 title=\"" + constNextMonth + "\" style=\"FONT-SIZE: 8;FONT-FAMILY:webdings;WIDTH:18px;HEIGHT:20px\" onclick=\"changeCalendarDate(_calendarControl.nextYear,_calendarControl.nextMonth)\">";
    _ch += "</TD></TR>";
    _ch += "</TABLE></TD></TR>";
    _ch += "<TR><TD>";
    _ch += "<TABLE border=1 bordercolor=silver id=\"calendarData\" HEIGHT=100% WIDTH=100% CELLSPACING=0 CELLPADDING=0 style=\"BORDER-COLLAPSE: collapse\"";
    _ch += "onclick=\"_calendar_cell_onclick(event.srcElement)\">";
    _ch += "<TR height=20px style=\"background-image: url(" + _theme_root + "/table_title.gif)\">";
    for (var i = 0; i <= 6; i++) {
        _ch += "<TD align=center>" + _calendar_days[i] + "</TD>";
    }
    _ch += "</TR>";
    for (var i = 0; i <= 5; i++) {
        _ch += "<TR>";
        for (var j = 0; j <= 6; j++) {
            _ch += "<TD align=center></TD>";
        }
        _ch += "</TR>";
    }
    _ch += "</TABLE></TD></TR>";
    _ch += "<TR class=\"footer\"><TD align=right>";
    _ch += "<INPUT extra=button type=button id=\"button_today\" value=\"" + constToday + " " + _calendarControl.todayYear + "-" + (_calendarControl.todayMonth + 1) + "-" + _calendarControl.todayDay + "\" onclick=\"_calendar_today_onclick()\"";
    _ch += "</TD></TR></TABLE>";
    if (_ba) _ba.innerHTML = _ch;
    else document.body.innerHTML = _ch;
    initElements(CalendarTable);
    changeCalendarDate(_calendarControl._bR.getFullYear(), _calendarControl._bR.getMonth(), _calendarControl._bR.getDate());
    if (editor) {
        editor.select();
    }
};
function setCalendarDate(date) {
    changeCalendarDate(date.getFullYear(), date.getMonth(), date.getDate());
};
function changeCalendarDate(year, month, day) {
    if (_calendarControl.year == year && _calendarControl.month == month && (!day || _calendarControl.day == day)) return;
    if (_calendarControl.year != year || _calendarControl.month != month) {
        _calendarControl.year = year;
        _calendarControl.month = month;
        if (month == 0) {
            _calendarControl.preMonth = 11;
            _calendarControl.preYear = _calendarControl.year - 1;
        } else {
            _calendarControl.preMonth = _calendarControl.month - 1;
            _calendarControl.preYear = _calendarControl.year;
        }
        if (month == 11) {
            _calendarControl.nextMonth = 0;
            _calendarControl.nextYear = _calendarControl.year + 1;
        } else {
            _calendarControl.nextMonth = _calendarControl.month + 1;
            _calendarControl.nextYear = _calendarControl.year;
        }
        _calendarControl._dn = (new Date(year, month, 1)).getDay();
        if (_calendarControl._dn == 0) _calendarControl._dn = 7;
        var _bp = getNumberOfDays(_calendarControl.month, _calendarControl.year);
        var _cE = getNumberOfDays(_calendarControl.preMonth, _calendarControl.preYear);
        var _aH = getNumberOfDays(_calendarControl.nextMonth, _calendarControl.nextYear);
        var _de = _cE - _calendarControl._dn + 1;
        var endDate = 42 - _bp - _calendarControl._dn;
        _calender_month.value = (_calendarControl.month + 1);
        _calender_year.innerText = _calendarControl.year;
        var _ay = 0;
        var _cd;
        for (var i = _de; i <= _cE; i++) {
            var cell = calendarData.cells[_ay + 7];
            cell.monthAttribute = "pre";
            cell.className = "cell_trailing";
            cell.innerText = i;
            _cd = new Date(_calendarControl.preYear, _calendarControl.preMonth, i);
            if (outTimeRange(_calendarControl.minDate, _calendarControl.maxDate, _cd)) {
                cell.className = "cell_trailing_outrange";
            }
            _ay++;
        }
        for (var i = 1; i <= _bp; i++) {
            var cell = calendarData.cells[_ay + 7];
            cell.monthAttribute = "cur";
            if (_ay != _calendarControl.activeCellIndex) {
                cell.className = "cell_day";
            }
            cell.innerText = i;
            _cd = new Date(_calendarControl.year, _calendarControl.month, i);
            if (outTimeRange(_calendarControl.minDate, _calendarControl.maxDate, _cd)) {
                cell.className = "cell_day_outrange";
            }
            _ay++;
        }
        for (var i = 1; i <= endDate; i++) {
            var cell = calendarData.cells[_ay + 7];
            cell.monthAttribute = "next";
            cell.className = "cell_trailing";
            cell.innerText = i;
            _cd = new Date(_calendarControl.nextYear, _calendarControl.nextMonth, i);
            if (outTimeRange(_calendarControl.minDate, _calendarControl.maxDate, _cd)) {
                cell.className = "cell_trailing_outrange";
            }
            _ay++;
        }
    }
    if (day) _calendarControl.day = day;
    setCalendarActiveCell(calendarData.cells[_calendarControl.day + _calendarControl._dn - 1 + 7]);
};
function setCalendarActiveCell(cell) {
    function _O(cellIndex) {
        var cell = calendarData.cells[_calendarControl.activeCellIndex + 7];
        var _cd;
        with(_calendarControl) {
            if (cell.monthAttribute == "cur") {
                cell.className = "cell_day";
                _cd = new Date(year, month, activeCellIndex - _dn + 1);
                if (outTimeRange(_calendarControl.minDate, _calendarControl.maxDate, _cd)) {
                    cell.className = "cell_day_outrange";
                }
            } else if (cell.monthAttribute == "pre") {
                cell.className = "cell_trailing";
                _cd = new Date(preYear, preMonth, getNumberOfDays(preMonth, preYear) - _dn + activeCellIndex + 1);
                if (outTimeRange(_calendarControl.minDate, _calendarControl.maxDate, _cd)) {
                    cell.className = "cell_trailing_outrange";
                }
            } else {
                cell.className = "cell_trailing";
                _cd = new Date(nextYear, nextMonth, activeCellIndex - getNumberOfDays(month, year) - _dn + 1);
                if (outTimeRange(_calendarControl.minDate, _calendarControl.maxDate, _cd)) {
                    cell.className = "cell_trailing_outrange";
                }
            }
        }
        var cell = calendarData.cells[cellIndex + 7];
        cell.className = "cell_selected";
        _calendarControl.activeCellIndex = cellIndex;
    };
    function _m(year, month, day) {
        with(_calendarControl) {
            if (editor) {
                var _h = convertStr2Date_new(editor.value);
                if (!isNaN(_h) && _h.getFullYear() == year && _h.getMonth() == month && _h.getDate() == day) return;
                editor.value = year + "-" + (month + 1) + "-" + day;
            }
        }
    };
    if (cell.tagName.toLowerCase() != "td") return false;
    var _x = cell.parentElement.rowIndex * 7 + cell.cellIndex - 7;
    with(_calendarControl) {
        if (activeCellIndex == _x) return true;
        var monthAttribute = cell.monthAttribute;
        switch (monthAttribute) {
        case "pre":
            {
                changeCalendarDate(preYear, preMonth, getNumberOfDays(preMonth, preYear) - _dn + _x + 1);
                _O(_dn + day - 1);
                _m(preYear, preMonth, getNumberOfDays(preMonth, preYear) - _dn + _x + 1);
                break;
            }
        case "cur":
            {
                changeCalendarDate(year, month, _x - _dn + 1);
                _O(_x);
                _m(year, month, _x - _dn + 1);
                break;
            }
        case "next":
            {
                changeCalendarDate(nextYear, nextMonth, _x - getNumberOfDays(month, year) - _dn + 1);
                _O(_dn + day - 1);
                _m(nextYear, nextMonth, _x - getNumberOfDays(month, year) - _dn + 1);
                break;
            }
        }
    }
    return true;
};
function _calendar_cell_onclick(cell) {
    setCalendarActiveCell(cell);
    var validateResult = validateCalendarDateValue();
    if (validateResult[0] == false) {
        return;
    }
    dropDownSelected();
};
function _calendar_onkeydown() {
    switch (event.keyCode) {
    case 33:
        {
            if (event.ctrlKey) {
                changeCalendarDate(_calendarControl.year - 1, _calendarControl.month);
            } else {
                changeCalendarDate(_calendarControl.preYear, _calendarControl.preMonth);
            }
            break;
        }
    case 34:
        {
            if (event.ctrlKey) {
                changeCalendarDate(_calendarControl.year + 1, _calendarControl.month);
            } else {
                changeCalendarDate(_calendarControl.nextYear, _calendarControl.nextMonth);
            }
            break;
        }
    case 35:
        {
            var index = getNumberOfDays(_calendarControl.month, _calendarControl.year) + _calendarControl._dn - 1;
            setCalendarActiveCell(calendarData.cells[index + 7 + 7]);
            break;
        }
    case 36:
        {
            setCalendarActiveCell(calendarData.cells[_calendarControl._dn + 7 + 7]);
            break;
        }
    case 37:
        {
            var index = _calendarControl.activeCellIndex - 1;
            if (index < 0) index = 0;
            setCalendarActiveCell(calendarData.cells[index + 7]);
            break;
        }
    case 38:
        {
            if (_calendarControl.activeCellIndex < 14) {
                var day = getNumberOfDays(_calendarControl.preMonth, _calendarControl.preYear) + _calendarControl.day - 7;
                setCalendarDate(new Date(_calendarControl.preYear, _calendarControl.preMonth, day));
            } else {
                var index = _calendarControl.activeCellIndex - 7;
                setCalendarActiveCell(calendarData.cells[index + 7]);
            }
            break;
        }
    case 39:
        { //-->
            var index = _calendarControl.activeCellIndex + 1;
            if (index >= calendarData.cells.length - 7) index = calendarData.cells.length - 8;
            setCalendarActiveCell(calendarData.cells[index + 7]);
            break;
        }
    case 40:
        {
            if (_calendarControl.activeCellIndex > 34) {
                var day = 7 - (getNumberOfDays(_calendarControl.month, _calendarControl.year) - _calendarControl.day);
                setCalendarDate(new Date(_calendarControl.nextYear, _calendarControl.nextMonth, day));
            } else {
                var index = _calendarControl.activeCellIndex + 7;
                setCalendarActiveCell(calendarData.cells[index + 7]);
            }
            break;
        }
    }
};
function _calendar_today_onclick() {
    var validateResult = validateCalendarDateValue(_calendarControl.todayYear, _calendarControl.todayMonth, _calendarControl.todayDay);
    if (validateResult[0] == false) {
        alert(validateResult[1]);
        return;
    }
    changeCalendarDate(_calendarControl.todayYear, _calendarControl.todayMonth, _calendarControl.todayDay);
    var index = _calendarControl.todayDay + _calendarControl._dn - 1;
    setCalendarActiveCell(calendarData.cells[index + 7]);
    dropDownSelected();
};
function getNumberOfDays(month, year) {
    var _au = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    n = _au[month];
    if (month == 1 && (year % 4 == 0 && year % 100 != 0 || year % 400 == 0)) n++;
    return n;
};
function outTimeRange(minDate, maxDate, date) {
    var _du, _cs;
    if (minDate && date < minDate) {
        _du = true;
    } else {
        _du = false;
    }
    if (maxDate && date > maxDate) {
        _cs = true;
    } else {
        _cs = false;
    }
    if (minDate > maxDate) return _du == _cs;
    else return _du != _cs;
};
function getTimeRangeDesc(minDate, maxDate) {
    var result;
    var leftMsg;
    var rightMsg;
    if (!minDate && !maxDate) {
        result = "";
    } else if (minDate && maxDate) {
        if (minDate > maxDate) {
            result = constDateTimeRangeMultiple.replace("%s1", maxDate.getFullYear() + "/" + (maxDate.getMonth() + 1) + "/" + maxDate.getDate());
            result = result.replace("%s2", minDate.getFullYear() + "/" + (minDate.getMonth() + 1) + "/" + minDate.getDate());
        } else if (minDate < maxDate) {
            result = constDateTimeRangeSingle.replace("%s1", minDate.getFullYear() + "/" + (minDate.getMonth() + 1) + "/" + minDate.getDate());
            result = result.replace("%s2", maxDate.getFullYear() + "/" + (maxDate.getMonth() + 1) + "/" + maxDate.getDate());
        } else {
            result = constDateTimeRangeUnique.replace("%s", maxDate.getFullYear() + "/" + (maxDate.getMonth() + 1) + "/" + maxDate.getDate());
        }
    } else if (minDate) {
        result = constDateTimeRangeLeft.replace("%s", minDate.getFullYear() + "/" + (minDate.getMonth() + 1) + "/" + minDate.getDate());
    } else {
        result = constDateTimeRangeRight.replace("%s", maxDate.getFullYear() + "/" + (maxDate.getMonth() + 1) + "/" + maxDate.getDate());
    }
    return result;
};
function validateCalendarDateValue(year, month, day) {
    var result = new Array();
    result[0] = true;
    if (!_calendarControl) return result;
    if (!year) year = _calendarControl.year;
    if (!month) month = _calendarControl.month;
    if (!day) day = _calendarControl.day;
    var _cd = new Date(year, month, day);
    if (isNaN(_cd)) {
        result[0] = false;
        result[1] = constErrTypeDate;
    } else if (outTimeRange(_calendarControl.minDate, _calendarControl.maxDate, _cd)) {
        result[0] = false;
        result[1] = constDateTimeOutRange + " " + getTimeRangeDesc(_calendarControl.minDate, _calendarControl.maxDate);
    }
    return result;
};
function dropDownClear() {
    var record;
    switch (_dropdown_parentbox.dropDown.type) {
    case "dynamic":
        {
            if (_dropdown_dataset) record = _dropdown_dataset.record;
            if (typeof(record) == "undefined") {
                break;
            }
            _dropdown_parentbox.editor.value = "";
            break;
        }
    default:
        {
            break;
        }
    }
    if (record) {
        _dropdown_parentwindow.processDropDownSelectedClear(_dropdown_parentbox.editor, record);
    }
};
function _initDropDown(datasetId, dropdownId, selectValues, ddsfiles, lable, fileMapString, field, height, readOnly, required, type) {
    var dropDown = getDropDownByID(dropdownId);
    if (typeof(dropDown) == "undefined" || dropDown == null) {
        if (selectValues.length > 0 && selectValues.substring(selectValues.length - 1, selectValues.length) == ";") {
            selectValues = selectValues.substring(0, selectValues.length - 1);
        }
        if (required != "true") {
            selectValues = ";" + selectValues;
        }
    }
    var dropDownDataset = getDatasetByID(datasetId);
    if (typeof(dropDownDataset) == "undefined" || dropDownDataset == null) {
        var dds_t = createDataset(datasetId, '', selectValues),
        dds_f;
        dds_t.readOnly = readOnly;
        dds_t.pageSize = 1000;
        dds_t.pageIndex = 1;
        dds_t.pageCount = 1;
        dds_t.masterDataset = "";
        dds_t.type = "dropdown";
        dds_t.references = "";
        dds_t.submitData = "allchange";
        dds_t.autoLoadPage = true;
        dds_t.autoLoadDetail = true;
        dds_t.downloadUrl = getDecodeStr("~2fextraservice~2fdownloaddata");
        dds_t.sessionKey = "";
        dds_t.insertOnEmpty = false;
        dds_t.tag = "";
        dds_t.initDocumentFlag = false;
        if (ddsfiles) {
            var temp = ddsfiles;
            var temps = temp.split(",");
            for (var i = 0; i < temps.length; i++) {
                dds_f = dds_t.addField(temps[i], "string");
                dds_f.label = lable;
                dds_f.size = 0;
                dds_f.scale = 0;
                dds_f.readOnly = false;
                dds_f.required = false;
                dds_f.nullable = true;
                dds_f.defaultValue = getDecodeStr("");
                dds_f.updatable = true;
                dds_f.valueProtected = false;
                dds_f.visible = true;
                dds_f.autoGenId = false;
                dds_f.tableName = "";
                dds_f.fieldName = temps[i].split("=")[1];
                dds_f.tag = "";
                dds_f.editorType = "";
                dds_f.dropDown = "";
                dds_f.mask = getDecodeStr("");
                dds_f.maskErrorMessage = getDecodeStr("");
                dds_f.toolTip = getDecodeStr("");
                dds_f.lobDownloadURL = getDecodeStr("");
                dds_f.lobPopupURL = getDecodeStr("");
            }
        }
        initDataset(dds_t);
        var dd_t = createDropDown(dropdownId);
        if (type) {
            dd_t.type = type;
        } else {
            dd_t.type = "list";
        }
        dd_t.cache = true;
        dd_t.fixed = true;
        dd_t.fieldMap = fileMapString;
        dd_t.autoDropDown = true;
        dd_t.editable = true;
        if (height && height != "") {
            dd_t.height = height;
        } else {
            dd_t.height = 0;
        }
        dd_t.tag = "";
        dd_t.dataset = datasetId;
        dd_t.fields = field;
        dd_t.showHeader = false;
        initDropDown(dd_t);
    } else {}
};
function _initDropDown_cust1(datasetId, dropDownId, type, fileMap, viewType, field, height) {
    var dropDown = getDropDownByID(dropDownId);
    if (typeof(dropDown) == "undefined" || dropDown == null) {
        var dd_t = createDropDown(dropDownId);
        dd_t.type = type;
        dd_t.cache = true;
        dd_t.fixed = true;
        dd_t.fieldMeta = "";
        dd_t.fieldMap = fileMap;
        dd_t.sessionKey = "dd";
        dd_t.autoDropDown = true;
        dd_t.editable = true;
        dd_t.tag = "";
        dd_t.viewType = viewType;
        dd_t.dataset = datasetId;
        dd_t.fields = field;
        dd_t.showHeader = false;
        if (height != '') dd_t.height = height;
        else dd_t.height = 0;
        initDropDown(dd_t);
    } else {}
};
function _initDropDown_cust2(datasetId, dropDownId, targetDataset, readOnly, type, fileMap, height, url, id) {
    var dropDown = getDropDownByID(dropDownId);
    if (typeof(dropDown) == "undefined" || dropDown == null) {
        var dds_t = createDataset(datasetId, "", "");
        var dds_f;
        dds_t.readOnly = readOnly;
        dds_t.pageSize = 1000;
        dds_t.pageIndex = 1;
        dds_t.pageCount = 1;
        dds_t.masterDataset = "";
        dds_t.type = type;
        dds_t.references = "";
        dds_t.submitData = "allchange";
        dds_t.autoLoadPage = true;
        dds_t.autoLoadDetail = true;
        dds_t.downloadUrl = getDecodeStr("~2fextraservice~2fdownloaddata");
        dds_t.sessionKey = "";
        dds_t.insertOnEmpty = false;
        dds_t.tag = "";
        initDataset(dds_t);
        var dd_t = createDropDown(dropDownId);
        dd_t.type = type;
        dd_t.cache = true;
        dd_t.fixed = true;
        dd_t.fieldMeta = "";
        dd_t.fieldMap = fileMap;
        dd_t.sessionKey = "dd";
        dd_t.autoDropDown = true;
        dd_t.editable = true;
        dd_t.tag = "";
        dd_t.url = url;
        dd_t.targetDataset = targetDataset;
        dd_t.dataset = datasetId;
        dd_t.fieldId = id;
        if (height != '') dd_t.height = height;
        else dd_t.height = 0;
        initDropDown(dd_t);
    } else {}
};
function exporter(url, isLimit) {
    this.CSV = "CSV";
    this.canExpCsv = false;
    this.csvImage = "/images/csv_image_export.gif";
    this.DOC = "DOC";
    this.canExpDoc = false;
    this.docImage = "/images/doc_image_export.gif";
    this.XLS = "XLS";
    this.canExpXls = false;
    this.xlsImage = "/images/xls_image_export.gif";
    this.PDF = "PDF";
    this.canExpPdf = false;
    this.pdfImage = "/images/pdf_image_export.gif";
    this.HTML = "HTML";
    this.canExpHtml = false;
    this.htmlImage = "/images/html_image_export.gif";
    this.downloadURL = url;
    this.isLimit = isLimit;
    this.dataSet = null;
    this.dataSetInterface = null;
    this.target = "xxxxxxxxxxx";
    this.expDiv = null;
    this.expType = this.CSV;
    this.contentPath = "";
    this.div_els = null;
    this.setContentPath = function(path) {
        this.contentPath = path;
    };
    this.setDataSet = function(_bj) {
        this.dataSet = _bj
    };
    this.setDataSetInterface = function(_bj) {
        this.dataSetInterface = _bj
    };
    this.setDivEls = function(els) {
        this.div_els = els;
    };
    this.setCanExpCsv = function(isCan, image) {
        if (isCan != null) {
            this.canExpCsv = isCan;
        }
        if (image != null && image != "undefined") {
            this.csvImage = image;
        }
    };
    this.setCanExpDoc = function(isCan, image) {
        if (isCan != null) {
            this.canExpDoc = isCan;
        }
        if (image != null && image != "undefined") {
            this.docImage = image;
        }
    };
    this.setCanExpXls = function(isCan, image) {
        if (isCan != null) {
            this.canExpXls = isCan;
        }
        if (image != null && image != "undefined") {
            this.xlsImage = image;
        }
    };
    this.setCanExpPdf = function(isCan, image) {
        if (isCan != null) {
            this.canExpPdf = isCan;
        }
        if (image != null && image != "undefined") {
            this.pdfImage = image;
        }
    };
    this.setCanExpHtml = function(isCan, image) {
        if (isCan != null) {
            this.canExpHtml = isCan;
        }
        if (image != null && image != "undefined") {
            this.htmlImage = image;
        }
    };
    this.setExpWinId = function(expwinid, errdivid) {
        this.expwinid = expwinid;
        this.errdivid = errdivid;
    };
    this.openExpWin = function(expType) {
        this.expType = expType;
        if (this.isLimit) {
            if (!this.expWin) {
                this.expWin = $(this.expwinid).show();
                var _H = this;
                this.expWin.dialog({
                    width: 400,
                    title: _H.expWin.attr("buttontext"),
                    modal: true,
                    buttons: [{
                        text: _H.expWin.attr("buttontext"),
                        iconCls: 'icon-export',
                        handler: function() {
                            var _aY = _H.download();
                            if (_aY) {
                                _H.expWin.dialog("close");
                            }
                        }
                    }]
                });
                var _bs = document.getElementsByName(this.target);
                if (!_bs || !_bs[0]) {
                    _bs = $("<iframe name='" + this.target + "'></iframe>").hide().appendTo('body')[0];
                }
                if ($.data(this.expWin[0], "window").mask) {
                    $.data(this.expWin[0], "window").mask.click(function() {
                        _H.expWin.dialog("close");
                    });
                }
            }
            this.expWin.dialog("open");
            this.expWin.dialog("center");
        } else {
            this.download();
        }
    };
    this.openLimitDiv = function(expType) {
        this.expType = expType;
        if (this.isLimit) {
            if (this.expDiv == null || this.expDiv == "undefined") {
                this.expDiv = new openDivWindow();
            }
            this.expDiv.openNewWindow();
        } else {
            this.download();
        }
    };
    this.setNewDivId = function(mask_id, id, err_div_id) {
        if (this.expDiv == null || this.expDiv == "undefined") {
            this.expDiv = new openDivWindow();
        }
        this.expDiv.setNewDivId(mask_id, id, err_div_id);
    };
    this.getPageSize = function() {
        var dt = getDatasetByID(this.dataSet);
        return dt.pageCount;
    };
    this.checkDivEl = function(el, pageSize) {
        var page_els = document.getElementsByName(el.na);
        var page_el = page_els[0];
        if (el.rule != null && el.rule != "" && el.rule != "undefined") {
            if (page_el.value == "" || (!el.rule(page_el.value))) {
                $(this.errdivid).html(el.err);
                return false;
            }
        }
        if (el.maxChk != null && el.maxChk != "" && el.maxChk != "undefined") {
            if (page_el.value == "" || (!el.maxChk(page_el.value, pageSize))) {
                $(this.errdivid).html(el.err);
                return false;
            }
        }
        return true;
    };
    this.download = function() {
        var dt = getDatasetByID(this.dataSet);
        $(this.errdivid).empty();
        var _aX = document.getElementById("exp_download");
        if (_aX == null || _aX == "undefined") {
            _aX = document.createElement("DIV");
            _aX.id = "exp_download";
            _aX.style.visibility = "hidden";
        }
        _aX.innerHTML = "";
        document.body.appendChild(_aX);
        var form = document.createElement("FORM");
        form.method = "post";
        form.action = this.contentPath + this.downloadURL;
        form.style.visibility = "hidden";
        form.target = this.target;
        var idt = getDatasetByID(this.dataSetInterface);
        if (idt) {
            copyDateSetParameter(idt, dt);
            for (var i = 0; i < idt.fields.fieldCount; i++) {
                form.insertAdjacentHTML("beforeEnd", "<input type=\"hidden\" name=\"" + idt.getField(i).fieldName + "\" value=\"" + idt.getString(i) + "\"/>");
            }
        }
        var pId, _cf;
        for (var i = 0; i < dt.parameters.length; i++) {
            pId = dt.parameters[i].name;
            _cf = dt.parameters[i].value;
            if (_cf != null) {
                if (form[pId]) continue;
                form.insertAdjacentHTML("beforeEnd", "<input type=\"hidden\" name=\"" + pId + "\" value=\"" + _cf + "\"/>");
            }
        }
        var _cH = arguments.length < 1 && this.isLimit;
        if (_cH) {
            for (i = 0; i < this.div_els.length; i++) {
                var el = this.div_els[i];
                var page_el = document.getElementById(el.id);
                if (!this.checkDivEl(el, dt.pageCount)) {
                    return false;
                }
                if (el.type == "checkbox" && (!page_el.checked)) {
                    continue;
                }
                if ("mulSelect" == el.type) {
                    var _bw = "";
                    var page_els = document.getElementsByName(el.na);
                    for (var j = 0; j < page_els.length; j++) {
                        if (page_els[j].checked) {
                            if (_bw == "") {
                                _bw = page_els[j].value;
                            } else {
                                _bw = _bw + "," + page_els[j].value;
                            }
                        }
                    }
                    form.insertAdjacentHTML("beforeEnd", "<input type=\"hidden\" name=\"" + el.na + "\" value=\"" + getEncodeStr(_bw) + "\"/>");
                } else {
                    form.insertAdjacentHTML("beforeEnd", "<input type=\"hidden\" name=\"" + el.na + "\" value=\"" + getEncodeStr(page_el.value) + "\"/>");
                }
            }
        } else {
            if (arguments.length == 7) {
                this.expType = arguments[0];
                var cqId = this.dataSet.substring(0, this.dataSet.length - 8);
                form.insertAdjacentHTML("beforeEnd", "<input type=\"hidden\" name=\"" + cqId + "_expAll\" value=\"" + (arguments[1] ? 1 : 0) + "\"/>");
                form.insertAdjacentHTML("beforeEnd", "<input type=\"hidden\" name=\"" + cqId + "_complex\" value=\"" + (arguments[2] ? 1 : 0) + "\"/>");
                form.insertAdjacentHTML("beforeEnd", "<input type=\"hidden\" name=\"" + cqId + "_expElements\" value=\"" + getEncodeStr(arguments[3]) + "\"/>");
                form.insertAdjacentHTML("beforeEnd", "<input type=\"hidden\" name=\"" + cqId + "_startPage\" value=\"" + arguments[4] + "\"/>");
                form.insertAdjacentHTML("beforeEnd", "<input type=\"hidden\" name=\"" + cqId + "_endPage\" value=\"" + arguments[5] + "\"/>");
                form.insertAdjacentHTML("beforeEnd", "<input type=\"hidden\" name=\"" + cqId + "_allPage\" value=\"" + (arguments[6] ? 1 : 0) + "\"/>");
            }
        }
        form.insertAdjacentHTML("beforeEnd", "<input type=\"hidden\" name=\"expType\" value=\"" + this.expType + "\"/>");
        _aX.appendChild(form);
        form.submit();
        return true;
    };
};
exporter.checkPageNumber = function(pn, pageSize) {
    if (pn < 1 || pn > pageSize) {
        return false;
    }
    return true;
};
function checkAllpage(_bq, _cJ, _bh) {
    _cJ.disabled = _bh.disabled = _bq.checked;
};
function checkExpall(_bq, allpage, _cJ, _bh) {
    allpage.disabled = !_bq.checked;
    _cJ.disabled = _bh.disabled = _bq.checked && allpage.checked;
};
function mulSelect(_bU) {
    this.els_name = _bU;
    this.selected_label = null;
    this.selected_checkbox = null;
    this.selectedNode = function(_bb, _bf) {
        var lable = document.getElementById(_bf);
        if (lable.className == "nock") {
            lable.className = "cked";
            this.selected_label = _bf;
            this.selected_checkbox = _bb;
            var objs = document.getElementsByName(this.els_name);
            for (var i = 0; i < objs.length; i++) {
                var _bg = objs[i].parentNode;
                if (_bg.id != _bf) {
                    _bg.className = "nock";
                }
            }
        } else {
            lable.className = "nock";
            this.selected_label = null;
            this.selected_checkbox = null;
        }
    };
    this.up = function() {
        if (this.selected_label == null) {
            return false;
        }
        var temp = "";
        var _ap = document.getElementById(this.selected_label);
        var _aq = _ap.previousSibling;
        if (_aq == null || _aq == 'undefined') {
            return false;
        }
        temp = _ap.innerHTML;
        tempClassName = _ap.className;
        tempId = _ap.id;
        _ap.innerHTML = _aq.innerHTML;
        _ap.className = _aq.className;
        _ap.id = _aq.id;
        _aq.innerHTML = temp;
        _aq.className = tempClassName;
        _aq.id = tempId;
        return true;
    };
    this.down = function() {
        if (this.selected_label == null) {
            return false;
        }
        var temp = "";
        var tempClassName = "";
        var tempId = "";
        var _ap = document.getElementById(this.selected_label);
        var _bH = _ap.nextSibling;
        if (_bH == null || _bH == 'undefined') {
            return false;
        }
        temp = _ap.innerHTML;
        tempClassName = _ap.className;
        tempId = _ap.id;
        _ap.innerHTML = _bH.innerHTML;
        _ap.className = _bH.className;
        _ap.id = _bH.id;
        _bH.innerHTML = temp;
        _bH.className = tempClassName;
        _bH.id = tempId;
        return true;
    };
};
function openDivWindow() {
    this.mask_div_id = "mask_div_id";
    this.new_Div_id = "newWinFrame";
    this.err_div_id = "expErrDiv";
    this.newDivCenter = function() {
        var mk_div = document.getElementById(this.mask_div_id);
        _scrollWidth = document.compatMode == "BackCompat" ? Math.max(document.body.scrollWidth, document.body.clientWidth) : Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth);
        _scrollHeight = document.compatMode == "BackCompat" ? Math.max(document.body.scrollHeight, document.body.clientHeight) : Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight);
        mk_div.style.width = _scrollWidth + "px";
        mk_div.style.height = _scrollHeight + "px";
        mk_div.style.filter = "alpha(opacity=60)";
        mk_div.style.opacity = "0.6";
        mk_div.style.backgroundColor = '#EEEEEE';
        mk_div.style.zIndex = 1001;
        var _bm = document.getElementById(this.new_Div_id);
        _bm.style.top = ($(window).height() - $(exp_file_div).height()) / 2 + $(document).scrollTop() + "px";
        _bm.style.left = ($(window).width() - $(exp_file_div).width()) / 2 + $(document).scrollLeft() + "px";
    };
    this.setNewDivId = function(mask_id, id, err_id) {
        this.mask_div_id = mask_id;
        this.new_Div_id = id;
        this.err_div_id = err_id;
    };
    this.closeWin = function() {
        var _bm = openDivWindow.docEle(this.new_Div_id);
        var mask_div = openDivWindow.docEle(this.mask_div_id);
        _bm.style.display = "none";
        mask_div.style.display = "none";
        document.body.scroll = "yes";
        return false;
    };
    this.openNewWindow = function() {
        var _bm = openDivWindow.docEle(this.new_Div_id);
        var mask_div = openDivWindow.docEle(this.mask_div_id);
        _bm.style.display = "inline";
        mask_div.style.display = "inline";
    };
};
openDivWindow.docEle = function() {
    return document.getElementById(arguments[0]) || false;
};
function _initPagePilot(_bv) {
    _bv.refresh = _pagePilot_refresh;
    var dataset = getElementDataset(_bv);
    if (dataset) {}
    _bv.refresh();
};
function refreshPagePilot(_bv) {
    _bv.refresh();
};
function pageCacheToPage(_bv, index) {
    var dataset = getElementDataset(_bv);
    dataset.moveToPage(index);
    dataset.pageIndex = index;
    refreshPagePilot(_bv);
};
function _pagePilot_refresh() {
    var _bv = this;
    function _W(cell, index, pageIndex) {
        if (index == dataset.pageIndex) {
            cell.innerHTML = "<b>" + index + "</b>";
        } else {
            var _T = _bv.pageCache;
            if (isTrue(_T)) {
                cell.innerHTML = "<span onclick=\"javascript:pageCacheToPage(" + _bv.id + "," + index + ")\" style='cursor:hand'><font COLOR='blue'><u>" + index + "</u></font></span>";
            } else {
                cell.innerHTML = "<span onclick=\"javascript:" + dataset.id + ".flushData(" + index + ")\" style='cursor:hand'><font COLOR='blue'><u>" + index + "</u></font></span>";
            }
        }
    };
    var _bv = this;
    var dataset = getElementDataset(_bv);
    if (dataset) {
        var row = _bv.tBodies[0].rows[0];
        if (row) {
            row.removeNode(true);
        }
        var maxPageLink = getInt(_bv.maxPageLink);
        var _dd = dataset.pageIndex - getInt(maxPageLink / 2);
        if (_dd > (dataset.pageCount - maxPageLink + 1)) {
            _dd = dataset.pageCount - maxPageLink + 1;
        }
        if (_dd < 1) {
            _dd = 1;
        }
        var _aI = _dd + maxPageLink - 1;
        if (_aI > dataset.pageCount) {
            _aI = dataset.pageCount;
        }
        row = _bv.tBodies[0].insertRow();
        if (_dd > 1) {
            var cell = row.insertCell();
            _W(cell, 1, dataset.pageIndex);
            if (_dd > 2) {
                var cell = row.insertCell();
                cell.innerHTML = "...";
            }
        }
        for (var i = _dd; i <= _aI; i++) {
            var cell = row.insertCell();
            _W(cell, i, dataset.pageIndex);
        }
        if (_aI < dataset.pageCount) {
            if (_aI < dataset.pageCount - 1) {
                var cell = row.insertCell();
                cell.innerHTML = "...";
            }
            var cell = row.insertCell();
            _W(cell, dataset.pageCount, dataset.pageIndex);
        }
        var cell = row.insertCell();
        cell.innerHTML = " ";
        var cell = row.insertCell();
        cell.innerHTML = " ";
        var _aF = dataset.ExpFileDiv;
        if (_aF && _aF.canExpCsv) {
            var cell = row.insertCell();
            cell.innerHTML = "<a href=\"#\" onClick=\"" + dataset.id + "_exporter.openLimitDiv('CSV');\"><img style=\"BORDER: 0px;\" src=\"" + _aF.contentPath + _aF.csvImage + "\" title=\"" + constCSVExport + "\"/></a>";
        }
        if (_aF && _aF.canExpXls) {
            var cell = row.insertCell();
            cell.innerHTML = "<a href=\"#\" onClick=\"" + dataset.id + "_exporter.openLimitDiv('XLS');\"><img style=\"BORDER: 0px;\" src=\"" + _aF.contentPath + _aF.xlsImage + "\" title=\"" + constXLSExport + "\"/></a>";
        }
        if (_aF && _aF.canExpPdf) {
            var cell = row.insertCell();
            cell.innerHTML = "<a href=\"#\" onClick=\"" + dataset.id + "_exporter.openLimitDiv('PDF');\"><img style=\"BORDER: 0px;\" src=\"" + _aF.contentPath + _aF.pdfImage + "\" title=\"" + constPDFExport + "\"/></a>";
        }
    }
};
function RadioRender(id) {
    RadioRender._array_radio[RadioRender._array_radio.length] = this;
    var _id = id;
    var _fieldMap = undefined;
    var _dataset = undefined;
    var _radioValueField = undefined;
    var _radioViewField = undefined;
    var _viewField = undefined;
    var _valueField = undefined;
    var _bl = undefined;
    var _j = new Array();
    var _hiddenRadioBox;
    var _rowLen = 0;
    this.type;
    this.fields;
    this.table;
    this.require;
    this.getDataset = function() {
        if (typeof(_dataset) == "string") {
            _dataset = getDatasetByID(_dataset);
        }
        return _dataset;
    };
    this.getTargetDataset = function() {
        if (typeof(_bl) == "string") {
            _bl = getDatasetByID(_bl);
        }
        return _bl;
    };
    this.getRadioValueField = function() {
        return _radioValueField;
    };
    this.getRadioViewField = function() {
        return _radioViewField;
    };
    this.getValueField = function() {
        return _valueField;
    };
    this.getViewField = function() {
        return _viewField;
    };
    this.setDataset = function(dataset) {
        _dataset = dataset;
    };
    this.setTargetDataset = function(dataset) {
        _bl = dataset;
    };
    this.setHiddenRadioBox = function(_dc) {
        _hiddenRadioBox = _dc;
    };
    this.getRowLen = function() {
        return _rowLen;
    };
    this.setRowLen = function(len) {
        _rowLen = len;
    };
    this.setFieldMap = function(fieldMap) {
        _fieldMap = fieldMap;
        if (!_fieldMap) return;
        var maps = _fieldMap.split(';');
        if (maps.length < 2) return;
        var valueMap = maps[0];
        var _cm = maps[1];
        var valueFields = valueMap.split('=');
        var _cR = _cm.split('=');
        if (valueFields.length < 2 || _cR.length < 2) return;
        _valueField = valueFields[0];
        _radioValueField = valueFields[1];
        _viewField = _cR[0];
        _radioViewField = _cR[1];
    };
    this.getId = function() {
        return _id;
    };
    this.addRadioBox = function(_dc) {
        if (_dc.isHidden()) {
            _dc.setName(_id + "render_hidden");
            _hiddenRadioBox = _dc;
        } else {
            _j.push(_dc);
            _dc.setName(_id + "render" + _j.length);
        }
    };
    this.showRadioRenderBox = function(_bn) {
        if (!_bn) return;
        if (!_hiddenRadioBox) {
            var _dc = new RadioBox(this, true);
            this.addRadioBox(_dc);
        }
        _hiddenRadioBox.showHiddenRadioBox(_bn);
    };
    this.hideRadioRenderBox = function() {
        if (_hiddenRadioBox) {
            _hiddenRadioBox.hide();
        };
    };
    this.getRadioNameValue = function(value) {
        var result = "";
        var radioDataset = this.getDataset();
        var record = radioDataset.firstUnit;
        while (record) {
            if (record.getValue(_radioValueField) == value) {
                result = record.getValue(_radioViewField);
                break;
            }
            record = record.nextUnit;
        }
        return result;
    };
    this.selRadioFromRecord = function(record) {
        if (record) {
            var _ce = record.getValue(_valueField);
            for (var i = 0; i < _j.length; i++) {
                var _dc = _j[i];
                _dc.selRadio(_ce);
            }
            if (_hiddenRadioBox) {
                _hiddenRadioBox.selRadio(_ce);
            }
        }
    };
    this.sizeRadioBox = function() {
        if (_hiddenRadioBox) {
            _hiddenRadioBox.size();
        }
    };
    this.setReadOnly = function(readonly) {
        for (var i = 0; i < _j.length; i++) {
            var _dc = _j[i];
            if (_dc) {
                _dc.setReadOnly(readonly);
            }
        }
    };
};
function RadioBox(radio, hidden) {
    var _name;
    var _initialized = false;
    var _container = undefined;
    var _L = false;
    var _rowLen = 0;
    if (typeof(hidden) == "boolean") _L = hidden;
    var _w = RadioRender.getRadio(radio);
    if (typeof(_w) == "object") {
        _rowLen = _w.getRowLen();
    }
    function _N(record) {
        if (!_w) return;
        var _dv = _w.getRadioValueField();
        if (!_dv) return;
        var _cW = _w.getRadioViewField();
        if (!_cW) return;
        var radio = document.createElement("<input type='radio' value='" + record.getValue(_dv) + "' name='" + _name + "'/>");
        radio.onclick = _p;
        radio.onmouseup = _I;
        radio.label = record.getValue(_cW);
        return radio;
    };
    function _c(record) {
        if (!_w) return;
        var _cW = _w.getRadioViewField();
        if (!_cW) return;
        var label = document.createElement("<front></front>");
        label.innerText = record.getValue(_cW);
        return label;
    };
    function _M() {
        var br = document.createElement("<br></br>");
        return br;
    };
    function _J(_bn) {
        _container = document.createElement("<div style='diplay:none;position:absolute;'></div>");
        _container.style.zIndex = 1000;
        _container.style.textAlign = "left";
        document.body.appendChild(_container);
        _container.radio = _w.getId();
    };
    function _p() {
        return false;
    };
    function _I() {
        var radio = event.srcElement;
        if (_container && _container.valueHolder) {
            if (radio.checked) {
                radio.checked = false;
                _container.valueHolder.value = "";
                _S();
            } else {
                radio.checked = true;
                _container.valueHolder.value = radio.value;
                _a(radio);
            }
        }
    };
    function _a(radio) {
        var dataset = _w.getTargetDataset();
        var valueField = _w.getValueField();
        var viewField = _w.getViewField();
        if (dataset && valueField && viewField) {
            dataset.setValue(valueField, radio.value);
            dataset.setValue(viewField, radio.label);
        };
    };
    function _S() {
        var dataset = _w.getTargetDataset();
        var valueField = _w.getValueField();
        var viewField = _w.getViewField();
        if (dataset && valueField && viewField) {
            dataset.setValue(valueField, "");
            dataset.setValue(viewField, "");
        };
    };
    function _E(value) {
        if (_container) {
            for (var i = 0; i < _container.children.length; i++) {
                var child = _container.children[i];
                if (compareText(child.tagName, 'input')) {
                    if (child.value == value) {
                        child.checked = true;
                    } else {
                        child.checked = false;
                    }
                }
            }
        }
    };
    this.getName = function() {
        return _name;
    };
    this.setName = function(name) {
        _name = name;
    };
    this.isHidden = function() {
        return _L;
    };
    this.setContainer = function(_bP) {
        _container = _bP;
        if (compareText(_container.parentElement.tagName.toLowerCase(), "td")) {
            _container.valueHolder = _container.parentElement.children[0];
        }
        _container.radio = _w.getId();
    };
    this.init = function() {
        if (typeof(_w) == "undefined") return;
        if (!_name || !_container) return;
        _container.innerHTML = '';
        _container.contentEditable = false;
        var record, dataset, cursor = 1;
        dataset = _w.getDataset();
        record = dataset.firstUnit;
        while (record) {
            _container.appendChild(_N(record));
            _container.appendChild(_c(record));
            if (!_L && _rowLen != 0 && cursor % _rowLen == 0) {
                _container.appendChild(_M());
            };
            record = record.nextUnit;
            cursor++;
        };
        _initialized = true;
    };
    this.showHiddenRadioBox = function(valueHolder) {
        if (!valueHolder || !_w || !_L) return;
        if (!_container) {
            _J();
        }
        if (_initialized == false) {
            this.init();
        }
        _container.style.posLeft = valueHolder.style.posLeft;
        _container.style.posTop = valueHolder.style.posTop;
        _container.style.width = valueHolder.offsetWidth;
        _container.style.backgroundColor = 'white';
        _container.style.display = "";
        _container.style.border = "dimgray 1px solid";
        _container.valueHolder = valueHolder;
        if (_container.offsetHeight < _container.valueHolder.offsetHeight) {
            _container.style.height = _container.valueHolder.offsetHeight;
        }
        RadioRender._dockRadioBox = _container;
        var dataset = getElementDataset(_container.valueHolder);
        var valueField = _w.getValueField();
        if (dataset && valueField) {
            var _ce = dataset.getValue(valueField);
            _E(_ce);
        };
    };
    this.hide = function() {
        if (_container) {
            _container.style.display = "none";
            RadioRender._dockRadioBox = undefined;
        }
    };
    this.selRadio = _E;
    this.size = function() {
        if (_container && _container.valueHolder) {
            _container.style.width = _container.valueHolder.offsetWidth;
            if (_container.offsetHeight < _container.valueHolder.offsetHeight) {
                _container.style.height = _container.valueHolder.offsetHeight;
            }
            _container.style.posLeft = _container.valueHolder.style.posLeft;
            _container.style.posTop = _container.valueHolder.style.posTop;
        }
    };
    this.setReadOnly = function(readonly) {
        if (_container) {
            for (var i = 0; i < _container.children.length; i++) {
                var child = _container.children[i];
                if (compareText(child.tagName, 'input')) {
                    child.disabled = readonly;
                }
            }
        }
    }
};
RadioRender._array_radio = new Array();
RadioRender.getRadioById = function(id) {
    for (var i = 0; i < this._array_radio.length; i++) {
        if (this._array_radio[i].getId() == id) return this._array_radio[i];
    }
    var result;
    return result;
};
RadioRender._dockRadioBox = undefined;
RadioRender.getRadio = function(radio) {
    var result;
    if (typeof(radio) == "object") {
        result = radio;
    } else if (typeof(radio) == "string") {
        result = this.getRadioById(radio);
    }
    return result;
};
RadioRender.getRadios = function() {
    return this._array_radio;
};
RadioRender.sizeRadioBox = function(editor) {
    if (RadioRender._dockRadioBox) {
        var radio = this.getRadio(RadioRender._dockRadioBox.radio);
        if (radio) {
            radio.sizeRadioBox();
        }
    }
};
function _initRadio(datasetId, selectValues, radioId, readOnly, label, ddsfiles, fileMapString, targetDataset, field) {
    var dataset = getDatasetByID(datasetId);
    if (typeof(dataset) == "undefined" || dataset == null) {
        if (selectValues.length > 0 && selectValues.substring(selectValues.length - 1, selectValues.length) == ";") {
            selectValues = selectValues.substring(0, selectValues.length - 1);
        }
        eval("var " + datasetId + "=createDataset(datasetId,'',selectValues)");
        var dds_t = getDatasetByID(datasetId),
        dds_f;
        dds_t.readOnly = readOnly;
        dds_t.pageSize = 1000;
        dds_t.pageIndex = 1;
        dds_t.pageCount = 1;
        dds_t.masterDataset = "";
        dds_t.type = "dropdown";
        dds_t.references = "";
        dds_t.submitData = "allchange";
        dds_t.autoLoadPage = true;
        dds_t.autoLoadDetail = true;
        dds_t.downloadUrl = getDecodeStr("~2fextraservice~2fdownloaddata");
        dds_t.sessionKey = "";
        dds_t.insertOnEmpty = false;
        dds_t.tag = "";
        dds_t.initDocumentFlag = false;
        if (ddsfiles) {
            var temp = ddsfiles;
            var temps = temp.split(",");
            for (var i = 0; i < temps.length; i++) {
                dds_f = dds_t.addField(temps[i], "string");
                dds_f.label = label;
                dds_f.size = 0;
                dds_f.scale = 0;
                dds_f.readOnly = false;
                dds_f.required = false;
                dds_f.nullable = true;
                dds_f.defaultValue = getDecodeStr("");
                dds_f.updatable = true;
                dds_f.valueProtected = false;
                dds_f.visible = true;
                dds_f.autoGenId = false;
                dds_f.tableName = "";
                dds_f.fieldName = temps[i].split("=")[1];
                dds_f.tag = "";
                dds_f.editorType = "";
                dds_f.dropDown = "";
                dds_f.mask = getDecodeStr("");
                dds_f.maskErrorMessage = getDecodeStr("");
                dds_f.toolTip = getDecodeStr("");
                dds_f.lobDownloadURL = getDecodeStr("");
                dds_f.lobPopupURL = getDecodeStr("");
            }
        }
        initDataset(dds_t);
    }
    if (typeof(RadioRender.getRadioById(radioId)) == "undefined") {
        eval("var " + radioId + " =new RadioRender(radioId)");
        var dd_t = RadioRender.getRadioById(radioId);
        dd_t.type = "dataset";
        dd_t.setFieldMap(fileMapString);
        dd_t.setDataset(dds_t);
        dd_t.setTargetDataset(targetDataset);
        dd_t.fields = field;
    }
};
function errAlert(e) {
    switch (typeof(e)) {
    case "string":
        {
            if (e == null || e == "") cAlert(constAlertTipFailed, constAlertMsgSysErr, 'red');
            else cAlert(constAlertTipFailed, e, 'red');
            break;
        }
    case "object":
        {
            if (e == null) cAlert(constAlertTipFailed, constAlertMsgSysErr, 'red');
            else cAlert(constAlertTipFailed, e.description, 'red');
            break;
        }
    default:
        {
            cAlert(constAlertTipFailed, constAlertMsgSysErr, 'red');
            break;
        }
    }
};
function wrnAlert(str) {
    cAlert(constAlertTipInfo, str, '#336699');
};
function cAlert(_dH, str, bc) {
    window.alert(str);
};
function sAlert(_dH, str, bc) {
    var _ax, msgh, bordercolor;
    _ax = 400;
    msgh = 100;
    _cp = 25;
    bordercolor = bc;
    titlecolor = "#99CCFF";
    var sWidth, _dz;
    sWidth = document.body.offsetWidth;
    _dz = screen.height;
    var _ar = document.getElementById("bgDiv");
    if (_ar && typeof(_ar) == "object") {
        var msgTxt = document.getElementById("msgTxt");
        if (msgTxt) {
            msgTxt.innerHTML = msgTxt.innerHTML + "<br\>" + str;
            return;
        }
    }
    var _bQ = document.createElement("div");
    _bQ.setAttribute('id', 'bgDiv');
    _bQ.style.position = "absolute";
    _bQ.style.top = "0";
    _bQ.style.background = "#777";
    _bQ.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";
    _bQ.style.opacity = "0.6";
    _bQ.style.left = "0";
    _bQ.style.width = sWidth + "px";
    _bQ.style.height = _dz + "px";
    _bQ.style.zIndex = "10000";
    document.body.appendChild(_bQ);
    var _as = document.createElement("div");
    _as.setAttribute("id", "msgDiv");
    _as.setAttribute("align", "center");
    _as.style.background = "white";
    _as.style.border = "1px solid " + bordercolor;
    _as.style.position = "absolute";
    _as.style.left = "50%";
    _as.style.top = "50%";
    _as.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
    _as.style.marginLeft = "-225px";
    _as.style.marginTop = -75 + document.documentElement.scrollTop + "px";
    _as.style.width = _ax + "px";
    _as.style.height = msgh + "px";
    _as.style.textAlign = "center";
    _as.style.lineHeight = "25px";
    _as.style.zIndex = "10001";
    var title = document.createElement("h4");
    title.setAttribute("id", "msgTitle");
    title.setAttribute("align", "right");
    title.style.margin = "0";
    title.style.padding = "3px";
    title.style.background = bordercolor;
    title.style.filter = "progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
    title.style.opacity = "0.75";
    title.style.border = "1px solid " + bordercolor;
    title.style.height = "18px";
    title.style.font = "12px Verdana, Geneva, Arial, Helvetica, sans-serif";
    title.style.color = "white";
    title.style.cursor = "pointer";
    title.innerHTML = "<center>" + _dH + "</center>" + "关闭";
    title.setAttribute("title", _dH);
    title.onclick = function() {
        document.body.removeChild(_bQ);
        document.getElementById("msgDiv").removeChild(title);
        document.body.removeChild(_as);
    };
    document.body.appendChild(_as);
    document.getElementById("msgDiv").appendChild(title);
    var txt = document.createElement("p");
    txt.style.margin = "1em 0";
    txt.setAttribute("id", "msgTxt");
    txt.innerHTML = str;
    document.getElementById("msgDiv").appendChild(txt);
};
function FloatWindow(id, target) {
    var _id = id;
    var _q = $(target);
    function _G() {
        return _id;
    };
    function _o() {
        _q.dialog({
            modal: true,
            onBeforeOpen: function() {
                var result = fireUserEvent(_id + "_floatWindow_beforeShow", [this]);
                if (result == false) {
                    return false;
                }
            },
            onOpen: function() {
                fireUserEvent(_id + "_floatWindow_afterShow", [this]);
            },
            onBeforeClose: function() {
                var opts = _q.dialog('options');
                if (opts.inited) {
                    if (opts.action == 'hide') {
                        var result = fireUserEvent(_id + "_floatWindow_beforeHide", [this]);
                        if (result == false) {
                            return false;
                        }
                    } else {
                        var result = fireUserEvent(_id + "_floatWindow_beforeClose", [this]);
                        if (result == false) {
                            return false;
                        }
                    }
                }
            },
            onClose: function() {
                var opts = _q.dialog('options');
                if (opts.inited) {
                    if (opts.action == 'hide') {
                        fireUserEvent(_id + "_floatWindow_afterHide", [this]);
                    } else {
                        fireUserEvent(_id + "_floatWindow_afterClose", [this]);
                    }
                }
            }
        });
        if (_q.attr('show') == "false") {
            _q.dialog("close");
        }
        var options = _q.dialog('options');
        if ($.data(_q[0], "window").mask) {
            $.data(_q[0], "window").mask.click(function() {
                var opts = _q.dialog('options');
                opts.action = 'hide';
                _q.dialog("close");
            });
        }
        options.inited = true;
    };
    function _Z() {
        _q.dialog('open');
        _q.dialog('center');
    };
    function _F() {
        var opts = _q.dialog('options');
        opts.action = 'hide';
        _q.dialog('close');
    };
    function _g() {
        var opts = _q.dialog('options');
        opts.action = 'close';
        _q.dialog('close');
    };
    FloatWindow._array_windows.push(this);
    this.init = _o;
    this.getId = _G;
    this.show = _Z;
    this.hide = _F;
    this.close = _g;
};
FloatWindow._array_windows = new Array();
FloatWindow.getSubWindowById = function(id) {
    for (var i = 0; i < this._array_windows.length; i++) {
        if (this._array_windows[i].getId() == id) return this._array_windows[i];
    }
    return null;
};
FloatWindow.showSubWindow = function(id) {
    var subWindow = this.getSubWindowById(id);
    if (subWindow) {
        subWindow.show();
    }
};
FloatWindow.hideSubWindow = function(id) {
    var subWindow = this.getSubWindowById(id);
    if (subWindow) {
        subWindow.hide();
    }
};
FloatWindow.closeSubWindow = function(id) {
    var subWindow = this.getSubWindowById(id);
    if (subWindow) {
        subWindow.close();
    }
};
var recordFields;
var interfaceflag = false;
var _groupflag = true;
function refreshDataTable(table) {
    if (table.getAttribute("treeGrid") == "false") {
        refreshDataGrid(table);
    } else {
        refreshTreeGrid(table);
    }
};
function initDataTable(_aV) {
    if (_aV.getAttribute("treeGrid") == "false") {
        initDataGrid(_aV);
    } else {
        initTreeGrid(_aV);
    }
};
function initTreeGrid(_aV) {
    var grid = $(_aV);
    var _dataset = getElementDataset(_aV);
    var _Y = copyDataset(grid.attr("componentDataset") + "_copyed", grid.attr("componentDataset"));
    var _b = _aV.getAttribute("readonly");
    addEditor(grid, _dataset, _b);
    grid.treegrid({
        singleSelect: true,
        checkOnSelect: false,
        selectOnCheck: false,
        pagination: false,
        idField: "_id",
        editId: -1,
        selectedId: -1,
        dataset: _dataset,
        copyedds: _Y,
        init: false,
        readOnly: _b != "false",
        onInit: function() {
            return false;
        },
        rowStyler: function(index, row) {
            if (index % 2 == 1) {
                return 'background-color:#fafafa;';
            }
        },
        loader: function(param, success, error) {
            var opts = grid.treegrid('options');
            var _e = opts.copyedds;
            opts.init = false;
            opts.loadby = 1;
            _e.setParameter(opts.idField, param.id);
            _e.flushData(param.page);
            opts.queryParams = {};
            _e.setParameter(opts.idField, null);
            success(_e);
        },
        loadFilter: function(dataset) {
            var json = {};
            json.pageIndex = dataset.pageIndex;
            json.total = dataset.total;
            json.rows = [];
            if (dataset.length > 0) {
                var _P = dataset.getFirstRecord();
                var jsonmap = {};
                while (_P) {
                    var row = {};
                    for (var i = 0; i < dataset.fields.fieldCount; i++) {
                        var _f = dataset.getField(i);
                        var fieldName = _f.fieldName;
                        var v = _P.getValue(fieldName);
                        row[fieldName] = v;
                    }
                    row.state = _P.getString('_hasChild_') == 'true' ? "closed": "open";
                    row.pid = _P.getString("_parentId");
                    row.iconCls = _P.getString("_icon");
                    row.children = [];
                    row.record = _P;
                    _P._uuid = row._id;
                    jsonmap[row._id] = row;
                    _P = _P.getNextRecord();
                }
                for (var key in jsonmap) {
                    var row = jsonmap[key];
                    var prow = jsonmap[row.pid];
                    if (prow) {
                        prow.children[prow.children.length] = row;
                    } else {
                        json.rows[json.rows.length] = row;
                    }
                }
            }
            return json;
        },
        onLoadSuccess: function(node, data) {
            var opts = grid.treegrid('options');
            if (opts.loadby != 1 && data.rows[0]) {
                grid.treegrid("select", data.rows[0][opts.idField]);
            } else {
                for (var i = 0; i < data.rows.length; i++) {
                    var rec = data.rows[i].record;
                    rec.dataset = opts.dataset;
                    pArray_insert(opts.dataset, "end", null, rec);
                }
            }
            opts.init = true;
            opts.loadby = 0;
        },
        onSelect: function(_cC) {
            if (_cC) {
                var opts = grid.treegrid('options');
                opts.selectedId = _cC[opts.idField];
            }
        },
        onCheck: function(_cC) {
            if (_cC) {
                var opts = grid.treegrid('options');
                var dataset = opts.dataset;
                if (dataset.getField(opts.select)) {
                    var record = _cC.record;
                    if (record) {
                        record.setValue(opts.select, true);
                    }
                }
            }
        },
        onUncheck: function(_cC) {
            var opts = grid.treegrid('options');
            if (opts.init) {
                var dataset = opts.dataset;
                if (dataset.getField(opts.select)) {
                    var record = _cC.record;
                    if (record) {
                        record.setValue(opts.select, false);
                    }
                }
            }
        },
        onClickRow: function(_cC, tr) {
            var opts = grid.treegrid('options');
            var _cu = _cC[opts.idField];
            var isselected = $(tr).hasClass("datagrid-row-selected");
            var lastId = opts.selectedId;
            if (lastId != _cu && !opts.editing) {
                opts.dataset.setRecord(_cC.record);
            }
        },
        onBeforeEdit: function(_cC) {
            var opts = grid.treegrid('options');
            if (!opts.readOnly) {
                opts.editing = true;
                opts.editId = _cC[opts.idField];
                $(document).unbind(".treegrid").bind("mousedown.treegrid",
                function(e) {
                    if (opts.editId > -1) {
                        grid.treegrid('endEdit', opts.editId);
                    }
                }).bind("keydown.datagrid",
                function(e) {});
            }
            return ! opts.readOnly;
        },
        onAfterEdit: function(_cC, _aZ) {
            var opts = grid.treegrid('options');
            opts.editing = false;
            opts.editId = -1;
            $(document).unbind(".treegrid");
        },
        onCanelEdit: function(_cC, _aZ) {
            var opts = grid.treegrid('options');
            opts.editing = false;
            opts.editId = -1;
            $(document).unbind(".treegrid");
        },
        onDblClickCell: function(field, _cC) {
            var opts = grid.treegrid('options');
            if (!opts.editing) {
                var _cu = _cC[opts.idField];
                grid.treegrid('beginEdit', _cu);
                var editor = grid.treegrid('getEditor', {
                    index: _cu,
                    field: field
                });
                if (editor) {
                    editor.target.focus();
                    if (editor.type == "datebox" || editor.type == "datetimebox" || editor.type == "combobox" || editor.type == "combo") {
                        $(editor.target).combo("textbox").focus();
                    }
                }
            }
        }
    });
};
function refreshTreeGrid(table) {
    var _dataset = getElementDataset(table);
    var grid = $(table);
    var opts = grid.treegrid('options');
    if (opts.firstRefresh != false) {
        grid.treegrid("loadData", _dataset);
        opts.firstRefresh = false;
    }
};
function dataToMap(dataset, value, fieldName) {
    var _aU = dataset.getField(fieldName + 'Name');
    if (_aU) {
        var tag = _aU.tag;
        if (tag == 'selectName') {}
        if (tag == 'radioName') {
            var radioDataset = getDatasetByID(fieldName + '_RadioDataset');
            var r = radioDataset.getFirstRecord();
            while (r) {
                if (r[0] == value) {
                    value = r[1];
                    break;
                }
                r = r.getNextRecord();
            }
        }
    }
    return value;
};
function addEditor(grid, dataset, readonly) {
    var trs = $("thead tr th", grid);
    for (var i = 0; i < trs.length; i++) {
        var tr = trs.eq(i);
        if (tr.attr("checkbox") == "true") continue;
        var fieldName = tr.attr('field');
        if (!fieldName) {
            continue;
        }
        var field = dataset.getField(fieldName);
        tr.attr('formatter', "_cellFormatter");
        if (field.editType == 'select') {
            if (field.tag == "select" || field.tag == "selectCQ" || field.tag == "selectTree") {
                tr.attr('formatter', field.fieldName + "_cellFormatter");
            }
            if (field.tag == "select") {
                var Json = _initSelectJson(field);
                eval(field.fieldName + '_Json=Json;');
            }
        }
        tr.attr('sortable', true);
        if (readonly == 'false') {
            var _dC = "";
            var _cl = "_a:1";
            switch (field.editType) {
            case 'text':
                switch (field.dataType) {
                case 'int':
                    _dC = "numberbox";
                    break;
                case 'double':
                case 'float':
                    _dC = "numberbox";
                    _cl = "precision:" + field.scale;
                    break;
                case 'currency':
                    _dC = "numberbox";
                    _cl = "precision:" + field.scale + ",prefix:" + field.prefix + ",groupSeparator:','";
                    break;
                case 'predate':
                    ;
                    _dC = "datebox";
                    _cl = "today:'" + today() + "',comparemode:'le',dateType:'predate'";
                    break;
                case 'postdate':
                    ;
                    _dC = "datebox";
                    _cl = "today:'" + today() + "',comparemode:'ge',dateType:'postdate'";
                    break;
                case 'date':
                    _dC = "datebox";
                    _cl = "today:'" + today() + "'";
                    break;
                case 'timestamp':
                    _dC = "datetimebox";
                    _cl = "today:'" + today() + "'";
                    break;
                default:
                    _dC = "validatebox";
                    break;
                }
                break;
            case 'textarea':
                _dC = "textarea";
                break;
            case 'checkbox':
                _dC = "checkbox";
                _cl = "on:true,off:false";
                break;
            case 'predate':
                ;
                _dC = "datebox";
                _cl = "today:'" + today() + "',comparemode:'le',dateType:'predate'";
                break;
            case 'postdate':
                ;
                _dC = "datebox";
                _cl = "today:'" + today() + "',comparemode:'ge',dateType:'postdate'";
                break;
            case 'date':
                if (field.dataType == "timestamp") {
                    _dC = "datetimebox";
                } else {
                    _dC = "datebox";
                }
                _cl = "today:'" + today() + "'";
                break;
            case 'timestamp':
                _dC = "datetimebox";
                _cl = "today:'" + today() + "'";
                break;
            case 'select':
                switch (field.tag) {
                case 'select':
                    _dC = "combobox";
                    _cl = "valueField:'id',textField:'text',data:" + field.fieldName + "_Json,multiple:" + field.multiple + ",dataField:'" + field.fieldName + "',dropDown:'" + field.dropDown + "'";
                    break;
                case 'selectCQ':
                    _dC = "combogrid";
                    _cl = "dataField:'" + field.fieldName + "',dropDown:'" + field.dropDown + "',datasetName:'" + field.dropDownDataset + "',multiple:" + field.multiple;
                    break;
                case 'selectCustom':
                    _dC = "custom";
                    _cl = "dataField:'" + field.fieldName + "',dropDown:'" + field.dropDown + "',datasetName:'" + field.dropDownDataset + "'";
                    break;
                case 'selectTree':
                    _dC = "combotree";
                    _cl = "dataField:'" + field.fieldName + "',dropDown:'" + field.dropDown + "',datasetName:'" + field.dropDownDataset + "',multiple:" + field.multiple;
                    break;
                }
                break;
            default:
                _dC = "validatebox";
            }
            if (_dC) {
                if (field.required) {
                    _cl = "required:true," + _cl;
                }
                _cl = "componentDataset:'" + dataset.id + "'," + _cl;
                var mask = field.mask;
                var maskErrorMessage = field.maskErrorMessage;
                if (mask) {
                    _cl = "validType:'rul[\"" + mask + "\",\"" + maskErrorMessage + "\"]'," + _cl;
                }
                tr.attr('editor', "{type:'" + _dC + "',options:{" + _cl + "}}");
            }
        }
    }
};
function _cellFormatter(value, _cC, rowIndex, _aS, tableid, _aA) {
    if (_cC.isfoot) return value;
    var _aN = _aA[0];
    var record = _cC.record;
    var dataset = record.dataset;
    try {
        var _ad = tableid + "_" + _aS.toLowerCase() + "_onRefresh";
        if (isUserEventDefined(_ad)) {
            try {
                fireUserEvent(_ad, [_aN, value, record]);
            } catch(e) {
                return "cell format error";
            }
            return _aN.innerHTML;
        } else {
            var f = dataset.getField(_aS);
            try {
                if (f.dataType == "string") {
                    if (f.editType == "date") {
                        var d = parseDate(value);
                        if (d) {
                            value = d.format(_VIEW_DATE_PATTERN);
                        }
                    } else if (f.editType == "timestamp") {
                        var d = parseTimestamp(value);
                        if (d) {
                            value = d.format(_VIEW_DATETIME_PATTERN);
                        }
                    }
                } else if (f.dataType == "currency") {
                    value = formatCurrency("" + value);
                }
            } catch(e) {
                return "cell format error";
            }
            if (f.editType == "process") {
                var v = 0;
                if (f.dataType == "int") {
                    v = parseInt(value);
                } else {
                    v = parseFloat(value);
                }
                if (v || v == 0) {} else {
                    v = 0;
                }
                return $("<div/>").progressbar({
                    value: Math.floor(v),
                    onChange: function(value, _bD) {
                        var _ad = tableid + "_" + _aS + "_onProgress";
                        if (isUserEventDefined(_ad)) {
                            try {
                                fireUserEvent(_ad, [value, _bD, this.children[1], this.children[0]]);
                            } catch(e) {}
                        }
                    }
                })[0].outerHTML;
            }
            return value;
        }
    } catch(e) {
        return value;
    }
};
function _initSelectJson(field, require) {
    var _dropdown_dataset;
    var required;
    if (typeof(field) != "string") {
        _dropdown_dataset = getDatasetByID(field.fieldName + '_DropDownDataset');
        required = field.required;
    } else {
        _dropdown_dataset = getDatasetByID(field + '_DropDownDataset');
        required = (require == "true" ? true: false);
    }
    var json = [];
    if (!required) {
        var row = {
            id: "",
            text: ""
        };
        json[0] = row;
    }
    var record = _dropdown_dataset.getFirstRecord();
    while (record) {
        if (record[0]) {
            var row = {};
            row.id = record[0];
            row.text = record[1];
            json[json.length] = row;
        }
        record = record.getNextRecord();
    }
    return json;
};
function initDataGrid(_aV) {
    var grid = $(_aV);
    parse_complete_event.push(function() {
        var rownumber = grid.find("th:first").attr("rowspan");
        var dc = $.data(_aV, "datagrid").dc;
        var _cS = dc.view1.children("div.datagrid-header").find("tr.datagrid-header-row").find("div.datagrid-header-rownumber").parent();
        _cS.attr("rowspan", rownumber || 1);
        $(window).bind("resize.datagrid",
        function() {
            grid.datagrid('resize');
        });
    });
    var _b = _aV.getAttribute("readonly");
    var _dataset = getElementDataset(_aV);
    var pkid = grid.attr("pkid") || "id";
    var remeberCheck = grid.attr("remeberCheck") == "true";
    if (remeberCheck && !_dataset.getField(pkid)) {
        errAlert("pkid must be configured in macro.");
    }
    addEditor(grid, _dataset, _b);
    var _bW = null;
    var selectkey = grid.attr("selectkey");
    if (selectkey) {
        _bW = grid.attr("selectkey").indexOf('[');
        if (_bW > -1) selectkey = grid.attr("selectkey").substr(0, _bW);
    }
    grid.datagrid({
        checkOnSelect: false,
        selectOnCheck: false,
        nowrap: false,
        singleSelect: true,
        select: selectkey || "select",
        editIndex: -1,
        selectedIndex: -1,
        dataset: _dataset,
        init: false,
        readOnly: _b != "false",
        sumfieldstr: grid.attr("sumfieldstr"),
        pagination_toolbar: "#" + grid.attr("id") + "_paginationbar",
        pageCache: grid.attr("pageCache") == "true",
        cache: {},
        pkid: pkid,
        checked: {},
        fixed: false,
        onInit: function() {
            return false;
        },
        rowStyler: function(index, row, css) {
            if (index % 2 == 1) {
                return 'background-color:#fafafa;';
            }
        },
        onHeaderClick: function(table, _br, field) {
            fireUserEvent(_aV.getAttribute('id') + '_' + field.toLowerCase() + '_onHeaderClick', [table, _br]);
        },
        onLoadSuccess: function(data) {
            var opts = grid.datagrid('options');
            var dataset = opts.dataset;
            if (dataset.record) {
                grid.datagrid("selectRecord", dataset.record._uuid);
            }
            var has = dataset.getField(opts.select);
            for (var i = 0; i < data.rows.length; i++) {
                var _cC = data.rows[i];
                var record = _cC.record;
                var rowIndex = grid.datagrid("getRowIndex", _cC[opts.idField]);
                _cC.rowIndex = rowIndex;
                if (record) {
                    if (has) {
                        isTrue(record.getValue(opts.select)) ? grid.datagrid("checkRow", rowIndex) : grid.datagrid("uncheckRow", rowIndex);
                    }
                }
            }
            opts.init = true;
            if (remeberCheck) {
                for (var i = 0; i < data.rows.length; i++) {
                    var _cC = data.rows[i];
                    var record = _cC.record;
                    if (!opts.checked[""] && opts.checked[_cC[opts.pkid]]) {
                        if (record) {
                            if (has) {
                                record.setValue(opts.select, true);
                            }
                        }
                        grid.datagrid("checkRow", _cC.rowIndex);
                    } else {
                        grid.datagrid("uncheckRow", _cC.rowIndex);
                    }
                }
            }
            if (!opts.fixed) {
                var dc = $.data(_aV, "datagrid").dc;
                var header = dc.view2.children("div.datagrid-header");
                var _cO = header.width();
                var _ct = header.find("table").width();
                if (_cO > _ct) {
                    grid.datagrid('options').fitColumns = true;
                    grid.datagrid('fitColumns');
                }
                opts.fitColumns = false;
                opts.fixed = true;
            }
            _show_message_when_nodata(grid);
        },
        onSelect: function(rowIndex, _cC) {
            var opts = grid.datagrid('options');
            if (opts.init) {
                opts.selectedIndex = rowIndex;
            }
        },
        onCheck: function(rowIndex, _cC) {
            var opts = grid.datagrid('options');
            if (opts.init) {
                var dataset = opts.dataset;
                var record = _cC.record;
                if (record) {
                    if (dataset.getField(opts.select)) {
                        record.setValue(opts.select, true);
                    }
                    opts.checked[record.getString(opts.pkid)] = true;
                }
            }
        },
        onUncheck: function(rowIndex, _cC) {
            var opts = grid.datagrid('options');
            if (opts.init) {
                var dataset = opts.dataset;
                var record = _cC.record;
                if (record) {
                    if (dataset.getField(opts.select)) {
                        record.setValue(opts.select, false);
                    }
                    opts.checked[record.getString(opts.pkid)] = false;
                }
            }
        },
        onCheckAll: function(rows) {
            var opts = grid.datagrid('options');
            if (opts.init) {
                var dataset = opts.dataset;
                var has = dataset.getField(opts.select);
                for (var i = 0; i < rows.length; i++) {
                    var record = rows[i].record;
                    if (record) {
                        if (has) {
                            record.setValue(opts.select, true);
                        }
                        opts.checked[record.getString(opts.pkid)] = true;
                    }
                }
            }
        },
        onUncheckAll: function(rows) {
            var opts = grid.datagrid('options');
            if (opts.init) {
                var dataset = opts.dataset;
                var has = dataset.getField(opts.select);
                for (var i = 0; i < rows.length; i++) {
                    var record = rows[i].record;
                    if (record) {
                        if (has) {
                            record.setValue(opts.select, false);
                        }
                        opts.checked[record.getString(opts.pkid)] = false;
                    }
                }
            }
        },
        onClickRow: function(rowIndex, _cC, tr) {
            var opts = grid.datagrid('options');
            if (opts.selectedIndex != rowIndex && !opts.editing) {
                opts.dataset.setRecord(_cC.record);
            }
        },
        onSortColumn: function(sort, order) {
            var opts = grid.datagrid('options');
            var dataset = opts.dataset;
            dataset.sort((order == "desc" ? "-": "") + sort);
        },
        onBeforeEdit: function(rowIndex, _cC) {
            var opts = grid.datagrid('options');
            if (!opts.readOnly) {
                opts.editing = true;
                opts.editIndex = rowIndex;
                $(document).unbind(".datagrid").bind("mousedown.datagrid",
                function(e) {
                    if (opts.editIndex > -1) {
                        grid.datagrid('endEdit', opts.editIndex);
                    }
                }).bind("keydown.datagrid",
                function(e) {});
            }
            return ! opts.readOnly;
        },
        onAfterEdit: function(rowIndex, _cC, _aZ) {
            var opts = grid.datagrid('options');
            opts.editing = false;
            opts.editIndex = -1;
            $(document).unbind(".datagrid");
        },
        onCancelEdit: function(rowIndex, _cC) {
            var opts = grid.datagrid('options');
            opts.editing = false;
            opts.editIndex = -1;
            $(document).unbind(".datagrid");
        },
        onDeleteRow: function(data) {
            var dc = $.data(_aV, "datagrid").dc;
            var _ah = dc.view;
            if (_ah.height() < 30) {
                _ah.height(50);
            }
        },
        onDblClickCell: function(rowIndex, field, value) {
            var opts = grid.datagrid('options');
            if (!opts.editing) {
                grid.datagrid('beginEdit', rowIndex);
                var editor = grid.datagrid('getEditor', {
                    index: rowIndex,
                    field: field
                });
                if (editor) {
                    editor.target.focus();
                    if (editor.type == "datebox" || editor.type == "datetimebox" || editor.type == "combobox" || editor.type == "combo") {
                        $(editor.target).combo("textbox").focus();
                    }
                }
            }
        },
        onDblClickRow: function(rowIndex, _cC) {
            var _ad = grid.attr("id") + "_onDbClick";
            if (isUserEventDefined(_ad)) {
                try {
                    fireUserEvent(_ad, [this, _cC.record, rowIndex]);
                } catch(e) {}
            } else {
                if (grid.attr("floatwindow")) {
                    if (typeof(FloatWindow) != "undefined") {
                        FloatWindow.showSubWindow(grid.attr("floatwindow"));
                    }
                }
            }
        }
    });
    var pageList = [10, 20, 30, 40, 50];
    var pageSize = _dataset.masterDataset ? 999999 : _dataset.pageSize;
    if (("|" + pageList.join("|") + "|").indexOf("|" + pageSize + "|") == -1) {
        pageList.push(pageSize);
        pageList.sort();
    }
    grid.datagrid('getPager').pagination({
        pageSize: pageSize,
        pageList: pageList,
        pageNumber: 1,
        displayMsg: "",
        showPageList: !_dataset.masterDataset,
        onBeforeRefresh: function(pageNumber, pageSize) {
            var opts = grid.datagrid('options');
            opts.checked = {};
        },
        onSelectPage: function(pageNumber, pageSize) {
            var opts = grid.datagrid('options');
            opts.init = false;
            if (opts.editing) {
                opts.editing = false;
            }
            _dataset.setParameter("nextPage", pageNumber);
            _dataset.setParameter("everyPage", pageSize);
            _dataset.pageIndex = pageNumber;
            _dataset.pageSize = pageSize;
            opts.pageNumber = pageNumber;
            opts.pageSize = pageSize;
            if (opts.pageCache) {
                var datasettmp = opts.cache["cache-data"];
                var pagedata = datasettmp.toJson(opts);
                pagedata.total = datasettmp.length;
                grid.datagrid("loadData", pagedata);
                _dataset.setRecord(pagedata.rows[0].record);
            } else {
                _dataset.flushData(pageNumber);
            }
        }
    });
    var dc = $.data(_aV, "datagrid").dc;
    var _ah = dc.view;
    if (_ah.height() < 30) {
        _ah.height(50);
    }
};
function _show_message_when_nodata(grid) {
    var view = grid.datagrid("getPanel").children("div.datagrid-view");
    var _bd = view.children("div.datagrid-view2");
    var innerDiv = _bd.children("div.datagrid-body");
    var innerTd = innerDiv.find(".datagrid-btable tbody tr");
    if (!innerTd[0]) {
        innerDiv.html("<div class='datagrid-has-no-data'>" + $.fn.datagrid.defaults.emptyMsg + "</div>");
    }
};
function refreshDataGrid(table) {
    var _dataset = getElementDataset(table);
    var grid = $(table);
    var opts = grid.datagrid('options');
    if (opts.pageCache) {
        _dataset.pageCache = true;
        opts.cache["cache-data"] = _dataset;
    }
    var json = _dataset.toJson(opts);
    grid.datagrid("loadData", json);
};
function refreshDatagridCursor(_aV, dataset, record, reserved) {
    var grid = $(_aV);
    if (record) {
        if (grid.attr("treeGrid") == "false") {
            grid.datagrid("selectRecord", record._uuid);
        } else {
            grid.treegrid("select", record.getValue("_id"));
        }
    }
};
function refreshPagination(_aV, startRecord) {};
function refreshDataGridCellValue(_aV, dataset, field, record) {
    if (_aV.getAttribute("treeGrid") == "false") {
        var opts = $(_aV).datagrid("options");
        var editIndex = opts.editIndex;
        var rowIndex = $(_aV).datagrid("getRowIndex", record._uuid);
        if (editIndex == rowIndex) {
            var tr = opts.finder.getTr(_aV, rowIndex);
            tr.children("td").each(function() {
                var dataField = $(this).attr("field");
                if (dataField == field.fieldName || dataField + 'Name' == field.fieldName) {
                    var cell = $(this).find("div.datagrid-cell");
                    var ipt = cell.find("td").children();
                    if (ipt[0]) {
                        refreshInputValue(ipt[0], dataset, record);
                    } else {
                        var col = $(_aV).datagrid("getColumnOption", dataField);
                        if (col) {
                            if (col.formatter) {
                                cell.html(col.formatter(_cC[dataField], _cC, _cu, field, $(_aV).attr("id"), cell));
                            } else {
                                cell.html(_cC[dataField]);
                            }
                        }
                    }
                }
            });
        } else {
            var data = $(_aV).datagrid('getData');
            for (var i = 0; i < data.rows.length; i++) {
                if (data.rows[i][opts.idField] == record._uuid) {
                    data.rows[i][field.fieldName] = record.getJsonValue(field.fieldName);
                    $(_aV).datagrid('updateRow', {
                        index: rowIndex,
                        row: data.rows[i]
                    });
                    break;
                }
            }
        }
    } else {
        var opts = $(_aV).treegrid("options");
        var _cu = record._uuid;
        var editId = opts.editId;
        var _cC = $(_aV).treegrid('find', _cu);
        _cC[field.fieldName] = record.getJsonValue(field.fieldName);
        if (_cu == editId) {
            var tr = opts.finder.getTr(_aV, _cu);
            tr.children("td").each(function() {
                var dataField = $(this).attr("field");
                if (dataField == field.fieldName || dataField + 'Name' == field.fieldName) {
                    var cell = $(this).find("div.datagrid-cell");
                    var ipt = cell.find("td").children();
                    if (ipt[0]) {
                        refreshInputValue(ipt[0], dataset, record);
                    } else {
                        var col = $(_aV).datagrid("getColumnOption", dataField);
                        if (col) {
                            if (col.formatter) {
                                cell.html(col.formatter(_cC[dataField], _cC, _cu, field, $(_aV).attr("id"), cell));
                            } else {
                                cell.html(_cC[dataField]);
                            }
                        }
                    }
                }
            });
        } else {
            $(_aV).treegrid('update', {
                id: _cu,
                row: _cC
            });
        }
    }
};
function today() {
    var today = _today_date || new Date();
    return today.format(_VIEW_DATE_PATTERN);
};
function initEditor(_aV) {
    var field = $(_aV);
    var editType = field.attr("editType");
    var placeholder = field.attr("placeholder");
    switch (editType) {
    case "datebox":
    case "datetimebox":
        _dataInitEvent(field, placeholder, editType);
        _aV.setReadOnly = editor_setReadOnly;
        break;
    case "radio":
        initRadioGroup(_aV);
        break;
    case "checkbox":
        field.bind("click",
        function(event) {
            _checkboxChangeEvent(event);
        });
        break;
    case "password":
    case "validatebox":
    case "textarea":
        field.bind("change",
        function(event) {
            _fieldChangeEvent(event);
        });
        validEditorInput(field);
        field.validatebox();
        break;
    case "numberbox":
        field.bind("change",
        function(event) {
            _fieldChangeEvent(event);
        });
        validEditorInput(field);
        field.numberbox();
        break;
    default:
        break;
    }
    _aV.setReadOnly = editor_setReadOnly;
};
function setElementValue(_aV, dataset, dataField, value) {
    try {
        if (dataset.length == 0) {
            dataset.insertRecord("end");
        }
        _record_setValue(dataset.record, dataField, value);
    } catch(e) {
        refreshInputValue(_aV, dataset, dataset.record);
        _aV.focus();
    }
};
function _editor_setReadOnly(editor, _R) {
    var gfield = $(editor);
    var type = gfield.attr("editType");
    var state = _R ? "disable": "enable";
    switch (type) {
    case "datebox":
    case "datetimebox":
    case "dropDownSelect":
        {
            gfield.combo(state);
            if (_R) {
                gfield.combo("textbox").addClass("input-readonly");
            } else {
                gfield.combo("textbox").removeClass("input-readonly");
            }
            break;
        }
    case "radio":
        if (_R) {
            gfield.find('input').attr("disabled", "true");
        } else {
            gfield.find('input').removeAttr("disabled", _R);
        }
        break;
    case "checkbox":
        {
            if (_R) {
                gfield.attr('disabled', "true");
            } else {
                gfield.removeAttr("disabled");
            }
        }
    default:
        if (_R) {
            gfield.attr('readonly', "true");
            gfield.addClass("input-readonly");
        } else {
            gfield.removeAttr("readonly");
            gfield.removeClass("input-readonly");
        }
        break;
    }
};
function editor_setReadOnly(_R) {
    _editor_setReadOnly(this, _R);
};
function _dataInitEvent(field, placeholder, editType, width) {
    var editable = isTrue(field.attr("editable"));
    var comparemode = field.attr('dateType') == 'postdate' ? "ge": field.attr('dateType') == 'predate' ? "le": field.attr('comparemode');
    if (!placeholder) {
        placeholder = editType == "datebox" ? _VIEW_DATE_PATTERN: _VIEW_DATETIME_PATTERN;
    }
    field.combo({
        placeholder: placeholder,
        editable: editable,
        onInputText: function(value) {
            var oldValue = field.combo("getValue");
            if (value != oldValue) {
                if (value == "") {
                    _dateChangeEvent("", field, editType);
                } else {
                    var date = cast(value, editType == "datebox" ? 'date': 'timestamp');
                    if ($.type(date) != 'date') {
                        errAlert('date format error: ' + value);
                        $(this).combo('setText', oldValue);
                    } else {
                        _dateChangeEvent(date.format(editType == "datebox" ? _VIEW_DATE_PATTERN: _VIEW_DATETIME_PATTERN), field, editType);
                    }
                }
            }
        },
        oneClick: function() {
            var opts = field.combo('options');
            var defaults = {
                multiple: false,
                formEl: true,
                today: today(),
                changed: false,
                comparemode: comparemode,
                onChange: function(newValue, oldValue) {
                    opts.changed = true;
                },
                onInputText: opts.onInputText
            };
            if (editType == "datebox") {
                field.datebox($.extend(defaults, {
                    onSelect: function(value) {
                        if (opts.changed) {
                            opts.changed = false;
                            _dateChangeEvent(value, field, editType);
                        }
                    }
                }));
            } else {
                field.datetimebox($.extend(defaults, {
                    onOk: function(value) {
                        if (opts.changed) {
                            opts.changed = false;
                            _dateChangeEvent(value, $(this), "datetimebox");
                        }
                    }
                }));
            }
            $("div.combo-panel").panel("close");
            field.combo("textbox").focus();
            if (width) field.combo("resize", width);
            field.combo('showPanel');
        }
    });
    field.combo("textbox").parent().addClass("datebox");
};
function _dateChangeEvent(date, field, editType) {
    var _dataset = getDatasetByID(field.attr("componentDataset"));
    setElementValue(field[0], _dataset, field.attr("dataField"), date);
};
function _checkboxChangeEvent(e) {
    var src = e.target || window.event.srcElement;
    var _bA = src.id;
    if (_bA) {
        var field = $(src);
        var checked = field[0].checked;
        var _dataset = getDatasetByID(field.attr("componentDataset"));
        var dataField = field.attr('dataField');
        setElementValue(src, _dataset, dataField, checked);
    }
};
function _fieldChangeEvent(e) {
    var src = e.target || window.event.srcElement;
    var _bA = src.id;
    var field = $(src);
    var _dataset = getDatasetByID(field.attr("componentDataset"));
    var dataField = field.attr('dataField');
    var size = _dataset.getField(dataField).size;
    var mask = _dataset.getField(dataField).mask;
    var maskErrorMessage = _dataset.getField(dataField).maskErrorMessage;
    if (field.attr("extra") != "dropDownSelect") {
        if (field.val() != _dataset.getValue(dataField)) {
            var _aW;
            if (field.attr("editType") != "numberbox") {
                _aW = cutstr(field.val(), size);
            } else {
                _aW = field.val();
            }
            setElementValue(src, _dataset, dataField, _aW);
        }
    }
};
function refreshInputValue(_aV, _dataset, record) {
    var dataField = _aV.getAttribute("dataField");
    var _ag = _dataset.getValue(dataField);
    var field = $(_aV);
    var _ad = getElementEventName(_aV, "onSetValue");
    if (isUserEventDefined(_ad) && _dataset.loadCompleted) {
        var _cD = fireUserEvent(_ad, [_aV, _ag]);
        if (_cD == false) {
            return;
        }
    }
    switch (_aV.getAttribute("editType")) {
    case "dropDownSelect":
        var _k = getDropDownByID(_aV.getAttribute('dropDown'));
        var isStaticSelect = false;
        switch (_k.type) {
        case "list":
            isStaticSelect = true;
        case "dic":
            isStaticSelect = true;
        case "dynamictree":
            ;
        case "cq":
            ;
            var val = _ag.split(',');
            if (_aV.getAttribute("multi") != "true") {
                field.combo('setValue', _ag);
            } else {
                if (!val[0]) {
                    val.splice(0, 1);
                }
                field.combo('setValues', val);
            }
            if (isStaticSelect) {
                var tArray = new Array();
                var data = eval(dataField + "_Json");
                if (data) {
                    for (var i = 0; i < val.length; i++) {
                        for (var j = 0; j < data.length; j++) {
                            if (val[i] == (data[j].id + '')) {
                                tArray.push(data[j].text);
                                break;
                            }
                        }
                    }
                }
                field.combo('setText', tArray.join(','));
            } else {
                field.combo('setText', _dataset.getValue(dataField + "Name") != '' ? _dataset.getValue(dataField + "Name") : _ag);
            }
            break;
        case "dialog":
            {
                field.combo('setValue', _ag);
                field.combo('setText', _dataset.getValue(dataField + "Name") != '' ? _dataset.getValue(dataField + "Name") : _ag);
                break;
            }
        default:
            {
                field.combo('setValue', _ag).combo('setText', _ag);
            }
        }
        if (_dataset.modified) field.combo('isValid');
        else $.data(_aV, "combo").combo.find("input.combo-text").removeClass("validatebox-invalid");
        break;
    case "numberbox":
        field.numberbox('setValue', _ag);
        if (_dataset.modified) field.validatebox('isValid');
        else field.removeClass("validatebox-invalid");
        break;
    case "datebox":
        if ($.type(_ag) == 'date') {
            _ag = _ag.format(_VIEW_DATE_PATTERN);
        }
        field.combo('setValue', _ag).combo('setText', _ag);;
        if (_dataset.modified) field.datebox('isValid');
        else $.data(_aV, "combo").combo.find("input.combo-text").removeClass("validatebox-invalid");
        break;
    case "datetimebox":
        if ($.type(_ag) == 'date') {
            _ag = _ag.format(_VIEW_DATETIME_PATTERN);
        }
        field.combo('setValue', _ag).combo('setText', _ag);
        if (_dataset.modified) field.datebox('isValid');
        else $.data(_aV, "combo").combo.find("input.combo-text").removeClass("validatebox-invalid");
        break;
    case "checkbox":
        if (_ag) {
            field.attr("checked", true);
        } else {
            field.removeAttr("checked");
        }
        break;
    case "radio":
        $('input', field).each(function(i) {
            if (this.value == _ag) {
                this.checked = true;
            } else {
                $(this).removeAttr("checked");
            }
        });
        break;
    default:
        field.val(_ag);
        if (_dataset.modified) field.validatebox('isValid');
        else field.removeClass("validatebox-invalid");
        break;
    }
};
function initFieldlabel(_aV) {
    var jlabel = $(_aV);
    jlabel.addClass("form-labeltd");
    var label = jlabel.attr("label");
    var field = getElementField(_aV);
    var _ad = getElementEventName(_aV, "onRefresh");
    if (isUserEventDefined(_ad)) {
        if (!fireUserEvent(_ad, [_aV, label])) return;
    }
    if (field) {
        label = field.label;
        if (field.required) {
            label = "<font color=red>*</font>" + label;
        } else {
            label = "&nbsp;&nbsp;" + label;
        }
    }
    jlabel.html(label);
};
function refreshDatalabelValue(_aV, dataset, record) {
    var datalabel = $(_aV);
    var fieldname = _aV.getAttribute('dataField');
    var _bJ = record.getValue(fieldname);
    datalabel.text(_bJ);
};
function initRadioGroup(_aV) {
    var fieldName = _aV.getAttribute('name');
    eval('var radioDataset=' + _aV.getAttribute('id').replace('editor_', '') + '_RadioDataset');
    var resultDataset = _aV.getAttribute('componentDataset');
    var _cU = new Array();
    var _P = radioDataset.getFirstRecord();
    _cU.push('<div>');
    var rid = $.uuid++;
    while (_P) {
        _cU.push('<input id="' + fieldName + '" type="radio" name="' + fieldName + rid + '" value="' + _P[0] + '" >' + _P[1] + '</input>');
        _P = _P.getNextRecord();
    }
    _cU.push('</div>');
    var radio = $(_cU.join(''));
    _aV.appendChild(radio[0]);
    $('input[name=' + fieldName + rid + ']').bind('click',
    function(e) {
        radioGroupChangeEvent(e, resultDataset);
    });
};
function radioGroupChangeEvent(e, resultDataset) {
    var src = e.target || window.event.srcElement;
    var v = src.value;
    var dataset = getDatasetByID(resultDataset);
    dataset.setValue(src.id, v);
};
function cutstr(str, len) {
    var str_length = 0;
    var str_len = 0;
    str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            str_length++;
        }
        str_cut = str_cut.concat(a);
        if (str_length >= len) {
            return str_cut;
        }
    }
    if (str_length < len) {
        return str;
    }
};
function validEditorInput(field) {
    var _dataset = getDatasetByID(field.attr("componentDataset"));
    var dataField = field.attr('dataField');
    var _f = _dataset.getField(dataField);
    var mask = _f.mask;
    var maskErrorMessage = _f.maskErrorMessage;
    if (mask) {
        field.attr('validType', mask);
        field.attr('msg', maskErrorMessage);
    }
};
$.extend($.fn.validatebox.defaults.rules, {
    rul: {
        validator: function(value, param) {
            return new RegExp(param).test(value);
        },
        message: function(param) {
            return param;
        }
    }
});
function initDropdownTreeClick(_aV, _aD, _ao) {
    var editable = isTrue(_aV.getAttribute("editable"));
    var _r = _ao || setElementValue;
    var maindataset = getDatasetByID(_aV.getAttribute('componentDataset'));
    $(_aV).combo({
        editable: editable,
        onInputText: function(value) {
            _r(_aV, maindataset, _aV.getAttribute("dataField"), value);
            _r(_aV, maindataset, _aV.getAttribute("dataField") + "Name", value);
        },
        oneClick: function() {
            initDropdownTree(_aV, _aD, _ao);
        }
    });
    _aV.setReadOnly = editor_setReadOnly;
};
function initSelectCQClick(_aV, width, _aD, _ao) {
    var editable = isTrue(_aV.getAttribute("editable"));
    var _r = _ao || setElementValue;
    var maindataset = getDatasetByID(_aV.getAttribute('componentDataset'));
    $(_aV).combo({
        editable: editable,
        onInputText: function(value) {
            _r(_aV, maindataset, _aV.getAttribute("dataField"), value);
            _r(_aV, maindataset, _aV.getAttribute("dataField") + "Name", value);
        },
        oneClick: function() {
            initSelectCQ(_aV, width, _aD, _ao);
        }
    });
    _aV.setReadOnly = editor_setReadOnly;
};
function initSelectAndDicClick(_aV, _aD, _ao) {
    var editable = isTrue(_aV.getAttribute("editable"));
    var _r = _ao || setElementValue;
    var maindataset = getDatasetByID(_aV.getAttribute('componentDataset'));
    $(_aV).combo({
        editable: editable,
        onInputText: function(value) {
            _r(_aV, maindataset, _aV.getAttribute("dataField"), value);
            _r(_aV, maindataset, _aV.getAttribute("dataField") + "Name", value);
        },
        oneClick: function() {
            initSelectAndDic(_aV, _aD, _ao);
        }
    });
    _aV.setReadOnly = editor_setReadOnly;
};
function initSelectCustomClick(_aV, _aD, _ao) {
    var editable = isTrue(_aV.getAttribute("editable"));
    var _r = _ao || setElementValue;
    var maindataset = getDatasetByID(_aV.getAttribute('componentDataset'));
    $(_aV).combo({
        editable: editable,
        onInputText: function(value) {
            _r(_aV, maindataset, _aV.getAttribute("dataField"), value);
            _r(_aV, maindataset, _aV.getAttribute("dataField") + "Name", value);
        },
        oneClick: function() {
            initSelectCustom(_aV, _aD, _ao);
            $(_aV).combo('showPanel');
        }
    });
    _aV.setReadOnly = editor_setReadOnly;
};
function initSelectDialogClick(_aV, _aD, _ao) {
    var editable = isTrue(_aV.getAttribute("editable"));
    var _r = _ao || setElementValue;
    var maindataset = getDatasetByID(_aV.getAttribute('componentDataset'));
    $(_aV).combo({
        editable: editable,
        onInputText: function(value) {
            _r(_aV, maindataset, _aV.getAttribute("dataField"), value);
            _r(_aV, maindataset, _aV.getAttribute("dataField") + "Name", value);
        },
        oneClick: function() {
            initSelectDialog(_aV, _aD, _ao);
            $("div.combo-panel").panel("close");
        }
    });
    $(_aV).combo("textbox").parent().addClass("popselect");
    _aV.setReadOnly = editor_setReadOnly;
};
function initDropdownTree(_aV, _aD, _ao, width) {
    var _r = _ao || setElementValue;
    var _z = _aD || setFieldMapValue;
    var _V = $(_aV);
    var _U = getDropDownByID(_aV.getAttribute('dropDown'));
    var maindataset = getDatasetByID(_aV.getAttribute('componentdataset'));
    var _ae = getDatasetByID(_aV.getAttribute('datasetName'));
    var dropdowndataset = copyDataset(_aV.getAttribute('datasetName') + $.uuid++, _aV.getAttribute('datasetName'));
    dropdowndataset.type = "dropdwon";
    var fieldName = _V.attr("dataField");
    var multiple = isTrue(_V.attr("multi"));
    if (multiple) {
        editable = false;
    }
    _V.combotree({
        panelHeight: 200,
        init: false,
        async: false,
        isreload: false,
        clearCls: "icon-cancel",
        multiple: multiple,
        dropdownName: _V.attr('dropDown'),
        dropdown: _U,
        maindataset: maindataset,
        dataset: dropdowndataset,
        currentRecord: {},
        cascadeCheck: false,
        viewField: _U.fields || "_id",
        loader: function(param, success, error) {
            var opts = _V.combotree('options');
            var _dropdown_dataset = opts.dataset;
            _dropdown_dataset.setParameter("_id", param.id);
            _dropdown_dataset.flushData(1);
            _dropdown_dataset.setParameter("_id", null);
            opts.loadtype = 1;
            success(opts.dataset);
            opts.loadtype = 0;
        },
        loadFilter: function(dataset) {
            var opts = _V.combotree('options');
            return treedataset2json(dataset, opts);
        },
        onChange: function() {
            var opts = _V.combotree('options');
            opts.changed = true;
        },
        onBeforeClick: function(node, checked) {
            var opts = _V.combotree('options');
            if (node.canSelected == "false") {
                return false;
            }
            if ((opts.multiple && checked) || !opts.multiple) {
                var _ad = opts.dropdownName + '_onSelect';
                var _aL = (isUserEventDefined(_ad) && !fireUserEvent(_ad, [opts.dropdown, node.attributes.record, this]));
                if (_aL) {
                    return false;
                }
            }
        },
        onClick: function(node, _aR) {
            var opts = _V.combotree('options');
            if (!opts.multiple && opts.changed) {
                opts.changed = false;
                if (node.id != "") {}
                if (!opts.multiple) {
                    _z(_aV, opts.dropdown.fieldMap, opts.maindataset, node.attributes.record);
                } else {
                    var key = _V.combotree('getValues').join(",");
                    var val = _V.combotree('getText');
                    _r(_aV, maindataset, fieldName, key);
                    _r(_aV, maindataset, fieldName + "Name", val);
                }
            }
        },
        onShowPanel: function() {
            var opts = _V.combotree('options');
            var cached = _U.cached != false;
            if (!opts.init || !cached) {
                opts.dataset.flushData(1);
                _V.combotree('loadData', opts.dataset);
                opts.init = true;
            }
            var values = _V.combotree('getValues');
            var g = _V.combotree('tree');
            var gridopts = g.tree('options');
            var empty = function() {};
            var onSelect = gridopts.onSelect;
            var onCheck = gridopts.onCheck;
            gridopts.onSelect = empty;
            gridopts.onCheck = empty;
            g.find("span.tree-checkbox").addClass("tree-checkbox0").removeClass("tree-checkbox1 tree-checkbox2");
            g.find("div.tree-node-selected").removeClass("tree-node-selected");
            var vv = [],
            ss = [];
            for (var i = 0; i < values.length; i++) {
                var v = values[i];
                var s = v;
                var node = g.tree("find", v);
                if (node) {
                    s = node.text;
                    g.tree("check", node.target);
                    g.tree("select", node.target);
                }
                vv.push(v);
                ss.push(s);
            }
            gridopts.onSelect = onSelect;
            gridopts.onCheck = onCheck;
        },
        onInputText: function(value) {
            _r(_aV, maindataset, _V.attr("dataField"), value);
            _r(_aV, maindataset, _V.attr("dataField") + "Name", value);
        },
        onCheck: function(node, checked) {
            var _bC = _V.combotree('tree');
            var vv = [],
            ss = [];
            var _av = _bC.tree("getChecked");
            for (var i = 0; i < _av.length; i++) {
                vv.push(_av[i].id);
                ss.push(_av[i].text);
            }
            var key = vv.join(",");
            var val = ss.join(",");
            _r(_aV, maindataset, _V.attr("dataField"), key);
            _r(_aV, maindataset, _V.attr("dataField") + "Name", val);
        }
    });
    var panel = _V.combotree('panel');
    panel.panel({
        onBeforeOpen: function() {
            var _ad = _aV.getAttribute('dropDown') + '_beforeOpen';
            if (isUserEventDefined(_ad)) {
                var result = fireUserEvent(_ad, [_U]);
                if (result) {
                    if (result != true) {
                        errAlert(result);
                        return false;
                    }
                }
            }
            var opts = _V.combotree('options');
            var _U = opts.dropdown;
            opts.outerParam = converDateSetParameter2Str(_ae);
            var cached = _U.cached != false;
            if (cached) {
                converStr2DataSetParameter(opts.outerParam, opts.dataset);
            }
        }
    });
    _V.combotree("showPanel");
    _V.combotree("resize", width);
};
function refreshCustom(_aV, combo, dropdown) {
    var datasetName = _aV.getAttribute('datasetName');
    var resultName = _aV.getAttribute('componentDataset');
    var id = _aV.getAttribute("id");
    var _dataset = getDatasetByID(datasetName);
    var url = dropdown.url;
    var resultDataset = getDatasetByID(resultName);
    var div = $('<div></div>');
    div.html('<IFRAME frameborder=0 marginheight=0 marginwidth=0 src="' + _application_root + url + '"  style="width:100%;height:100%;"></IFRAME>');
    combo.combo({
        panelWidth: '200',
        panelHeight: '300'
    });
    div.appendTo(combo.combo('panel'));
};
function initSelectDialog(_aV) {
    var select = $(_aV);
    var maindatasetName = select.attr("componentDataset");
    var _l = getDatasetByID(maindatasetName);
    var dropdownName = select.attr('dropDown');
    var _U = getDropDownByID(dropdownName);
    var opts = select.combo('options');
    select.popselect({
        maindataset: _l,
        dropdown: _U,
        url: _application_root + _U.url,
        onInputText: opts.onInputText,
        onSelect: function(record) {
            var _ad = dropdownName + '_onSelect';
            _aL = (isUserEventDefined(_ad) && !fireUserEvent(_ad, [_U, record, this]));
            if (_aL) return;
            var opts = select.popselect('options');
            setFieldMapValue(_aV, opts.dropdown.fieldMap, opts.maindataset, record);
        },
        onShowPanel: function() {
            var _ad = dropdownName + '_beforeOpen';
            if (isUserEventDefined(_ad)) {
                var result = fireUserEvent(_ad, [_U]);
                if (result) {
                    if (result != true) {
                        errAlert(result);
                        return false;
                    }
                }
            }
        }
    });
    select.popselect("showPanel");
};
function setFieldMapValue(_aV, fieldMap, dataset, record) {
    if (fieldMap) {
        var fields = fieldMap.split(";");
        for (var i = 0; i < fields.length; i++) {
            var index = fields[i].indexOf("=");
            if (index >= 0) {
                setElementValue(_aV, dataset, fields[i].substr(0, index), record ? record.getValue(fields[i].substr(index + 1)) : "");
            } else {
                setElementValue(_aV, dataset, fields[i], record ? record.getValue(fields[i]) : "");
            }
        }
    }
};
function initSelectCQ(_aV, width, _aD, _ao) {
    var _z = _aD || setFieldMapValue;
    var _r = _ao || setElementValue;
    var combo = $(_aV);
    var maindataset = getDatasetByID(combo.attr('componentDataset'));
    var _ae = getDatasetByID(combo.attr('datasetName'));
    var dropdowndataset = copyDataset("_tmp_" + combo.attr('datasetName') + $.uuid++, combo.attr('datasetName'));
    combo.attr("tmpdatasetid", dropdowndataset.id);
    dropdowndataset.type = "dropdwon";
    var fieldName = combo.attr("dataField");
    var _U = getDropDownByID(combo.attr('dropDown'));
    var _bz = [];
    var _cR = _U.fields ? _U.fields.split(",") : [];
    for (var i = 0; i < _cR.length; i++) {
        var _bo = {};
        _bo.field = _cR[i];
        _bo.title = dropdowndataset.getField(_cR[i]).label;
        _bo.width = 100;
        _bz.push(_bo);
    }
    var fieldMaps = _U.fieldMap ? _U.fieldMap.split(";") : [];
    var _di = "";
    var _aw = "";
    for (var i = 0; i < fieldMaps.length; i++) {
        var s = fieldMaps[i].split('=');
        if (s[0] == (fieldName + 'Name')) {
            _di = s[1];
        } else if (s[0] == fieldName) {
            _aw = s[1];
        }
    }
    var multiple = (combo.attr("multi") == "true" || combo.attr("multi") == true);
    if (multiple) {
        editable = false;
    }
    combo.combogrid({
        dd: {},
        panelWidth: 250,
        panelHeight: 300,
        idField: _aw,
        multiple: multiple,
        textField: _di,
        columns: [_bz],
        pagination: true,
        init: false,
        pageCache: false,
        cache: {},
        dataset: dropdowndataset,
        onShowPanel: function() {
            var opts = combo.combogrid('options');
            var cached = _U.cached != false;
            if (dropdowndataset.init != "true" && cached) {
                return;
            }
            if (!cached || !opts.init) {
                opts.dataset.flushData(1);
                combo.combogrid('grid').datagrid('loadData', opts.dataset.toJson());
                opts.init = true;
            }
            var values = combo.combogrid('getValues');
            var g = combo.combogrid('grid');
            var gridopts = g.datagrid('options');
            var empty = function() {};
            var onUnselectAll = gridopts.onUnselectAll;
            var onSelect = gridopts.onSelect;
            gridopts.onUnselectAll = empty;
            gridopts.onSelect = empty;
            g.datagrid("clearSelections");
            for (var i = 0; i < values.length; i++) {
                var index = g.datagrid("getRowIndex", values[i]);
                if (index >= 0) {
                    g.datagrid("selectRow", index);
                }
            }
            gridopts.onUnselectAll = onUnselectAll;
            gridopts.onSelect = onSelect;
        },
        onChange: function() {
            var opts = combo.combogrid('options');
            opts.changed = true;
        },
        onHidePanel: function() {},
        onLoadSuccess: function(data) {
            var opts = combo.combogrid('options');
            if (opts.dataset.pageSize < opts.dataset.length) {
                opts.pageCache = true;
                opts.cache["cache-data"] = opts.dataset;
            } else {}
        }
    });
    combo.combo('resize', width);
    var panel = combo.combogrid('panel');
    panel.panel({
        onBeforeOpen: function() {
            var _ad = combo.attr('dropDown') + '_beforeOpen';
            if (isUserEventDefined(_ad)) {
                var result = fireUserEvent(_ad, [_U]);
                if (result) {
                    if (result != true) {
                        errAlert(result);
                        return false;
                    }
                }
            }
            var opts = combo.combogrid('options');
            opts.outerParam = converDateSetParameter2Str(_ae);
            var cached = _U.cached != false;
            if (cached) {
                converStr2DataSetParameter(opts.outerParam, opts.dataset);
            }
        }
    });
    var grid = combo.combogrid('grid');
    grid.datagrid({
        isdropdown: true,
        singleSelect: !multiple,
        fitColumns: true,
        onBeforeClickRow: function(rowIndex, _cC, selected) {
            var _ad = combo.attr('dropDown') + '_onSelect';
            var _aL = (isUserEventDefined(_ad) && !fireUserEvent(_ad, [_U, _cC.record, this]));
            if (_aL) {
                return false;
            }
        },
        onClickRow: function(rowIndex, _cC) {
            var opts = combo.combogrid('options');
            if (opts.multiple) {
                var key = combo.combogrid('getValues').join(",");
                var val = combo.combogrid('getText');
                _r(_aV, maindataset, combo.attr("dataField"), key);
                _r(_aV, maindataset, combo.attr("dataField") + "Name", val);
            } else {
                if (opts.changed) {
                    opts.changed = false;
                    _z(_aV, _U.fieldMap, maindataset, _cC.record);
                }
                combo.combo("hidePanel");
            }
        },
        onSelect: function(rowIndex, _cC) {
            _u(_cC, 1);
        },
        onUnselect: function(rowIndex, _cC) {
            _u(_cC, 0);
        },
        rowStyler: function(index, row) {
            if (index % 2 == 1) {
                return 'background-color:#fafafa;';
            }
        }
    });
    function _u(data, f) {
        var values = combo.combo("getValues");
        var text = combo.combo("getText");
        var vv = [],
        ss = [];
        vv = values;
        ss = text ? text.split(",") : [];
        var ind = $.inArray(data[_aw], vv);
        if (f == 0) {
            if (ind > -1) {
                vv.splice(ind, 1);
                ss.splice(ind, 1);
            }
        } else if (f == 1) {
            if (ind == -1) {
                vv.push(data[_aw]);
                ss.push(data[_di]);
            }
        }
        combo.combo("setValues", vv);
        combo.combo("setText", ss.join(","));
    };
    var _bL = dropdowndataset.pKey || [];
    if (_bL.length > 0) {
        var gridpanel = grid.datagrid('getPanel');
        var dv = $("<div style='height:auto'></div>").addClass("datagrid-toolbar").prependTo(gridpanel);
        var tbl = $("<table class='combogrid-where' width='100%' border='0'></table>").appendTo(dv);
        for (var i = 0; i < _bL.length; i++) {
            if (_bL[i].name && _bL[i].name.startWith("value")) {
                var _dL = $("<label for='" + _bL[i].name + "'>" + _bL[i].desc + "</label>");
                var _do = $("<input name='" + _bL[i].name + "' type='text' style='width:100px;' >").validatebox();
                var tr = $("<tr></tr>").append($("<td></td>").append(_dL)).append($("<td></td>").append(_do));
                tr.appendTo(tbl);
            }
        }
        var _cg = $("<a href='javascript:void(0);' style='margin-left:5px'/>");
        _cg.linkbutton({
            plain: true,
            iconCls: 'icon-search'
        });
        function _B() {
            tbl.find("input").each(function() {
                dropdowndataset.setParameter(this.name, this.value);
            });
            dropdowndataset.flushData(1);
            combo.combogrid('grid').datagrid('loadData', dropdowndataset.toJson());
        };
        tbl.find("input").keydown(function(e) {
            if (e.keyCode == 13) {
                _B();
            }
        });
        _cg.click(function() {
            _B();
        });
        tbl.find('td:last').append(_cg);
    } else {
        dropdowndataset.init = "true";
    }
    var pageList = [maindataset.pageSize];
    var pagination = grid.datagrid("getPager");
    pagination.pagination({
        showRefresh: false,
        showPageList: false,
        pageSize: dropdowndataset.pageSize || 10,
        displayMsg: "",
        beforePageText: "",
        afterPageText: "/{pages}",
        buttons: [{
            iconCls: 'icon-cancel',
            handler: function() {
                grid.datagrid("clearSelections");
                _z(_aV, _U.fieldMap, maindataset, null);
            }
        }],
        onSelectPage: function(pageNumber, pageSize) {
            var opts = combo.combogrid("options");
            var _e;
            if (opts.pageCache) {
                _e = opts.cache["cache-data"];
            } else {
                _e = opts.dataset;
                _e.flushData(pageNumber);
            }
            _e.setParameter("nextPage", pageNumber);
            _e.setParameter("everyPage", pageSize);
            _e.pageIndex = pageNumber;
            _e.pageSize = pageSize;
            grid.datagrid("loadData", _e.toJson());
        }
    });
    combo.combogrid('showPanel');
};
function initSelectAndDic(_aV) {
    var select = $(_aV);
    var datasetName = select.attr("datasetName");
    var maindatasetName = select.attr("componentDataset");
    var _dropdown_dataset = getDatasetByID(datasetName);
    var _l = getDatasetByID(maindatasetName);
    var dropdownName = select.attr('dropDown');
    var _U = getDropDownByID(select.attr('dropDown'));
    var multiple = select.attr("multi");
    var _bY = new Array();
    var tArray1 = new Array();
    select.combobox({
        panelHeight: _dropdown_dataset.length > 10 ? 300 : 'auto',
        maindataset: _l,
        dropdowndataset: _dropdown_dataset,
        onBeforeSelect: function(value) {
            var _ad = dropdownName + '_onSelect';
            _aL = (isUserEventDefined(_ad) && !fireUserEvent(_ad, [_U, value.record, this]));
            if (_aL) {
                return false;
            }
        },
        onSelect: function(value) {
            var opts = select.combobox('options');
            var _dropdown_dataset = opts.dropdowndataset;
            if (value.id) {
                var values = select.combobox('getValues');
                setElementValue(_aV, opts.maindataset, select.attr("dataField"), values.join(","));
                if (!opts.multiple) {
                    setElementValue(_aV, opts.maindataset, select.attr("dataField") + "Name", value.text);
                } else {
                    var _cB = new Array();
                    var tArray = new Array();
                    var data = eval(select.attr("dataField") + "_Json");
                    for (var i = 0; i < values.length; i++) {
                        for (var j = 0; j < data.length; j++) {
                            if (values[i] == data[j].id) {
                                _cB.push(data[j]);
                                tArray.push(data[j].text);
                                break;
                            }
                        }
                    }
                    _bY = _cB;
                    tArray1 = tArray;
                    setElementValue(_aV, opts.maindataset, select.attr("dataField") + "Name", tArray.join(','));
                }
            } else {
                setElementValue(_aV, opts.maindataset, select.attr("dataField"), "");
                select.combobox("panel").panel("close");
            }
        },
        onUnselect: function(value) {
            var opts = select.combobox('options');
            var _dropdown_dataset = opts.dropdowndataset;
            var _ad = dropdownName + '_onSelect';
            _aL = (isUserEventDefined(_ad) && !fireUserEvent(_ad, [_U, value.record, this]));
            if (_aL) return;
            if (opts.multiple) {
                for (var i = 0; i < _bY.length; i++) {
                    if (_bY[i].id == value.id) {
                        _bY.splice(i, 1);
                        tArray1.splice(i, 1);
                        break;
                    }
                }
                var values = select.combobox('getValues');
                setElementValue(_aV, opts.maindataset, select.attr("dataField"), values.join(","));
                setElementValue(_aV, opts.maindataset, select.attr("dataField") + "Name", tArray1.join(','));
            }
        },
        onInputText: function(value) {
            var opts = select.combobox('options');
            setElementValue(_aV, opts.maindataset, select.attr("dataField"), value);
        }
    });
    select.combobox("panel").panel({
        onBeforeOpen: function() {
            $(this).find('.combobox-item').css('height', 'auto');
            $(this).find('.combobox-item:first[value=]').css('height', '14px');
            var _ad = dropdownName + '_beforeOpen';
            if (isUserEventDefined(_ad)) {
                var result = fireUserEvent(_ad, [_U]);
                if (result) {
                    if (result != true) {
                        errAlert(result);
                        return false;
                    }
                }
            }
        }
    });
    var json = [];
    if (select.attr("required") != "required") {
        var row = {
            id: "",
            text: ""
        };
        json[0] = row;
    }
    var record = _dropdown_dataset.getFirstRecord();
    while (record) {
        if (record[0]) {
            var row = {};
            row.id = record[0];
            row.text = record[1];
            row.record = record;
            json[json.length] = row;
        }
        record = record.getNextRecord();
    }
    select.combobox('loadData', json);
    select.combobox("showPanel");
};
function treedataset2json(dataset, opts) {
    var json = [];
    if (dataset.length > 0) {
        var _P = dataset.getFirstRecord();
        if (opts.loadtype != 1 && !opts.multiple) {
            var row = {};
            row.id = "";
            row.text = "";
            row.state = "open";
            row.iconCls = opts.clearCls;
            row.attributes = {};
            json[0] = row;
        }
        var jsonmap = {};
        while (_P) {
            var row = {};
            var _am = {};
            _am.record = _P;
            row.id = _P.getValue("_id");
            row.state = _P.getString('_hasChild_') == 'true' ? "closed": "open";
            row.pid = _P.getString("_parentId");
            row.text = _P.getString(opts.viewField);
            row.iconCls = _P.getString("_icon");
            row.canSelected = _P.getString("_canSelected_");
            row.checked = _P.getString("_checked") == 'true';
            row.attributes = _am;
            row.children = [];
            jsonmap[row.id] = row;
            _P = _P.getNextRecord();
        }
        for (var key in jsonmap) {
            var row = jsonmap[key];
            var prow = jsonmap[row.pid];
            if (prow) {
                prow.children[prow.children.length] = row;
            } else {
                json[json.length] = row;
            }
        }
    }
    return json;
};
function refreshComboGrid(_aV, combo, dropdown) {
    var datasetName = _aV.getAttribute('datasetName');
    var resultName = _aV.getAttribute('componentDataset');
    var id = _aV.getAttribute("id");
    var _dataset = getDatasetByID(datasetName);
    var resultDataset = getDatasetByID(resultName);
    _dataset.flushData(1);
    var pKey = _dataset.pKey;
    var div = [];
    var selectField = new Array();
    div.push('<div style="overflow-x:hidden" >');
    div.push('<input id="forfocus_' + id + '" style="margin-left:-200px;">');
    div.push('<table style="float:right"><tr><td>');
    div.push('<table >');
    for (var i = 0; i < pKey.length; i++) {
        if (pKey[i].name.substring(0, 5) == "value") {
            if (i == 0) {
                div.push('<tr><td sytle="width:50px" colspan="2"><div>' + pKey[i].desc + '</div></td><td colspan="2"><input  type="text" dropdown="text" style="width:100px;" >' + '</td><td></td></tr>');
            } else {
                div.push('<tr><td sytle="width:50px" colspan="2"><div>' + pKey[i].desc + '</div></td><td colspan="2"><input  type="text" dropdown="text" style="width:100px" ></td></tr>');
            }
        }
    }
    div.push('</table></td></tr>');
    div.push('<tr><table border="0" cellpadding="0" cellspacing="0"><tbody><tr>');
    div.push('<td><a class="l-btn l-btn-plain l-btn-disabled" href="javascript:void(0)" icon="pagination-first"><span class="l-btn-left"><span class="l-btn-text">');
    div.push('<span class="l-btn-empty pagination-first">&nbsp;</span></span></span></a></td>');
    div.push('<td><a class="l-btn l-btn-plain l-btn-disabled" href="javascript:void(0)" icon="pagination-prev"><span class="l-btn-left"><span class="l-btn-text">');
    div.push('<span class="l-btn-empty pagination-prev">&nbsp;</span></span></span></a></td><td><div class="pagination-btn-separator"></div></td>');
    div.push('<td><input id="' + id + '_DDIndex" class="pagination-num" value="1" size="2" type="text"></td><td><span id="pageCount111" style="padding-right:6px;">/' + _dataset.pageCount + '</span></td>');
    div.push('<td><div class="pagination-btn-separator"></div></td><td><a class="l-btn l-btn-plain l-btn-disabled" href="javascript:void(0)" icon="pagination-next">');
    div.push('<span class="l-btn-left"><span class="l-btn-text"><span class="l-btn-empty pagination-next">&nbsp;</span></span></span></a></td>');
    div.push('<td><a class="l-btn l-btn-plain l-btn-disabled" href="javascript:void(0)" icon="pagination-last"><span class="l-btn-left"><span class="l-btn-text">');
    div.push('<span class="l-btn-empty pagination-last">&nbsp;</span></span></span></a></td><td><a id="dropdownClear" href="#" class="easyui-linkbutton" plain="true" iconCls="icon-cancel" title="清空"></a></td></tr></tbody></table><div style="clear:both;"></div>');
    div.push('</tr></table></td></tr><tr><td>');
    var _al = div.length;
    div.push('<table>');
    div.push('<thead><tr>');
    var _aC = dropdown.fields;
    _aC = _aC.split(',');
    var sumWidth = 0;
    for (var i = 0; i < _aC.length; i++) {
        var fi = _aC[i].split(':');
        var fh = fi[1];
        if (!fi[1]) {
            if (_aC.length == 1) {
                fh = '220';
            } else {
                fh = '100';
            }
        }
        div.push('<th field=' + fi[0] + ' width="' + fh + '">funcId</th>');
        selectField.push(fi[0]);
        sumWidth = sumWidth + parseInt(fh);
    }
    div.push('</tr></thead></table></td></tr></table>');
    div.push('</div>');
    if (_dataset.length >= 10) {
        div[_al] = '<table  id="' + id + '_d"  class="easyui-datagrid" style="width:' + (sumWidth + 6) + 'px;height:285px" singleSelect="true">';
    } else {
        div[_al] = '<table  id="' + id + '_d"  class="easyui-datagrid" style="width:' + (sumWidth + 6) + 'px;" autoHeight="true" singleSelect="true">';
    }
    var d = $(div.join(''));
    var w = null;
    var h = null;
    if (pKey[0]) {
        w = pKey[0].width;
        h = pKey[0].height;
    }
    $("#" + id + "_m").replaceWith(d);
    if (!w) {
        w = sumWidth;
    }
    if (!h) {
        h = 'auto';
    }
    var grid = $('#' + id + '_d');
    grid.datagrid();
    var JsonObject = new Object();
    var recordObject = new Object();
    eval('JsonObject.a' + 1 + '=loadDataToGrid(combo,selectField,_dataset,"",grid,dropdown,recordObject);');
    _dataset.setParameter("cacheIndex", 0);
    combo.combo({
        panelWidth: parseInt(w) + 7,
        panelHeight: h
    });
    d.appendTo(combo.combo('panel'));
    dropDownBindEvent(combo, grid, _dataset, resultDataset, dropdown, pKey, selectField, id, dropdown, JsonObject, recordObject);
    SArray.put(id, recordObject.a1);
};
function dropDownInterface(combo, dataset, pKey, selectField, id, recordObject) {
    var inputs = $('input[dropdown=text]');
    inputs.bind('click',
    function() {
        $(this).focus();
    });
    inputs.bind('keydown',
    function(e) {
        var key = e.which;
        if (key == 13) {
            for (var i = 0; i < inputs.length; i++) {
                dataset.setParameter(pKey[i].name, inputs.eq(i).val());
            }
            dataset.flushData(1);
            loadDataToGrid(combo, selectField, dataset, id, '', '', recordObject);
            $('#' + id + '_DDIndex').val(1);
            $('#pageCount111').text('/' + dataset.pageCount);
            return false;
        }
    });
};
function dropDownBindEvent(combo, grid, _dataset, resultDataset, dropdown, pKey, selectField, id, dropdown, JsonObject, recordObject) {
    var _be = combo.combo('panel');
    var rows = $("tbody tr.datagrid-row", _be);
    var span = $("#pageCount111", _be);
    var _ai = dropdown.fieldMap.split(";");
    var fieldName = dropdown.id.replace('_DropDown', '');
    var _aw = new Array();
    var valueName = new Array();
    var _di = null;
    var keyN = null;
    if (_dataset.pageCount == 1) span.text('/' + JsonObject.a1.length);
    for (var i = 0; i < _ai.length; i++) {
        var _bF = _ai[i].split('=');
        if (_bF[0] == (fieldName + 'Name')) {
            _di = _bF[1];
        }
        if (_bF[0] == fieldName) {
            keyN = _bF[1];
        }
        _aw.push(_bF[0]);
        valueName.push(_bF[1]);
    }
    var index = 0;
    _be.bind('keydown',
    function(e) {
        var key = e.which;
        if (key == 38) {
            _be.focus();
            if (index > 0) {
                index--;
                grid.datagrid("selectRow", index);
            }
            return false;
        }
        if (key == 40) {
            _be.focus();
            if (index < rows.length - 1) {
                index++;
                grid.datagrid("selectRow", index);
            }
            return false;
        }
        if (key == 37) {
            dropDownPrev(grid, selectField, id, _dataset, combo, JsonObject, dropdown, recordObject);
            if (_dataset.pageCount != 1) {
                index = 0;
            }
            return false;
        }
        if (key == 39) {
            dropDownNext(grid, selectField, id, _dataset, combo, JsonObject, dropdown, recordObject);
            if (_dataset.pageCount != 1) {
                index = 0;
            }
            return false;
        }
        if (key == 13) {
            combo.combo('hidePanel');
            var record = SArray.get(id)[index];
            index = 0;
            var _cV = record.getValue(_di);
            resultDataset.setValue(fieldName, _cV);
            for (var i = 0; i < _aw.length; i++) {
                resultDataset.setValue(_aw[i], record.getValue(valueName[i]));
            }
            fireUserEvent(combo.attr('dropDown') + '_onSelect', [dropdown, SArray.get(id)[rowIndex], combo[0]]);
            return false;
        }
    });
    var keyArray = [];
    var valueArray = [];
    var _cw = [];
    grid.datagrid({
        onClickRow: function(rowIndex, _cC) {
            fireUserEvent(combo.attr('dropDown') + '_onSelect', [dropdown, SArray.get(id)[rowIndex], combo[0]]);
            var _ak = _cC[keyN];
            var _cV = _cC[_di];
            if (combo.attr('multi') == "false") {
                grid.datagrid("selectRow", rowIndex);
                combo.combo('hidePanel');
                var record = SArray.get(id)[rowIndex];
                for (var i = 0; i < _aw.length; i++) {
                    resultDataset.setValue(_aw[i], record.getValue(valueName[i]));
                }
            } else {
                var opts = grid.datagrid('options');
                opts.singleSelect = false;
                var _bN = null;
                for (var i = 0; i < _cw.length; i++) {
                    if (_cw[i] == rowIndex) {
                        _bN = rowIndex;
                        _cw.splice(i, 1);
                        break;
                    }
                }
                if (_bN || _bN == 0) {
                    grid.datagrid("unselectRow", _bN);
                } else {
                    grid.datagrid("selectRow", rowIndex);
                    _cw.push(rowIndex);
                }
                var _dj = true;
                for (var i = 0; i < keyArray.length; i++) {
                    if (keyArray[i] == _ak) {
                        keyArray.splice(i, 1);
                        valueArray.splice(i, 1);
                        _dj = false;
                        break;
                    }
                }
                if (_dj) {
                    keyArray.push(_ak);
                    valueArray.push(_cV);
                }
                resultDataset.setValue(fieldName, keyArray.join(','));
                resultDataset.setValue(fieldName + 'Name', valueArray.join(','));
            }
        }
    });
    $(document).bind('mousedown',
    function(e) {
        combo.combo('hidePanel');
        index = 0;
    });
    $('#dropdownClear').linkbutton();
    $('#dropdownClear').bind('click',
    function() {
        combo.combo('clear');
        resultDataset.setValue(fieldName, '');
    });
    dropDownInterface(combo, _dataset, pKey, selectField, id, recordObject);
    _be.bind('mousedown',
    function(e) {
        e.stopPropagation();
        window.event.cancelBubble = true;
    });
    $('a[icon=pagination-first]', _be).bind('click',
    function() {
        dropDownFirst(grid, selectField, id, _dataset, combo, JsonObject, dropdown, recordObject);
    });
    $('a[icon=pagination-prev]', _be).bind('click',
    function() {
        dropDownPrev(grid, selectField, id, _dataset, combo, JsonObject, dropdown, recordObject);
    });
    $('a[icon=pagination-next]', _be).bind('click',
    function() {
        dropDownNext(grid, selectField, id, _dataset, combo, JsonObject, dropdown, recordObject);
    });
    $('a[icon=pagination-last]', _be).bind('click',
    function() {
        dropDownLast(grid, selectField, id, _dataset, combo, JsonObject, dropdown, recordObject);
    });
    _be.find(".datagrid-body").eq(1).css('overflow-x', 'hidden');
    $('.datagrid-header', _be).css('display', 'none');
    $('.datagrid-wrap', _be).css('height', '200');
};
var SArray = new Map();
function dropDownFirst(grid, selectField, id, _dataset, combo, JsonObject, dropdown, recordObject) {
    var datagrid = $('#' + id + '_d');
    if (_dataset.pageCount > 1) {
        if (dropdown.cached == false) {
            _dataset.flushData(1);
            $('#' + id + '_DDIndex').val(1);
            loadDataToGrid(combo, selectField, _dataset, id, "", "", recordObject);
        } else {
            datagrid.datagrid("loadData", JsonObject.a1[0]);
            $('#' + id + '_DDIndex').val(1);
        }
    } else {
        datagrid.datagrid("loadData", JsonObject.a1[0]);
        $('#' + id + '_DDIndex').val(1);
    }
    SArray.put(id, recordObject.a1);
    _dataset.setParameter("cacheIndex", 0);
};
function dropDownPrev(grid, selectField, id, _dataset, combo, JsonObject, dropdown, recordObject) {
    if (_dataset.pageCount > 1) {
        if (dropdown.cached == true) {
            var cacheIndex = parseInt(_dataset.getParameter("cacheIndex"));
            if (cacheIndex == 0) {
                return;
            } else {
                $('#' + id + '_DDIndex').val(cacheIndex);
                cacheIndex = cacheIndex - 1;
                var json = eval('JsonObject.a' + (cacheIndex + 1));
                if (json) {
                    $('#' + id + '_d').datagrid("loadData", json[0]);
                    _dataset.setParameter("cacheIndex", cacheIndex);
                    SArray.put(id, eval('recordObject.a' + (cacheIndex + 1)));
                } else {
                    _dataset.flushData(cacheIndex + 1);
                    $('#' + id + '_DDIndex').val(cacheIndex + 1);
                    eval('JsonObject.a' + (cacheIndex + 1) + '=loadDataToGrid(combo,selectField,_dataset,id,"","",recordObject)');
                    _dataset.setParameter("cacheIndex", cacheIndex);
                    SArray.put(id, eval('recordObject.a' + (cacheIndex + 1)));
                }
            }
        } else {
            if (_dataset.pageIndex == 1) {
                $(this).linkbutton({
                    disabled: true
                });
                return;
            }
            _dataset.flushData(_dataset.pageIndex - 1);
            $('#' + id + '_DDIndex').val(_dataset.pageIndex);
            var jarray = loadDataToGrid(combo, selectField, _dataset, id, "", "", recordObject);
            JsonArray.push(jarray[0]);
            var cacheIndex = parseInt(_dataset.getParameter("cacheIndex"));
            _dataset.setParameter("cacheIndex", cacheIndex - 1);
        }
    } else {
        var cacheIndex = parseInt(_dataset.getParameter("cacheIndex"));
        if (cacheIndex == 0) {
            return;
        } else {
            $('#' + id + '_DDIndex').val(cacheIndex);
            cacheIndex = cacheIndex - 1;
            $('#' + id + '_d').datagrid("loadData", JsonObject.a1[cacheIndex]);
            _dataset.setParameter("cacheIndex", cacheIndex);
            SArray.put(id, eval('recordObject.a' + (cacheIndex + 1)));
        }
    }
};
function dropDownNext(grid, selectField, id, _dataset, combo, JsonObject, dropdown, recordObject) {
    var cacheIndex = parseInt(_dataset.getParameter("cacheIndex"));
    if (_dataset.pageCount > 1) {
        if (dropdown.cached == true) {
            if ((cacheIndex + 1) == _dataset.pageCount) {
                return;
            }
            var json = eval('JsonObject.a' + (cacheIndex + 2));
            if (json) {
                var cacheIndex = parseInt(_dataset.getParameter("cacheIndex"));
                cacheIndex = cacheIndex + 1;
                $('#' + id + '_DDIndex').val(cacheIndex + 1);
                $('#' + id + '_d').datagrid("loadData", json[0]);
                _dataset.setParameter("cacheIndex", cacheIndex);
                SArray.put(id, eval('recordObject.a' + (cacheIndex + 1)));
            } else {
                _dataset.flushData(cacheIndex + 2);
                $('#' + id + '_DDIndex').val(_dataset.pageIndex);
                eval('JsonObject.a' + _dataset.pageIndex + '=loadDataToGrid(combo,selectField,_dataset,id,"","",recordObject)');
                _dataset.setParameter("cacheIndex", cacheIndex + 1);
                SArray.put(id, eval('recordObject.a' + _dataset.pageIndex));
            }
        } else {
            if (_dataset.pageIndex == _dataset.pageCount) {
                return;
            }
            _dataset.flushData(_dataset.pageIndex + 1);
            $('#' + id + '_DDIndex').val(_dataset.pageIndex);
            loadDataToGrid(combo, selectField, _dataset, id, "", "", recordObject);
            _dataset.setParameter("cacheIndex", _dataset.pageIndex);
        }
    } else {
        var cacheIndex = parseInt(_dataset.getParameter("cacheIndex"));
        if (cacheIndex == JsonObject.a1.length - 1) {
            return;
        } else {
            cacheIndex = cacheIndex + 2;
            $('#' + id + '_DDIndex').val(cacheIndex);
            $('#' + id + '_d').datagrid("loadData", JsonObject.a1[cacheIndex - 1]);
            _dataset.setParameter("cacheIndex", cacheIndex - 1);
            SArray.put(id, eval('recordObject.a' + cacheIndex));
        }
    }
};
function dropDownLast(grid, selectField, id, _dataset, combo, JsonObject, dropdown, recordObject) {
    if (_dataset.pageCount > 1) {
        if (dropdown.cached == false) {
            _dataset.flushData(_dataset.pageCount);
            $('#' + id + '_DDIndex').val(_dataset.pageCount);
            loadDataToGrid(combo, selectField, _dataset, id, "", "", recordObject);
        } else {
            var json = eval('JsonObject.a' + _dataset.pageCount);
            if (json) {
                $('#' + id + '_d').datagrid("loadData", json[0]);
                $('#' + id + '_DDIndex').val(_dataset.pageCount);
                SArray.put(id, eval('recordObject.a' + _dataset.pageCount));
            } else {
                _dataset.flushData(_dataset.pageCount);
                $('#' + id + '_DDIndex').val(_dataset.pageCount);
                eval('JsonObject.a' + _dataset.pageCount + '=loadDataToGrid(combo,selectField,_dataset,id,"","",recordObject)');
                SArray.put(id, eval('recordObject.a' + _dataset.pageCount));
            }
        }
        _dataset.setParameter("cacheIndex", _dataset.pageCount - 1);
    } else {
        $('#' + id + '_d').datagrid("loadData", JsonObject.a1[JsonObject.a1.length - 1]);
        $('#' + id + '_DDIndex').val(JsonObject.a1.length);
        _dataset.setParameter("cacheIndex", JsonObject.a1.length - 1);
        SArray.put(id, eval('recordObject.a' + (JsonObject.a1.length - 1)));
    }
};
function loadDataToGrid(combo, selectField, _dataset, id, datagrid, dropdown, recordObject) {
    var _P = _dataset.getFirstRecord();
    var grid;
    if (datagrid) grid = datagrid;
    else grid = $('#' + id + '_d');
    var JsonArray = new Array();
    var index = 0;
    for (var j = 0; j < _dataset.length / 10; j++) {
        var recordJson = {};
        recordJson.total = 10;
        recordJson.rows = [];
        var total = 0;
        var downRecordArray = new Array();
        while (_P) {
            downRecordArray.push(_P);
            total++;
            var row = {};
            for (var i = 0; i < _dataset.fields.fieldCount; i++) {
                var _f = _dataset.getField(i);
                var fieldName = _f.fieldName;
                var field = _P.getValue(fieldName);
                row[fieldName] = field;
            }
            if (total == 10) {
                if (_dataset.pageCount > 1) {
                    eval('recordObject.a' + _dataset.pageIndex + '=downRecordArray');
                } else {
                    eval('recordObject.a' + (++index) + '=downRecordArray');
                }
                break;
            }
            recordJson.rows.push(row);
            _P = _P.getNextRecord();
        }
        if (_dataset.length < 10) {
            if (_dataset.pageCount > 1) {
                eval('recordObject.a' + _dataset.pageIndex + '=downRecordArray');
            } else {
                eval('recordObject.a' + (++index) + '=downRecordArray');
            }
        }
        JsonArray.push(recordJson);
    }
    if (_dataset.length) {
        grid.datagrid("loadData", JsonArray[0]);
        var fname = combo.attr('dataField') + '_selectCQDropDown';
        eval(fname + '=downRecordArray;');
    } else {
        grid.datagrid("loadData", 0);
    }
    return JsonArray;
};
var _dropdown_parentbox;
function _dropdown_onclick() {
    if (parent._dropdown_parentbox) {
        parent._dropdown_parentbox.combo('hidePanel');
    }
};
function _dropdown_resize() {
    if (_dropdown_parentbox) {
        var wh = _dropdown_parentbox.combo('options').ifr.contentWindow.winsize();
        _dropdown_parentbox.combo('panel').panel('resize', wh);
    }
};
function initSelectCustom(_aV) {
    var combo = $(_aV);
    var datasetName = combo.attr("datasetName");
    var maindatasetName = combo.attr("componentDataset");
    var maindataset = getDatasetByID(maindatasetName);
    var _dropdown_dataset = getDatasetByID(datasetName);
    var _U = getDropDownByID(combo.attr('dropDown'));
    var ifr = $('<iframe scrolling=no height=0 frameborder=0 marginheight=0 marginwidth=0 style="width:100%;height:100%" onload="(function(){})()"></iframe>');
    combo.combo({
        panelHeight: 5,
        ifr: ifr[0],
        onHidePanel: function() {
            var _C = ifr[0];
            if (_C.contentWindow.dropDown_onGetRecord) {
                record = _C.contentWindow.dropDown_onGetRecord();
            }
            var _ad = combo.attr('dropDown') + '_onSelect';
            _aL = (isUserEventDefined(_ad) && !fireUserEvent(_ad, [_U, record, this]));
            if (_aL) return;
            setFieldMapValue(_aV, _U.fieldMap, maindataset, record);
        }
    });
    var panel = combo.combo('panel');
    panel.panel({
        onBeforeOpen: function() {
            var _ad = combo.attr('dropDown') + '_beforeOpen';
            if (isUserEventDefined(_ad)) {
                var result = fireUserEvent(_ad, [_U]);
                if (result) {
                    if (result != true) {
                        errAlert(result);
                        return false;
                    }
                }
            }
            _dropdown_parentbox = combo;
            if (!ifr.attr("src")) {
                if (ifr[0].attachEvent) {
                    ifr[0].attachEvent("onload", _dropdown_resize);
                } else {
                    ifr[0].onload = _dropdown_resize;
                }
                ifr.attr("src", _Q(_U));
            }
        }
    });
    ifr.appendTo(panel);
    if (_dropdown_dataset.init == "true") {
        ifr.attr("src", _Q(_U));
    }
    function _Q(dropdown) {
        var _url = dropdown.url;
        if (_url.substring(0, 1) == "/") {
            _url = _application_root + _url;
        }
        var fieldMapStr = dropdown.fieldMap;
        var viewField = dropdown.fields;
        var fieldId = dropdown.fieldId;
        if (_url.lastIndexOf("?") != -1) {
            _url += "&sessionkey=" + dropdown.sessionKey + "&fieldMapStr=" + fieldMapStr + "&viewField=" + viewField + "&fieldId=" + fieldId;
        } else {
            _url += "?sessionkey=" + dropdown.sessionKey + "&fieldMapStr=" + fieldMapStr + "&viewField=" + viewField + "&fieldId=" + fieldId;
        }
        var _bl = dropdown.targetDataset;
        if (typeof(_bl) == "string") _bl = getDatasetByID(_bl);
        if (_bl) {
            var targetFieldStr = converDateSet2Str(_bl);
            _url += "&targetFieldStr=" + targetFieldStr;
        }
        var _dataset = dropdown.dataset;
        if (typeof(_dataset) == "string") _dataset = getDatasetByID(_dataset);
        if (_dataset) {
            var paramStr = converDateSetParameter2Str(_dataset);
            _url += "&paramStr=" + paramStr;
        }
        return _url;
    }
};
var _activeElement = null;
var _activeEditor = null;
var _activeTable = null;
var _dropdown_window = null;
var _isDropDownPage = false;
var _document_loading = false;
var _stored_element = null;
var _array_dataset = new Array();
var _tabset_list = new Array();
var _jtabset_list = new Array();
var _array_submitmanager = new Array();
var _user_events = new Object();
var _oidmap = null;
var _skip_activeChanged = false;
function _finishInitializtion() {
    for (var i = 0; i < _tabset_list.length; i++) {
        initElement(_tabset_list[i]);
    }
};
function initDocument() {
    fireUserEvent("document_onInit", []);
    with(document) {
        initElements(body);
        for (var i = 0; i < _array_dataset.length; i++) {
            var dataset = _array_dataset[i];
            if (dataset.masterDataset) {
                dataset.setMasterDataset(dataset.masterDataset, dataset.references);
            }
            var _aT = getElementEventName(dataset, "onFilterRecord");
            dataset.filtered = isUserEventDefined(_aT);
            dataset.initDocumentFlag = true;
            dataset.pageElement = "document";
        }
        _finishInitializtion();
        language = "javascript";
    }
    $(window).unload(function() {
        if ($.browser.msie) {
            CollectGarbage();
        }
    });
    initTheme();
    fireUserEvent("document_afterInit", []);
};
function initDocumentLet(_aV) {
    fireUserEvent("documentlet_onInit", []);
    with(document) {
        initElements(_aV);
        for (var i = 0; i < _array_dataset.length; i++) {
            var dataset = _array_dataset[i];
            if (dataset.initDocumentFlag == false) {
                if (dataset.masterDataset) {
                    dataset.setMasterDataset(dataset.masterDataset, dataset.references);
                }
                var _aT = getElementEventName(dataset, "onFilterRecord");
                dataset.filtered = isUserEventDefined(_aT);
                dataset.pageElement = _aV.id;
                dataset.initDocumentFlag = true;
            }
        }
    }
    fireUserEvent("documentlet_afterInit", []);
};
function fireUserEvent(_aG, param) {
    var result;
    if (_aG == "") return;
    var eventInfo = _user_events[_aG];
    if (eventInfo == null) {
        if (!isUserEventDefined(_aG)) return;
        eventInfo = _user_events[_aG];
    }
    if (eventInfo != null && eventInfo.defined) {
        result = eventInfo.handle(param[0], param[1], param[2], param[3]);
    }
    return result;
};
function initElements(_aV) {
    if (compareText(_aV.getAttribute("extra"), "tabset")) {
        _tabset_list[_tabset_list.length] = _aV;
    } else {
        if (!initElement(_aV)) return;
    }
    for (var i = 0; i < _aV.children.length; i++) {
        initElements(_aV.children[i]);
    }
};
function initElementDataset(_aV) {
    var dataset = _aV.getAttribute("componentDataset");
    if (dataset) setElementDataset(_aV, dataset);
};
function initElementDropdownDataset(_aV) {
    var dataset = _aV.getAttribute("datasetName");
    if (dataset) setElementDataset(_aV, dataset);
};
function initElement(_aV) {
    var _i = _aV.getAttribute("extra");
    var noExtra = isTrue(_aV.getAttribute("noExtra"));
    var initChildren = !noExtra;
    if (_i && !noExtra) {
        _aV.window = window;
        switch (_i) {
        case "fieldlabel":
            {
                initElementDataset(_aV);
                initFieldlabel(_aV);
                break;
            }
        case "datalabel":
            {
                initElementDataset(_aV);
                break;
            }
        case "editor":
            {
                initEditor(_aV);
                initElementDataset(_aV);
                break;
            }
        case "dropDownSelect":
            {
                initElementDataset(_aV);
                var _U = getDropDownByID(_aV.getAttribute('dropDown'));
                switch (_U.type) {
                case "cq":
                    initSelectCQClick(_aV);
                    break;
                case "dynamictree":
                    initDropdownTreeClick(_aV);
                    break;
                case "custom":
                    initSelectCustomClick(_aV);
                    break;
                case "dialog":
                    {
                        initSelectDialogClick(_aV);
                        break;
                    }
                default:
                    initSelectAndDicClick(_aV);
                }
                break;
            }
        case "datagrid":
            {
                initElementDataset(_aV);
                initDataTable(_aV);
                break;
            }
        case "pagination":
            {
                initElementDataset(_aV);
                break;
            }
        case "button":
            {
                initChildren = false;
                if (_aV.tagName == "A") {
                    $(_aV).linkbutton();
                }
                break;
            }
        case "tabset":
            {
                initEasyTabSet(_aV);
                initChildren = false;
                break;
            }
        case "menuitem":
            {
                var menu = $(_aV);
                menu.bind("contextmenu",
                function() {
                    return false;
                });
                var id = menu.attr("id");
                menu.menu({
                    onClick: function(item) {
                        var opts = $.data(_aV, 'menu').options;
                        fireUserEvent(id + "_onClick", [item, opts.data]);
                    },
                    onShow: function(item) {
                        var opts = $.data(_aV, 'menu').options;
                        fireUserEvent(id + "_onShow", [item, opts.data]);
                    },
                    onHide: function(item) {
                        var opts = $.data(_aV, 'menu').options;
                        fireUserEvent(id + "_onHide", [item, opts.data]);
                    }
                });
                break;
            }
        case "tree":
            {
                var dtree = new DynamicTree(_aV);
                eval(_aV.getAttribute("id") + "=dtree;");
                break;
            }
        case "tabs":
            {
                var dtabs = new DynamicTabSet(_aV);
                eval(_aV.getAttribute("id") + "=dtabs;dtabs.setParams(" + _aV.getAttribute("id") + "_params);");
                break;
            }
        case "floatwindow":
            {
                var _win = $(_aV);
                var fwin = new FloatWindow(_win.attr("id"), _aV);
                fwin.init();
                eval("subwindow_" + _win.attr("id") + "=fwin;");
                break;
            }
        case "accordionMenu":
            var _accmenu = $(_aV);
            var _accordion = new AccordionMenu(_aV);
            eval(_accmenu.attr("id") + "=_accordion;");
            break;
        case "groupbox":
            var groupbox = $(_aV);
            var expand = groupbox.attr("expand");
            var outerContainer = groupbox.find("div:first");
            outerContainer.css("height", "100%");
            var innerContainer = outerContainer.find("div:first");
            var imgUrl;
            var alt;
            if (expand == "true") {
                alt = constGroupBoxExpandAlt;
                innerContainer.show();
                imgUrl = _theme_root + "/group_expand.gif";
            } else {
                imgUrl = _theme_root + "/group_collapse.gif";
                alt = constGroupBoxCollapseAlt;
                innerContainer.hide();
            }
            $("<img/>").css("cursor", "hand").attr("expand", expand).attr("alt", alt).attr("src", imgUrl).click(function() {
                var img = $(this);
                if (img.attr("expand") == "true") {
                    innerContainer.hide();
                    img.attr("expand", "false").attr("alt", constGroupBoxExpandAlt).attr("src", _theme_root + "/group_collapse.gif");
                } else {
                    innerContainer.show();
                    img.attr("expand", "true").attr("alt", constGroupBoxCollapseAlt).attr("src", _theme_root + "/group_expand.gif");
                }
            }).appendTo(groupbox.find("legend"));
            break;
        default:
            {
                if (!_aV.className && _i) _aV.className = _i;
                break;
            }
        }
    }
    $(_aV).attr("noExtra", "true");
    return initChildren;
};
function _createParameters() {
    var parameters = new Array();
    parameters.setParameter = parameters_setParameter;
    parameters.getParameter = parameters_getParameter;
    return parameters;
};
function _createPageState() {
    this.version = "0";
    this.REQUEST_PARAM_NAME = "SubmitManager.PageState";
    this.parameter = _createParameters();
    this.getString = _PageState_getString;
    this.setString = _PageState_setString;
    this.getCount = _PageState_getCount;
    this.getStringCode = _PageState_toString;
    this.getRequestText = _PageState_getRequestText;
    return this;
};
function parameters_setParameter(name, value, dataType) {
    var parameter;
    if (typeof(name) == "number") {
        var i = name;
        this[i].name = name;
        this[i].value = value;
        if (dataType) {
            this[i].dataType = dataType;
        }
    } else {
        var count = this.length;
        var _bi = false;
        for (var i = 0; i < count; i++) {
            if (compareText(this[i].name, name)) {
                _bi = true;
                break;
            }
        }
        if (!_bi) {
            i = count;
            this[i] = new Object();
        }
        this[i].name = name;
        this[i].value = value;
        if (dataType) {
            this[i].dataType = dataType;
        }
    }
};
function parameters_getParameter(name) {
    if (typeof(name) == "number") {
        return this[name].value;
    } else {
        var count = this.length;
        for (var i = 0; i < count; i++) {
            if (compareText(this[i].name, name)) {
                return this[i].value;
                break;
            }
        }
        return "";
    }
};
function _PageState_getString(name) {
    return this.parameter.getParameter(name);
};
function _PageState_setString(name, value) {
    this.parameter.setParameter(name, value);
};
function _PageState_getCount() {
    return this.parameter.length;
};
function _PageState_toString() {
    var result = "";
    var parameter = this.parameter;
    for (var i = 0; i < parameter.length; i++) {
        result += (i == 0) ? "": ";";
        result += getEncodeStr(parameter[i].name) + "=" + getEncodeStr(parameter[i].value);
    }
    return getEncodeStr(result);
};
function _PageState_getRequestText() {
    return this.REQUEST_PARAM_NAME + "=" + this.getStringCode();
};
function getElementEventName(_aV, _ad) {
    var result = "";
    if (_aV.extra != "dockeditor") result = _aV.id + "_" + _ad;
    else {
        var _bn = _aV.editorHolder;
        if (_bn) result = _bn.id + "_" + _ad;
    }
    return result;
};
function isUserEventDefined(_aG) {
    if (_aG == "") return false;
    var eventInfo = _user_events[_aG];
    if (eventInfo == null) {
        eventInfo = new Object();
        _user_events[_aG] = eventInfo;
        var script = "eventInfo.defined=(typeof(" + _aG + ")!=\"undefined\");" + "if (eventInfo.defined) eventInfo.handle=" + _aG + ";";
        eval(script);
    }
    return eventInfo.defined;
};
function unfireUserEvent(_aG) {
    var eventInfo = _user_events[_aG];
    if (eventInfo == null) {} else {
        _user_events[_aG] = null;
    }
};
function isFileIncluded(fileId) {
    var included = false;
    eval("included=(typeof(_fileIncluded_" + fileId + ")!=\"undefined\")");
    return included;
};
function getElementDataset(_aV) {
    var dataset = _aV.getAttribute("componentDataset");
    if (typeof(dataset) == "string") {
        dataset = getDatasetByID(dataset);
    }
    return dataset;
};
function _image_onClick() {
    var _aV = event.srcElement;
    var _bn = _aV.parentElement;
    var field = getElementField(_bn);
    var dataset = field.dataset;
    var fieldname = field.name;
    var param = new Object();
    param.dataset = dataset;
    param.field = field.fieldName;
    param.image = _aV.src;
    var url = field.lobPopupURL;
    if (url.indexOf("?") < 0) {
        url += "?";
    }
    url += "&lob_sessionkey=" + dataset.getValue(fieldname);
    url += "&dataset_sessionKey=" + dataset.sessionKey;
    url += "&lobfield=" + field.fieldName;
    url += "&oid=" + dataset.getValue("oid");
    showModalDialog(_application_root + url, param, "dialogHeight: 400px; dialogWidth: 400px; center: Yes; help: No; resizable: yes; status: No");
    dataset.setValue(fieldname, dataset.getValue(fieldname));
};
function addParams2TabsUrl(tabset, paramNames, _an) {
    var _s = paramNames.split(",");
    var _y = _an.split(",");
    for (var i = 0; i < tabset.cells.length; i++) {
        if (typeof(tabset.cells[i].targetUrl) != "undefined" && tabset.cells[i].targetUrl != "") {
            for (var j = 0; j < _s.length; j++) {
                if (j == 0) {
                    tabset.cells[i].targetUrl = tabset.cells[i].targetUrl + "?" + _s[j] + "=" + _y[j];
                } else {
                    tabset.cells[i].targetUrl = tabset.cells[i].targetUrl + "&" + _s[j] + "=" + _y[j];
                }
            }
        }
    }
};
function addParams2TabsUrl(tabset, paramNames, _an) {
    tabset.addParams(paramNames, _an);
};
function megerURL(applicationRoot, url) {
    var v_url = url;
    if (v_url && v_url.length > 0) {
        var s = v_url.substring(0, 1);
        if (s == '/') {
            return applicationRoot + v_url;
        } else {
            return applicationRoot + "/" + v_url;
        }
    } else {
        return applicationRoot + "/";
    }
};
function compareDate(_at, _aM, month) {
    var _aP = _at.getFullYear();
    var _bO = _at.getMonth();
    var _bM = _at.getDate();
    if (new Date(_aP, _bO + month, _bM) < _aM) {
        return false;
    } else {
        return true;
    }
};
function compareDateFunction(_at, _aM) {
    var _bV;
    var _bZ;
    if (typeof(_at) == "object") {
        _bV = _at;
    } else {
        _bV = convertStr2Date(_at);
    }
    if (typeof(_aM) == "object") {
        _bZ = _aM;
    } else {
        _bZ = convertStr2Date(_aM);
    }
    return compareDate(_bV, _bZ, 0);
};
function convertStr2Date(_aB) {
    var year = parseInt(_aB.substring(0, 4));
    var _dm = _aB.substring(4, 6);
    if ('0' == _dm.charAt(0)) _dm = _dm.substring(1, 2);
    var month = parseInt(_dm);
    if (_aB.substring(6, 7) == "0") {
        var day = parseInt(_aB.substring(7, 8));
    } else {
        var day = parseInt(_aB.substring(6, 8));
    }
    return new Date(year + "/" + month + "/" + day);
};
function convertStr2Date_new(_aB) {
    var result;
    result = new Date(_aB);
    if (!isNaN(result)) return result;
    var re = /^(\d{4})(\-)(\d{1,2})\-(\d{1,2})$/;
    var m = re.exec(_aB);
    if (m != null) {
        result = new Date(m[1], m[3] - 1, m[4]);
        return result;
    }
    return convertStr2Date(_aB);
};
function traversalRecords(_bB, datasetToCheck, _aa) {
    var selectCount = 0;
    var _aJ = datasetToCheck.length;
    for (; ! datasetToCheck.eof; datasetToCheck.moveNext(), _aJ--) {
        if (datasetToCheck.getString("select") == "true") {
            selectCount++;
            if (!_bB(datasetToCheck.getString(_aa))) {
                return false;
            }
        }
    }
    var pos = 0;
    for (datasetToCheck.moveFirst(); pos < _aJ; datasetToCheck.moveNext(), pos++) {
        if (datasetToCheck.getString("select") == "true") {
            selectCount++;
            if (!checkCancelStatus(datasetToCheck.getString(_aa))) {
                return false;
            }
        }
    }
    datasetToCheck.moveFirst();
    datasetToCheck.move(_aJ);
    if (selectCount == 0) {
        alert("请选择一笔纪录！");
        return false;
    }
    return true;
};
Request = {
    QueryString: function(item) {
        var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return svalue ? svalue[1] : svalue;
    }
};
function getRecordStateNum(dataset, stateName) {
    var v_rec = dataset.firstUnit;
    var v_none = 0;
    var v_insert = 0;
    var v_modify = 0;
    var v_delete = 0;
    var v_new = 0;
    var v_discard = 0;
    while (v_rec) {
        if (v_rec.recordState == "none") {
            v_none = v_none + 1;
        }
        if (v_rec.recordState == "insert") {
            v_insert = v_inert + 1;
        }
        if (v_rec.recordState == "modify") {
            v_modify = v_modify + 1;
        }
        if (v_rec.recordState == "delete") {
            v_delete = v_delete + 1;
        }
        if (v_rec.recordState == "new") {
            v_new = v_new + 1;
        }
        if (v_rec.recordState == "discard") {
            v_discard = v_discard + 1;
        }
        v_rec = v_rec.nextUnit;
    }
    if (stateName == "none") return v_none;
    if (stateName == "insert") return v_insert;
    if (stateName == "modify") return v_modify;
    if (stateName == "delete") return v_delete;
    if (stateName == "new") return v_new;
    if (stateName == "discard") return v_discard;
};
function getElementField(_aV) {
    var dataset = getElementDataset(_aV);
    if (!dataset) return;
    return dataset.getField(_aV.getAttribute("dataField"));
};
function uninitLet(_aV) {
    var _ab;
    uninitElements(_aV);
    if (!_aV) {
        _ab = "document";
    } else {
        _ab = _aV.id;
    }
    var _X = new Array();
    for (var i = 0; i < _array_dataset.length; i++) {
        var dataset = _array_dataset[i];
        if (dataset.pageElement == _ab && dataset.type != "dropdown") {
            dataset.disableControls();
            dataset.disableEvents();
            freeDataset(dataset);
            eval(dataset.id + "=undefined;");
        } else {
            _X[_X.length] = dataset;
        }
    }
    _array_dataset = _X;
};
function uninitElements(_aV) {
    if (!_aV) {
        for (var i = 0; i < _array_dataset.length; i++) {
            var dataset = _array_dataset[i];
            if (dataset.window == window) dataset.setMasterDataset(null);
        }
        _aV = document.body;
    }
    var noExtra = isTrue(_aV.getAttribute("noExtra"));
    if (_aV && !noExtra) {
        for (var i = 0; i < _aV.children.length; i++) {
            uninitElements(_aV.children[i]);
        }
        uninitElement(_aV);
    }
};
function uninitElement(_aV) {
    var _i = _aV.getAttribute("extra");
    switch (_i) {
    case "datalabel":
        ;
    case "editor":
        ;
    case "dockeditor":
        ;
    case "datatable":
        ;
    case "tablecell":
        ;
    case "pagepilot":
        ;
    case "datagrid":
        ;
    case "datagridgroup":
        ;
    case "datapilot":
        {
            if (typeof(setElementDataset) != "undefined") setElementDataset(_aV, null);
            break;
        }
    }
};
function switchTheme(theme) {
    var _dp = $("link[href$='easyui.css']");
    var _dg = _dp.attr('href');
    _dp.attr('href', _dg.replace(/(themes\/).*(\/easyui.css)/g, '$1' + theme + '$2'));
    document.cookie = 'fpportal-theme-' + _current_user + '=' + theme;
};
function initTheme(theme) {
    if (theme) {
        switchTheme(theme);
    } else {
        var _bx = document.cookie.split(';');
        if (!_bx.length) {
            return;
        }
        for (var i = 0; i < _bx.length; i++) {
            var _bc = _bx[i].split('=');
            if ($.trim(_bc[0]) == ('fpportal-theme-' + _current_user)) {
                theme = $.trim(_bc[1]);
                break;
            }
        }
        if (theme && theme != 'undefined') {
            switchTheme(theme);
        }
    }
}