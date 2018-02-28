/**
 * CSS related helper functions.
 */
export class CSS {

    /**
     * Inlines CSS styles. 
     * Useful for exporting or printing SVG.
     * {@link https://gist.github.com/devinus/415179}
     */
    static inline() {
        let rules = document.styleSheets[document.styleSheets.length-1].cssRules;
        
        for (let idx = 0; idx < rules.length; idx++) {
            let rule = rules[idx],
            nodes    = document.querySelectorAll(rule.selectorText);

            for (let i = 0; i < nodes.length; i++) {
                nodes[i].style.cssText += rule.style.cssText;
            }
        }
    }
}