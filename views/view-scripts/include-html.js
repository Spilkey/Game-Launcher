

function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /*loop through a collection of all HTML elements:*/
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        includeSpecificHtml(elmnt)
    }
};

function includeSpecificHtml(element){
    /*search for elements with a certain atrribute:*/
    file = element.getAttribute("w3-include-html");
    if (file) {
        /*make an HTTP request using the attribute value as the file name:*/
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {element.innerHTML = this.responseText;}
                if (this.status == 404) {element.innerHTML = "Page not found.";}
                let id = element.getAttribute('id');
                document.dispatchEvent(events[id]);
            }
        }      
        xhttp.open("GET", file, true);
        xhttp.send();
        /*exit the function:*/
        return;
    }
}