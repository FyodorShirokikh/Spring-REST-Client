$(async function () {
    await getTableWithUsers();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    getCurrentUser: async () => await fetch(`api/users/getuser`),
    findOneUser: async (id) => await fetch(`api/users/${id}`)
}

async function getTableWithUsers() {
    let table = $('#notMainTableWithUser tbody');
    table.empty()
    let precuruser = await userFetchService.getCurrentUser();
    let heademail = $(".headEmail");
    let headroles = $(".headRoles");
    let mainmenudiv = $(".mainmenu");
    precuruser.json().then(async curuser => {
        heademail.replaceWith(`<div class="headEmail">${curuser.email}</div>`);
        headroles.replaceWith(`<div class="headRoles text-white">&nbsp with roles:&nbsp${curuser.rolesStr}</div>`);
        let roleSofUser = curuser.rolesStr;
        let mainmenutext = "";
        if (roleSofUser.indexOf('ADMIN') !== -1) {
            mainmenutext = `
                <div class="mainmenu nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <a class="nav-link" href="/admin" aria-selected="true">Admin</a>
                    <a class="nav-link active" id="v-pclassNameprofile-tab" href="/user" aria-selected="true">User</a></div>
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
        let userid = curuser.id;
        let preuser = await userFetchService.findOneUser(userid);
        let user = preuser.json();
        user.then(user => {
            let tableFilling = `$(
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.lastname}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.rolesStr}</td>                                                                         
                </tr>
        )`;
            table.append(tableFilling);
        })
    });
}