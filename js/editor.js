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
        var defaults, $el, wysiwyg,
            // unique class name, for referencing text block, with editor panel
            unique_class = genId('editor')
        ;

        this.version = '0.1';
        this.$edit_el = $(element);

        /**
         * @property defaults
         * @type {Object}
         */
        defaults = {
            buttons: [
                'bold', 'italic', 'underline', 'strike',
                'align_left', 'align_center', 'align_right',
                'ordered_list', 'unordered_list', 'image'
            ],
            activate_event: 'click',
            ajax_url: false,
            ajax_handler: false
        };


        this.settings = $.extend({}, defaults, settings);
        fbug([this.$edit_el[0], this.settings]);
        // saving settings, for later use
        this.$edit_el.data('editor.settings', this.settings);




        //constructing editor panel
        wysiwyg = $('<ul class="wysiwyg_panel"></ul>')
            .addClass(unique_class);

        $.each(this.settings.buttons, $.proxy(function(k, v) {
            if( newjs.editor.buttons[v] ) {
                var button = new newjs.Button(v, newjs.editor.buttons[v], this);

                wysiwyg.append( button.getHTML()) ;
            }

        }, this));

        //wysiwyg.width(i*24);
        wysiwyg.appendTo(this.$edit_el);
        element.contentEditable = true;

        //
        this.activate = function() {
            var pos, editor,
                el_height, el_margin_top, el_padding_top, top;
            // first - hiding all other panels

            hide_editors();

            pos = this.$edit_el.position();
            editor = $('.'+ unique_class).show();

            el_height = parseInt(editor.height()),
            el_margin_top = parseInt(this.$edit_el.css('margin-top')),
            el_padding_top = parseInt(this.$edit_el.css('padding-top'));
            top = pos.top - el_height + el_margin_top + el_padding_top;

            editor.css({
                left: pos.left,
                top: top
            });
        };

        this.$edit_el
            .on(this.settings.activate_event, $.proxy(this.activate, this) )
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

    newjs.Button = function(btn_type, config, editor) {
        var a;
        this.btn_type = btn_type;
        var cl = config.display_type !== 'list_item' ? 'wysiwyg_btn' : 'wysiwyg_list_item';

        this.html = $('<li><a href="#" class="wysiwyg_button"></a></li>')
            .addClass(cl);

        a = this.html.find('a');

        a.data('command', btn_type)
            .addClass('wysiwyg_btn_'+ btn_type)
            .on('mousedown', function(e) {
                return false;
            })
            .on('click', function(e) {fbug(e)
                var cmd = $(this).data('command');
                var btn = newjs.editor.buttons[cmd];
                var x = e.clientX;
                var y = e.clientY;

                if(btn) {
                    btn.handler(editor.$edit_el, editor.settings, x, y);
                }
            });

        if(config.html) {
            a.html(config.html);
        }

        if(config.list_data && config.list_data.length > 0) {
            var ul = $('<ul class="dropdown-menu" role="menu"></ul>');

            $.each(config.list_data, function(k, v) {
                v.display_type = 'list_item';
                var btn = new newjs.Button(k, v, editor);

                ul.append( btn.getHTML() );
            });

            a.addClass('btn dropdown-toggle')
                .attr('data-toggle', "dropdown");
            this.html.append(ul);
        }

        this.getHTML = function() {
            return this.html;
        };
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
        html: 'B',
        list_data: [
            {
                html: '1',
                handler: function() { fbug('keke'); }
            },
            {
                html: '2',
                handler: function() { fbug('keke2'); }
            }
        ],
        handler: function(el, settings) {
            document.execCommand('bold', false, '');
        }
    });
    newjs.editor.addButton('italic', {
        html: '<em>i</em>',
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