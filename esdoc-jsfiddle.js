/**
 * Replace all '<div class="fiddleEmbed">[jsfiddle-url]</div>'
 * with '<script async src="[jsfiddle-url"></script>'
 */
module.exports = function transform({ $, config, options, fileName, is }) {   
    $('.fiddleEmbed').each(function (i, el) {
        const url = $(this).text();
        $(this).html(`<script async src="https:${url}"></script>`);
    });
};