/**
 * Standard list format
 */

import { Ref } from "vue"

export interface MenuListItem extends ListItem {
  selected?: boolean
  action?: "navigate" | "callback" | string
  icon?: string
  callback?: (value: string) => any
}
export type ListItem = {
  name?: string
  value?: string
  desc?: string
  selected?: boolean
  [key: string]: unknown
}

/**
 * Object with a priority key for sorting
 */
export interface PriorityItem {
  priority?: number
  [key: string]: any
}

export type RawListItem = ListItem | string

export declare interface MenuItem {
  key?: string
  name: string
  icon?: string
  route?: Ref<string>
  url?: Ref<string>
  active?: Ref<boolean>
  onClick?: (item: MenuItem) => void
  priority?: number
}

export type ActionItem = MenuItem & {
  btn?:
    | "default"
    | "red"
    | "slate"
    | "slateOutline"
    | "primary"
    | "primaryOutline"
    | "green"
    | "blue"
    | "whiteOutline"
    | string
  size?: "sm" | "lg" | "md" | "xl" | string
}

export interface MenuGroup {
  groupName?: string
  menu: MenuItem[]
}

export type InArray<T extends Array<any>> = T extends (infer U)[] ? U : never
