import { addFilter, setting } from "@factor/tools"
import "./directives"

export const factorError404 = setting("app.components.error404")
export const factorContent = setting("app.components.content")
export const factorSite = setting("app.components.site")

export const factorLink = setting("core.components.link")
export const factorBtn = setting("core.components.btn")
export const factorBtnBase = setting("core.components.btnBase")
export const factorBtnDashboard = setting("core.components.btnDashboard")
export const factorModal = setting("core.components.modalApp")
export const factorModalDashboard = setting("core.components.modal")
export const factorLoadingRing = setting("core.components.loadingRing")
export const factorMenu = () => import("./el/menu.vue")
export const factorIcon = () => import("./el/icon.vue")
export const factorAvatar = () => import("./el/avatar.vue")
export const factorLightbox = setting("core.components.lightbox")

export const factorForm = () => import("./form/form.vue")
export const factorInputWrap = () => import("./form/wrap-input.vue")
export const factorInputEmail = () => import("./form/email.vue")
export const factorInputDate = () => import("./form/date.vue")
export const factorInputPassword = () => import("./form/password.vue")
export const factorInputText = () => import("./form/text.vue")
export const factorInputTextarea = () => import("./form/textarea.vue")
export const factorInputPhone = () => import("./form/phone.vue")
export const factorInputCheckbox = () => import("./form/checkbox.vue")
export const factorInputBirthday = () => import("./form/birthday.vue")
export const factorInputImageUpload = () => import("./form/image-upload.vue")
export const factorInputSelect = () => import("./form/select.vue")
export const factorInputSubmit = () => import("./form/submit.vue")

addFilter("components", __ => {
  // Forms / Inputs
  // __["factor-form"] = () => import("./form/form.vue")
  // __["factor-input-wrap"] = () => import("./form/wrap-input.vue")
  // __["factor-input-email"] = () => import("./form/email.vue")
  // __["factor-input-date"] = () => import("./form/date.vue")
  // __["factor-input-password"] = () => import("./form/password.vue")
  // __["factor-input-text"] = () => import("./form/text.vue")
  // __["factor-input-textarea"] = () => import("./form/textarea.vue")
  // __["factor-input-phone"] = () => import("./form/phone.vue")
  // __["factor-input-checkbox"] = () => import("./form/checkbox.vue")
  // __["factor-input-birthday"] = () => import("./form/birthday.vue")
  // __["factor-input-image-upload"] = () => import("./form/image-upload.vue")
  // __["factor-input-select"] = () => import("./form/select.vue")
  // __["factor-input-submit"] = () => import("./form/submit.vue")

  // UI
  //__["factor-btn"] = setting("core.components.btn")
  //__["factor-btn-base"] = setting("core.components.btnBase")
  //__["factor-btn-dashboard"] = setting("core.components.btnDashboard")
  // __["factor-modal"] = setting("core.components.modalApp")
  // __["factor-modal-dashboard"] = setting("core.components.modal")
  //__["factor-loading-ring"] = setting("core.components.loadingRing")
  //__["factor-lightbox"] = setting("core.components.lightbox")
  //__["factor-link"] = setting("core.components.link")
  // __["factor-avatar"] = () => import("./el/avatar.vue")
  // __["factor-menu"] = () => import("./el/menu.vue")
  // __["factor-icon"] = () => import("./el/icon.vue")

  return __
})
