import { deletes, get, post } from "./services";
const urlEvents = "http://localhost:3001/events";

// show events

export async function showEvents() {
  let containerEvents = document.getElementById("information-events")
  let dataEvents = await get(urlEvents)
  dataEvents.forEach(event => {
    containerEvents.innerHTML +=
      `<div style="border: black 1px solid">
        <tr>
            <td>${event.nameEvent}</td>
            <td>${event.description}</td>
            <td>${event.capacity}</td>
            <td>${event.date}</td>
            <td><button class="edit-btn" id="${event.id}">Editar</button>
            <button class="delete-btn" id="${event.id}">Eliminar</button></td>
        </tr>
    </div>
    `
    
});
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


export function createEvent() {
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

    }
  });
}