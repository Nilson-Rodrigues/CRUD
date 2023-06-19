'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    //Limpando os campos
    clearFields()
    document.getElementById('modal')
        .classList.remove('active')
}
/* não mais necessário
//Variável dos parametros á serem salvos
const tempItem = {
    nome: 'Bombox',
    categoria: 'Caixa de Som',
    quantidade: '10',
    valor: '2500'
}
*/

//acesso ao banco de dados, ele retorna o banco
const getLocalStorage = () => JSON.parse(localStorage.getItem("db_inventario")) ?? [];
//localStorage não aceita json
const setLocalStorage = (db_inventario) => localStorage.setItem("db_inventario", JSON.stringify(db_inventario));

//CRUD - INICIO
//Create
const createItem = (item) => {
    //Criando um array para ir adicionando os cadastros
    const db_inventario = getLocalStorage()
    db_inventario.push(item);
    setLocalStorage(db_inventario)
}
//read
const readItem = () => getLocalStorage()
//Update
const updateItem = (index, item) => {
    const db_inventario = getLocalStorage()
    db_inventario[index] = item;
    setLocalStorage(db_inventario);
}
//Delete
const deleteItem = (index) => {
    const db_inventario = getLocalStorage()
    //splice altera o array original
    db_inventario.splice(index, 1)
    setLocalStorage(db_inventario)
}
//CRUD - FIM

//função para verificar os campos
const isValidFields = () => {
    //reportValidity retorna verdadeiro se todos os inputs seguirem as regras
    // do required
    return document.querySelector('#form-save').reportValidity()
}
//função para limpar os campos- vai junto com o closeModal()
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    //percorrendo campo por campo
    fields.forEach(field => field.value = '')
}

//Interações com o layout - INICIO
//Salvando um novo item
const saveItem = () => {

    //validação dos campos
    if (isValidFields()) {
        const item = {
            nome: document.querySelector('#nome').value,
            categoria: document.querySelector('#categoria').value,
            quantidade: document.querySelector('#quantidade').value,
            valor: document.querySelector('#valor').value
        }
        //caso o index seja new ele é um novo item a ser criado
        const index = document.querySelector('#nome').dataset.index
        if(index == 'new'){
            createItem(item);
            updateTable();
            closeModal();
        } else {
            //se não o editItem() altera o 'new' pelo 'index' do item
            updateItem(index, item)
            updateTable()
            closeModal()
        }
    }

}

//atualizando a tabela - INICIO

//função para criar uma linha para cada item
const creatRow = (item, index) =>{
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.categoria}</td>
    <td>${item.quantidade}</td>
    <td>R$ ${item.valor+',00'}</td>
    <td>
        <button type="button" class="button green" id="edit-${index}">Editar</button>
        <button type="button" class="button red" id="delete-${index}">Excluir</button>
    </td>
    `
    //adicionando ao DOM
    document.querySelector('#tbInventario>tbody').appendChild(newRow)
}

//Função para limpar a tabela antes de atualizar, para não repetir os dados
const clearTable = () =>{
    const rows = document.querySelectorAll('#tbInventario>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

//Mostrando os dados na tabela
const updateTable = () =>{
    const db_inventario = getLocalStorage()
    clearTable()
    //o forEach manda o valor e o index desse valor,
    // e com esse index podemos identificar cada elemento
    db_inventario.forEach(creatRow)
}

//Função para preencher os campos com os dados do item para editar
const fillFields = (item) => {
    document.querySelector('#nome').value = item.nome
    document.querySelector('#categoria').value = item.categoria
    document.querySelector('#quantidade').value = item.quantidade
    document.querySelector('#valor').value = item.valor
    document.querySelector('#nome').dataset.index = item.index
}

//Função para editar o item
const editItem = (index) =>{
    //identificando o item apartir do index
    const item = readItem()[index]
    item.index = index
    fillFields(item)
    openModal()
}

//Função dos botões
const editDelete = (event) => {
    //Identificando onde foi o click
    if(event.target.type == 'button'){
        //captura o ID do botão, split transforma em um array separando a ação do ID
        /* event.target.id.split('-') */

        //desestruturação cria duas variaveis apartir de um array
        const [action, index] = event.target.id.split('-');
        
        if(action=='edit'){
            editItem(index);
        }else{
            const item = readItem()[index]
            const response = confirm(`O item ${item.nome} vai ser excluido permanentemente, deseja continuar?`)
            if (response){
                deleteItem(index)
                updateTable()
            }
        }
    }
}

updateTable()
//atualizando a tabela - FIM

//Interações com o layout - FIM

//Eventos de click
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)
document.getElementById('modalClose')
    .addEventListener('click', closeModal)
document.querySelector('#salvar')
    .addEventListener('click', saveItem)
document.querySelector('#tbInventario>tbody')
    .addEventListener('click', editDelete)
document.querySelector('#cancelar')
    .addEventListener('click', closeModal)