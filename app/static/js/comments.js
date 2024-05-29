function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

$(document).ready(function() {
    const socket = new WebSocket('ws://' + window.location.host + '/ws/comments/');
    socket.onopen = function(event) {
        console.log("WebSocket is open now.");
    };

    socket.onclose = function(event) {
        console.log("WebSocket is closed now.");
    };
    socket.onerror = function(error) {
        console.log("WebSocket Error: ", error);
    };

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.html) {
            if (data.parent_comment_id) {
                let parentComment = $('#comment-' + data.parent_comment_id);
                let repliesContainer = $('#replies-' + data.parent_comment_id);
                repliesContainer.show();
                console.log(repliesContainer);
                repliesContainer.append(data.html);

                if (!parentComment.closest('.comment-box').data('parent-comment-id') && repliesContainer.children().length === 1){
                    let toggleButton = $('<button class="toggle-replies-button" data-comment-id="' + data.parent_comment_id + '">Скрыть комментарии</button>');
                    parentComment.append(toggleButton);
                }
            } else {
                const commentList = $('#comment-list');
                commentList.prepend(data.html);
            }
            $('#comment-form')[0].reset();
            $('#id_parent_comment_id').val('');
            $('#comment-form-container').hide();
            $('.add-comment-button').text('Добавить комментарий');
            $('.reply-button').text('Ответить');
        }else if (data.errors) {
            let fieldNames = Object.keys(data.errors);
            let firstFieldErrors = data.errors[fieldNames[0]];
            $('#comment-form-errors').text(firstFieldErrors);
        }

    };

    $('#comment-form').on('submit', function(event) {
        event.preventDefault();
        let formData = new FormData(this);

        var textWithoutTags = formData.get('text').replace(/<[^>]+>/g, '');
        if (textWithoutTags.length === 0) {
            alert('Comments without text are not allowed');
            return;
        }


        var txtFile= formData.get('text_file')
        var image= formData.get('image')

        let jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
        
        if (txtFile.size > 0 || image.size > 0) {
            if (txtFile.size > 0) {
                var filetype = txtFile.name.split('.').pop();
    
                if (filetype !== 'txt'){
                    alert('Only txt files allowed');
                    return;
                }
            }

            var fileformData = new FormData();
            fileformData.append('text_file', txtFile)
            fileformData.append('image', image);
            $.ajax({
                url: commentUrl,
                method: "POST",
                data: fileformData,
                processData: false, 
                contentType: false,
                headers: {
                    'X-CSRFToken': csrftoken
                },
                success: function(data) {
                    console.log("success", data)
                    jsonData['image']=data.image_file;
                    jsonData['text_file']=data.txt_file; 
                    
                    console.log(JSON.stringify(jsonData));
                    socket.send(JSON.stringify(jsonData));
 
                },  


                error: function(response) {
                    console.log(response);
                }
            });
        }
        else {
            socket.send(JSON.stringify(jsonData));
        }

    });


$('#previewButton').on('click', function() {
    let formData = new FormData($('#comment-form')[0]);
    let textValue = formData.get('text');
    let previewText = $('#previewArea .preview-text');
    previewText.html(textValue);

    let imageInput = $('#id_image')[0];
    if (imageInput.files.length > 0) {
        let imageFile = imageInput.files[0];
        let img = new Image();
        img.src = window.URL.createObjectURL(imageFile);
        $('#previewArea .preview-image').attr('src', img.src).show();
    } else {
        $('#previewArea .preview-image').hide();
    }

    $('#previewArea').show();
});

    $('.add-comment-button').on('click', function() {
        $('#id_parent_comment_id').val('');
        if ($(this).text() === 'Добавить комментарий') {
            $('.reply-button').text('Ответить');
            $('#comment-form-container').insertAfter($(this)).show();
            $(this).text('Отменить');
        } else {
            $(this).text('Добавить комментарий');
            $('#comment-form-container').hide();
        }
    });

    $(document).on('click', '.reply-button', function() {
        var commentId = $(this).attr('data-comment-id');
        if ($(this).text() === 'Ответить') {
            $('.add-comment-button').text('Добавить комментарий');
            $('.reply-button').text('Ответить');
            $('#comment-form-container').insertAfter($(this).closest('.comment-box')).show();
            $('#id_parent_comment_id').val(commentId);
            $(this).text('Отменить');
        } else {
            $(this).text('Ответить');
            $('#comment-form-container').hide();
        }
    });

    $(document).on('click', '.toggle-replies-button', function() {
        var commentId = $(this).attr('data-comment-id');
        var repliesContainer = $('#replies-' + commentId);
        if (repliesContainer.is(':visible')) {
            repliesContainer.hide();
            $(this).text('Посмотреть комментарии');
        } else {
            repliesContainer.show();
            $(this).text('Скрыть комментарии');
        }
    });

    $('.html-tag-buttons button').on('click', function() {
        var tag = $(this).data('tag');
        var textarea = $('#id_text');
        var start = textarea[0].selectionStart;
        var end = textarea[0].selectionEnd;
        var text = textarea.val();
        var before = text.substring(0, start);
        var after = text.substring(end, text.length);
        var content = text.substring(start, end);
        var newText = before + '<' + tag + '>' + content + '</' + tag + '>' + after;
        textarea.val(newText);

        var newPosition = start + tag.length + 2;
        textarea[0].setSelectionRange(newPosition, newPosition);
        textarea.focus();
    });
});
