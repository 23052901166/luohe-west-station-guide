// 大屏预览渲染（匹配真实双栏大屏）
function renderPreviewScreen() {
    // 清空左右两列
    document.getElementById("previewTbody").innerHTML = "";
    document.getElementById("previewStationName").innerText = systemConfig.stationName;
    
    // 按开点排序车次
    const sortedTrains = [...systemConfig.trains].sort((a, b) => {
        if (!a.departTime) return 1;
        if (!b.departTime) return -1;
        return a.departTime.localeCompare(b.departTime);
    });

    // 拆分车次为左右两列（模拟真实大屏）
    const leftTrains = sortedTrains.filter((_, index) => index % 2 === 0);
    const rightTrains = sortedTrains.filter((_, index) => index % 2 === 1);

    // 生成左侧车次HTML
    let leftHtml = "";
    leftTrains.forEach(train => {
        if (!train.departTime) return;
        let statusText = "正在候车";
        let statusClass = "status-waiting";
        
        if (train.status === "停运") {
            statusText = "停运";
            statusClass = "status-stop";
        } else if (train.status === "晚点") {
            statusText = "晚点";
            statusClass = "status-delay";
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

        leftHtml += `
            <tr>
                <td>${train.no}</td>
                <td>${train.start}</td>
                <td>${train.end}</td>
                <td>${train.departTime}</td>
                <td>${train.platform}</td>
                <td class="${statusClass}">${statusText}</td>
            </tr>
        `;
    });

    // 生成右侧车次HTML
    let rightHtml = "";
    rightTrains.forEach(train => {
        if (!train.departTime) return;
        let statusText = "正在候车";
        let statusClass = "status-waiting";
        
        if (train.status === "停运") {
            statusText = "停运";
            statusClass = "status-stop";
        } else if (train.status === "晚点") {
            statusText = "晚点";
            statusClass = "status-delay";
        } else {
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

        rightHtml += `
            <tr>
                <td>${train.no}</td>
                <td>${train.start}</td>
                <td>${train.end}</td>
                <td>${train.departTime}</td>
                <td>${train.platform}</td>
                <td class="${statusClass}">${statusText}</td>
            </tr>
        `;
    });

    // 拼接双栏结构
    const fullHtml = `
        <div class="trains-wrapper">
            <div class="train-column">
                <div class="train-table scroll-container">
                    <table>
                        <thead>
                            <tr>
                                <th>车次</th>
                                <th>始发站</th>
                                <th>终到站</th>
                                <th>开点</th>
                                <th>站台</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>${leftHtml}</tbody>
                    </table>
                </div>
            </div>
            <div class="train-column">
                <div class="train-table scroll-container">
                    <table>
                        <thead>
                            <tr>
                                <th>车次</th>
                                <th>始发站</th>
                                <th>终到站</th>
                                <th>开点</th>
                                <th>站台</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>${rightHtml}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    document.getElementById("previewTbody").parentNode.innerHTML = fullHtml;
}
