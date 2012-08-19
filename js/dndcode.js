function init_drop(el, settings) {
            var holder = el;

            holder.ondragover = function () { this.className = 'hover'; return false; };
            holder.ondragend = function () { this.className = ''; return false; };
            holder.ondrop = function (e) {
                this.className = '';



                if(e.dataTransfer && e.dataTransfer.files) {
                    e.preventDefault();
                    e.stopPropagation();

                    var files = e.dataTransfer.files;

                    if(files.length !== 0) {
                        var reader = new FileReader();

                        reader.file = files[0];

                        reader.onload = function(event) {
                            if (event.target.file.type.search(/image\/.*/) != -1) {
                                fbug(event.target.file)
                                //holder.style.background = 'url(' + event.target.result + ') no-repeat center';
                                document.execCommand('insertImage', false, event.target.result);
                                //
                                //upload_file(event.target.file);
                            }
                            else {
                                fbug('keke')
                            }

                            //cs.addImg(event.target.result);
                            //holder.style.background = 'url(' + event.target.result + ') no-repeat center';

                        };

                        reader.readAsDataURL(files[0]);
                    }
                }


                return false;
            };
        }

        function upload_file(file) {
            var xhr = new XMLHttpRequest(),
                upload = xhr.upload;
            upload.addEventListener("progress", function (ev) {
                if (ev.lengthComputable) {

                    fbug(['uploading...', (ev.loaded / ev.total) * 100 + "%"]);
                }
            }, false);

            upload.addEventListener("error", function (ev) {
                console.log(ev);
            }, false);

            xhr.open(
                "POST",
                '/editor/uploadImg'
            );

            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.setRequestHeader("X-File-Name", file.name);

            /*upload.addEventListener("load", function (ev) {
             fbug(['upload done!', arguments]);
             fbug(['hfghf', xhr.response]);
             //cs.addImg();
             }, false);*/

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        fbug(['upload done!', xhr.response]);

                        try {
                            //var json = $.parseJSON(xhr.response);
                            //json.width = cs.getPxVal(cs.getValFromPx(json.width));
                            //json.height = cs.getPxVal(cs.getValFromPx(json.height));

                            //cs.addImg(json);
                        }
                        catch(e) {
                            fbug(['ERROR FUPL', e])
                        }
                    }
                }
            };

            xhr.send(file);


        }