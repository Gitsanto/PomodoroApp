let countdown = 0; // variable to set/clear intervals
let seconds = 1500; // seconds left on the clock
let workTime = 25;
let breakTime = 5;
let isBreak = true;
let isPaused = true;
let timerTime = "25:00";

const status = document.querySelector("#status");
const timerDisplay = document.querySelector(".timerDisplay");
const startBtn = document.querySelector("#start-btn");
const endBtn = document.querySelector("#end-btn");
const resetBtn = document.querySelector("#reset");
const workMin = document.querySelector("#work-min");
const breakMin = document.querySelector("#break-min");

const alarm = document.createElement('audio'); // A bell sound will play when the timer reaches 0
alarm.setAttribute("src", "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");


/* EVENT LISTENERS FOR START AND RESET BUTTONS */
startBtn.addEventListener('click', () => {
  clearInterval(countdown);
  isPaused = !isPaused;
  if (!isPaused) {
    countdown = setInterval(timer, 1000);
  }
  updateTracking(2);
})

endBtn.addEventListener('click', () => {
  clearInterval(countdown);
  if(!isPaused || !isBreak){
    updateTracking(3);
    seconds = workTime * 60;
    countdown = 0;
    isPaused = true;
    isBreak = true;
  }
})

resetBtn.addEventListener('click', () => {
  clearInterval(countdown);
  seconds = workTime * 60;
  countdown = 0;
  isPaused = true;
  isBreak = true;
})

/* TIMER - HANDLES COUNTDOWN */
function timer() {
  seconds --;
  if (seconds < 0) {
    clearInterval(countdown);
    alarm.currentTime = 0;
    alarm.play();
    seconds = (isBreak ? breakTime : workTime) * 60;
    isBreak = !isBreak;
    countdown = setInterval(timer, 1000);
  }
}

 
/* UPDATE WORK AND BREAK TIMES */
let increment = 5;

let incrementFunctions =
    {"#work-plus": function () { workTime = Math.min(workTime + increment, 60)},
     "#work-minus": function () { workTime = Math.max(workTime - increment, 5)},
     "#break-plus": function () { breakTime = Math.min(breakTime + increment, 60)},
     "#break-minus": function () { breakTime = Math.max(breakTime - increment, 5)}};

for (var key in incrementFunctions) {
    if (incrementFunctions.hasOwnProperty(key)) {
      document.querySelector(key).onclick = incrementFunctions[key];
    }
}

/* UPDATE HTML CONTENT */
function countdownDisplay() {
  let minutes = Math.floor(seconds / 60);
  let remainderSeconds = seconds % 60;
  // timerDisplay.textContent = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  timerTime = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  timerDisplay.textContent = timerTime
  document.title =  timerTime + " | Pomodoro Clock"
}

function buttonDisplay() {
  if (isPaused && countdown === 0) {
    startBtn.textContent = "START";
  } else if (isPaused && countdown !== 0) {
    startBtn.textContent = "Continue"; 
  } else {
    startBtn.textContent = "Pause";
  }
}

function updateHTML() {
  countdownDisplay();
  buttonDisplay();
  isBreak ? status.textContent = "Keep Working" : status.textContent = "Take a Break!";
  workMin.textContent = workTime;
  breakMin.textContent = breakTime;  
}

window.setInterval(updateHTML, 100);

document.onclick = updateHTML;

/*
  @desc Update Tracking table
  @param  {Number} $updatingCol - Column of table where timestamp is insert
  @return {}
 */
function updateTracking(updatingCol) {
  const TotalRow = $tableID.find('tbody tr').length
  var table = document.getElementById("table");
  var row = table.getElementsByTagName("tr")[TotalRow];
  
  // const $row = $(this).parents('tr');

  if(TotalRow <= 1){
      $('tbody').append(newTr);
  }

  const td = row.getElementsByTagName("td")[updatingCol];
  const td3 = row.getElementsByTagName("td")[3];
  const TdValue = td.innerHTML.trim().replace("<br>", "");
  const Td3Value = td3.innerHTML.trim().replace("<br>", "");
  
  if (TdValue == "" ){
    td.innerHTML = new Date();
  // if TotalRow is less than 1 or Table donot have value
  }else if (TotalRow <= 1 || Td3Value != "") {
     const $clone = $tableID.find('tbody tr').last().clone(true).removeClass('hide table-line');
     $tableID.find('table').append($clone);
     const TotalRow = $tableID.find('tbody tr').length
     const  lastrow = table.getElementsByTagName("tr")[TotalRow];
     lastrow.getElementsByTagName("td")[2].innerHTML = new Date();
     lastrow.getElementsByTagName("td")[3].innerHTML = "";
  }

}

// addded for table-editable
const $tableID = $('#table');
const $BTN = $('#export-btn');
const $EXPORT = $('#export');
const $AddTable = $('.table-add');

 const newTr = `
<tr class="hide">
<td class="pt-3-half" contenteditable="true">Working</td>
<td class="pt-3-half" contenteditable="true">25</td>
<td class="pt-3-half" contenteditable="true"></td>
<td class="pt-3-half" contenteditable="true"></td>
<td>
  <span class="table-remove"><i type="button"
    class="material-icons white-text red">clear</i></span>
<span class="table-up"><i type="button"
      class="material-icons">vertical_align_top</i></span>
<span class="table-down"><i type="button"
        class="material-icons">vertical_align_bottom</i></span>
</td>
</tr>`;


//  $('.table-add').on('click', 'i', () => {
$AddTable.on('click', () => {
   const $clone = $tableID.find('tbody tr').last().clone(true).removeClass('hide table-line');
   
   if ($tableID.find('tbody tr').length === 0) {
     $('tbody').append(newTr);
   }
   $tableID.find('table').append($clone);
 });

 $tableID.on('click', '.table-remove', function () {
  if ($tableID.find('tbody tr').length > 1) {
   $(this).parents('tr').detach();
  }
 });

 $tableID.on('click', '.table-up', function () {

   const $row = $(this).parents('tr');

  //  if ($row.index() === 1) {
  //    return;
  //  }

   $row.prev().before($row.get(0));
 });

 $tableID.on('click', '.table-down', function () {
   const $row = $(this).parents('tr');
   $row.next().after($row.get(0));
 });

 // A few jQuery helpers for exporting only
 jQuery.fn.pop = [].pop;
 jQuery.fn.shift = [].shift;

 $BTN.on('click', () => {

   const $rows = $tableID.find('tr:not(:hidden)');
   const headers = [];
   const data = [];

   // Get the headers (add special header logic here)
   $($rows.shift()).find('th:not(:empty)').each(function () {

     headers.push($(this).text().toLowerCase());
   });

   // Turn all existing rows into a loopable array
   $rows.each(function () {
     const $td = $(this).find('td');
     const h = {};

     // Use the headers from earlier to name our hash keys
     headers.forEach((header, i) => {

       h[header] = $td.eq(i).text();
     });

     data.push(h);
   });

   // Output the result
   $EXPORT.text(JSON.stringify(data));
 });