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
        let formData = $(this).serialize();
        $.ajax({
            url: commentUrl,
            method: "POST",
            data: formData,
            headers: {
                'X-CSRFToken': csrftoken
            },
            success: function(data) {
                if (data.html) {
                    if (data.parent_comment_id) {
                        let repliesContainer = $('#replies-' + data.parent_comment_id);
                        console.log('repliesContainer.length',repliesContainer.length )
                        
                        if (repliesContainer.length === 0) {
                            repliesContainer = $('<ul class="replies"></ul>');
                            repliesContainer.attr('id', 'replies-' + data.parent_comment_id);
                            repliesContainer.attr('data-comment-id', data.parent_comment_id);
                            $('#comment-' + data.parent_comment_id).append(repliesContainer);
                        }
                            repliesContainer.append(data.html);

                    } else {
                        const commentList = $('#comment-list');

                        commentList.append(data.html);
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
});
