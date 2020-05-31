const productEndpoint = 'http://localhost:9000/api/v1/products';

const createProduct = async (title, description, category, price) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${productEndpoint}`,
            data: {
                title,
                description,
                category,
                price
            }
        });

        // console.log(res);
        if (res.data.status === 'success') {
            window.setTimeout(() => {
                showAlert('success', 'Product added!');
                location.assign('/admin/products');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

const editProduct = async (prodId, title, description, category, price) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: `${productEndpoint}/${prodId}`,
            data: {
                title,
                description,
                category,
                price
            }
        });

        // console.log(res);
        if (res.data.status === 'success') {
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
        const res = await axios({
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

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const price = document.getElementById('title').value;

        createProduct(title, description, category, price);
        console.log(title, description, category, price);
    });

if (editProductForm)
    editProductForm.addEventListener('click', e => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const price = document.getElementById('title').value;

        const { productId } = e.target.dataset;

        editProduct(productId, title, description, category, price);
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