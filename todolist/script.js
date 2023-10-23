window.addEventListener('load', loadTasks);//κανεί load όλα τα tasks απο το localstorage
//κάνω τα στοιχεία της html που θα χρησιμοποιήσω variables για την javascript, τα const θεωρούνται πολύ αποδοτικά στην μνήμη ram
const addTaskInput = document.getElementById('add-task-input');
const remindertimeInput = document.getElementById('remindertime');
const dueTimeInput = document.getElementById('duetime');
const catOptionsInput = document.getElementById('cat-options');
const sortOptionInput = document.getElementById('sort-option');
const addButton = document.getElementById('add-button');
const sortButton = document.getElementById('sort-button');
const todoTable = document.getElementById('todotable2');
const ch_box = document.getElementsByClassName('box');
let tasks = []; //αρχικοποίηση πίνακα

function addTask() {
  const taskTitle = addTaskInput.value;
  const remindertime = remindertimeInput.value;
  const catOption = catOptionsInput.value;
  //κάνει τρεις ελέγχους: αν υπάρχει περιεχόμενο στον τίτλο και αν η ημερα προθεσμιας και reminder είναι πριν απο σήμερα (εφόσον το default είναι 17 φλεβάρη αν δεν το αλλάξει ο χρήστης θα βγάλει λάθος.)
  if (!taskTitle){alert("Παρακαλώ μην αφήνετε τον τίτλο κενό."); return;}
  if (duetimeChecker(dueTimeInput.value) == false){return;}
  if (duetimeChecker(remindertimeInput.value) == false){return;}
  
  //Δϊνει ένα μοναδικό id στο entry το οποίο είναι η ημερομηνία σε μορφή date.now() (τα μιλισεκοντ που έχουν περάσει απο το 1970) το οποίο είναι μοναδικό και δεν πρόκειται ένα entry να έχει άλλο id
  const task = {
    id: Date.now(),
    title: taskTitle,
    dateAdded: new Date(),
    dateDue: dueTimeInput.value,
    reminder: remindertime,
    category: catOption,
    completed: false,
  };
  tasks.push(task);
  setAlertAtTime(task.title , task.reminder)
  renderTask(task);
  addTaskInput.value = '';
  remindertimeInput.value = '';
};

//χρησιμοποιεί την μέθοδο sort για να συγκρίνει μεταξύ τους τα rows με την ανάλογη παράμετρο που του έχω δώσει για sorting
function sortTasks() {
  const sortBy = sortOptionInput.value;

  switch (sortBy) {
    case 'date-added':
      
      tasks.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
      break;

    case 'date-due':
      tasks.sort((a, b) => new Date(a.dateDue) - new Date(b.dateDue));
      break;

    case 'completion-status':
      tasks.sort((a, b) => a.completed - b.completed);
      break;

    default:

      break;
  };
  todoTable.innerHTML = '';
 renderTasks();
};

// Listeners για τα κουμπιά του web app 
addButton.addEventListener('click', addTask);
sortButton.addEventListener('click', sortTasks);
todoTable.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-button')) {
    const row = event.target.closest('tr');
    const id = Number(row.dataset.id);
    deleteTask(id);
    row.remove();
  }

});

//Ελέγχει αν ο χρήστης έχει βάλει έγκυρη ημερομηνία.
function duetimeChecker(timeString) {
  const currentTime = new Date(); 
  const targetTime = new Date(timeString); 
  if (targetTime < currentTime) {
    alert("H Ημ/νια και ώρα που δηλώσατε δεν μπορεί να είναι πριν την τωρινή");
    return false;
  } else {
    return true;
  };
};

//Ενεργοποιείται μόλις ο χρήστης πατήσει το add button, γίνεται εκκίνηση ενός setTimeout το οποίο αποθηκεύεται μαζί με τον τίτλο της εργασίας στο localstorage και χτυπάει με alert() οταν τελειώσει ο χρόνος.
function setAlertAtTime(taskname, timeString) {
  const currentTime = new Date();
  const targetTime = new Date(timeString); 

  if (targetTime < currentTime) {
    alert("H Ημ/νια και ώρα που δηλώσατε δεν μπορεί να είναι πριν την τωρινή");
    return; 
  };
  const timeDiff = targetTime - currentTime; 
  localStorage.setItem("targetTime", targetTime.getTime());
  localStorage.setItem("tasktitle", taskname);
  setTimeout(() => {
    alert(`Ο χρόνος της προθεσμίας για την εργασία ${taskname} `);
    localStorage.removeItem("targetTime");
  }, timeDiff);
};

//ελέγχει αν όντως υπάρχει στο localstorage κάποιο alarm
const storedTargetTime = localStorage.getItem("targetTime");
const storedtasktitle = localStorage.getItem("tasktitle");
if (storedTargetTime) {
  const taskname = storedtasktitle;
  const targetTime = new Date(parseInt(storedTargetTime));
  const currentTime = new Date();
  if (targetTime > currentTime) {
    const timeDiff = targetTime - currentTime;
    setTimeout(() => {
      alert(`Ο χρόνος της προθεσμίας για την ${taskname} `);
      localStorage.removeItem("targetTime");
    }, timeDiff);
  } else {
    localStorage.removeItem("targetTime");
  };
};

function renderTasks() {
  tasks.forEach(task => {
    renderTask(task);
  });
};


//παίρνει το id απο την γραμμή 116, οπού βρίσκει το πιο κοντίνο tr απο αυτό στην html και παίρνει το custom id της σειράς που βρίσκεται.
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
};

//εμφανίζει τον πίνακα
function renderTask(task) {
  const row = todoTable.insertRow();
  row.dataset.id = task.id;
  row.innerHTML = `
    <td>${task.title}</td>
    <td>${task.dateDue.toLocaleString()}</td>
    <td>${task.dateAdded.toLocaleString()}</td>
    <td>${task.category}</td>
    <td><input class="box" type="checkbox" ${task.completed ? 'checked' : ''}></td>
    <td><button class="delete-button">Delete</button></td>
  `;
  //επρεπε να φτιάξω ένα event listener για να αποθηκεύσει την τιμή του checkbox στο localstorage όταν ο χρήστης το πατάει.
  const checkbox = row.querySelector('.box');
  checkbox.addEventListener('change', () => {
    const isChecked = checkbox.checked;
    const id = Number(row.dataset.id);
    const taskIndex = tasks.findIndex(task => task.id === id);
    tasks[taskIndex].completed = isChecked;
    saveTasks();
  });
  saveTasks();
};

function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    renderTasks();
  };
};

//αποθηκεύει τον πίνακα στο localstorage.
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};