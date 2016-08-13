# module-loader

Load modules from the browser. Kind of like require.js, but using
the ES6 module syntax.

## Getting started
Include the module-loader script on your page. It must be placed after all of
your modules for it to work.

Include your own modules on the page, and set their type to `text/module`.
Include regular (non-module) JavaScript as you would normally.

```html
<div id="greeting"></div>
<script src="my_module.js" type="text/module"></script>
<script type="text/module">
import ...;
// ...
export ...;
</script>
<script src="module-loader.js"></script>
```
