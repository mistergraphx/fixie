/*
 * Fixie.js
 *
 * v1.2.0
 *
 * forked from https://github.com/ryhan/fixie
 * original Author Ryhan Hassan
 * ryhanh@me.com
 *
 * Automagically adds filler content
 * whenever an element has class="fixie".
 * Hope you find it useful :)
 */
var fixie = (function () {
    let selector;
    let fixie_wordlibrary = ["8-bit", "ethical", "reprehenderit", "delectus", "non", "latte", "fixie", "mollit", "authentic", "1982", "moon", "helvetica", "dreamcatcher", "esse", "vinyl", "nulla", "Carles", "bushwick", "bronson", "clothesline", "fin", "frado", "jug", "kale", "organic", "local", "fresh", "tassel", "liberal", "art", "the", "of", "bennie", "chowder", "daisy", "gluten", "hog", "capitalism", "is", "vegan", "ut", "farm-to-table", "etsy", "incididunt", "sunt", "twee", "yr", "before", "gentrify", "whatever", "wes", "Anderson", "chillwave", "dubstep", "sriracha", "voluptate", "pour-over", "esse", "trust-fund", "Pinterest", "Instagram", "DSLR", "vintage", "dumpster", "totally", "selvage", "gluten-free", "brooklyn", "placeat", "delectus", "sint", "magna", "brony", "pony", "party", "beer", "shot", "narwhal", "salvia", "letterpress", "art", "party", "street-art", "seitan", "anime", "wayfarers", "non-ethical", "viral", "iphone", "anim", "polaroid", "gastropub", "city", "classy", "original", "brew"];
    let imagePlaceHolder = "https://fakeimg.pl/${w}x${h}/?text=${text}";

    const fetchWord = () => fixie_wordlibrary[constrain(0, fixie_wordlibrary.length - 1)];
    const fetchPhrase = () => fetch(3, 5, fetchWord);
    const fetchSentence = () => fetch(4, 9, fetchWord) + ".";
    const fetchParagraph = () => fetch(3, 7, fetchSentence);
    const fetchParagraphs = () => surroundWithTag(3, 7, fetchParagraph, "p");
    const fetchList = () => surroundWithTag(4, 8, fetchPhrase, "li");
    const fetchDefinitionList = () => {
        let html = "";
        for (let i = 0, l = constrain(3, 5); i < l; i++) {
            html += surroundWithTag(1, 1, fetchPhrase, "dt") + surroundWithTag(1, 1, fetchPhrase, "dd");
        }
        return html;
    };

    const constrain = (min, max) => Math.round(Math.random() * (max - min) + min);

    const fetch = (min, max, func, join = " ") => {
        const length = constrain(min, max);
        const result = Array.from({ length }, func).join(join);
        return capitalize(result);
    };

    const surroundWithTag = (min, max, func, tagName) => {
        const content = fetch(min, max, func, `</${tagName}><${tagName}>`);
        return `<${tagName}>${content}</${tagName}>`;
    };

    const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

    function fixie_handler(element) {
        if (!/^\s*$/.test(element.innerHTML)) {
            Array.from(element.children).forEach(fixie_handler);
            return;
        }

        const handlers = {
            b: fetchWord,
            em: fetchWord,
            strong: fetchWord,
            button: fetchWord,
            label: fetchWord,
            th: fetchWord,
            td: fetchWord,
            title: fetchWord,
            tr: fetchWord,
            header: fetchPhrase,
            cite: fetchPhrase,
            caption: fetchPhrase,
            mark: fetchPhrase,
            q: fetchPhrase,
            s: fetchPhrase,
            u: fetchPhrase,
            small: fetchPhrase,
            code: fetchPhrase,
            pre: fetchPhrase,
            li: fetchPhrase,
            dt: fetchPhrase,
            h1: fetchPhrase,
            h2: fetchPhrase,
            h3: fetchPhrase,
            h4: fetchPhrase,
            h5: fetchPhrase,
            h6: fetchPhrase,
            footer: fetchParagraph,
            aside: fetchParagraph,
            summary: fetchParagraph,
            blockquote: fetchParagraph,
            p: fetchParagraph,
            article: fetchParagraphs,
            section: fetchParagraphs,
            a: (el) => {
                const href = el.getAttribute("href") || el.href || "#";
                el.href = href;
                return el.innerHTML = `www.${fetchWord()}${capitalize(fetchWord())}.com`;

            },
            img: (el) => {
                const src = el.getAttribute("src") || el.src || "";
                const temp = el.getAttribute("fixie-temp-img") === "true";
                if (!src || temp) {
                    const width = el.getAttribute("width") || el.width || 250;
                    const height = el.getAttribute("height") || el.height || 100;
                    const title = el.getAttribute("title") || "";
                    el.src = imagePlaceHolder.replace("${w}", width).replace("${h}", height).replace("${text}", title);
                    el.setAttribute("fixie-temp-img", true);
                }
            },
            ol: fetchList,
            ul: fetchList,
            dl: fetchDefinitionList,
            hr: ()=> '',
            div: ()=>'',
            input: ()=>'',
            span: (el) => {
                return  (!/(icn+|icon+)/.test(el.className))? fetchSentence() : ''
            },
            i: (el) => {
                return  (!/(icn+|icon+)/.test(el.className))? fetchSentence() : ''
            }
        };

        const handler = handlers[element.nodeName.toLowerCase()] || fetchSentence;
        element.innerHTML = handler(element);
    }

    function fixie_handle_elements(elements) {
        for (const element of elements) {
            fixie_handler(element)
        }
    }

    function init_str(selector_str) {
        try {
            const elements = document.querySelectorAll(selector_str);
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
            fixie_handle_elements(document.getElementsByClassName("fixie"));
        },
        setImagePlaceholder(pl) {
            imagePlaceHolder = pl;
            return this;
        },
        setSelector(sl) {
            selector = Array.isArray(sl) ? sl.join(",") : sl;
            return this;
        },
        setWordLibrary(dic) {
            fixie_wordlibrary = dic;
            return this;
        }
    };
})();