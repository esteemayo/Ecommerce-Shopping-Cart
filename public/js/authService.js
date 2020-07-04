const apiEndPoint = 'http://localhost:9000/api/v1/users';

const signup = async (name, email, username, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${apiEndPoint}/signup`,
            data: {
                name,
                email,
                username,
                password,
                passwordConfirm
            }
        });

        // console.log(res);

        if (res.data.status === 'success') {
            window.setTimeout(() => {
                showAlert('success', 'Your account has been successfully created!');
                location.assign('/products');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

const login = async (username, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${apiEndPoint}/login`,
            data: {
                username,
                password
            }
        });

        // console.log(res);
        if (res.data.status === 'success') {
            window.setTimeout(() => {
                showAlert('success', 'Logged you in', 10);
                location.assign('/products');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${apiEndPoint}/logout`
        });

        // console.log(res);
        window.setTimeout(() => {
            showAlert('success', 'Logged you out!', 7);
            location.assign('/login');
        });
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

// DOM ELEMENT
const signUpForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.logout-btn');

// DELEGATION
if (signUpForm)
    signUpForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;

        signup(name, email, username, password, passwordConfirm);
    });

if (loginForm)
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        login(username, password);
    });

if (logoutBtn) logoutBtn.addEventListener('click', logout);




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