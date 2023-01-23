export const imagerror = {
  inserted(el, binding) {
    el.onerror = () => {
      el.src = binding.value
    }
  }
}
