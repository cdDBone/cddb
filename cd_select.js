'use strict';

let fakeResults = [];

function search() {
    console.log(fakeResults);
    const artistsInput = document.getElementById('artists').value;
    const artists = artistsInput.split(',').map(artist => artist.trim());
    const cd = document.getElementById('cd').value;
    const song = document.getElementById('song').value;
    const type = document.getElementById('type').value;

    // 仮の結果表示
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    // テーブル作成
    const table = document.createElement('table');
    const headerRow = table.createTHead().insertRow();
    ['CD', 'Type', 'Artists', 'Song'].forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    const filteredResults = fakeResults.filter(entry => {
        const includesArtists = artists[0] ? artists.every(artist => entry.artists.includes(artist)) : true;
        const includesSong = song ? entry.song.toLowerCase().includes(song.toLowerCase()) : true;
        const includesCd = cd ? entry.cd.toLowerCase().includes(cd.toLowerCase()) : true;
        const includesType = type ? entry.type === type : true;
        return includesArtists && includesSong && includesCd && includesType;
      });

    filteredResults.forEach(entry => {

        // テーブル行の作成
        const tr = table.insertRow();
        ["cd", "type", "artists", "song"].forEach(key => {
        const cell = tr.insertCell();
        cell.textContent = Array.isArray(entry[key]) ? entry[key].join(', ') : entry[key];
  });
});

resultsContainer.appendChild(table);
}

let csvDataArray;   // csvファイルの配列

const fileUp = document.getElementById("fileUpload");
const fileBtn = document.getElementById("fileUploadButton");

fileBtn.addEventListener("click", function() {
  // ファイル入力要素をクリックする
  fileUp.click();
});

const fileInput = document.getElementById("fileUpload");
fileInput.addEventListener("change", function() {
    const file = fileInput.files[0];
    console.log(file);

    // CSVファイルの解析
    Papa.parse(file, {
        complete: function(results) {
            // 解析結果はresults.dataに格納されています
            csvDataArray = results.data;
            console.log('CSVデータ配列:', csvDataArray);

            downloadJS();
        }
    });
});
  


// js形式に変換
function downloadJS() {
  // 配列をオブジェクトに変換
  console.log(csvDataArray);
  const fileValue = convertArrayToObject(csvDataArray);
  console.log(fileValue)

  // オブジェクトを適用
  fakeResults = fileValue;
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
/**
 * CD名
    シングルかアルバムか
    曲名
    歌ってる人
 */