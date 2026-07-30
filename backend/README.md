# 記帳布後端 — Apps Script 設定步驟

後端是一個 **獨立（standalone）的 Google Apps Script Web App**，以你（Fay）的身分執行，
負責把前端送來的花費寫進「當年度記帳本」。程式碼在 [`apps-script/`](./apps-script)。

> 為什麼是獨立專案：記帳本每年換一份新檔案，獨立專案用「名稱/ID」找當年度的本子，
> 不必每年重綁。

## 一、建立專案並貼程式碼

1. 到 [script.google.com](https://script.google.com) → **New project**，命名為 `Pudget Backend`。
2. 把 [`apps-script/Code.gs`](./apps-script/Code.gs) 的內容整個貼進 `Code.gs`（覆蓋預設內容）。
3. 左側 ⚙️ **Project Settings** → 勾選 **「Show "appsscript.json" manifest file in editor」**。
   回到編輯器會多出 `appsscript.json`，用 [`apps-script/appsscript.json`](./apps-script/appsscript.json) 的內容覆蓋它。

## 二、設定通關碼（與可選的記帳本 ID）

**Project Settings → Script Properties → Add script property：**

| Property | Value | 說明 |
|---|---|---|
| `TOKEN` | 自己想一組長字串（例如亂數 24 碼） | **必填**。前端要帶一樣的通關碼才寫得進來。**別存進 repo、別外流。** |
| `BOOK_ID_2026` | 2026 記帳本的試算表 ID | **選填**。設了就免開 Drive 權限；沒設則程式用名稱「2026記帳本」自動找。 |

> 試算表 ID = 網址 `https://docs.google.com/spreadsheets/d/<這一段就是 ID>/edit` 中間那段。
> 每年換新本子時，若你用 `BOOK_ID_YYYY` 就新增一條（如 `BOOK_ID_2027`）；若靠名稱自動找則什麼都不用改。

## 三、部署成 Web App

1. 右上 **Deploy → New deployment**。
2. 齒輪選 **Web app**。
3. **Execute as: Me（你）**、**Who has access: Anyone**。
   （安全性靠 `TOKEN`，不是靠網址保密；沒有通關碼的人寫不進來。）
4. **Deploy** → 第一次會要**授權**：允許存取 Google 試算表（若沒設 `BOOK_ID` 還會要 Drive 權限）。
5. 複製 **Web app URL**（結尾是 `/exec`）。

## 四、驗證

- 直接用瀏覽器打開那個 `/exec` 網址，應回傳：
  `{"ok":true,"service":"pudget", ...}` ← 代表活著。

## 五、給我這兩樣，我把前端接上

- **Web app URL（/exec）**
- **你設的 `TOKEN`**

> 這兩樣會存在你和男友**各自手機的 App 設定裡（localStorage）**，
> **不會進 repo、不會外流**。之後在 App 的齒輪設定頁輸入即可。

---

## 之後改版（更新後端程式碼）

改了 `Code.gs` 後：Apps Script 編輯器貼上新版 → **Deploy → Manage deployments →
編輯現有部署 → Version 選 New version → Deploy**（沿用同一個 `/exec` 網址）。

> 進階：也可以用 [`clasp`](https://github.com/google/clasp) 從這個 repo 直接 push 程式碼，
> 但 `clasp login` 是**全域 Google 登入狀態**（可能與公司帳號衝突），所以預設走「手動貼上」。
> 要用 clasp 再跟我說，我會提醒你注意登入帳號。
