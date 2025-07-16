import { post } from "./services"
import { navigate } from "./script";



// funcion de login

export async function login(urlUsers) {
    const message = document.getElementById('message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {

            const response = await fetch(urlUsers);
            const data = await response.json();
            const user = data.find(u => u.username === username && u.password === password);

            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                    // Redirigir según el rol
                if (user.role === 'admin') {
                    navigate('/admin');// Página de administrador
                } else {
                    navigate('/user'); // Página de usuario normal
                }
            } else {
                message.textContent = 'Usuario o contraseña incorrectos.';

            }
        } catch (error) {
            console.error(error);
            message.textContent = 'Error al iniciar sesión. Inténtalo de nuevo más tarde.';

        }
    });
}

// // Create user
export async function createUser(urlUsers) {
    const createUserForm = document.getElementById('new-user');
    const message = document.getElementById('message');


    createUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();


        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const passwordValidate = document.getElementById('passwordValidate').value.trim();


        try {
            const response = await fetch(urlUsers);
            const users = await response.json();
            const userExists = users.find(u => u.username === username);
            if (userExists) {
                message.textContent = `El usuario "${username}" ya existe`;
            } else {
                if (password === passwordValidate) {
                    const newUser = {
                        username,
                        password,
                        role: "user"
                    };
                    const createdUser = await post(urlUsers, newUser);

                    message.textContent = `El usuario "${createdUser.username}" se ha creado correctamente`;

                    createUserForm.reset();
                } else {
                    message.textContent = 'la contraseña no coincide.'
                }
            }
        } catch (error) {
            console.error(error);
            message.textContent = "Error al crear el usuario";
        }
    });

}



// window.addEventListener('DOMContentLoaded', () => {
//     const loginForm = document.getElementById('loginForm');
//     const createUserForm = document.getElementById('new-user');

//     if (window.location.pathname === '/login') {

//         loginForm.addEventListener("submit", (e) => {
//             e.preventDefault();
//             login();
//         })
//     } else {

//         createUserForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             createUser();
//             createUserForm.reset();

//         });
//     }
// })