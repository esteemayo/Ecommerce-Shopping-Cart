// import axios from 'axios';

const endpoint = 'http://localhost:9000/api/v1/categories';

const addCategory = async title => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${endpoint}`,
            data: {
                title
            }
        });

        // console.log(res);

        if (res.data.status === 'success') {
            window.setTimeout(() => {
                showAlert('success', 'Category successfully added.');
                location.assign('/admin/categories');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err);
    }
};

const editCategory = async (catId, title) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `${endpoint}/${catId}`,
            data: {
                title
            }
        });

        // console.log(res);
        if (res.data.status === 'success') {
            window.setTimeout(() => {
                showAlert('success', 'Category updated successfully!');
                location.assign('/admin/categories');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err);
    }
};

const deleteCategory = async catId => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `${endpoint}/${catId}`
        });

        console.log(res);
        showAlert('success', 'Category successfully deleted!');
        location.reload(true);

    } catch (err) {
        showAlert('error', err);
    }
};

// DOM ELEMENT
const addForm = document.querySelector('.add-category');
const editCat = document.querySelector('.form--edit-category');
const delCat = document.getElementById('delete-cat');

// DELEGATION
if (addForm)
    addForm.addEventListener('submit', e => {
        e.preventDefault();

        const title = document.getElementById('title').value;

        console.log(title);
        addCategory(title);
    });

if (editCat)
    editCat.addEventListener('click', e => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const { categoryId } = e.target.dataset;
        editCategory(categoryId, title);

    });

if (delCat)
    delCat.addEventListener('click', e => {
        const { categoryId } = e.target.dataset;
        deleteCategory(categoryId);
    });




const hideAlert = () => {
    const elem = document.querySelector('.alert');
    if (elem) elem.parentElement.removeChild(elem);
};

const showAlert = (type, msg, time = 5) => {
    hideAlert();
    const markup = `<div class="alert alert-${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, time * 1000);
};