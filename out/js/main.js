function removeElement(elementId) {
  // Removes an element from the document
  var element = getElement(elementId);
  if(element){ element.parentNode.removeChild(element); }
}

function getElement(id){
  return document.getElementById(id)
}

function setClass(id, className){
  getElement(id).className = className;
}

const fetchSettings = {}

function grabPageContent(page){
  fetch(page, fetchSettings)
    .then(data => data.text())
    .then(html => { getElement('pagecontent_container').innerHTML = html;
    setClass('pagecontent_container','pg-loaded');  });
}

function pageContentSwitch(page){
  const pageClass = page.replace('.html','').split('/');

  setClass('pagecontent_container', 'pg-loading');
  setClass('header',pageClass[2] ? pageClass[2] : 'home');
  document.querySelectorAll('.nav_link').forEach(link => link.className= ('link-' + pageClass[2]) == link.id ? 'nav_link currentpage' : 'nav_link');

  setTimeout(function(){
    removeElement('pagecontent');
    grabPageContent(page);
  }, 250);
}

function goToPage(event) {
  event.preventDefault();
  window.scrollTo(0,0);

  const hrefUrl = event.target.getAttribute('href');
  const pageName = hrefUrl.search('home') > 0 ? 'monkasite.html' : event.target.innerHTML + ' | monk.html';
  const pageToLoad = hrefUrl + '.html';
  const curPage = hrefUrl.search('home') > 0 ? '/' : hrefUrl;

  document.title = pageName
  window.history.pushState({'pageName': pageName, 'page': curPage}, pageName, curPage);
  pageContentSwitch(pageToLoad);
}
document.querySelectorAll('.nav_link,#header_sitename_text').forEach(link => link.addEventListener('click', goToPage));

window.onpopstate = function(event) {
  const pageName = event.state['pageName'];
  const url = event.state['page'];

  if(url && url!='/'){
    pageContentSwitch(url+'.html');
    document.title = pageName;
  }else{
    pageContentSwitch('../pages/home.html');
    document.title = 'monkasite.html';
  }
}

document.addEventListener('DOMContentLoaded', function() {
    const path = document.location.pathname;
    if(path != '/'){
      pageContentSwitch(path);
    }
}, false);

// Dragging fix
// https://stackoverflow.com/questions/26356877/html5-draggable-false-not-working-in-firefox-browser
document.addEventListener("dragstart", function( event ) {
    if (event.target.localName == 'a') {
      event.preventDefault();
    }
}, false);
