const { getDataFromStore, setDataInStore } = window.require("./utils.js");

const textAreaElement = document.querySelector("textarea");
const setTimeTableButton = document.querySelector("#setTimeTable");

const changeTextAreaRows = () => {
  textAreaElement.rows = textAreaElement.rows === 15 ? 12 : 15;
};

setTimeTableButton.addEventListener("click", (event) => {
  event.preventDefault();
  const allData = textAreaElement.value;
  //   var timeTableData = [];
  if (allData.trim() !== "") {
    const lines = allData.split("\n");
    try {
      const ttData = generateJSON(lines);
      const ttMerged = mergeComponents(ttData);
      const jsonValue = JSON.stringify(ttMerged, null, 4);
      textAreaElement.value = jsonValue;
      setDataInStore("timetable", ttMerged);
      if (document.querySelector("#errorBanner").style.display) {
        document.querySelector("#errorBanner").style.display = "none";
      } else {
        changeTextAreaRows();
      }
      document.querySelector("#successBanner").style.display = "block";
      setTimeTableButton.disabled = true;
      const { ipcRenderer } = window.require("electron");
      ipcRenderer.send("time-table-is-set", "ping");
    } catch (err) {
      console.log(err);
      changeTextAreaRows();
      document.querySelector("#errorBanner").style.display = "block";
    }
  }
});

const mergeComponents = (slotData) => {
  //   console.log(slotData);
  let finalData = {};
  for (const day of Object.keys(slotData)) {
    finalData[day] = [];
    const { theory, lab } = slotData[day];

    for (let course of theory) {
      course.component = "theory";
    }
    for (let course of lab) {
      course.component = "lab";
    }

    if (lab && lab.length === 0) {
      finalData[day] = theory.slice();
    } else if (theory && theory.length === 0) {
      finalData[day] = lab.slice();
    } else {
      let theoryIndex = 0,
        labIndex = 0;
      while (theoryIndex < theory.length && labIndex < lab.length) {
        const { start: tStartS } = theory[theoryIndex];
        const { start: lStartS } = lab[labIndex];
        const tStart = parseInt(tStartS.substr(0, 2));
        const lStart = parseInt(lStartS.substr(0, 2));
        if (tStart < lStart) {
          finalData[day].push(theory[theoryIndex++]);
        } else {
          finalData[day].push(lab[labIndex++]);
        }
      }
      while (theoryIndex < theory.length) {
        finalData[day].push(theory[theoryIndex++]);
      }
      while (labIndex < lab.length) {
        finalData[day].push(lab[labIndex++]);
      }
    }
  }
  return finalData;
};

document
  .querySelector("#closeErrorBanner")
  .addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector("#errorBanner").style.display = "none";
    changeTextAreaRows();
  });
document
  .querySelector("#closeSuccessBanner")
  .addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector("#successBanner").style.display = "none";
    changeTextAreaRows();
  });

generateJSON = (allData) => {
  var slots = {};
  var timings = {};

  const days = "mon tue wed thu fri sat sun".split(" ");
  const ignore_words = "theory lab lunch".split(" ");

  let current_component = "";
  for (let line of allData.slice(0, 4)) {
    const cols = line.trim().split("\t");
    let current = "";
    let col_ind = 0;
    for (let col of cols) {
      cell = col.toLowerCase();
      if (["theory", "lab"].indexOf(cell) !== -1) {
        current_component = col.toLowerCase();
        timings[current_component] = [];
      } else if (["start", "end"].indexOf(cell) !== -1) {
        current = cell;
      } else {
        if (current === "start")
          timings[current_component].push({ start: cell });
        else {
          timings[current_component][col_ind][current] = cell;
        }
        col_ind += 1;
      }
    }
  }

  let current_day = "";
  current_component = "";
  for (let line of allData.slice(4)) {
    const cols = line.trim().split("\t");
    let ind_offset = 0;
    for (let col_ind = 0; col_ind < cols.length; col_ind++) {
      const col = cols[col_ind];
      const cell = col.toLowerCase();
      if (days.indexOf(cell) !== -1) {
        slots[cell] = {};
        current_day = cell;
      }
      if (["theory", "lab"].indexOf(cell) !== -1) {
        current_component = col.toLowerCase();
        slots[current_day][current_component] = [];
        ind_offset = col_ind + 1;
      }
      if (ignore_words.indexOf(cell) === -1) {
        const index = col_ind - ind_offset;
        const info = col.split("-");
        if (info.length > 1 && info[0].trim() !== "") {
          const [slot, course_code, _, location] = info;
          const { start, end } = timings[current_component][index];
          slots[current_day][current_component].push({
            slot: slot,
            course_code: course_code,
            course_name: "course_name",
            location: location,
            start: start,
            end: end,
          });
        }
      }
    }
  }
  return slots;
};
