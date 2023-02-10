
export const imagerror = {
  inserted(el, binding) {
    el.src = el.src || binding.value
    el.onerror = () => {
      el.src = binding.value
      // http://q6cu3t6jv.bkt.clouddn.com/1063705989926227968?t=1582797590950
    }
  },
  componentUpdated(el, binding) {
    el.src = el.src || binding.value
  }
}
