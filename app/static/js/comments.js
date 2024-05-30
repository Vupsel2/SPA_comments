let savedTxtFile = null;
let savedImageFile = null;

const secretKey = 'qwesaxxcacxz#q123'; 

function generateJWT(payload, secretKey) {
    const header = { alg: "HS256", typ: "JWT" };
    const sHeader = JSON.stringify(header);
    const sPayload = JSON.stringify(payload);
    const sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, secretKey);
    return sJWT;
}

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
            const eventDetail = {
                html: data.html,
                parentCommentId: data.parent_comment_id,
                commentId: data.comment_id
            };
            const newCommentEvent = new CustomEvent('newComment', { detail: eventDetail });
            document.dispatchEvent(newCommentEvent);
        } else if (data.errors) {
            let fieldNames = Object.keys(data.errors);
            let firstFieldErrors = data.errors[fieldNames[0]];
            $('#comment-form-errors').text(firstFieldErrors);
        }
    };

    
    document.addEventListener('newComment', function(event) {
        const { html, parentCommentId, commentId } = event.detail;
    
        if (parentCommentId) {
            let parentComment = $('#comment-' + parentCommentId);
            let repliesContainer = $('#replies-' + parentCommentId);
            repliesContainer.show();
            repliesContainer.append(html);
    
            if (!parentComment.closest('.comment-box').data('parent-comment-id') && repliesContainer.children().length === 1) {
                let toggleButton = $('<button class="toggle-replies-button" data-comment-id="' + parentCommentId + '">Скрыть комментарии</button>');
                parentComment.append(toggleButton);
            }
        } else {
            const commentList = $('#comment-list');
            commentList.prepend(html);
        }
    
        if (savedTxtFile || savedImageFile) {
            const fileFormData = new FormData();
            if (savedTxtFile && savedTxtFile.size > 0) {
                fileFormData.append('text_file', savedTxtFile);
            }
            if (savedImageFile && savedImageFile.size > 0) {
                fileFormData.append('image', savedImageFile);
            }
    
            fileFormData.append('comment_id', commentId);
            fileFormData.forEach((value, key) => {
                console.log(key, value);
            });
    
            $.ajax({
                url: FilecommentUrl,
                method: 'POST',
                data: fileFormData,
                processData: false,
                contentType: false,
                headers: {
                    'X-CSRFToken': csrftoken
                },
                success: function(data) {
                    const commentId = data.comment_id;
                    const commentElement = $('#comment-' + commentId);
    
                    if (commentElement.length > 0) {
                        if (data.image_file) {
                            const imageElement = '<img src="/media/' + data.image_file + '" alt="comment image" class="comment-image">';
                            commentElement.find('p').first().after(imageElement);
                        }
                        if (data.txt_file) {
                                commentElement.append('<a href="/media/' + data.txt_file + '" target="_blank" class="comment-text-file">Скачать текстовый файл</a>');
                            
                        }
                    } else {
                        console.log('Comment element not found for ID:', commentId);
                    }
                },
                error: function(response) {
                    console.log(response);
                }
            });
        }
    
        savedImageFile = null;
        savedTxtFile = null;
    
        $('#comment-form')[0].reset();
        $('#id_parent_comment_id').val('');
        $('#comment-form-container').hide();
        $('.add-comment-button').text('Добавить комментарий');
        $('.reply-button').text('Ответить');
    });
    $('#comment-form').on('submit', function(event) {
        event.preventDefault();
        let formData = new FormData(this);

        var textWithoutTags = formData.get('text').replace(/<[^>]+>/g, '');
        if (textWithoutTags.length === 0) {
            alert('Comments without text are not allowed');
            return;
        }

        let jsonData = {};
        formData.forEach((value, key) => {
            
            console.log(key, value);
            jsonData[key] = value;
        });

        

        const txtFile = formData.get('text_file');
        const image = formData.get('image');
        

        if (txtFile.size > 0 ) {
            if (txtFile.size > 0) {
                var filetype = txtFile.name.split('.').pop();

                if (filetype !== 'txt') {
                    alert('Only txt files allowed');
                    return;
                }
                savedTxtFile = txtFile;
                
            }
        }
        if(image.size > 0){
            
                var filetype = image.name.split('.').pop();

                if (filetype !== 'jpg' && filetype !== 'gif' && filetype !== 'png') {
                    alert('Only JPG, GIF, PNG files allowed');
                    return;
                }
                
            savedImageFile = image;
        }
        const token = generateJWT(jsonData, secretKey);
        socket.send(token);
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
