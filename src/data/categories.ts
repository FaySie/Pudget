import {
  IconHome,
  IconBolt,
  IconLamp,
  IconCookie,
  IconShoppingBag,
  IconDeviceTvOld,
  IconShirt,
  IconMotorbike,
  IconPills,
  IconLuggage,
  IconDeviceGamepad2,
  IconDots,
  type Icon as TablerIcon,
} from '@tabler/icons-react'

export interface Category {
  label: string
  Icon: TablerIcon
}

/** 12 類別，順序與 icon 對齊 Fay 在 Figma 調整後的版本 */
export const CATEGORIES: Category[] = [
  { label: '房租', Icon: IconHome },
  { label: '水電瓦斯', Icon: IconBolt },
  { label: '家具擺飾', Icon: IconLamp },
  { label: '飲食', Icon: IconCookie },
  { label: '民生用品', Icon: IconShoppingBag },
  { label: '電器產品', Icon: IconDeviceTvOld },
  { label: '鞋帽服飾', Icon: IconShirt },
  { label: '交通', Icon: IconMotorbike },
  { label: '醫療保健', Icon: IconPills },
  { label: '住宿', Icon: IconLuggage },
  { label: '遊戲', Icon: IconDeviceGamepad2 },
  { label: '其他', Icon: IconDots },
]
