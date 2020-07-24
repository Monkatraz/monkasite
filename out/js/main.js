// Helper functions
function removeElement(elementId) {
  var element = getElement(elementId);
  if(element){ element.parentNode.removeChild(element); }
}
function getElement(id){
  return document.getElementById(id)
}
function setClass(id, className){
  getElement(id).className = className;
}

// DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    // If we came in from a different URL (redirect)
    // we need to load the correct page
    // If it's no page, just leave it alone -
    // - the home page is already inside index.html
    const path = document.location.pathname;
    if(path != '/'){
      removeElement('pagecontainer')
      pageContentSwitch(path);
    }
    // When page is loaded,  we'll select all our nav-links and listen to them
    document.querySelectorAll('.nav_link,#header_sitename_text').forEach(
      link => link.addEventListener('click', goToPage)
    );
  })

// Page successfully switched, DOM is in
function onPageContentLoad() {
  const container = getElement('pagecontent_container');
  // Very slight timeout just for the sake of making things look smoother
  setTimeout(function(){ container.className = 'pg-loaded' }, 50);
  // Replace our crappy images with the correct ones
  container.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function(){
      if(this.getAttribute('data-src')) {
        this.setAttribute('src',this.getAttribute('data-src'));
      }
    });
  });
}
// Check if our mutation is actually a new page
// Rather than going through the mutations this is just simpler
// This isn't an extendable system - but it's fine for this
function checkIfNewPage(mutationsList, observer){
  if(getElement('pagecontent')){ onPageContentLoad() }
}
// Call function when our new page is in the DOM
const imgObserver = new MutationObserver(checkIfNewPage);
imgObserver.observe(getElement('pagecontent_container'), {subtree: true, childList: true});

// Fetch function to get our page and then load it once it has it
const fetchSettings = {}
function grabPageContent(page){
  // for the sake of simplicity I do this hacky string replace solution rather than proper rewriting of URLS
  fetch(page.replace('pages','partials'), fetchSettings)
    .then(data => data.text())
    .then(html => { getElement('pagecontent_container').innerHTML = html;});
}

// Primary switch page function
function pageContentSwitch(page){
  const pageClass = page.replace('.html','').split('/');

  // Set navbar and loading state
  setClass('pagecontent_container', 'pg-loading');
  setClass('header',pageClass[2] ? pageClass[2] : 'home');
  document.querySelectorAll('.nav_link').forEach(link => link.className= ('link-' + pageClass[2]) == link.id ? 'nav_link currentpage' : 'nav_link');

  // We're doing a timeout so that we can let the page disappear with an animation
  // Not for any actual reason, just purely for the purposes of coolfactor
  setTimeout(function(){
    removeElement('pagecontent');
    grabPageContent(page);
  }, 250);
}

// Function for nav buttons
function goToPage(event) {
  // Prevent page switch, scroll us back up to the top
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

// History events
// We store the page information in the history state
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

// Link dragging annoyance fix
// https://stackoverflow.com/questions/26356877/html5-draggable-false-not-working-in-firefox-browser
document.addEventListener('dragstart', function( event ) {
    if (event.target.localName == 'a') {
      event.preventDefault();
    }
}, false);
