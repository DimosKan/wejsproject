//Ψάχνει το localstorage και αποθηκεύει το περιεχόμενο στην μεταβλητή recipes
let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

//Εμφανίζει τις συνταγές
function renderRecipes() {
  let table = document.getElementById("recipe-table");
  while (table.rows.length > 1) {
    table.deleteRow(1);
  };
  //εμφανίζει κάθε row
  recipes.forEach(function(recipe, index) {
    let row = table.insertRow(index+1);
    let titleCell = row.insertCell(0);
    let ingredientsCell = row.insertCell(1);
    let instructionsCell = row.insertCell(2);
    let categoryCell = row.insertCell(3 );
    let actionCell = row.insertCell(4);
    categoryCell.classList.add("category-cell");
    actionCell.classList.add("action-cell");
    titleCell.innerHTML = recipe.title;
    ingredientsCell.innerHTML = recipe.ingredients;
    instructionsCell.innerHTML = recipe.instructions;
    categoryCell.innerHTML = recipe.category;
    actionCell.innerHTML = "<button onclick='editRecipe("+index+")'>Επεξεργασία</button> <button onclick='deleteRecipe("+index+")'>Διαγραφή</button>";
  });
};

//Γράφει σε ένα object όλες τις τιμές που πήρε απο την φόρμα.
function addRecipe() {
  let form = document.getElementById("recipe-form");
  let recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value,
    instructions: form.instructions.value,
    category: form.category.value
  };
  recipes.push(recipe);
  localStorage.setItem("recipes", JSON.stringify(recipes));//αποθήκευση στο storage
  form.reset();
  renderRecipes();
};

//Σκανάρει όλα τα rows για την λέξη κλειδί που δώθηκε στο search σε κάθε column, όταν βρει κάτι τα βάζει σε έναν πίνακα και τα εμφανίζει όλα μαζί.
function searchRecipes() {
  let query = document.getElementById("search").value.toLowerCase();
  let matches = [];
  recipes.forEach(function(recipe) {
    if (recipe.title.toLowerCase().includes(query ) || recipe.ingredients.toLowerCase().includes(query) || recipe.instructions.toLowerCase().includes(query)) {
      matches.push(recipe);
    };
  });
  recipes = matches;
  renderRecipes();
};

//με το να πατάει ο χρήστης το κλειδί διαγράφει το entry, βάζει κάθε value στο form input που αντιστοιχεί και ο χρήστης επεξεργάζεται ουσιαστικά ένα νέο entry.
function editRecipe(index) {
  let recipe = recipes[index];
  let form =document.getElementById("recipe-form");
  form.title.value = recipe.title;
  form.ingredients.value = recipe.ingredients;
  form.instructions.value =recipe.instructions;
  form.category.value = recipe.category;
  recipes.splice(index,1);
  localStorage.setItem("recipes",JSON.stringify(recipes));
  renderRecipes();
};

//Διαγραφεί του
function deleteRecipe(index) {
  recipes.splice(index,1);
  localStorage.setItem("recipes",JSON.stringify(recipes));
  renderRecipes();
};

renderRecipes();
