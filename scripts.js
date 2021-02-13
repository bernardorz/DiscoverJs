
const Modal = {
    // open(){
    //   //Function open() => Abre o modal, adiciona a classe active em .modal-overlay .
    //  const modalOpen = document.querySelector(".modal-overlay")
    //  modalOpen.classList.add("active")
    // },

    // close(){
    //   //Function close() => Fecha o modal, removendo a class active em .modal-overlay active .
    //   const modalClose = document.querySelector(".modal-overlay")
    //   modalClose.classList.remove("active")
    // },

    //contains faz a verificação se contem a class "active" na div ".modal-overlay"
    // ? => true | : => false
    //Se Conter => ? modalOpen.classList.remove("active")
    //Se Não conter => : modalOpen.classList.add("active")
    toggle(){
    const modalOpen = document.querySelector(".modal-overlay");
    modalOpen.classList.contains("active") ? modalOpen.classList.remove("active") : modalOpen.classList.add("active");
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const transactions = [

    {
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021'
    },
    {
        description: 'Website',
        amount: -500000,
        date: '23/01/2021'
    },
    {
        description: 'Internet',
        amount: 200000,
        date: '23/01/2021'
    },
    {
        description: 'Puteiro',
        amount: -20000,
        date: '24/01/2021'
    }
]


const Transaction = {
    //soma total
    all:Storage.get(),

    add(transaction){
         Transaction.all.push(transaction)

         App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes(){
    //Pegar todas as transações
    //Verificar se a transação é maior que zero
    //para cada transação se for maior que zero somar a uma variavel e retornar ela
    let income = 0;
    Transaction.all.forEach(transaction => {
        if(transaction.amount > 0){
            income += transaction.amount;
        }
    }) 
    return income;
    },

    expenses(){
        let expense = 0;
    
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0){
                expense += transaction.amount;
            }
        })
        return expense;
    },

    total(){
    //Entradas - Saídas
        
    return Transaction.incomes() + Transaction.expenses()
    }

}

const  DOM = {

    transactionsContainer: document.querySelector("#data-table tbody"),


    addTransaction(transaction, index){
    const tr = document.createElement('tr') // criando elemente na dom
    tr.innerHTML = DOM.innerHTMLTransection(transaction)  
    tr.dataset.index = index

     DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransection(transaction, index){

        const Cssclass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${Cssclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
          <img onclick="Transaction.remove(${index})" src="./public/images/minus.svg" alt="" />
        </td>`

        return html;
    },

    updateBalance(){
        document
        .getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document
        .getElementById('expenseDisplay')
        .innerHTML =  Utils.formatCurrency(Transaction.expenses())

        document
        .getElementById('totalDisplay')
        .innerHTML =  Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {

    formatAmount(value){
        value = Number(value) * 100
        
        return value
    },

    formatDate(date){
     const spliteedDate = date.split("-")
     return `${spliteedDate[2]}/${spliteedDate[1]}/${spliteedDate[0]}`
    },
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

       return signal + value
    }
}

const Form = {
    description : document.querySelector('input#description'),
    amount : document.querySelector('input#amount'),
    date : document.querySelector('input#data'),

    getValues(){
       return{
           description : Form.description.value,
           amount : Form.amount.value,
           date: Form.date.value
       }
    },

    formatData(){
        console.log("Formatar dados")
    },
    validateFields(){
        const {description, amount, date} = Form.getValues()
        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, preencha todos os campos")
        } else{
            const p = document.querySelector('#errorText');

            p.innerHTML = ""
        }
    },

    formatValues(){
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return{
            description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value= ""
        Form.amount.value= ""
        Form.date.value= ""
    },

    submit(event){
        event.preventDefault()


       try {
        Form.validateFields()  //Validação dos campos
        const transaction = Form.formatValues() // Pegar transação formatada
        Transaction.add(transaction) //Adicionar transação
        Form.clearFields() //Limpar os fields do formulario
        Modal.toggle() //Fecha modal
       } catch (error) {
        
        const p = document.querySelector('#errorText');

        p.innerHTML = "Por favor, preencha todos os campos necessarios"
       }


        //Veficar se todas as informações foram preenchidas
        //Formatar os dados para salvar 
        //salvar
        //apagar os dados do formulario
        //close modal
        //Atualizar a aplicação

        // Form.validateFields()
        // Form.formatData()
    }
}


const App = {
    init(){

       Transaction.all.forEach(DOM.addTransaction)
        
       
       
       DOM.updateBalance()

       Storage.set(Transaction.all)
       
       
    },
    reload(){
        DOM.clearTransactions()
        App.init()
    }
}
App.init()


