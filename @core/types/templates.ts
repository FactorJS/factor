import { ListItem } from "@factor/api"
export interface TemplateConfig {
  name?: string
  slug: string
  value?: string
  component: () => Promise<any>
  fields?: TemplateSetting[]
}

export interface TemplateSetting {
  input?: string
  label?: string
  _id: string
  _default?: string | Record<string, any>[]
  description?: string
  settings?: TemplateSetting[]
  list?: string[] | ListItem[]
}
