function fbug(x){
    if ((typeof(console) != 'undefined') && (typeof(console['log']) != 'undefined'))
        console.log(x);
}

var editor = {
    init: function() {

    },
    add: function(block) {
        block = $(block);

        var buttons = [
            'bold', 'italic', 'underline', 'strike',
            'align_left', 'align_center', 'align_right'];
        var wysiwyg = $('<div class="wysiwyg_panel"></div>');

        var i = 0;
        $.each(buttons, function(k, v) {
            i++;
            var el = $('<div data-command="'+ v +'" class="wysiwyg_btn wysiwyg_btn_'+ v +'"></div>')
                .mousedown(function() {return false})
                .click(editor.command);

            wysiwyg.append(el);
        });

        wysiwyg.width(i*24);



        block.mouseover(function() {
            document.designMode = "on";

            var pos = block.position();
            var editor = $(this).find('.wysiwyg_panel');

            var top = parseInt(pos.top) - parseInt(editor.height()) + parseInt(block.css('margin-top')) + parseInt(block.css('padding-top'));
            editor.css({left: pos.left,  top: top})
                .show();
            block.attr('contenteditable', true);
        })
        .mouseout(function() {
            document.designMode = "off";

            $(this).find('.wysiwyg_panel').hide();
            block.attr('contenteditable', false);
        });

        wysiwyg.attr('contenteditable', false);
        block.prepend(wysiwyg);
        //disableSelection(wysiwyg);
    },
    command: function(e) {
        var cmd = $(this).data('command');
        var block = $(this).parents('p');

        var x = e.clientX;
        var y = e.clientY;

        if(cmd === 'bold') {
            document.execCommand('bold');
        }
        else if(cmd === 'italic') {
            document.execCommand('italic');
        }
        else if(cmd === 'underline') {
            document.execCommand('underline');
        }
        else if(cmd === 'strike') {
            document.execCommand('strikeThrough');
        }
        else if(cmd === 'align_left') {
            document.execCommand('justifyLeft');
        }
        else if(cmd === 'align_center') {
            document.execCommand('justifyCenter');
        }
        else if(cmd === 'align_right') {
            document.execCommand('justifyRight');
        }

        else if(cmd === 'font_color') {
            cs.showColorPicker(x,  y,  function(color) {
                block.css('color', color);
            });
        }

        else if(cmd === 'bg_color') {
            cs.showColorPicker(x,  y,  function(color) {
                block.css('background-color', color);
                block.css('border-color', color);

                block.data('');
            });
        }

        else if(cmd === 'close') {
            block.remove();
        }
        else if(cmd === 'font_size') {
            cs.prompt({
                x: x,
                y: y + 20,
                text: 'Enter font size',
                callback: function(val) {
                    var size = parseInt(val) +'px';
                    block.find('.edit_text').css({'font-size': size, 'line-height': size});
                    block.css({'height': size});
                    var w = cs.checkWidth(block.find('.edit_text').clone());

                    block.css({'width': w});
                }
            })
        }

        //

        return false;
    }
};