/**
 * 記帳布 Pudget — 後端（Google Apps Script Web App）
 *
 * 職責：接收前端 POST 的一筆花費，寫進「當年度記帳本」對應月份的流水帳；
 *       共用錢包付款時，另外在「蛙太收支簿」記一列支出；需先結清則把該列文字設為紅色。
 * 以「部署者本人（Fay）」身分執行 → 具備寫入 Sheet 的權限；前端只需通關碼。
 *
 * 設定（Apps Script 專案 → 專案設定 → 指令碼屬性）：
 *   TOKEN           必填。前端要帶一樣的通關碼才寫得進來。
 *   BOOK_ID_2026    選填。指定該年度記帳本的試算表 ID（設了就不必開 Drive 權限）。
 *                   沒設的話，程式會用 DriveApp 依名稱「{年}記帳本」自動尋找。
 *
 * 前端呼叫務必用 Content-Type: text/plain（避免 CORS preflight；Apps Script 會 302
 * 轉到 googleusercontent 並帶 Access-Control-Allow-Origin，瀏覽器才讀得到回應）。
 */

var CONFIG = {
  WALLET_SHEET: '蛙太收支簿',
  RED: '#FF0000', // 需先結清的紅字色（可自行調整）
  bookName: function (year) { return year + '記帳本'; },
};

function doGet() {
  return json({ ok: true, service: 'pudget', ts: new Date().toISOString() });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return json({ ok: false, error: 'busy' });
  }
  try {
    var body;
    try {
      body = JSON.parse(e.postData.contents);
    } catch (err) {
      return json({ ok: false, error: 'bad_json' });
    }

    var token = PropertiesService.getScriptProperties().getProperty('TOKEN');
    if (!token || body.token !== token) {
      return json({ ok: false, error: 'invalid_token' });
    }

    if (!body.date || !body.category || !body.item || body.amount == null || !body.payer) {
      return json({ ok: false, error: 'bad_request' });
    }
    var parts = String(body.date).split('-');
    var y = Number(parts[0]), m = Number(parts[1]), d = Number(parts[2]);
    if (!y || !m || !d) return json({ ok: false, error: 'bad_date' });

    var ss = openBook(y);
    if (!ss) return json({ ok: false, error: 'book_not_found', message: CONFIG.bookName(y) });

    var monthName = m + '月';
    var sheet = ss.getSheetByName(monthName);
    if (!sheet) return json({ ok: false, error: 'month_not_found', message: monthName });

    // 冪等：同一個 client id 已寫過就當成功（避免離線補傳重複寫入）
    if (body.id && hasId(sheet, body.id)) {
      return json({ ok: true, duplicate: true, id: body.id });
    }

    var rowIndex = sheet.getLastRow() + 1;
    var dateStr = m + '/' + d;
    var note = [body.note, '此帳目由小布登記'].filter(function (x) { return x; }).join(' ｜ ');
    var meta = JSON.stringify({
      id: body.id || '',
      source: 'app',
      ts: new Date().toISOString(),
    });

    // B..H：日期、類別、項目、金額、付款人、備註、(H)中繼資料
    sheet.getRange(rowIndex, 2, 1, 7).setValues([[
      dateStr, body.category, body.item, Number(body.amount), body.payer, note, meta,
    ]]);

    // 需先結清 → B..G 設紅字
    if (body.settleFirst) {
      sheet.getRange(rowIndex, 2, 1, 6).setFontColor(CONFIG.RED);
    }

    // 共用錢包 → 蛙太收支簿 記一列支出
    var walletRow = null;
    if (body.payer === '共用錢包') {
      walletRow = appendWallet(ss, dateStr, body.item, Number(body.amount));
    }

    return json({ ok: true, id: body.id, month: monthName, row: rowIndex, walletRow: walletRow });
  } catch (err) {
    return json({ ok: false, error: 'server_error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** 開啟當年度記帳本：優先用指定 ID，否則依名稱自動找 */
function openBook(year) {
  var props = PropertiesService.getScriptProperties();
  var explicit = props.getProperty('BOOK_ID_' + year);
  if (explicit) {
    try { return SpreadsheetApp.openById(explicit); } catch (err) { /* fall through */ }
  }
  var files = DriveApp.getFilesByName(CONFIG.bookName(year));
  if (files.hasNext()) return SpreadsheetApp.open(files.next());
  return null;
}

/** 檢查 H 欄是否已含此 client id */
function hasId(sheet, id) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var vals = sheet.getRange(2, 8, last - 1, 1).getValues();
  for (var i = 0; i < vals.length; i++) {
    if (vals[i][0] && String(vals[i][0]).indexOf(id) !== -1) return true;
  }
  return false;
}

/** 找蛙太收支簿分頁（分頁名可能含 emoji 前綴，如「🐸 蛙太收支簿」，用包含比對） */
function findWalletSheet(ss) {
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getName().indexOf(CONFIG.WALLET_SHEET) !== -1) return sheets[i];
  }
  return null;
}

/** 蛙太收支簿：B=日期 C=項目 D=收入 E=支出 F=餘額(公式) */
function appendWallet(ss, dateStr, item, amount) {
  var sheet = findWalletSheet(ss);
  if (!sheet) return null;
  var row = sheet.getLastRow() + 1;
  sheet.getRange(row, 2, 1, 4).setValues([[dateStr, item, '', amount]]);
  sheet.getRange(row, 6).setFormula('=F' + (row - 1) + '+D' + row + '-E' + row);
  return row;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
