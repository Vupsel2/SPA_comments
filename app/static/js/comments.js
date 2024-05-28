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
    $('#comment-form').on('submit', function(event) {
        event.preventDefault();
        let formData = new FormData(this);
        
        var textWithoutTags = formData.get('text').replace(/<[^>]+>/g, '');
        console.log(textWithoutTags);
        console.log(textWithoutTags.length);
        if (textWithoutTags.length === 0) {
            alert('Comments without text are not allowed');
            return;
        }

        let imageInput = $('#id_image')[0];
        let textFileInput = $('#id_text_file')[0];
 
        if (imageInput.files.length > 0) {
            let imageFile = imageInput.files[0];
            let img = new Image();
            img.src = window.URL.createObjectURL(imageFile);
            console.log("img.src", img.src);
            formData.append('image', imageFile);
        }        

        if (textFileInput.files.length > 0) {
            let textFile = textFileInput.files[0];
            if (textFile.size > 100 * 1024) {
                alert('Text file size must be less than 100 KB.');
                return;
            }
            if (!textFile.name.endsWith('.txt')) {
                alert('Only .txt files are allowed.');
                return;
            }
        }

        $.ajax({
            url: commentUrl,
            method: "POST",
            data: formData,
            processData: false, 
            contentType: false,
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function(data) {
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
                }
                $('#comment-form')[0].reset();
                $('#id_parent_comment_id').val('');
                $('#comment-form-container').hide();
                $('.add-comment-button').text('Добавить комментарий');
                $('.reply-button').text('Ответить');
            },
            error: function(response) {
                const errors = response.responseJSON.errors;
                console.log(errors);
                let error = '';
                for (const field in errors) {
                    error += field + ': ' + errors[field].join(', ') + '\n';
                }
                $('#comment-form-errors').text(error);
            }
        }); 
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
