'use strict';

let csvDataArray;   // csvファイルの配列

const fileInput = document.getElementById("file");
fileInput.addEventListener("change", function() {
    const file = fileInput.files[0];

    // CSVファイルの解析
    Papa.parse(file, {
        complete: function(results) {
            // 解析結果はresults.dataに格納されています
            csvDataArray = results.data;
            console.log('CSVデータ配列:', csvDataArray);

            // テーブルを表示
            arrayToTable(csvDataArray);
        }
    });
});

function addData() {
    const data = [];  // 一行を表すデータ
    // csvファイルの管理
    if (!csvDataArray) {
        alert("ファイルをアップロードしてください");
    }

    // HTML要素の取得
    const cd = document.getElementById("cd").value;
    const type = document.getElementById("album").checked ? "アルバム" : "シングル";
    const song = document.getElementById("song").value;
    const artistsCheckboxes = document.querySelectorAll('[name="artist"]:checked');

    // 必須項目の入力チェック
    if (!cd || !song) {
        alert("必須項目を入力してください");
        return;
    }

    // データの追加
    data.push(cd, type, song);
    artistsCheckboxes.forEach(checkbox => data.push(checkbox.value));

    // csvDataArrayにデータを追加
    console.log(data);
    console.log(csvDataArray);
    csvDataArray.push(data);

    // テーブルを表示
    arrayToTable(csvDataArray);
}

function downloadCSV() {
    if (csvDataArray.length === 0) {
        alert("ダウンロードするデータがありません");
        return;
    }

    const csvContent = convertArrayToCSV(csvDataArray);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    if (link.download !== undefined) { // ダウンロード属性がサポートされているか確認
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert("ダウンロード機能がサポートされていません");
    }
}

function convertArrayToCSV(dataArray) {
    const csvRows = [];
    for (const row of dataArray) {
        const csvFields = row.map(value => `"${value}"`);
        csvRows.push(csvFields.join(","));
    }
    return csvRows.join("\n");
}

// jsファイルをダウンロード
function downloadJS() {
    // 配列をオブジェクトに変換
    console.log(csvDataArray);
    const fileValue = convertArrayToObject(csvDataArray);

    // オブジェクトを文字列に変換
    const jsonString = JSON.stringify(fileValue);
    const fileValueStart = "const fakeResults = ";
    const fileValuefinish = ";";
    const fileRender = fileValueStart + jsonString + fileValuefinish;

    const blob = new Blob([fileRender], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'CD_Data.js';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 配列をオブジェクト形式に変換する
function convertArrayToObject(array) {
    console.log(array);
    const header = array[0];
    return array.slice(1).map(row => {
        const obj = {};
        header.forEach((key, index) => {
            obj[key] = row[index];
        });
        return obj;
    });
}

// 配列をテーブルに変換する関数
function arrayToTable(array) {
    const tableContainer = document.getElementById('result');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // ヘッダー行の作成
    const headerRow = document.createElement('tr');
    for (const header of array[0]) {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);

    // データ行の作成
    for (let i = 1; i < array.length; i++) {
        const rowData = array[i];
        const tr = document.createElement('tr');
        for (const data of rowData) {
            const td = document.createElement('td');
            td.textContent = data;
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}