/**
 * This function renders the detail view of the task
 *
 * @param {number} i - The id of the task to render
 */
function renderTaskdetailHTML(i) {
    findAssignedUser(i);
    showSubtasksInProgress(i);
    showSubtasksFinished(i);
    renderPriorityText(i);
    createHTML(i);
}

/**
 * This function renders the subtask headline
 *
 * @returns - The generated HTML string representing the subtask headline
 */
function renderSubtaskHeadline() {
    return (subtaskHeadline = /*html*/ `
    <div class="task-detail-font-color margin-bottom10">
     Subtasks
    </div>`);
}

/**
 * This function shows the subtasks in progress, if available
 *
 * @param {number} i - The id of the task
 */
function showSubtasksInProgress(i) {
    inProgress = '';
    let subtasksProgress = tasks[i]['subtasksInProgress'];
    subtaskHeadline = '';
    for (let k = 0; k < subtasksProgress.length; k++) {
        let subtaskProgress = subtasksProgress[k];
        renderSubtaskHeadline();
        inProgress += /*html*/ ` 
        <div class="task-detail-flex margin-bottom10">
            <img onclick="switchSubtaskStatusToFinished(${i}, ${k})" class="task-box" src="./img/subtask-checkbox-unchecked.svg" alt="">
            ${subtaskProgress}
            <img onclick="deleteSubtaskInProgress(${i}, ${k})" class="subtask-delete" src="./img/close.svg" alt="">
        </div>
        `;
    }
    updateBoardHTML();
}

/**
 * This function switches the status ob a subtask to finished
 * @param {number} i - The id of the task
 * @param {number} k - The id of the undone subtask
 */
async function switchSubtaskStatusToFinished(i, k) {
    let splicedSubtask = tasks[i]['subtasksInProgress'].splice(k, 1);
    tasks[i]['subtasksFinish'].push(splicedSubtask);
    await currentUserTaskSave();
    renderTaskdetailHTML(i);
}

/**
 * This function deletes an undone subtask
 * @param {number} i - The id of the task
 * @param {number} k - The id of the undone subtask to delete
 */
async function deleteSubtaskInProgress(i, k) {
    tasks[i]['subtasksInProgress'].splice(k, 1);
    await currentUserTaskSave();
    renderTaskdetailHTML(i);
}

/**
 * This function shows the finished subtasks, if available
 *
 * @param {number} i - The id of the task
 */
function showSubtasksFinished(i) {
    finished = '';
    let subtasksDone = tasks[i]['subtasksFinish'];
    for (let l = 0; l < subtasksDone.length; l++) {
        let subtaskDone = subtasksDone[l];
        renderSubtaskHeadline();
        finished += /*html*/ ` 
       <div class="task-detail-flex margin-bottom10 text-line-through">
           <img onclick="switchSubtaskStatusToUndone(${i},${l})" class="task-box" src="./img/subtask-done.svg" alt="">
           ${subtaskDone}
           <img onclick="deleteSubtaskFinished(${i},${l})" class="subtask-delete"  src="img/close.svg" alt="">
       </div>`;
    }
    updateBoardHTML();
}

/**
 * This function switches the status of a subtask to undone
 * @param {number} i - The id of the task
 * @param {number} k - The id of the done subtask
 */
async function switchSubtaskStatusToUndone(i, l) {
    let splicedSubtask = tasks[i]['subtasksFinish'].splice(l, 1);
    tasks[i]['subtasksInProgress'].push(splicedSubtask);
    await currentUserTaskSave();
    renderTaskdetailHTML(i);
}

/**
 * This function deletes a done subtask
 * @param {number} i - The id of the task
 * @param {number} k - The id of the done subtask to delete
 */
async function deleteSubtaskFinished(i, l) {
    tasks[i]['subtasksFinish'].splice(l, 1);
    await currentUserTaskSave();
    renderTaskdetailHTML(i);
}

/**
 * This function renders the priority
 *
 * @param {number} i - The id of the task
 */
function renderPriorityText(i) {
    let prioLow = './img/prioLow.svg';
    let prioMedium = './img/prioMedium.svg';
    let prioUrgent = './img/prioUrgent.svg';
    taskPriority = '';
    if (prioLow === tasks[i]['priority']) {
        taskPriority = 'Low';
    }
    if (prioMedium === tasks[i]['priority']) {
        taskPriority = 'Medium';
    }
    if (prioUrgent === tasks[i]['priority']) {
        taskPriority = 'Urgent';
    }
}

/** * This function is used to impede the closing of a container */
function stopBody(event) {
    event.stopPropagation();
}

/**
 * This function renders the detailed task
 *
 * @param {number} i - The id of the task
 */
function createHTML(i) {
    document.getElementById('board_popup_section').classList.remove('d-none');
    let priority = tasks[i]['priority'];
    let imageUrl;
    let priorityText;
    if (priority == 'low') {
        imageUrl = './img/prio-low.svg';
        priorityText = 'Low';
    }
    if (priority == 'medium') {
        imageUrl = './img/prio-medium.svg';
        priorityText = 'Medium';
    }
    if (priority == 'urgent') {
        imageUrl = './img/prio-urgent.svg';
        priorityText = 'Urgent';
    }
    if (priority == ''){
        imageUrl = '';
        priorityText = '';
    }

    document.getElementById('board_popup_section').innerHTML = /*html*/ `

    <div onclick="stopBody(event)" class="task-detail" id="task_card">
            <div class="task-detail-content-container">
                <div class="task-detail-top">
                    <div class="task-detail-category" style="${tasks[i]['categoryColor']}"> ${tasks[i]['category']}</div>
                    <img onclick="slideOut('task_card', 'board_popup_section', 200)" src="img/close.svg" alt="close" class="close-hover">
                </div>
                <div class="task-detail-content">
                    <div class="task-detail-title">
                        <h2>${tasks[i]['title']}</h2>
                    </div>
                    <div class="task-description show-scrollbar">
                        ${tasks[i]['description']}
                    </div>
                    <div class="task-detail-flex">
                        <div class="task-detail-font-color">Due date:</div>
                        <div> ${tasks[i]['dueDate']}</div>
                    </div>
                    <div class="task-detail-flex">
                        <div class="task-detail-font-color">Priority:</div>
                        <div class="priority-container">
                            <div>${priorityText}</div>
                            <img src="${imageUrl}">
                        </div>
                    </div>
                    <div>
                        <div class="margin-bottom10 task-detail-font-color">Assigned To:</div>
                        <div class="task-detail-users show-scrollbar">                            
                        ${assignedUserDetail}
                        </div>
                    </div>
                    <div class="task-detail-subtasks show-scrollbar">                        
                        ${subtaskHeadline}
                        ${inProgress}
                        ${finished}
                    </div>
                </div>
            </div>
            <div class="task-detail-bottom">
                <div onclick="deleteTask(${i})" class="delete-edit-buttons">
                    <img  src="img/delete.svg" alt="">Delete
                </div>
                <img src="img/vector-detail-card.svg" alt="">
                <div onclick="editTask(${i})" class="delete-edit-buttons">
                    <img  src="img/pen.svg" alt="">Edit
                </div>
            </div>
        </div>
    `;
}

/**
 * This function shows the assigned user on the detailed task
 *
 * @param {number} i - The id of the task
 * @returns - The generated HTML string representing the assigned User
 */
function findAssignedUser(i) {
    let userNames = tasks[i]['contactName'];
    let users = tasks[i]['contactAbbreviation'];
    let colors = tasks[i]['contactColor'];
    // if(users == undefined){
    //     assignedUserDetail = '';
    // } else {
        assignedUserDetail = '';
        for (let j = 0; j < users.length; j++) {
            let user = users[j];
            let userName = userNames[j];
            let color = colors[j];
            assignedUserDetail += /*html*/ ` 
            <div class="user-details">
                <div class="profile-picture" style="background-color:${color}">
                    ${user}
                </div>
                <div class="user-name">
                    ${userName}
                </div>   
            </div>
            `;
        }
    // }
   
    return assignedUserDetail;
}

/**
 * This function closes the detail view of a task
 *
 */
function closeTask() {
    document.getElementById('task_card').classList.add('d-none');
    document.getElementById('board_popup_section').classList.add('d-none');
}

/**
 * This function deletes a task
 *
 * @param {number} i - The id of the task
 */
async function deleteTask(i) {
    tasks.splice(i, 1);
    await currentUserTaskSave();
    closeTask();
    updateBoardHTML();
}

