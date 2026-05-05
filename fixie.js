// @ts-check
/*
 * Fixie.js
 *
 * v1.2.0
 *
 * add filler content to empty DOM nodes
 * whenever an element has class="fixie".
 */
var fixie = (function () {
    /** @type {String} */
    let selector;
    /** @type {Array<string>} */
    let dictionary = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    ];
    /** @type {Array<String>} */
    let words = generateWords(dictionary);
    /** @param {Array<String>} dic */
    function generateWords(dic) {
      return dic.join().replace(/[^\w]/g, ' ').trim().replace(/\s\s+/g, ' ').split(' ');
    }

    let imagePlaceHolder = "https://fakeimg.pl/${w}x${h}/?text=${text}";

    const fetchWords = (num = 5)=>{
        let output = ''
        for (let i = 0; i < num; i++) {
            output += words[Math.floor(Math.random() * words.length)] + ' ';
        }
        return output.trim();
    };

    const fetchSentences = (num = 1)=>{
        let output = ''
        for (let i = 0; i < num; i++) {
            output += dictionary[Math.floor(Math.random() * dictionary.length)];
        }
        return formater(output);
    };
    const fetchPhrase = () => `${capitalize(fetchWords(constrain(3,5)))}.`;
    // const fetchSentences = () => fetch(4, 9, fetchWords) + ".";
    const fetchParagraph = () => fetch(1, 1, fetchSentences);
    const fetchParagraphs = () => surroundWithTag(3, 7, fetchParagraph, "p");
    const fetchList = () => surroundWithTag(4, 8, fetchPhrase, "li");
    const fetchDefinitionList = () => {
        let html = "";
        for (let i = 0, l = constrain(3, 5); i < l; i++) {
            html += surroundWithTag(1, 1, fetchPhrase, "dt") + surroundWithTag(1, 1, fetchPhrase, "dd");
        }
        return html;
    };
    /**
     * return a random number between 2 values
     *
     * @param   {Number}  min   minimal value
     * @param   {Number}  max   maximum value
     * @return  {Number}        random number between min and max
     */
    const constrain = (min, max) => Math.round(Math.random() * (max - min) + min);
    /**
     * fetch dictionary using generator functions
     *
     * @param   {Number}    min   minimal value
     * @param   {Number}    max   maximum value
     * @param   {function():string}  func  a text fragment generator function
     * @param   {String}    join  separator for array.join
     * @return  {String}            the generated string
     */
    const fetch = (min, max, func, join = " ") => {
        const length = constrain(min, max);
        return Array.from({ length }, func).join(join);
    };;
    /**
     * surround a text fragment with a tag
     * with min/max
     *
     * @param   {Number}    min   minimal value
     * @param   {Number}    max   maximum value
     * @param   {function():string}  func  a text fragment generator function
     * @param   {String|HTMLElement} tagName a valid html tag name
     * @return  {String}   html element with text fragment
     */
    const surroundWithTag = (min, max, func, tagName) => {
        const content = fetch(min, max, func, `</${tagName}><${tagName}>`);
        return `<${tagName}>${content}</${tagName}>`;
    };;
    /**
     * Transform the first character to uppercase and lower the rest
     * @param {string} string   a text fragment
     * @returns {string}
     */
    const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    /**
     * apply some typographic rules
     * @param {string} string
     * @return  {string}  return a formatted string
     */
    const formater = (string)=>{
        string = string.replace(/(?:\s?)([!\?\:])/gm, '\u202F$1');   // add narrow non-breaking space before ':'
        string = string.replace(/(\.{1}[^\s])/gm, '. ');     // add a space after '.' if not present
        string = string.replace(/(\.{3})/gm, '…');           // change three dots to unicode character
        string = string.replace(/[']/gm, '’');               // Change to simple quote
        string = string.replace(/( {2,})/gm, ' ');           // remove multiple spaces
        return string;
    };
    /**
     * handle all DOM elements
     *
     * @param   {HTMLElement}  element  a DOM element
     *
     */
    function fixie_handler(element) {
        if (!/^\s*$/.test(element.innerHTML)) {
            Array.from(element.children).forEach(fixie_handler);
            return false;
        }
        /**
         * @typedef {(el: HTMLElement) => string|void} HandlerFn
         * @type {Record<string, HandlerFn>}
         */
        const handlers = {
            b: () => fetchWords(),
            em: () => fetchWords(),
            strong: () => fetchWords(),
            button: () => fetchWords(),
            label: () => fetchWords(),
            th: () => fetchWords(),
            td: () => fetchWords(),
            title: () => fetchWords(),
            tr: () => fetchWords(),
            header: () => fetchPhrase(),
            cite: () => fetchPhrase(),
            caption: () => fetchPhrase(),
            mark: () => fetchPhrase(),
            q: () => fetchPhrase(),
            s: () => fetchPhrase(),
            u: () => fetchPhrase(),
            small: () => fetchPhrase(),
            code: () => fetchPhrase(),
            pre: () => fetchPhrase(),
            li: () => fetchPhrase(),
            dt: () => fetchPhrase(),
            h1: () => fetchPhrase(),
            h2: () => fetchPhrase(),
            h3: () => fetchPhrase(),
            h4: () => fetchPhrase(),
            h5: () => fetchPhrase(),
            h6: () => fetchPhrase(),
            footer: () => fetchParagraph(),
            aside: () => fetchParagraph(),
            summary: () => fetchParagraph(),
            blockquote: () => fetchParagraph(),
            p: () => fetchParagraph(),
            article: () => fetchParagraphs(),
            section: () => fetchParagraphs(),
            /** @param {HTMLLinkElement} el  */
            a: (el) => {
              el.href = el.getAttribute("href") || el.href || "#";
              return `www.${fetchWords(3).replace(/\s/g,'')}.com`;
            },
            /** @param {HTMLImageElement} el  */
            img: (el) => {
                const src = el.getAttribute("src") || el.src || "";
                const temp = el.getAttribute("fixie-temp-img") === "true";
                if (!src || temp) {
                    const width = Number(el.getAttribute("width")) || el.width || 250;
                    const height = Number(el.getAttribute("height")) || el.height || 100;
                    // const title = el.getAttribute("title") || "";
                    el.src = imagePlaceHolder.replace("${w}", `${width}`).replace("${h}", `${height}`);
                    el.setAttribute("fixie-temp-img", 'true');

                }
            },
            ol: () => fetchList(),
            ul: () => fetchList(),
            dl: () => fetchDefinitionList(),
            hr: () => '',
            div: () => '',
            input: () => '',
            /** @param {HTMLSpanElement} el  */
            span: (el) => {
                return  (!/(icn+|icon+)/.test(el.className))? fetchSentences() : '';
            },
            /** @param {HTMLElement} el  */
            i: (el) => {
              return  (!/(icn+|icon+)/.test(el.className))? fetchSentences() : '';
            }
        };
        const handler = handlers[element.nodeName.toLowerCase()] || (() => fetchSentences());
        const result = handler(element) || '';
        if (typeof result !== "undefined") {
          element.innerHTML = result;
        }
    }
    /** @param {NodeListOf<HTMLElement>} elements */
    function fixie_handle_elements(elements) {
        for (const element of elements) {
          fixie_handler(element);
        }
    }
    /** @param {string} cssSelectors   */
    function init_str(cssSelectors) {
        try {
            /** @type {NodeListOf<HTMLElement>}*/
            const elements = document.querySelectorAll(cssSelectors);
            fixie_handle_elements(elements);
            return true;
        } catch (err) {
            console.log('fixie', err);
            return false;
        }
    }

    return {
        init() {
            if (selector) {
                return init_str(selector);
            }
            fixie_handle_elements(document.querySelectorAll(".fixie"));
        },
        /** @param {String} placeholderTemplate placeholder service template url use template literals ${w},${h},${t} accordingly to replcae width,height and text  */
        setImagePlaceholder(placeholderTemplate) {
            imagePlaceHolder = placeholderTemplate;
            return this;
        },
        /** @param {Array<String>|string} sl a selectors list (array or string accepted) */
        setSelector(sl) {
            selector = Array.isArray(sl) ? sl.join(",") : sl;
            return this;
        },
        /** @param {Array<String>} dic array of sentences */
        setWordLibrary(dic) {
            dictionary = dic;
            words = generateWords(dictionary);
            return this;
        }
    };
})();