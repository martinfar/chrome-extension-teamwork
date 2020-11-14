import Teamwork from "teamwork-api"


const tw = Teamwork('chess987soccer', 'vatrox')

function myItemFunc(text, input) {
    var newText = input.slice(0, input.indexOf(", ")) + ", " + text;

    return Awesomplete.$.create("li", {
        innerHTML: newText.replace(RegExp(input.trim(), "gi"), "<mark>$&</mark>"),
        "aria-selected": "false"
    });
}

function myFilterFunc(text, input) {
    if (input.indexOf(",") > -1) {
        return RegExp("^" + Awesomplete.$.regExpEscape(input.replace(/^.+?, /, ''), "i")).test(text);
    } else {
        return false;
    }
}

var input = document.getElementById("projects");
var awesomplete = new Awesomplete(input, {
  minChars: 1,
  autoFirst: true
});


$("input").on("keyup", function(){
    tw.projects.get({ status: "ACTIVE" }).then(function (result) {
        console.log(result.projects)
        var activeProjects = result.projects
        var nameArray = activeProjects.map(function (project) { return project.name; });
         awesomplete.list = nameArray;
    });
  });