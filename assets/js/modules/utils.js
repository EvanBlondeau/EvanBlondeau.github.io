/**
 * Utilitaires JS
 * ------------------------------------------------------------------
 * Contient des fonctions d'aide génériques pour la manipulation du DOM.
 * Ces fonctions sont utilisées par les autres modules pour simplifier le code.
 */

/**
 * Sélectionne un ou plusieurs éléments du DOM.
 * @param {string} el - Le sélecteur CSS de l'élément à sélectionner.
 * @param {boolean} all - Si true, retourne tous les éléments correspondants (NodeList), sinon le premier (Element).
 * @returns {Element|Element[]} L'élément ou la liste d'éléments trouvés.
 */
export const select = (el, all = false) => {
  el = el.trim()
  if (all) {
    return [...document.querySelectorAll(el)]
  } else {
    return document.querySelector(el)
  }
}

/**
 * Ajoute un écouteur d'événement à un ou plusieurs éléments.
 * @param {string} type - Le type d'événement (ex: 'click', 'scroll').
 * @param {string} el - Le sélecteur CSS de l'élément cible.
 * @param {function} listener - La fonction de rappel à exécuter.
 * @param {boolean} all - Si true, attache l'écouteur à tous les éléments correspondants.
 */
export const on = (type, el, listener, all = false) => {
  let selectEl = select(el, all)
  if (selectEl) {
    if (all) {
      selectEl.forEach(e => e.addEventListener(type, listener))
    } else {
      selectEl.addEventListener(type, listener)
    }
  }
}

/**
 * Ajoute un écouteur d'événement 'scroll' à un élément.
 * @param {Element} el - L'élément cible (souvent document ou window).
 * @param {function} listener - La fonction de rappel à exécuter lors du défilement.
 */
export const onscroll = (el, listener) => {
  el.addEventListener('scroll', listener)
}
