// author   denolk
// email    revolter00@gmail.com      

var $ = jQuery;

var bypass9GagNsfw = {

    _baseUrl: 'http://img-9gag-fun.9cache.com/photo/',
    _icon128Url: '',
    _enabled: false,
	_mediaTypeImages:[{mime:'image/gif',ext:'_460sa.gif'}, {mime:'image/png',ext:'_460sa.png'}],			 
	_mediaTypeVideos:[{mime:'video/mp4',ext:'_460sv.mp4'}, {mime:'video/webm',ext:'_460svwm.webm'}],

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
        
        $nsfwLink.parent()
            .css('background-image', 'url(' + bypass9GagNsfw._icon128Url + ')')
            .css('background-repeat', 'no-repeat')
            .css('background-position', '50%')
            .css('min-height', '128px');

		$element = bypass9GagNsfw.createMediaElement(entryId, width);
		
        $nsfwLink.parent().append($element);
        $nsfwLink.parents('article').addClass('bypass9GagNsfw'); // any identifier, will be used later implementations
        $nsfwLink.hide();
    },
	
	
	// todo: treating all media as video, find a way to check the media type before creating element
	createMediaElement: function(entryId, width){	
		var $media = $(document.createElement('video'));
        $media.attr('preload','auto')
			  .attr('autoplay','autoplay')
			  .attr('loop','')
			  .attr('muted','')
			  .css({ 'min-width': width, 'max-width': width, 'width': width, 'height': 'auto' })
			  .addClass('bypass9GagNsfw-media-element');
		
		$navLinks = $(document.createElement('ul'));
		$navLinks.css({'font-size':'10px','color':'#ccc','list-style':'none'});
		
		for(var i=0;i<bypass9GagNsfw._mediaTypeImages.length;i++){
			var url = bypass9GagNsfw._baseUrl + entryId + bypass9GagNsfw._mediaTypeImages[i].ext;
			$media.attr('poster',url);
			$navLinks.append($(document.createElement('li')).append($(document.createElement('a')).attr('target','_blank').attr('href',url).text(url)));
		}
		
		for(var i=0;i<bypass9GagNsfw._mediaTypeVideos.length;i++){
			var url = bypass9GagNsfw._baseUrl + entryId + bypass9GagNsfw._mediaTypeVideos[i].ext;
			$media.append($(document.createElement('source'))
				.attr('src',url)
				.attr('type',bypass9GagNsfw._mediaTypeVideos[i].mime));
				$navLinks.append($(document.createElement('li')).append($(document.createElement('a')).attr('target','_blank').attr('href',url).text(url)));
		}    
        
		return $(document.createElement('div')).append($media).append('<br>').append($navLinks);
	},

    unblockEntryPage: function () {
        var $nsfwLink = $('.badge-nsfw-entry-cover');
        if (!$nsfwLink || $nsfwLink.length == 0) {
            return;
        }
        bypass9GagNsfw.unblockEntry($nsfwLink, '728px');
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