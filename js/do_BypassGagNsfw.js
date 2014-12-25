// author   denolk
// email    revolter00@gmail.com

var $ = jQuery;

var bypass9GagNsfw = {

    _baseUrl: 'http://d24w6bsrhbeh9d.cloudfront.net/photo/',
    _icon128Url: '',
    _enabled: false,

    load: function () {
        console.log('-------- bypass9GagNsfw - load --------');

        bypass9GagNsfw._icon128Url = chrome.extension.getURL('img/icon128.png');

        if (document.location.href.indexOf('/gag/') > -1) {
            bypass9GagNsfw.unblockEntryPage();
            $(document).on('DOMNodeInserted', 'article.bypass9GagNsfw div.post-container', bypass9GagNsfw.onPageNavigation);
        }
        else {
            bypass9GagNsfw.unblockEntryList();
            $(document).on('scroll', bypass9GagNsfw.unblockEntryList);
        }
    },

    unload: function () {
        $(document).off('DOMNodeInserted', 'article.bypass9GagNsfw div.post-container', bypass9GagNsfw.onPageNavigation);
        $(document).off('scroll', bypass9GagNsfw.unblockEntryList);
    },

    onPageNavigation: function (evt) {
        if (evt.target.className) {
            bypass9GagNsfw.unblockEntryPage();
        }
    },

    unblockEntry: function ($nsfwLink, width) {
        var entryId = $nsfwLink.parents('article').attr('data-entry-id');
        var mediaUrl = bypass9GagNsfw._baseUrl + entryId + '_460sa.png';
        $nsfwLink.parent()
            .css('background-image', 'url(' + bypass9GagNsfw._icon128Url + ')')
            .css('background-repeat', 'no-repeat')
            .css('background-position', '50%')
            .css('min-height', '128px');

        // todo: find optimal approach
        // reference: http://jsperf.com/jquery-vs-createelement
        var $img = $(document.createElement('img'));
        $img.attr('src', mediaUrl);
        if (width) {
            $img.css({ 'min-width': width, 'max-width': width, 'width': width, 'height': 'auto' });
        }
        $nsfwLink.parent().append($img);
        $nsfwLink.parents('article').addClass('bypass9GagNsfw'); // any identifier, will be used later implementations
        $nsfwLink.remove();
    },

    unblockEntryPage: function () {
        var $nsfwLink = $('.badge-nsfw-entry-cover');
        if (!$nsfwLink || $nsfwLink.length == 0) {
            return;
        }
        bypass9GagNsfw.unblockEntry($nsfwLink);
    },

    unblockEntryList: function () {
        var $nsfwLinks = $('.badge-evt.badge-nsfw-entry-cover');
        if (!$nsfwLinks || $nsfwLinks.length == 0) {
            return;
        }
        $nsfwLinks.each(function () {
            bypass9GagNsfw.unblockEntry($(this), '486px');
        });
    },

    _denolk: 'bye..'
};

$(document).ready(bypass9GagNsfw.load);