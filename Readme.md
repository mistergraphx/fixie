# Fixie

Fill empty HTML elements with realistic placeholder content, based on their tag: headings get a short phrase, paragraphs get sentences, lists get items, images get a sized placeholder. Write your markup, call `fixie.init()`, and see your layout with content in it.

No dependencies, one file, plain JavaScript.

> Based on [fixie](https://github.com/ryhan/fixie) by Ryhan Hassan (2012), rewritten and maintained since. This version adds a custom dictionary, custom image placeholders, CSS selectors, typographic rules and a modern JavaScript codebase.

## Quick start

```html
<article class="fixie">
  <h1></h1>
  <p></p>
  <img width="800" height="450" alt="">
  <ul></ul>
</article>

<script src="fixie.js"></script>
<script>
  fixie.init();
</script>
```

Every empty element inside `.fixie` gets content. Elements that already have content are left untouched, but their empty children are filled:

```html
<p class="fixie">Hello <a></a></p>
<!-- "Hello" stays, the link gets a fake URL as its text -->
```

Open `sample.html` to see it in action.

## What each element gets

| Elements | Content |
|---|---|
| `h1`–`h6`, `li`, `dt`, `header`, `cite`, `caption`, `mark`, `q`, `small`, `code`, `pre` | A short phrase |
| `b`, `strong`, `em`, `button`, `label`, `th`, `td`, `title` | A few words |
| `p`, `blockquote`, `aside`, `footer`, `summary` | A paragraph |
| `article`, `section` | Several paragraphs |
| `ul`, `ol` | 4 to 8 list items |
| `dl` | 3 to 5 term / definition pairs |
| `a` | A fake domain name as text; `href="#"` if it has none |
| `img` (without `src`) | An SVG placeholder showing its size, or its `title` |
| `span`, `i` | Sentences, except icons (see below) |
| `div`, `hr`, `input` | Nothing |

Icons are left alone: a `span` or `i` whose class contains `icn` or `icon` stays empty.

## Options

All setters can be chained before `init()`.

### Target other elements

```javascript
fixie.setSelector('.lorem').init();
fixie.setSelector(['.card p', '#sidebar li']).init();

// every empty element on the page
fixie.setSelector(':empty').init();
```

### Use your own text

Pass an array of sentences. Words for short content are picked from them too, so the language of your filler matches your project:

```javascript
fixie.setWordLibrary([
  "To be, or not to be: that is the question.",
  "Brevity is the soul of wit.",
  "There is nothing either good or bad, but thinking makes it so."
]).init();
```

### Change the image placeholder

The default is an inline SVG, so it works offline. Its background follows the `--placeholder-bg` CSS custom property. To use an image service instead, pass a URL template with `${w}`, `${h}` and `${text}`:

```javascript
fixie.setImagePlaceholder('https://fakeimg.pl/${w}x${h}/?text=${text}').init();
```

Width and height come from the `width` and `height` attributes (250×100 by default).

## Typography

Generated text follows a few typographic rules: a narrow no-break space before `!`, `?` and `:` (French style), a space after each full stop, `…` instead of three dots, and typographic apostrophes.

## Tip: spot leftover filler

Before going live, highlight what is still placeholder content:

```css
.fixie { outline: 4px solid red; }
```

## Credits and license

Fixie was created by [Ryhan Hassan](https://github.com/ryhan/fixie) in 2012, with contributions from Andreas Köberle, Zach Ahn, Brandon Kase and others. This version is maintained by [Arnaud Bérard](https://github.com/mistergraphx).

MIT License, see [LICENSE](LICENSE).
