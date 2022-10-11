"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var messageDiv = getMessageElement(user, message, "massageContainer", "name-left");
    document.getElementById("chat").append(messageDiv);
});

connection.on("ReceiveCallerMessage", function (user, message) {
    var messageDiv = getMessageElement(user, message, "massageContainer darker", "name-right");
    document.getElementById("chat").append(messageDiv);
});


function getMessageElement (user, message, messageClass, nameClass){
    var messageDiv = document.createElement("div");
    messageDiv.className = messageClass;
    var span = document.createElement("span");
    var p = document.createElement("p");
    span.textContent = user;
    span.className = nameClass;
    p.textContent = message;
    messageDiv.append(span);
    messageDiv.append(p);
    return messageDiv;
}

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    document.getElementById("messageInput").value = '';
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});