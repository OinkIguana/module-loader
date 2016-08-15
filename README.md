# module-loader

Load modules from the browser using the ES2015 standard. 

## Getting started
Include the module-loader script on your page. It must be placed after all of
your modules for it to work.

Include your own modules on the page, and set their type to `module`.
Include regular (non-module) JavaScript as you would normally.

```html
<div id="greeting"></div>
<script src="my_module.js" type="module" id="external-module"></script>
<script type="module" id="inline-module">
import ...;
// ...
export ...;
</script>
<script src="module-loader.js"></script>
```

Exports from an entry module are added to the `window.moduleLoader` object,
listed under the id of the element (i.e. `window.moduleLoader['inline-module']`)
