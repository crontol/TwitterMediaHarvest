import select from 'select-dom'

/**
 * MutationObserver
 * @param {String} element DOMSelector
 * @param {MutationCallback} observerCallback
 * @param {Object} options MutationsObserver options
 * @returns {MutationObserver}
 */
export const observeElement = (
  element,
  observerCallback,
  options = { childList: true }
) => {
  const observer = new MutationObserver(observerCallback)
  if (element instanceof HTMLElement) {
    observer.observe(element, options)
  }
  if (typeof element === 'string' && select.exists(element)) {
    observer.observe(select(element), options)
  }
  return observer
}

export default observeElement
