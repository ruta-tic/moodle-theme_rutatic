define(['jquery'], function($) {
  'use strict';

    return {
        init: function() {

            $('.banner-top').parents('.no-overflow').removeClass('no-overflow');

            var fn_effect = function () {
                var $this = $(this);
                var $parents = $this.parents('.box_resources');

                if ($parents.length == 0) {
                    return;
                }

                var $parent = $($parents[0]);

                $parent.find('.selected').removeClass('selected');
                $parent.find('[data-rel]').hide();
                $parent.find('[data-rel="' + $this.attr('data-type') + '"]').show();
                $this.addClass('selected');

            };

            $('.menucontroler').on('mouseover touchstart', fn_effect);

            $('.menucontroler').on('touchend', function() {
                var $node = $('[data-rel="' + $(this).attr('data-type') + '"]');
                $("html, body").animate({ scrollTop: $node.offset().top }, 500);
            });

            $('.attachedimages').each(function() {
                var $this = $(this);
                $this.find('br').remove();
                $this.find('img').first().addClass('active');

                var fnnextimage = function () {
                    var $active = $this.find('img.active');
                    var $next = $active.next('img');

                    $active.removeClass('active');

                    if ($next.length > 0) {
                        $next.addClass('active');
                    } else {
                        $this.find('img').first().addClass('active');
                    }
                };

                var fnprevimage = function () {
                    var $active = $this.find('img.active');
                    var $next = $active.prev('img');

                    $active.removeClass('active');

                    if ($next.length > 0) {
                        $next.addClass('active');
                    } else {
                        $this.find('img').last().addClass('active');
                    }
                };

                if ($this.find('img').length > 0) {
                    $this.find('img').on('click', fnnextimage);

                    var $controlbefore = $('<div class="slide-control" data-action="before">&#60;</div>');
                    $controlbefore.on('click', fnprevimage);
                    $this.append($controlbefore);

                    var $controlafter = $('<div class="slide-control" data-action="after">&#62;</div>');
                    $controlafter.on('click', fnnextimage);
                    $this.append($controlafter);

                } else {
                    $this.hide();
                }
           });

            $('completion.complete').parents('.completion-parent').addClass('complete');

            $('completion.incomplete').parents('.completion-parent').addClass('incomplete');

            $('[data-dhbg-toggle]').on('click', function() {
                var $this = $(this);
                var cssclass = $this.attr('data-dhbg-toggle');
                var target = $this.attr('data-target');

                $(target).toggleClass(cssclass);
            });


            // ==============================================================================================
            // Float Window
            // ==============================================================================================
            $('.tepuy-wf').each(function() {
                var $this = $(this);

                $this.wrapInner("<div class='tepuy-body'></div>");

                var style = '';
                if ($this.attr('data-tepuy-width')) {
                    style += 'width:' + $this.attr('data-tepuy-width') + ';';
                }

                if ($this.attr('data-tepuy-height')) {
                    style += 'height:' + $this.attr('data-tepuy-height') + ';';
                }

                var $close = $('<div class="tepuy-close">X</div>');
                $close.on('click', function() {
                    $this.hide({ effect: 'slide', direction: 'down' });
                });

                if (style != '') {
                    $this.attr('style', style);
                }

                $this.append($close);
                $this.hide();
            });

            $('.tepuy-wf-controller').on('click', function(){
                var $this = $(this);
                var w = $this.attr('data-tepuy-width');
                var h = $this.attr('data-tepuy-height');

                var $float_window = $($this.attr('data-tepuy-content'));

                if (w) {
                    $float_window.css('width', w);
                }

                if (h) {
                    $float_window.css('height', h);
                }

                $float_window.show({ effect: 'slide', direction: 'down' });
            });

            // ==============================================================================================
            // Modal Window
            // ==============================================================================================
            $('.tepuy-w').each(function() {
                var $this = $(this);

                $this.wrapInner("<div class='tepuy-body'></div>");

                var style = '';
                if ($this.attr('data-tepuy-width')) {
                    style += 'width:' + $this.attr('data-tepuy-width') + ';';
                }

                if ($this.attr('data-tepuy-height')) {
                    style += 'height:' + $this.attr('data-tepuy-height') + ';';
                }

                if (style != '') {
                    $this.attr('style', style);
                }

                if ($this.attr('data-tepuy-showentry')) {
                    $.get(M.cfg.wwwroot + '/mod/glossary/showentry_ajax.php',
                            { 'eid': $this.attr('data-tepuy-showentry') },
                            function(data) {
                                if (data.entries.length > 0) {
                                    $this.find('.tepuy-body').html(data.entries[0].definition);
                                }
                    }, 'json');

                } else if ($this.attr('data-tepuy-innerentry')) {

                    if ($this.find('a.glossary.autolink').length > 0) {
                        $.get($this.find('a.glossary.autolink').attr('href').replace('showentry.php', 'showentry_ajax.php'),
                                function(data) {
                                    if (data.entries.length > 0) {
                                        $this.find('.tepuy-body').html(data.entries[0].definition);
                                    }
                        }, 'json');

                        $this.attr('title', $this.find('a.glossary.autolink').attr('title'));
                    }
                }

                $this.hide();
            });

            $('.tepuy-w-controller').on('click', function(e){
                e.preventDefault();

                var $this = $(this);

                var dialogue = $this.data('dialogue');

                if (!dialogue) {

                    //var maxHeight = $(window).height() - 100;

                    var w = $this.attr('data-tepuy-width');
                    var h = $this.attr('data-tepuy-height');

                    var $float_window = $($this.attr('data-tepuy-content') + ' .tepuy-body');

                    var properties = {
                        center: true,
                        modal: true,
                        visible: false,
                        draggable: false,
                        width: 'auto',
                        height: 'auto',
                        autofillheight: 'header',
                        bodyContent: $float_window
                    };

                    if (w) {
                        properties.width = w;
                    }

                    if (h) {
                        properties.height = h;
                        //maxHeight = maxHeight > h ? h - 100 : maxHeight;
                    }

                    var dialogue = new M.core.dialogue(properties);
                    $this.data('dialogue', dialogue);

                    //$('#' + dialogue.get('id') + ' .tepuy-body').css('height', maxHeight);
                }


                dialogue.show();
            });
        }
    };
});
