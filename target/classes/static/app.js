$(async function () {
    await getTableWithUsers();
    getModal();
    addNewUser();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch(`api/users`),
    findOneUser: async (id) => await fetch(`api/users/${id}`),
    getCurrentUser: async () => await fetch(`api/users/getuser`),
    addUser: async (user) => await fetch(`api/users`,
        {method: 'POST', headers: userFetchService.head, body: JSON.stringify(user)}),
    updateUser: async (user) => await fetch(`api/users`,
        {method: 'PUT', headers: userFetchService.head, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`api/users/${id}`,
        {method: 'DELETE', headers: userFetchService.head})
}

async function getTableWithUsers() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();
    let precuruser = await userFetchService.getCurrentUser();
    let heademail = $(".headEmail");
    let headroles = $(".headRoles");
    let mainmenudiv = $(".mainmenu");
    precuruser.json().then(curuser => {
        heademail.replaceWith(`<div class="headEmail">${curuser.email}</div>`);
        headroles.replaceWith(`<div class="headRoles text-white">&nbsp with roles:&nbsp${curuser.rolesStr}</div>`);
        let roleSofUser = curuser.rolesStr;
        let mainmenutext = "";
        if (roleSofUser.indexOf('ADMIN') !== -1) {
            mainmenutext = `
                <div class="mainmenu nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <a class="nav-link active className-pills-home-tab" data-toggle=" pill" href="#nav-home" role="tab" 
                        aria-controls="nav-home" aria-selected="true">Admin</a>
                    <a class="nav-link" id="v-pclassNameprofile-tab" href="/user" aria-selected="true">User</a></div>
            `
        } else {
            mainmenutext = `
                <div class="mainmenu nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <a class="nav-link active" id="v-pills-profile-tab" data-toggle="pill" href="#nav-profile" role="tab"
                       aria-controls="nav-profile" aria-selected="true">User</a>
                    </div>
            `
        }
        mainmenudiv.replaceWith(mainmenutext);
    });

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let tableFilling = `$(
                        <tr id="rowUserId_${user.id}">
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.lastname}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>
                            <td>${user.rolesStr}</td>                                                
                            <td>
                                <button type="button" class="btn btn-info eBtn" id="editBtn"
                                data-userid="${user.id}" data-action="edit" 
                                data-toggle="modal" data-target="#editModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger dBtn" id="deleteBtn"
                                   data-userid="${user.id}" data-action="delete"
                                   data-toggle="modal" data-target="#editModal">Delete</button>
                            </td> 
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })
    $("#mainTableWithUsers").find('button').on('click', async(event) => {
        let defaultModal = $('#DefaultModal');
        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');
        console.log(buttonUserId + " " + buttonAction);
        /**
         * if (buttonAction === 'edit') {
         *     defaultModal = $('#editModal');
         * } else if (buttonAction === 'delete') {
         *     defaultModal = $('#deleteModal');
         * }
         */
        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function getModal() {
    $('#DefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        console.log(action);
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    });
}


async function editUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();
    modal.find('.modal-title').html('Edit user');
    let editButton = `<button class="btn btn-primary" id="editButton">Edit</button>`;
    let closeButton = `<button class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);
    user.then(user => {
        let bodyForm = `
            <div class="form-group text-center">
                <label for="id">ID</label>
                <input type="text" class="form-control" id="id"
                       name="id" value="${user.id}" readonly="true"/>
            </div>
            <div class="form-group text-center">
                <label for="username">First name</label>
                <input type="text" class="form-control" id="username"
                       name="username" value="${user.username}"/>
            </div>
            <div class="form-group text-center">
                <label for="lastname">Last name</label>
                <input type="text" class="form-control" id="lastname"
                       name="lastname" value="${user.lastname}">
            </div>
            <div class="form-group text-center">
                <label for="age">Age</label>
                <input type="number" class="form-control" id="age"
                       name="age" value="${user.age}">
            </div>
            <div class="form-group text-center">
                <label for="email">Email address</label>
                <input type="text" class="form-control" id="email"
                       name="email" value="${user.email}" required>
            </div>
            <div class="form-group text-center">
                <label for="password">Password</label>
                <input type="password" class="form-control"
                       id="password" name="password" required>
            </div>
            <div class="rolesE form-group text-center">
                <label for="rolesE">Role</label>
                <select multiple class="form-control" size=2
                    id="rolesE" name="rolesE" required>
                <option value="ROLE_ADMIN">ADMIN</option>
                <option value="ROLE_USER">USER</option>
            </select>
        </div>
    `;
        modal.find('.modal-body').append(bodyForm);
        let optionsToSelect = user.roles.map(item => item.name);
        if (optionsToSelect.indexOf('ROLE_USER') !== -1 && optionsToSelect.indexOf('ROLE_ADMIN') !== -1) {
            $('#rolesE option').prop('selected', true).change();
        } else if (optionsToSelect.indexOf('ROLE_USER') !== -1) {
            $('#rolesE option[value="ROLE_USER"]').prop('selected', true).change();
        } else if (optionsToSelect.indexOf('ROLE_ADMIN') !== -1) {
            $('#rolesE option[value="ROLE_ADMIN"]').prop('selected', true).change();
        }
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val().trim();
        let username = modal.find("#username").val().trim();
        let lastname = modal.find("#lastname").val().trim();
        let email = modal.find("#email").val().trim();
        let age = modal.find("#age").val().trim();
        let password = modal.find("#password").val().trim();
        let rolet = [];
        for (let option of document.getElementById('rolesE').options) {
            if (option.selected) {
                rolet.push(option.value);
            }
        }
        rolef = "";
        if (rolet.length === 1 && rolet[0] === 'ROLE_USER') {
            rolef = [{"id": 1, "name": "ROLE_USER"}]
        } else if (rolet.length === 1 && rolet[0] === 'ROLE_ADMIN') {
            rolef = [{"id": 2, "name": "ROLE_ADMIN"}]
        } else {
            rolef = [{"id": 1, "name": "ROLE_USER"}, {"id": 2, "name": "ROLE_ADMIN"}]
        }
        let data = {
            id: id,
            username: username,
            lastname: lastname,
            email: email,
            age: age,
            password: password,
            roles: rolef
        }
        if (password !== "" && email !== "" && rolef !== "")
        {
            const response = await userFetchService.updateUser(data);
            if (response.ok) {
                getTableWithUsers();
                modal.modal('hide');
            } else {
                let body = await response.json();
                let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                        ${body.info}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
                modal.find('.modal-body').prepend(alert);
            }
        }
    })
}

async function deleteUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();
    modal.find('.modal-title').html('Delete user');
    let deleteButton = `<button class="btn btn-danger" id="deleteButton">Delete</button>`;
    let closeButton = `<button class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(deleteButton);
    modal.find('.modal-footer').append(closeButton);
    user.then(user => {
        let bodyForm = `
            <div class="form-group text-center">
                <label for="dID">ID</label>
                <input class="form-control" id="dID" name="id"
                       type="text" value="${user.id}" readonly="true"/>
            </div>
            <div class="form-group text-center">
                <label for="dFirstName">First name</label>
                <input type="text" class="form-control" id="dFirstName"
                       name="username" value="${user.username}" readonly="true"/>
            </div>
            <div class="form-group text-center">
                <label for="dLastName">Last name</label>
                <input type="text" class="form-control" id="dLastName"
                       name="lastname" value="${user.lastname}" readonly="true"/>
            </div>
            <div class="form-group text-center">
                <label for="dAge">Age</label>
                <input type="number" class="form-control" id="dAge"
                       name="age" value="${user.age}" readonly="true"/>
            </div>
            <div class="form-group text-center">
                <label for="dEmail">Email address</label>
                <input type="text" class="form-control" id="dEmail"
                       name="email" value="${user.email}" readonly="true"/>
            </div>
            <div class="dRoles form-group text-center">
                <label for="dRoles">Role</label>
                <select disabled multiple class="form-control" size=2
                        id="dRoles" name="dRoles" readonly="true">
                    <option value="ROLE_ADMIN">ADMIN</option>
                    <option value="ROLE_USER">USER</option>
                </select>
            </div>
        `;
        modal.find('.modal-body').append(bodyForm);
        let optionsToSelect = user.roles.map(item => item.name);
        if (optionsToSelect.indexOf('ROLE_USER') !== -1 && optionsToSelect.indexOf('ROLE_ADMIN') !== -1) {
            $('#dRoles option').prop('selected', true).change();
        } else if (optionsToSelect.indexOf('ROLE_USER') !== -1) {
            $('#dRoles option[value="ROLE_USER"]').prop('selected', true).change();
        } else if (optionsToSelect.indexOf('ROLE_ADMIN') !== -1) {
            $('#dRoles option[value="ROLE_ADMIN"]').prop('selected', true).change();
        }
    })
    $("#deleteButton").on('click', async () => {
        let id = modal.find("#dID").val().trim();
        const response = await userFetchService.deleteUser(id);
        if (response.ok) {
            let idStr = '#rowUserId_' + id;
            let rowDel = $(idStr);
            rowDel.remove();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                        ${body.info}
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function addNewUser() {
    $('#addNewUserButton').click(async () =>  {
        let addUserForm = $('#addNewUserForm')
        let username = addUserForm.find('#addNewUsername').val().trim();
        let lastname = addUserForm.find('#addNewLastname').val().trim();
        let age = addUserForm.find('#addNewAge').val().trim();
        let email = addUserForm.find('#addNewEmail').val().trim();
        let password = addUserForm.find('#addNewPassword').val().trim();
        let rolet = [];
        for (let option of document.getElementById('addNewRoles').options) {
            if (option.selected) {
                rolet.push(option.value);
            }
        }
        rolef = "";
        if (rolet.length === 1 && rolet[0] === 'ROLE_USER') {
            rolef = [{"id": 1, "name": "ROLE_USER"}]
        } else if (rolet.length === 1 && rolet[0] === 'ROLE_ADMIN') {
            rolef = [{"id": 2, "name": "ROLE_ADMIN"}]
        } else {
            rolef = [{"id": 1, "name": "ROLE_USER"}, {"id": 2, "name": "ROLE_ADMIN"}]
        }
        let data = {
            username: username,
            lastname: lastname,
            age: age,
            email: email,
            password: password,
            roles: rolef
        };
        if (password !== "" && email !== "" && rolef !== "") {
            const response = await userFetchService.addUser(data);
            if (response.ok) {
                getTableWithUsers();
            } else {
                let body = await response.json();
                let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="someMessageError">
                                ${body.info}
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>`;
                addUserForm.prepend(alert)
            }
        }
    })
}