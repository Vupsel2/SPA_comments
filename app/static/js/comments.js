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
        console.log("formData", formData);
        for (let pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]);
        }
 
        console.log("formData IMAGE", formData.entries());
        let imageInput = $('#id_image')[0];
        let textFileInput = $('#id_text_file')[0];
        console.log(imageInput);
        console.log("dddddddddddddddddddddd");
        
        if (imageInput.files.length > 0) {

            let imageFile = imageInput.files[0];

            let img = new Image();

            img.src = window.URL.createObjectURL(imageFile);
            console.log("img.src", img.src);
            formData.append('image', imageFile);
            console.log("Путь к файлу:", imageFile);
            
            
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
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
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
        console.log(repliesContainer);
        if (repliesContainer.is(':visible')) {
            repliesContainer.hide();
            $(this).text('Посмотреть комментарии');
        } else {
            repliesContainer.find('.replies').show();
            repliesContainer.show();
            $(this).text('Скрыть комментарии');
        }
    });
});
