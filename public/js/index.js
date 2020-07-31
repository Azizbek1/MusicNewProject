$(document).ready(() => {
    $('.music_delete').on('click', (e) => {
        $target = $(e.target);
        const id  = $target.attr('data-id')
        $.ajax({
            type: 'DELETE',
            url: '/musics/'+id,
            success: (response) => {
                alert(`Musiqa o'chirib tashlandi`);
                window.location.href='/';
            },
            error: (err) => {console.log(err)}
        })
    })
})