import { login, createUser } from "./scriptUsers";
import { showEvents,createEvent } from "./scriptEvents";


const urlEvents = "http://localhost:3001/events";
const urlUsers = "http://localhost:3001/users";

const routes = {
  "/login": "./views/login.html",
  "/register": "./views/register.html",
  "/admin": "./views/admin.html",
  "/user": "./views/user.html",
  "/events": "./views/events.html",
  "/newEvent": "./views/newEvent.html",
};

// SPA
document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    navigate(e.target.getAttribute("href"));
  }
});

export async function navigate(pathname) {
  const route = routes[pathname];
  const html = await fetch(route).then((res) => res.text());
  document.getElementById("content").innerHTML = html;
  history.pushState({}, "", pathname);
  if (pathname == "/login") {
    login(urlUsers)
  } else if (pathname == "/register") {
    createUser(urlUsers)
  } else if (pathname == "/events") {
    showEvents()
  } else if (pathname == "/newEvent") {
    createEvent()
  }
}

window.addEventListener("popstate", () =>
  navigate(location.pathname)
);

//recargar la pagina con vista protegida

window.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  if(currentUser){
    if (currentUser.role === "admin"){
      navigate("/admin");
    } else {
      navigate("/user");
    }
  } else {
    navigate("/login")
  }

})