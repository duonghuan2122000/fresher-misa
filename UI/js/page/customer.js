$(function() {
    loadData();

    setEvent();

    saveCustomer();
});

/**
 * Hàm set event cho các element.
 * Created at: 19/03/2021
 */
function setEvent() {
    // thiết lập toggle cho menu
    $('.dropdown .dropdown-toggle').on("click", function(e) {
        e.preventDefault();
        $(this).parent().find('.dropdown-content').toggleClass('hide');
    });

    // thiết lập toggle cho navbar
    $('.header .toggle').on('click', function(e) {
        e.preventDefault();
        $('.navbar').toggleClass('navbar-toggle');
    });

    // sự kiện mở dialog thêm mới
    $('#btnAdd').on('click', function(e) {
        e.preventDefault();
        $('.dialog').removeClass('hide');
    });

    // đóng dialog
    $('.dialog .dialog-close-button').on('click', function(e) {
        e.preventDefault();
        clearValForm();
        $('.dialog').addClass('hide');
    });

    // refresh data
    $('#btnRefresh').click(function(e) {
        e.preventDefault();
        loadData();
    });

    // sự kiện double click mở dialog sửa khách hàng
    $('table#tblListCustomer tbody').on('dblclick', 'tr', function(e) {
        e.preventDefault();
        var customerId = $(this).data('recordId');
        var customer = getCustomer(customerId);
        bindCustomerToDialog(customer);
        $('.dialog').removeClass('hide');
    });
}

/**
 * Hàm lấy dữ liệu khách hàng từ api
 * @param {string} customerId 
 * @returns customer
 */
function getCustomer(customerId) {
    var customer = null
    $.ajax({
            method: 'GET',
            url: `http://api.manhnv.net/api/customers/${customerId}`,
            contentType: 'application/json',
            async: false
        })
        .done(function(res) {
            customer = res;
        })
        .fail(function(res) {
            // error
            console.error("Không tìm thấy khách hàng.");
        });
    return customer;
}

function clearValForm() {
    $('#customerForm').find('input[name=Address]').val('');
    $('#customerForm').find('input[name=CompanyName]').val('');
    $('#customerForm').find('input[name=CompanyTaxCode]').val('');
    $('#customerForm').find('input[name=CustomerCode]').val('');
    $('#customerForm').find('input[name=CustomerGroupId]').val('');
    $('#customerForm').find('input[name=DateOfBirth]').val(null);
    $('#customerForm').find('input[name=Email]').val('');
    $('#customerForm').find('input[name=FullName]').val('');
    $('#customerForm').find('input[name=PhoneNumber]').val('');
    $('#customerForm').find('input[name=Gender]').removeAttr('checked');
}

/**
 * Hàm lưu thông tin khách hàng.
 * Created at: 19/03/2021
 */
function saveCustomer() {
    $('form#customerForm').on('submit', function(e) {
        e.preventDefault();
        var fields = $(this).serializeArray();
        var customer = {};
        $.each(fields, function(_, field) {
            customer[field.name] = field.value;
        });

        // tiến hành lưu data khách hàng trên server.
        console.log(customer);
    });
}

/**
 * Load dữ liệu khách hàng từ API.
 * Created at: 19/03/2021
 */
function loadData() {
    // lay du lieu tu api ve
    var data = getData();
    buildDataTableHTML(data);

}

/**
 * Hàm sử dụng ajax load dữ liệu khách hàng từ API.
 * Created at: 19/03/2021
 * @returns Danh sách khách hàng.
 */
function getData() {
    var customers = null;
    $.ajax({
            url: 'http://api.manhnv.net/api/customers',
            method: 'GET',
            contentType: 'application/json',
            async: false
        })
        .done(function(res) {
            customers = res;
        })
        .fail(function() {
            alert('Có lỗi xảy ra.');
        });

    return customers;
}

/**
 * Hàm thực hiện build dữ liệu khách hàng vào html.
 * Created at: 19/03/2021
 * @param {array} data
 */
function buildDataTableHTML(data) {
    $('table#tblListCustomer tbody').html('');
    $.each(data, function(_, customer) {
        var dateOfBirth = customer.DateOfBirth;
        var dateFormat = formatDateDDMMYYYY(dateOfBirth);
        var debitAmount = Math.floor(Math.random() * 1000000000);
        var money = formatMoney(debitAmount);
        var trHTML = $(`<tr>
                    <td>${customer.CustomerCode}</td>
                    <td>${customer.FullName}</td>
                    <td>${customer.GenderName}</td>
                    <td>${dateFormat}</td>
                    <td>${customer.CustomerGroupName}</td>
                    <td>${customer.PhoneNumber}</td>
                    <td>${customer.Email}</td>
                    <td class="has-text-right">${money}</td>
                    <td class="has-text-centered">
                        <input type="checkbox" checked>
                    </td>
                </tr>`);
        trHTML.data('recordId', customer.CustomerId);

        $('table#tblListCustomer tbody').append(trHTML);
    });
}

function bindCustomerToDialog(customer) {
    $('#customerForm').find('input[name=Address]').val(customer.Address);
    $('#customerForm').find('input[name=CompanyName]').val(customer.CompanyName);
    $('#customerForm').find('input[name=CompanyTaxCode]').val(customer.CompanyTaxCode);
    $('#customerForm').find('input[name=CustomerCode]').val(customer.CustomerCode);
    $('#customerForm').find('input[name=CustomerGroupId]').val(customer.CustomerGroupId);
    $('#customerForm').find('input[name=DateOfBirth]').val(new Date(customer.DateOfBirth).toISOString().substr(0, 10));
    $('#customerForm').find('input[name=Email]').val(customer.Email);
    $('#customerForm').find('input[name=FullName]').val(customer.FullName);
    $('#customerForm').find('input[name=PhoneNumber]').val(customer.PhoneNumber);
    $('#customerForm').find(`input[name=Gender][value=${customer.Gender}]`).attr('checked', true);
}

/**
 * Hàm format date theo dạng DD/MM/YYYY.
 * Created at: 19/03/2021
 * @param {string} dateStr date string cần format
 */
function formatDateDDMMYYYY(dateStr) {
    if (!dateStr) {
        return '';
    }
    var date = new Date(dateStr);
    var dateString = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString();
    var monthString = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString();
    var year = date.getFullYear();
    return `${dateString}/${monthString}/${year}`;
}

/**
 * Hàm xử lý tiền.
 * Created at: 19/03/2021
 * @param {number} money 
 */
function formatMoney(money) {
    var numFormat = new Intl.NumberFormat('vi-VN');
    return numFormat.format(money);
}