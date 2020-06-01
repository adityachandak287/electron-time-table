const { getDataFromStore, setDataInStore } = window.require("./utils.js");

var rootDiv = document.getElementById("root");
var setTimeTableButton = document.getElementById("setTimeTable");
var hideButton = document.getElementById("hideButton");
var dayDiv = document.getElementById("dayDiv");

const daytoDay = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
};

setTimeTableButton.addEventListener("click", (event) => {
  event.preventDefault();
  const { ipcRenderer } = window.require("electron");

  console.log("remote sending async");
  ipcRenderer.send("set-time-table", "ping");
  ipcRenderer.on("get-time-table", (event, arg) => {
    console.log("server sent", arg); // prints "pong"
    fetchData();
  });
  ipcRenderer.on("refresh", (event, arg) => {
    console.log("server refresh", arg); // prints "pong"
    ipcRenderer.send("test", "ping");
    fetchData();
  });
  ipcRenderer.on("get-time-table-req", (event, arg) => {
    console.log("get-time-table-req", arg); // prints "pong"
    rootDiv.innerHTML = "";
    fetchData();
  });
});

fetchData = async () => {
  const timetable = getDataFromStore("timetable");
  if (timetable) {
    const currentDay = getDay();
    timetable[currentDay].forEach((slot) => {
      makeSlot(slot);
    });
  }
};

getDay = () => {
  const currentDate = new Date().toString();
  const currentDay = currentDate.substr(0, 3).toLowerCase();
  dayDiv.textContent = daytoDay[currentDay];
  return currentDay;
  // return "thu";
};

makeSlot = (slotData) => {
  const htmlContent = `
  <div class="card-body">
    <div class="flexSpans">
      <span><strong>${slotData.slot}</strong></span>
      <span class="middleSpan">${slotData.location}</span>
      <span class="rightSpan"><strong>${slotData.start} - ${
    slotData.end
  }</strong></span>
    </div>
    <div class="flexSpans">
      <span><strong>${slotData.course_code}</strong></span>
      <span class="middleSpan"><img src=${
        slotData.component === "theory"
          ? "../static/theory.png"
          : "../static/lab.png"
      } width="32px" alt="theory" /></span>
      <span class="rightSpan"><strong>${slotData.course_name}</strong></span>
    </div>
  </div>`;
  let tempDiv = document.createElement("div");
  tempDiv.classList.add("card", "m-2", "rounded", "shadow-sm");
  // tempDiv.classList.add("m-2");
  // tempDiv.classList.add("rounded");
  //   tempDiv.classList.add("bg-light");
  tempDiv.innerHTML = htmlContent;
  rootDiv.appendChild(tempDiv);
};

fetchData();
// getTimeTable();
