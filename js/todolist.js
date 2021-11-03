;(function(){
    'use strict'
    const $itemInput = document.getElementById('item-input');
    // const $addItemBtn = document.getElementById('add-item');
    const $todoAddForm = document.getElementById('todo-add');
    const $todoList = document.getElementById('todo-list');
    const $todoListLi = $todoList.getElementsByTagName('li');
    let arrTasks = getSavedData();
    function getSavedData() {
        let dataTasks = JSON.parse(localStorage.getItem('tasks'));
        if (dataTasks) {
            if (!dataTasks.length) {
                return [{name: 'Olá, bem vindo!', createAt: Date.now(), completed: false}];
            } else {
                return dataTasks;
            }
        } else {
            return [{name: 'Olá, bem vindo!', createAt: Date.now(), completed: false}];
        }
    }
    function generateLiTask(obj) {
        const li = document.createElement('li');
        li.className = 'col-12 col-md-6 col-lg-4 todo-item';
        const buttonCheck = document.createElement('button');
        buttonCheck.className = 'button-check';
        buttonCheck.setAttribute('data-action','checkbutton')
        buttonCheck.innerHTML = `<i class="fas fa-check ${obj.completed ? "" : "displayNone"}" data-action="checkbutton"></i>`;
        if (obj.completed) {
        } else {
        }
        li.appendChild(buttonCheck);
        const p = document.createElement('p');
        p.className = 'task-name';
        p.textContent = obj.name;
        li.appendChild(p);
        const iconEdit = document.createElement('i');
        iconEdit.setAttribute('data-action', 'editbutton');
        iconEdit.className = 'fas fa-edit';
        li.appendChild(iconEdit);
        const divEdit = document.createElement('div');
        divEdit.className = 'editContainer';
        divEdit.innerHTML = '<input class="editInput" type="text"><button data-action="edit_edit" class="editButton">OK</button><button data-action="edit_cancel" class="cancelButton">Cancelar</button>';
        li.appendChild(divEdit);
        const iconTrash = document.createElement('i');
        iconTrash.setAttribute('data-action', 'trashbutton');
        iconTrash.className = 'fas fa-trash-alt';
        li.appendChild(iconTrash);
        // addEventLi(li);
        return li;
    }

    function renderTasks() {
        $todoList.innerHTML = '';
        arrTasks.forEach(task => {
            $todoList.appendChild(generateLiTask(task));
        })
        saveLocal();
    }

    function saveLocal() {
        localStorage.setItem('tasks', JSON.stringify(arrTasks));
    }

    function addTask(task) {
        arrTasks.push({name: task, createAt: Date.now(), completed: false})
    }

    function clickedUl(e) {
        const dataAction = e.target.getAttribute('data-action');
        if (!dataAction) return;

        let currentLi = e.target;
        while (currentLi.nodeName != "LI") {
            currentLi = currentLi.parentElement;
        }
        let currentLiIndex = [...$todoListLi].indexOf(currentLi);
        let editContainer = currentLi.querySelector('div.editContainer');
        let editContainerTxt = editContainer.querySelector('.editInput');

        const actions = {
            checkbutton: function() {
                arrTasks[currentLiIndex].completed = !arrTasks[currentLiIndex].completed;
                renderTasks();
            },
            editbutton: function() {
                [...$todoList.querySelectorAll('div.editContainer')].forEach(container => {
                    container.removeAttribute('style');
                })
                editContainer.style.display = "flex";
                editContainerTxt.value = arrTasks[currentLiIndex].name;
            },
            trashbutton: function() {
                arrTasks.splice(currentLiIndex, 1);
                renderTasks();
            },
            edit_edit: function() {
                if (editContainerTxt.value) {
                    arrTasks[currentLiIndex].name = editContainerTxt.value;
                    renderTasks();
                    editContainer.removeAttribute('style');
                } else {
                    editContainerTxt.focus();
                }
            },
            edit_cancel: function() {
                editContainer.removeAttribute('style');
            }
        }
        if (actions[dataAction]) {
            actions[dataAction]()
        }
    }

    $todoAddForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if($itemInput.value != '') {
            addTask($itemInput.value);
        }
        $itemInput.value = '';
        $itemInput.focus();
        renderTasks();
    });
    $todoList.addEventListener('click', clickedUl);

    renderTasks();
})()