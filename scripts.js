// Seleciona os elementos do formulario
const form = document.querySelector('form')
const amount = document.getElementById('amount')
const expense = document.getElementById('expense')
const category = document.getElementById('category')

// Seleciona os elementos da ul
const expenseList = document.querySelector('ul')
const expenseQuantity = document.querySelector('aside header p span')
const expenseTotal = document.querySelector('aside header h2')

// Arrow Function
// Pega o submit do input para formatar o valor
amount.oninput = () => {
  // Pega o valor do input e remove as letras
  let value = amount.value.replace(/\D/g, '')

  // Transforma o valor em centavos (150/100 = 1.5 = R$ 1,50)
  value = Number(value) / 100
  
  // Atualiza o valor do input
  amount.value = formatCurrencyBRL(value)
}

// Formata o valor para Real BR
function formatCurrencyBRL(value){
  value = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return value
}

// Armazena os valores pós submit
form.onsubmit = (event) => {
  // Faz com a página não recarregue com o clique do submit
  event.preventDefault()

  // Cria um objeto com os dados da nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  // Adiciona o item na lista
  expenseAdd(newExpense)
}

// Adiciona um novo item na ul
function expenseAdd(newExpense){
  try {
    // Cria o elemento li para adicionar na ul
    const expenseItem = document.createElement('li')
    expenseItem.classList.add('expense')

    // Cria o icone da categoria
    const expenseIcon = document.createElement('img')
    expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute('alt', newExpense.category_name)

    // Cria a info da despesa
    const expenseInfo = document.createElement('div')
    expenseInfo.classList.add('expense-info')

    // Cria o nome da despesa
    const expenseName = document.createElement('strong')
    expenseName.textContent =  newExpense.expense

    // Cria a categoria da despesa
    const expenseCategory = document.createElement('span')
    expenseCategory.textContent =  newExpense.category_name

    // Coloca o name e a category dentro da div expense-info
    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa
    const expenseAmount = document.createElement('span')
    expenseAmount.classList.add('expense-amount')
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace('R$', '')}`

    //Cria o X de remover
    const removeIcon = document.createElement('img')
    removeIcon.classList.add('remove-icon')
    removeIcon.setAttribute('src', 'img/remove.svg')
    removeIcon.setAttribute('alt', 'remover')

    // Adiciona as informações na li
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // Adiciona o item na ul
    expenseList.append(expenseItem)

    // Atualiza a quantidade de despesas e do total do refund
    updateTotals()

    // Limpa os campos
    clear()

  } catch (error) {
    alert('Não foi possível atualizar a lista de despesas.')
    console.log(error)
  }
}

// Atualiza quantas e o valor total das despesas
function updateTotals() {
  try {
    // Conta quantas depesas(li) há na ul
    const items = expenseList.children

    // Atualiza a quantidade de itens da ul
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? 'despesas' : 'despesa'}`

    // Var para calcular o total do refund
    let total = 0

    // Percorre cada item(li) da ul
    for(let item = 0; item < items.length; item++){
      const itemAmount = items[item].querySelector('.expense-amount')

      // Remove caracteres não numéricos e substitui a vírgula pelo ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, '').replace(',', '.')

      // Converte o valor para float
      value = parseFloat(value)

      // Verifica se o número é válido
      if(isNaN(value)){
        return alert('Não foi possível calcular o total. O valor não parece ser um número.')
      }

      // Incrementar o valor total
      total += Number(value)
    }

    // Cria a span para adicionar o R$ formatado
    const symbolBRL = document.createElement('small')
    symbolBRL.textContent = 'R$'

    // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace('R$', '')

    // Limpa o conteúdo do elemento
    expenseTotal.innerHTML = ''

    //Adiciona o símbolo da moeda e o valor total formatado
    expenseTotal.append(symbolBRL, total)

  } catch (error) {
    console.log(error)
    alert('Não foi possível atualizar a quantidade de despesas e o valor total delas.')
  }
}

// Evento que captura o clique nos itens da lista
expenseList.addEventListener('click', function (event) {
  // Verifica se o elemento clicado é o ícone de remover
  if(event.target.classList.contains('remove-icon')){
    // Pega a li pai do elemento clicado
    const item = event.target.closest('.expense')

    // Remove item da lista
    item.remove()
  }
  // Atualiza a quantidade de despesas
  updateTotals()
})

function clear(){
  // Limpa os campos depois do submit
  expense.value = ''
  category.value = ''
  amount.value = ''

  // Coloca o foco no input principal
  expense.focus()
}