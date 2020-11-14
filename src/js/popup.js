import Teamwork from "teamwork-api"
import axios from "axios"
import Promise from "bluebird"

$.ajaxSetup({
    cache: false
});


Promise.config({
    // Enable warnings
    warnings: true,
    // Enable long stack traces
    longStackTraces: true,
    // Enable cancellation
    cancellation: true,
    // Enable monitoring
    monitoring: true,
    // Enable async hooks
    asyncHooks: true,
});

const request = axios.CancelToken.source();

var company = 'vatrox'
var apiKey = 'ford135neon'

//const tw = Teamwork('chess987soccer', 'vatrox')  
const tw = Teamwork(apiKey, company)

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


var tasksProm


tw.projects.get({ status: "ACTIVE" }).then(function (result) {
    console.log(result.projects)
    var activeProjects = result.projects
    var projectNames = activeProjects.map(function (project) { return project.name; });
    $("#projects").on("keypress", function (e) {
        awesompletePr.list = projectNames;
        // if press enter
        if (e.which == 13) {
            //busca el objeto project por el valor del nombre
            var projectList = activeProjects.filter(project => {
                return project.name === $("#projects").val()
            })
        }


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


            $('#updateTasks').click(function () {

                //busca el objeto tasklist por el valor del nombre
                 tasklistArray = tasklistResult.filter(item => {
                    return item.name === $("#tasklists").val()
                })

                let taskObjList

                $.ajax({
                    async: false,
                    cache: false,
                    url: `https://${company}.teamwork.com/tasklists/${tasklistArray[0].id}/tasks.json`,
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


            $('#getTaskID').click(function () {
                //busca el objeto task por el valor del nombre
                let taskSync
                $.ajax({
                    async: false,
                    cache: false,
                    url: `https://${company}.teamwork.com/tasklists/${tasklistArray[0].id}/tasks.json`,
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

                var taskArray = taskSync.filter(item => {
                    return item.content === $("#task").val()
                })
                console.log(taskSync)

                if (document.getElementById('copyTarget').textContent.length > 0) {
                    //do something
                    $("#copyTarget").text(taskArray[0].id);
                } else {
                    document.getElementById("copyTarget").innerHTML = taskArray[0].id;
                }

            });












        
    });
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

