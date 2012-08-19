/**
 * Editor instance.
 *
 * @module editor
 *
 */

(function($, window){
    // our namespace
    var newjs = {};
    window.newjs = newjs;

    newjs.editor = {};
    newjs.editor.buttons = [];
    newjs.editor.addButton = function(code, data) {
        newjs.editor.buttons[code] = data;
    };


    /**
     * @class Editor
     * @constructor
     *
     * @param {HTMLElement} element DOM-element which will be editable by editor
     * @param {Object} settings settings for editor instance
     */
    newjs.Editor = function(element, settings) {
        this.version = '0.1';

        /**
         * @property defaults
         * @type {Object}
         */
        var defaults = {
            buttons: [
                'bold', 'italic', 'underline', 'strike',
                'align_left', 'align_center', 'align_right',
                'ordered_list', 'unordered_list', 'image'
            ],
            activate_event: 'click',
            ajax_url: false,
            ajax_handler: false
        };

        var $el = $(element);
        settings = $.extend({}, defaults, settings);fbug(settings);
        // saving settings, for later use
        $el.data('editor.settings', settings);

        // unique class name, for referencing text block, with editor panel
        var unique_class = genId('editor');

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
                    var btn = newjs.editor.buttons[cmd];
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
        element.contentEditable = true;

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




        function hide_editors() {
            $('.wysiwyg_panel').hide();
        }

        function genId(prefix) {
            var nid = prefix +'_'+ Math.floor(Math.random() * 10000);

            if( $('.'+ nid).length === 0 ) {
                return nid;
            } else {
                return genId(prefix);
            }
        }
    };

    // extend plugin scope
    $.fn.extend({
        editor: function(settings) {
            return this.each(function() {
                new newjs.Editor(this, settings);
            });
        }
    });

    function fbug(x){
        if ((typeof(console) != 'undefined') && (typeof(console['log']) != 'undefined'))
            console.log(x);
    }

    newjs.editor.addButton('bold', {
        handler: function(el, settings, x, y) {
            document.execCommand('bold', false, '');
        }
    });
    newjs.editor.addButton('italic', {
        handler: function(el, settings, x, y) {
            document.execCommand('italic', false, '');
        }
    });
    newjs.editor.addButton('underline', {
        handler: function(el, settings, x, y) {
            document.execCommand('underline', false, '');
        }
    });
    newjs.editor.addButton('strike', {
        handler: function(el, settings, x, y) {
            document.execCommand('strikeThrough', false, '');
        }
    });
    newjs.editor.addButton('align_left', {
        handler: function(el, settings, x, y) {
            document.execCommand('justifyLeft', false, '');
        }
    });
    newjs.editor.addButton('align_center', {
        handler: function(el, settings, x, y) {
            document.execCommand('justifyCenter', false, '');
        }
    });
    newjs.editor.addButton('align_right', {
        handler: function(el, settings, x, y) {
            document.execCommand('justifyRight', false, '');
        }
    });

    newjs.editor.addButton('ordered_list', {
        handler: function(el, settings, x, y) {
            document.execCommand('insertOrderedList', false, '');
        }
    });

    newjs.editor.addButton('unordered_list', {
        handler: function(el, settings, x, y) {
            document.execCommand('insertUnorderedList', false, '');
        }
    });
    newjs.editor.addButton('save', {
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
})(jQuery, window);