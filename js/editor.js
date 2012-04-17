(function($){
    $.extend({
        editor: new function() {
            this.version = '0.1';
            var buttons = [];

            var defaults = {
                buttons: [
                    'bold', 'italic', 'underline', 'strike',
                    'align_left', 'align_center', 'align_right'
                ],
                activate_event: 'click',
                ajax_url: false,
                ajax_handler: false
            };

            this.construct = function(settings) {
                return this.each(function(){
                    var el = this;
                    var $el = $(el);
                    var settings = $.extend({}, defaults, settings);
                    // saving settings, for later use
                    $el.data('editor.settings', settings);

                    var ed = $.editor;

                    // unique class name, for referencing text block, with editor panel
                    var unique_class = genId();

                    //constructing editor panel
                    var wysiwyg = $('<div class="wysiwyg_panel"></div>')
                        .addClass(unique_class);
                    var i = 0;
                    $.each(settings.buttons, function(k, v) {
                        i++;
                        var btn = $('<div class="wysiwyg_btn"></div>')
                            .data('command', v)
                            .addClass('wysiwyg_btn_'+ v)
                            .on('mousedown', function() {
                                //fbug('mousedown');
                                return false;
                            })
                            .on('click', function(e) {

                                var cmd = $(this).data('command');
                                var btn = buttons[cmd];
                                //fbug(['click', cmd, btn]);
                                var x = e.clientX;
                                var y = e.clientY;

                                if(btn) {
                                    btn.handler($el, settings, x, y);
                                }
                            });
                        wysiwyg.append(btn);
                    });

                    //wysiwyg.width(i*24);
                    wysiwyg.appendTo($el);
                    el.contentEditable = true;

                    //
                    var activateEditor = function() {
                        // first - hiding all other panels
                        hide_editors();

                        var pos = $el.position();
                        var editor = $('.'+ unique_class).show();


                        var el_height = parseInt(editor.height()),
                            el_margin_top = parseInt($el.css('margin-top')),
                            el_padding_top = parseInt($el.css('padding-top'));
                        var top = pos.top - el_height + el_margin_top + el_padding_top;

                        editor.css({
                            left: pos.left,
                            top: top
                        });
                    };

                    $el
                        .on(settings.activate_event, activateEditor)
                        .on('blur', hide_editors);
                });
            };

            this.addButton = function(code, data) {
                buttons[code] = data;
            }
        }
    });


    function hide_editors() {
        $('.wysiwyg_panel').hide();
    }

    function fbug(x){
        if ((typeof(console) != 'undefined') && (typeof(console['log']) != 'undefined'))
            console.log(x);
    }

    function genId() {
        var nid = 'editor_uniqeid_'+ Math.floor(Math.random() * 10000);

        if( $('.'+ nid).length === 0 ) {
            return nid;
        } else {
            return genId();
        }
    }

    // extend plugin scope
    $.fn.extend({
        editor: $.editor.construct
    });

    var ed = $.editor;

    ed.addButton('bold', {
        handler: function(el, settings, x, y) {
            document.execCommand('bold', false, '');
        }
    });
    ed.addButton('italic', {
        handler: function(el, settings, x, y) {
            document.execCommand('italic', false, '');
        }
    });
    ed.addButton('underline', {
        handler: function(el, settings, x, y) {
            document.execCommand('underline', false, '');
        }
    });
    ed.addButton('strike', {
        handler: function(el, settings, x, y) {
            fbug(111)
            document.execCommand('strikeThrough', false, '');
        }
    });
    ed.addButton('align_left', {
        handler: function(el, settings, x, y) {
            document.execCommand('justifyLeft', false, '');
        }
    });
    ed.addButton('align_center', {
        handler: function(el, settings, x, y) {
            document.execCommand('justifyCenter', false, '');
        }
    });
    ed.addButton('align_right', {
        handler: function(el, settings, x, y) {
            document.execCommand('justifyRight', false, '');
        }
    });
    ed.addButton('save', {
        handler: function(el, settings, x, y) {
            fbug(settings);
            var datavalue = el.clone();
            datavalue.find('.wysiwyg_panel').remove();

            var formData = {
                'id': el.attr('data_id'),
                'value': datavalue.html()
            };


            $.ajax({
                url: 'example.php',
                type:'POST',
                data: {'html': $.toJSON(formData)},
                success: function(res) {
                    alert('Data updated');
                }
            });
        }
    });
})(jQuery);