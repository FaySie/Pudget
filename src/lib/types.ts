export type Payer = '毛毛' | '馥仔' | '共用錢包'
export type Me = '毛毛' | '馥仔'

export interface DraftEntry {
  /** 本地日期 yyyy-mm-dd（決定寫進哪個月的分頁） */
  date: string
  category: string
  item: string
  /** 使用者輸入字串，送出時轉數字 */
  amount: string
  payer: Payer
  note: string
  /** 需先結清（代墊）→ 在 Sheet 標紅字 */
  settleFirst: boolean
}
