// 系统配置
let systemConfig = {
    stationName: "漯河西站",
    timeOffset: 0,
    theme: "light",
    trains: [
        { id: 1, no: "G2104", type: "过路车", start: "信阳东", end: "威海", arriveTime: "07:24", departTime: "07:27", gate: "1", platform: "2", landmark: "蓝色", direction: "←1 18→", status: "正点", delay: 0, expectedArrive: "", expectedDepart: "" },
        { id: 2, no: "G478", type: "过路车", start: "汉口", end: "北京西", arriveTime: "07:55", departTime: "07:57", gate: "1", platform: "3", landmark: "紫色", direction: "←1 18→", status: "正点", delay: 0, expectedArrive: "", expectedDepart: "" },
        { id: 3, no: "G3484", type: "过路车", start: "汉口", end: "沈阳北", arriveTime: "08:07", departTime: "08:09", gate: "1", platform: "3", landmark: "黄色", direction: "←1 18→", status: "正点", delay: 0, expectedArrive: "", expectedDepart: "" },
        { id: 4, no: "G3821", type: "始发车", start: "漯河西", end: "上海...", arriveTime: "", departTime: "08:15", gate: "2", platform: "5", landmark: "蓝色", direction: "←1 18→", status: "正点", delay: 0, expectedArrive: "", expectedDepart: "" },
        { id: 5, no: "G516", type: "过路车", start: "汉口", end: "呼和...", arriveTime: "08:20", departTime: "08:22", gate: "1", platform: "2", landmark: "绿色", direction: "←1 17→", status: "正点", delay: 0, expectedArrive: "", expectedDepart: "" },
        { id: 6, no: "G3010", type: "过路车", start: "武汉", end: "青岛", arriveTime: "08:25", departTime: "08:27", gate: "1", platform: "3", landmark: "黄色", direction: "←1 8→", status: "正点", delay: 0, expectedArrive: "", expectedDepart: "" },
        { id: 7, no: "G577", type: "过路车", start: "洛阳...", end: "上海...", arriveTime: "08:30", departTime: "08:33", gate: "2", platform: "5", landmark: "紫色", direction: "←1 18→", status: "正点", delay: 0, expectedArrive: "", expectedDepart: "" },
        { id: 8, no: "G769", type: "始发车", start: "漯河西", end: "成都东", arriveTime: "", departTime: "08:32", gate: "2", platform: "4", landmark: "紫色", direction: "←1 17→", status: "正点", delay: 0, expectedArrive: "", expectedDepart: "" }
    ]
};

let importedData = [];

// ===================== 核心交互功能 =====================
// 更新时间显示
function updateDatetime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + systemConfig.timeOffset);
    const datetimeStr = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日${now.getHours()}时${now.getMinutes()}分${now.getSeconds()}秒`;
    document.getElementById("datetime").innerText = datetimeStr;
    document.getElementById("previewDatetime").innerText = datetimeStr;
}

// 渲染车次表格（可直接点击编辑）
function renderTrainTable() {
    const tbody = document.getElementById("trainTbody");
    tbody.innerHTML = "";

    systemConfig.trains.forEach(train => {
        const tr = document.createElement("tr");
        let statusClass = "status-normal";
        if (train.status === "晚点") statusClass = "status-delay";
        if (train.status === "停运") statusClass = "status-stop";

        tr.innerHTML = `
            <td><input type="text" value="${train.no}" onchange="updateTrain(${train.id}, 'no', this.value)"></td>
            <td><input type="text" value="${train.type}" onchange="updateTrain(${train.id}, 'type', this.value)"></td>
            <td><input type="text" value="${train.start}" onchange="updateTrain(${train.id}, 'start', this.value)"></td>
            <td><input type="text" value="${train.end}" onchange="updateTrain(${train.id}, 'end', this.value)"></td>
            <td><input type="text" value="${train.arriveTime}" onchange="updateTrain(${train.id}, 'arriveTime', this.value)"></td>
            <td><input type="text" value="${train.departTime}" onchange="updateTrain(${train.id}, 'departTime', this.value)"></td>
            <td><input type="text" value="${train.gate}" onchange="updateTrain(${train.id}, 'gate', this.value)"></td>
            <td><input type="text" value="${train.platform}" onchange="updateTrain(${train.id}, 'platform', this.value)"></td>
            <td><input type="text" value="${train.landmark}" onchange="updateTrain(${train.id}, 'landmark', this.value)"></td>
            <td><input type="text" value="${train.direction}" onchange="updateTrain(${train.id}, 'direction', this.value)"></td>
            <td><input type="text" class="${statusClass}" value="${train.status}" onchange="updateTrain(${train.id}, 'status', this.value)"></td>
            <td><input type="text" value="${train.delay}" onchange="updateTrain(${train.id}, 'delay', this.value)"></td>
            <td><input type="text" value="${train.expectedArrive}" onchange="updateTrain(${train.id}, 'expectedArrive', this.value)"></td>
            <td><input type="text" value="${train.expectedDepart}" onchange="updateTrain(${train.id}, 'expectedDepart', this.value)"></td>
        `;
        tbody.appendChild(tr);
    });

    // 同步更新大屏预览
    renderPreviewScreen();
}

// 更新车次信息（表格编辑触发）
function updateTrain(id, field, value) {
    const train = systemConfig.trains.find(t => t.id === id);
    if (train) {
        train[field] = value;
        renderPreviewScreen();
    }
}

// 晚点命令弹窗
function showCommandModal(type) {
    document.getElementById("commandModal").style.display = "flex";
    document.getElementById("commandTitle").innerText = type === "delay" ? "晚点命令" : "停运命令";
    document.getElementById("delayInputContainer").style.display = type === "delay" ? "block" : "none";
    document.getElementById("trainNoInput").value = "";
    document.getElementById("delayMinutesInput").value = "";
}

// 确认晚点/停运命令
function confirmCommand() {
    const trainNo = document.getElementById("trainNoInput").value;
    const delayMinutes = document.getElementById("delayMinutesInput").value;
    const type = document.getElementById("commandTitle").innerText;

    const train = systemConfig.trains.find(t => t.no === trainNo);
    if (!train) {
        alert("未找到该车次");
        return;
    }

    if (type === "晚点命令") {
        train.status = "晚点";
        train.delay = parseInt(delayMinutes);
        // 自动计算预计时间
        if (train.arriveTime) {
            const [h, m] = train.arriveTime.split(":").map(Number);
            const newDate = new Date();
            newDate.setHours(h, m + parseInt(delayMinutes));
            train.expectedArrive = `${String(newDate.getHours()).padStart(2,'0')}:${String(newDate.getMinutes()).padStart(2,'0')}`;
        }
        if (train.departTime) {
            const [h, m] = train.departTime.split(":").map(Number);
            const newDate = new Date();
            newDate.setHours(h, m + parseInt(delayMinutes));
            train.expectedDepart = `${String(newDate.getHours()).padStart(2,'0')}:${String(newDate.getMinutes()).padStart(2,'0')}`;
        }
        alert(`已将车次${trainNo}设置为晚点${delayMinutes}分钟`);
    } else {
        train.status = "停运";
        alert(`已将车次${trainNo}设置为停运`);
    }

    closeModal();
    renderTrainTable();
}

// 查找车次弹窗
function showSearchModal() {
    document.getElementById("searchModal").style.display = "flex";
    document.getElementById("searchKeywordInput").value = "";
}

// 确认查找
function confirmSearch() {
    const keyword = document.getElementById("searchKeywordInput").value;
    if (!keyword) return;

    const filtered = systemConfig.trains.filter(t => 
        t.no.includes(keyword) || t.start.includes(keyword) || t.end.includes(keyword)
    );

    if (filtered.length > 0) {
        alert(`找到${filtered.length}条相关车次，已在表格中高亮显示`);
        // 高亮匹配行
        const rows = document.querySelectorAll("#trainTbody tr");
        rows.forEach((row, index) => {
            const train = systemConfig.trains[index];
            if (train.no.includes(keyword) || train.start.includes(keyword) || train.end.includes(keyword)) {
                row.style.backgroundColor = "#fff3cd";
            } else {
                row.style.backgroundColor = "";
            }
        });
    } else {
        alert("未找到相关车次");
    }

    closeModal();
}

// 刷新屏显
function refreshScreen() {
    renderPreviewScreen();
    alert("屏显已刷新");
}

// 站名配置弹窗
function showConfigModal(type) {
    document.getElementById("configModal").style.display = "flex";
    const titleMap = { station: "站名配置", train: "车次配置", time: "时间配置" };
    document.getElementById("configTitle").innerText = titleMap[type];

    if (type === "station") {
        document.getElementById("configForm").innerHTML = `
            <label>车站名称：</label>
            <input type="text" id="stationNameInput" value="${systemConfig.stationName}">
        `;
    } else if (type === "time") {
        document.getElementById("configForm").innerHTML = `
            <label>时间偏移（分钟）：</label>
            <input type="number" id="timeOffsetInput" value="${systemConfig.timeOffset}">
            <p>正数为调快，负数为调慢</p>
        `;
    } else {
        document.getElementById("configForm").innerHTML = `
            <p>车次配置说明：</p>
            <ul>
                <li>可直接在表格中修改车次信息</li>
                <li>支持导入/导出Excel车次</li>
                <li>晚点车次会自动计算预计时间</li>
            </ul>
        `;
    }
}

// 保存配置
function saveConfig() {
    const title = document.getElementById("configTitle").innerText;
    if (title === "站名配置") {
        systemConfig.stationName = document.getElementById("stationNameInput").value;
        document.getElementById("previewStationName").innerText = `${systemConfig.stationName}欢迎您`;
    } else if (title === "时间配置") {
        systemConfig.timeOffset = parseInt(document.getElementById("timeOffsetInput").value) || 0;
    }
    closeModal();
    alert("配置已保存");
}

// 风格切换
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    systemConfig.theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
}

// 关于
function showAbout() {
    alert("漯河西站铁路旅客候车引导系统 v1.0\n支持Excel导入、手动编辑、大屏预览\n2026");
}

// 退出系统
function exitSystem() {
    if (confirm("确定要退出系统吗？")) {
        window.close();
    }
}

// 大屏预览渲染
function renderPreviewScreen() {
    const tbody = document.getElementById("previewTbody");
    tbody.innerHTML = "";
    document.getElementById("previewStationName").innerText = `${systemConfig.stationName}欢迎您`;

    // 按开点排序车次
    const sortedTrains = [...systemConfig.trains].sort((a, b) => {
        if (!a.departTime) return 1;
        if (!b.departTime) return -1;
        return a.departTime.localeCompare(b.departTime);
    });

    sortedTrains.forEach(train => {
        if (!train.departTime) return;
        const tr = document.createElement("tr");
        let statusText = "正在候车";
        let statusClass = "status-waiting";
        if (train.status === "停运") {
            statusText = "停运";
        } else if (train.status === "晚点") {
            statusText = "晚点";
        } else {
            // 模拟检票状态（开车前15分钟检票）
            const now = new Date();
            const [h, m] = train.departTime.split(":").map(Number);
            const departTime = new Date();
            departTime.setHours(h, m);
            const diff = (departTime - now) / 60000;
            if (diff > 0 && diff <= 15) {
                statusText = "正在检票";
                statusClass = "status-checking";
            }
        }

        tr.innerHTML = `
            <td>${train.no}</td>
            <td>${train.start}</td>
            <td>${train.end}</td>
            <td>${train.departTime}</td>
            <td>${train.gate} / ${train.platform}</td>
            <td class="${statusClass}">${statusText}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 导入Excel功能
function openImportModal() {
    document.getElementById("importModal").style.display = "flex";
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            importedData = XLSX.utils.sheet_to_json(worksheet);
            
            // 显示预览
            const previewDiv = document.getElementById("previewContainer");
            previewDiv.innerHTML = "<table><thead><tr><th>车次</th><th>发站</th><th>到站</th></tr></thead><tbody>";
            importedData.slice(0, 10).forEach(row => {
                previewDiv.innerHTML += `<tr><td>${row.车次 || ''}</td><td>${row.发站 || ''}</td><td>${row.到站 || ''}</td></tr>`;
            });
            previewDiv.innerHTML += "</tbody></table>";
        } catch (error) {
            alert(`解析失败：${error.message}`);
        }
    };
    reader.readAsArrayBuffer(file);
}

function confirmImport() {
    if (importedData.length === 0) {
        alert("请先选择Excel文件");
        return;
    }

    // 转换数据格式
    let newId = Math.max(...systemConfig.trains.map(t => t.id)) + 1;
    importedData.forEach(row => {
        systemConfig.trains.push({
            id: newId++,
            no: row.车次 || '',
            type: row.列车属性 || '过路车',
            start: row.发站 || '',
            end: row.到站 || '',
            arriveTime: row.到点 || '',
            departTime: row.开点 || '',
            gate: row.检票口 || '1',
            platform: row.站台 || '1',
            landmark: row.地标 || '蓝色',
            direction: row.朝向 || '←1 18→',
            status: row.运行情况 || '正点',
            delay: row.运行差时 || 0,
            expectedArrive: row.预计到点 || '',
            expectedDepart: row.预计开点 || ''
        });
    });

    renderTrainTable();
    closeModal();
    alert(`成功导入${importedData.length}条车次数据`);
}

// 导出Excel
function exportToExcel() {
    const exportData = systemConfig.trains.map(t => ({
        "车次": t.no,
        "列车属性": t.type,
        "发站": t.start,
        "到站": t.end,
        "到点": t.arriveTime,
        "开点": t.departTime,
        "检票口": t.gate,
        "站台": t.platform,
        "地标": t.landmark,
        "朝向": t.direction,
        "运行情况": t.status,
        "运行差时": t.delay,
        "预计到点": t.expectedArrive,
        "预计开点": t.expectedDepart
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "漯河西站车次");
    XLSX.writeFile(workbook, "漯河西站车次数据.xlsx");
}

// 大屏预览
function openPreviewScreen() {
    document.getElementById("previewModal").style.display = "flex";
    renderPreviewScreen();
}

function closePreviewModal() {
    document.getElementById("previewModal").style.display = "none";
}

// 关闭弹窗
function closeModal() {
    document.getElementById("commandModal").style.display = "none";
    document.getElementById("searchModal").style.display = "none";
    document.getElementById("configModal").style.display = "none";
    document.getElementById("importModal").style.display = "none";
}

// 初始化
function init() {
    updateDatetime();
    setInterval(updateDatetime, 1000);
    renderTrainTable();
}

window.onload = init;
