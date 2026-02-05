// generate_recipe_json.js
function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\((?:.|\n)*?\)/g, ' ')
    .replace(/[&]/g, ' and ')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

function keyFromItem(item) {
  const raw = (item || '').trim();
  let s = raw.replace(/\((?:.|\n)*?\)/g, ' ');
  const LEADING_DROP = ['fresh', 'uncooked', 'raw'];
  s = s.replace(new RegExp('^\\s*(' + LEADING_DROP.join('|') + ')\\b\\s*', 'i'), '');
  return slugify(s);
}

function htmlEscape(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Example data
const recipe = {
  id: 1,
  name: "Creamy Lemon Dill Chicken & Rice Casserole",
  servings: 4,
  tags: ["chicken", "casserole", "lemon", "dill", "oven", "rice"],
  ingredients: [
    { amount: "500 g", item: "chicken breast", key: keyFromItem("chicken breast"), notes: "cubed" }
  ],
  instructions: [
    "Preheat oven to 190°C / 375°F.",
    "In a baking dish, combine rice and chicken broth."
  ]
};

const ingredients = recipe.ingredients;
const instructions = recipe.instructions;

const tagSet = new Set(ingredients.map(i => i.key).filter(Boolean));
const ingredientTags = Array.from(tagSet).sort();

const atomSet = new Set();
ingredientTags.forEach(k => k.split('-').forEach(tok => tok && atomSet.add(tok)));
const ingredientAtoms = Array.from(atomSet).sort();

const payload = {
  id: recipe.id,
  name: recipe.name, // Do not escape HTML here if you want plain JSON
  servings: recipe.servings,
  tags: recipe.tags,
  components: [
    { component_name: "Ingredients", ingredients },
    { component_name: "Instructions", instructions }
  ],
  ingredientTags,
  ingredientAtoms
};

console.log(JSON.stringify(payload, null, 2));
