import Teamwork from "teamwork-api"
import '../css/popup.css';

var apiKey 
var company = 'vatrox'
var activeProjects

$.support.cors = true


if (typeof localStorage.getItem('apiKey') !== 'undefined' && localStorage.getItem('apiKey')) {

    apiKey = localStorage.getItem('apiKey')

    var entryApiKey = document.getElementById("entryApiKey");
    entryApiKey.style.display = "none"
    $("#localApiKey").text("API Key "+apiKey);
    var localApiKey = document.getElementById("localApiKey");
    localApiKey.style.display = "block"


} else {
    apiKey = $("#apiKey").val();
    localStorage.setItem('apiKey', apiKey)
}


$('#apiKeyButton').click(function () {

    if (typeof localStorage.getItem('apiKey') !== 'undefined' && localStorage.getItem('apiKey')) {

        apiKey = localStorage.getItem('apiKey')
    
        var entryApiKey = document.getElementById("entryApiKey");
        entryApiKey.style.display = "none"
        $("#localApiKey").text("API Key "+apiKey);
        var localApiKey = document.getElementById("localApiKey");
        localApiKey.style.display = "block"
    
    
    } else {
        apiKey = $("#apiKey").val();
        localStorage.setItem('apiKey', apiKey)
    }

    $.ajax({
        async: false,
        url: `https://${company}.teamwork.com/projects.json`,
        headers: {
            "Authorization": "Basic " + btoa(apiKey + ":" + 'xx'),
        },
        data: {
            status: "ACTIVE"
        },
        type: "GET",
        success: function (result) {
            console.dir(result);
            activeProjects = result.projects
        },
        error: function (e) {
            console.dir(e);
        }
    });

    $.ajax({
        async: false,
        url: `https://${company}.teamwork.com/authenticate.json`,
        headers: {
            "Authorization": "Basic " + btoa(apiKey + ":" + 'xx')
        },
        type: "GET",
        success: function (result) {
            userId = result.account.userId
        },
        error: function (e) {
            console.dir(e);
        }
    });

    console.dir(activeProjects);

    var userId
    var startTime = '09:00'
    var isbillable = 'true'


    //const tw = Teamwork('chess987soccer', 'vatrox')  
    //const tw = Teamwork(apiKey, company)

    var inputProjects = document.getElementById("projects");
    var awesompletePr = new Awesomplete(inputProjects, {
        minChars: 1,
        autoFirst: true
    });

    var inputTasklists = document.getElementById("tasklists");
    var awesompleteTl = new Awesomplete(inputTasklists, {
        minChars: 1,
        autoFirst: true
    });


    var inputTask = document.getElementById("task");
    var awesompleteTk = new Awesomplete(inputTask, {
        minChars: 1,
        autoFirst: true
    });






    //tw.projects.get({ status: "ACTIVE" }).then(function (result) {

    //console.log(result.projects)

    var projectNames = activeProjects.map(function (project) { return project.name; });
    var projectList

    $("#projects").on("keypress", function (e) {
        awesompletePr.list = projectNames;
        // if press enter
        if (e.which == 13) {
            //busca el objeto project por el valor del nombre
            projectList = activeProjects.filter(project => {
                return project.name === $("#projects").val()
            })


            let tasklistResult

            $.ajax({
                async: false,
                cache: false,
                url: `https://${company}.teamwork.com/projects/${projectList[0].id}/tasklists.json`,
                headers: {
                    "Authorization": "Basic " + btoa(apiKey + ":" + 'xx')
                },
                type: "GET",
                success: function (result) {
                    tasklistResult = result.tasklists
                },
                error: function (e) {
                    console.dir(e);
                }
            });




            console.log(tasklistResult)
            var tasklistsNames = tasklistResult.map(function (project) { return project.name; });
            $("#tasklists").on("keypress", function (e) {
                awesompleteTl.list = tasklistsNames;

            });

            var tasklistArray
            var taskListId

            $('#updateTasks').click(function () {

                //busca el objeto tasklist por el valor del nombre
                tasklistArray = tasklistResult.filter(item => {
                    return item.name === $("#tasklists").val()
                })

                taskListId = tasklistArray[0].id

                let taskObjList

                $.ajax({
                    async: false,
                    cache: false,
                    url: `https://${company}.teamwork.com/tasklists/${taskListId}/tasks.json`,
                    headers: {
                        "Authorization": "Basic " + btoa(apiKey + ":" + 'xx')
                    },
                    type: "GET",
                    success: function (resp) {
                        taskObjList = resp['todo-items']
                    },
                    error: function (e) {
                        console.dir(e);
                    }
                });


                var taskNames = taskObjList.map(function (result) { return result.content; });
                console.log(taskObjList)
                $("#task").on("keypress", function (e) {
                    awesompleteTk.list = taskNames;
                });

            })



            var taskId

            $('#getTaskID').click(function () {
                //busca el objeto task por el valor del nombre
                let taskSync
                //Buscar la lista de tareas para esa tasklist
                $.ajax({
                    async: false,
                    cache: false,
                    url: `https://${company}.teamwork.com/tasklists/${taskListId}/tasks.json`,
                    headers: {
                        "Authorization": "Basic " + btoa(apiKey + ":" + 'xx')
                    },
                    type: "GET",
                    success: function (respuesta) {
                        taskSync = respuesta['todo-items']
                    },
                    error: function (e) {
                        console.dir(e);
                    }
                });
                // filter for specific task name 
                var taskArray = taskSync.filter(item => {
                    return item.content === $("#task").val()
                })
                console.log(taskSync)
                // id of task


                if (taskArray.length > 0) {
                    taskId = taskArray[0].id;

                } else {

                    var newTaskObj = {
                        "todo-item": {
                            content: $("#task").val(),
                            "creator-id": userId
                        }
                    };

                    // Create task if id does not exist
                    $.ajax({
                        async: false,
                        cache: false,
                        url: `https://${company}.teamwork.com/tasklists/${taskListId}/tasks.json`,
                        headers: {
                            "Authorization": "Basic " + btoa(apiKey + ":" + 'xx')
                        },
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify(newTaskObj),
                        type: "POST",
                        success: function (resp) {
                            console.dir(resp);
                            taskId = resp.id;
                        },
                        error: function (e) {
                            console.dir(e);
                        }
                    });
                }

                if (document.getElementById('copyTarget').textContent.length > 0) {
                    $("#copyTarget").text(taskId);
                } else {
                    document.getElementById("copyTarget").innerHTML = taskId;
                }

            });


            $('#uploadTimeEntryTask').click(function () {


                var dateEntry


                // $( "#datepicker" ).datepicker();
                dateEntry = $('#datepicker').val();

                var description = $('#descripcion').val()
                var hours = $('#hours').val()
                var minutes = $('#minutes').val()
                var timeEntry = {
                    "time-entry": {
                        description: description, "person-id": userId, date: dateEntry,
                        time: startTime, hours: hours, minutes: minutes, isbillable: isbillable
                    }
                };



                $.ajax({
                    async: false,
                    cache: false,
                    url: `https://${company}.teamwork.com/tasks/${taskId}/time_entries.json`,
                    headers: {
                        "Authorization": "Basic " + btoa(apiKey + ":" + 'xx')
                    },
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(timeEntry),
                    type: "POST",
                    success: function (resp) {
                        console.dir(resp);
                    },
                    error: function (e) {
                        console.dir(e);
                    }
                });

            });

        }
    });


});

//});
//});

$('#datepicker').datepicker({ dateFormat: 'yymmdd' })

$('#hours, #minutes').keydown(function () {
    // Save old value.
    if (!$(this).val() || (parseInt($(this).val()) <= $(this).attr('max') && parseInt($(this).val()) >= $(this).attr('min')))
        $(this).data("old", $(this).val());
});
$('#hours, #minutes').keyup(function () {
    // Check correct, else revert back to old value.
    if (!$(this).val() || (parseInt($(this).val()) <= $(this).attr('max') && parseInt($(this).val()) >= $(this).attr('min')))
        ;
    else
        $(this).val($(this).data("old"));
});

document.getElementById("copyButton").addEventListener("click", function () {
    copyToClipboard(document.getElementById("copyTarget"));
});

function copyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch (e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}


// tw.projects.get({ status: "ACTIVE" }).then(function (result) {
//     console.log(result.projects)
//     var activeProjects = result.projects
//     var nameArray = activeProjects.map(function (project) { return project.name; });

//     awesomplete.list = nameArray
// });

//console.log (activeProjects.constructor.name)

//

