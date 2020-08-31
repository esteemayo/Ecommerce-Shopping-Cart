const productEndpoint = 'http://localhost:9000/api/v1/products';

const createProduct = async data => {
    try {
        const { data: res } = await axios({
            method: 'POST',
            url: `${productEndpoint}`,
            data
        });

        // console.log(res);
        if (res.status === 'success') {
            window.setTimeout(() => {
                showAlert('success', 'Product added!');
                location.assign('/admin/products');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

const editProduct = async (data, prodId) => {
    try {
        const { data: res } = await axios({
            method: 'PATCH',
            url: `${productEndpoint}/${prodId}`,
            data
        });

        // console.log(res);
        if (res.status === 'success') {
            window.setTimeout(() => {
                showAlert('success', 'Product updated.');
                location.assign('/admin/products');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

const deleteProduct = async prodId => {
    try {
        await axios({
            method: 'DELETE',
            url: `${productEndpoint}/${prodId}`
        });

        showAlert('success', 'Product deleted!');
        location.reload(true);
    } catch (err) {
        showAlert('error', err.data.response.message);
    }
};

// DOM ELEMENT
const productForm = document.querySelector('.form--add-product');
const editProductForm = document.querySelector('.form--edit-product');
const delProduct = document.getElementById('delete-product');

// DELEGATION
if (productForm)
    productForm.addEventListener('submit', e => {
        e.preventDefault();

        const form = new FormData();

        form.append('title', document.getElementById('title').value);
        form.append('description', document.getElementById('description').value);
        form.append('category', document.getElementById('category').value);
        form.append('price', document.getElementById('price').value);
        form.append('img', document.getElementById('img').files[0]);
        form.append('imageGallery', document.getElementById('imageGallery').files[0]);
        form.append('imageGallery', document.getElementById('imageGallery').files[1]);
        form.append('imageGallery', document.getElementById('imageGallery').files[2]);
        form.append('imageGallery', document.getElementById('imageGallery').files[3]);

        createProduct(form);
    });

if (editProductForm)
    editProductForm.addEventListener('click', e => {
        e.preventDefault();

        const form = new FormData();

        form.append('title', document.getElementById('title').value);
        form.append('description', document.getElementById('description').value);
        form.append('category', document.getElementById('category').value);
        form.append('price', document.getElementById('price').value);
        form.append('img', document.getElementById('img').files[0]);
        form.append('imageGallery', document.getElementById('imageGallery').files[0]);
        form.append('imageGallery', document.getElementById('imageGallery').files[1]);
        form.append('imageGallery', document.getElementById('imageGallery').files[2]);
        form.append('imageGallery', document.getElementById('imageGallery').files[3]);

        // const { productId } = e.target.dataset;
        const productId = document.getElementById('productId').value;

        editProduct(form, productId);
    });

if (delProduct)
    delProduct.addEventListener('click', e => {
        const { productId } = e.target.dataset;
        deleteProduct(productId);
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