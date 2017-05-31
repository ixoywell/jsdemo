function showTime() {
    document.getElementById('clock').value = new Date();
    setTimeout('showTime()',1000);
}
setTimeout('showTime()',1000);