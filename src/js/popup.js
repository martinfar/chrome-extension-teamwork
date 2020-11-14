import Teamwork from "teamwork-api"
import Promise from 'Bluebird'

let controller = new window.AbortController();

//const tw = Teamwork('chess987soccer', 'vatrox')  
const tw = Teamwork('ford135neon', 'vatrox')

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

            tw.projects.getTasklists(projectList[0].id).then(function (result) {
                console.log(result.tasklists)
                var tasklistsNames = result.tasklists.map(function (project) { return project.name; });
                $("#tasklists").on("keypress", function (e) {
                    awesompleteTl.list = tasklistsNames;

                });

                $('#updateTasks').click(function () {

                    //busca el objeto tasklist por el valor del nombre
                    var tasklistArray = result.tasklists.filter(item => {
                        return item.name === $("#tasklists").val()
                    })

                    tw.tasklist.getTasks(tasklistArray[0].id).then(function (result) {
                        console.log(result)
                        var taskNames = result['todo-items'].map(function (result) { return result.content; });

                        $("#task").on("keypress", function (e) {
                            awesompleteTk.list = taskNames;
                        });

                        $('#getTaskID').click(function () {
                            //busca el objeto task por el valor del nombre
                            var taskArray = result['todo-items'].filter(item => {
                                return item.content === $("#task").val()
                            })
                            console.log(result['todo-items'])

                            if (document.getElementById('copyTarget').textContent.length > 0) {
                                //do something
                                $("#copyTarget").text(taskArray[0].id);
                            } else {
                                document.getElementById("copyTarget").innerHTML = taskArray[0].id;
                            }
                        });
                    });


                })




                console.log(taskNames)




            });





        }
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

