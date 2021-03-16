$(function() {
    // loadData();

    // toggle dropdown
    $('.dropdown .dropdown-toggle').on("click", function(e) {
        e.preventDefault();
        $(this).parent().find('.dropdown-content').toggleClass('hide');
    });

    $('.header .toggle').on('click', function(e) {
        e.preventDefault();
        $('.navbar').toggleClass('navbar-toggle');
    });

    $('.title-box .btn').on('click', function(e) {
        e.preventDefault();
        $('.dialog').removeClass('hide');
    });

    $('.dialog dialog-close-button, .dialog:not(".dialog-content")').on('click', function(e) {
        e.preventDefault();
        $('.dialog').addClass('hide');
    });
});

/**
 * Load du lieu khach hang
 */
function loadData() {
    // lay du lieu tu api ve
    var data = getData();
    console.log(data.responseJSON);
}

function getData() {
    return $.ajax({
            url: 'http://api.manhnv.net/api/customers',
            method: 'GET',
            contentType: 'application/json',
            async: false
        })
        .done(function(res) {
            return res;
        }).fail(function() {
            alert('Có lỗi xảy ra.');
        });
}