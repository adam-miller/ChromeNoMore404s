function main() {
    var link = document.createElement("a");
    link.href = location.search.slice(1);
    var url = link.host;

document.title=document.title +" "+url;

document.querySelector('#dnsErrorMessage').innerText+=" "+url;

}

setTimeout(main,500);


