
const urlUsers = "http://localhost:3001/users";
const urlEvents = "http://localhost:3001/events";


const routes = {
    "/login": "./views/login.html",
    "/register": "./views/register.html",
    "/admin": "./views/admin.html",
    "/user": "./views/user.html",
    "/events": "./views/events.html",
    "/newEvent": "./views/newEvent.html",
};

alert("bienvenido");

//services

async function post(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('No se pudo guardar el usuario');
    }

    return await response.json();
}

async function get(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error en GET:", error);
  }
}

async function update(url, id, body) {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body) // body debe ser un objeto como { title, body, userId }
    });

    const data = await response.json();
    console.log("PUT actualizado:", data);
    return data;
  } catch (error) {
    console.error("Error en PUT:", error);
    throw error;
  }
}

async function deletes(url, id) {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      console.log("DELETE: recurso eliminado correctamente");
      return true;
    } else {
      console.error("Error al eliminar");
      return false;
    }
  } catch (error) {
    console.error("Error en DELETE:", error);
    throw error;
  }
}

// SPA

document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
  }
});

async function navigate(pathname) {
    const route = routes[pathname];
    const html = await fetch(route).then((res) => res.text());
    document.getElementById("content").innerHTML = html;
    history.pushState({}, "", pathname);

    if (pathname == "/login") {
        login()
    } else if (pathname == "/register") {
        createUser()
    } else if (pathname == "/events") {
        showEvents()
    } else if (pathname == "/newEvent") {
        createEvent()
    }
}


window.addEventListener("popstate", () =>
  navigate(location.pathname)
);


// funcion de login 
function login() {
    const loginForm = document.getElementById('loginForm');
    const message = document.getElementById('message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('db.json');
            const data = await response.json();
            const user = data.users.find(u => u.username === username && u.password === password);
            
            if (user) {
                localStorage.setItem('userName', username);
                
                // Redirigir según el rol
                if (user.role === 'admin') {
                    localStorage.setItem('role',"admin");
                    window.location.href = './views/admin.html'; // Página de administrador
                } else {
                    localStorage.setItem('role',"user");
                    window.location.href = './views/user.html'; // Página de usuario normal
                }
            } else {
                message.textContent = 'Usuario o contraseña incorrectos.';

            }
        } catch (error) {
            message.textContent = 'Error al iniciar sesión. Inténtalo de nuevo más tarde.';

        }
    });
}

// Create user
function createUser() {
    const createUserForm = document.getElementById('new-user');
    const message = document.getElementById('message');

    createUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();


        try {
            const response = await fetch(urlUsers);
            const users = await response.json();

            const userExists = users.find(u => u.username === username);

            if (userExists) {
                message.textContent = `El usuario "${username}" ya existe`;
            } else {
                const newUser = {
                    username,
                    password,
                    role: "user"
                };

                const createdUser = await post(urlUsers, newUser);

                message.textContent = `El usuario "${createdUser.username}" se ha creado correctamente`;

                createUserForm.reset();
            }
        } catch (error) {
            
            message.textContent = "Error al crear el usuario";
        }
    });
}


// show events

async function showEvents() {
  let containerEvents = document.getElementById("information-events")
  let dataEvents = await get(urlEvents)
  dataEvents.forEach(event => {
    containerEvents.innerHTML += 
    `<div style="border: black 1px solid">
        <tr>
            <td>${event.name}</td>
            <td>${event.description}</td>
            <td>${event.capacity}</td>
            <td>${event.date}</td>
            <td><button class="edit-btn" id="${event.id}">Editar</button>
            <button class="delete-btn" id="${event.id}">Eliminar</button></td>
        </tr>
    </div>
    `

  });


}


function createEvent() {
    const createEventForm = document.getElementById('form-new-event');
    const message = document.getElementById('message');

    createEventForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameEvent = document.getElementById('nameEvent').value.trim();
        const description = document.getElementById('description').value.trim();
        const date = document.getElementById('date').value.trim();
        const capacity = document.getElementById('capacity').value.trim();


        try {
            const response = await fetch(urlEvents);
            const event = await response.json();

            const eventExists = event.find(u => u.nameEvent === nameEvent);

            if (eventExists) {
                message.textContent = `El evento "${nameEvent}" ya existe`;
            } else {
                const newEvent = {
                    nameEvent,
                    description,
                    date,
                    capacity
                };

                const createdEvent = await post(urlEvents, newEvent);

                message.textContent = `El Evento "${createdEvent.nameEvent}" se ha creado correctamente`;

                createEventForm.reset();
            }
        } catch (error) {
            alert("error al crear evento")
            message.textContent = "Error al crear el Evento";

            let buttons = document.querySelectorAll(".delete-btn")
            buttons.forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    let id = btn.id
                    let deleteEvent = await deletes(urlUsers, id)
                    if (deleteEvent) {
                        alert("Evento eliminado correctamente")
                        navigate("/events")
                    } else {
                        alert("Evento no eliminado correctamente")
                    }
                })
            })
        }
    });
}
