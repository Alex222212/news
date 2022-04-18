// Custom Http Module
function customHttp() {
  return {
    get(url, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        xhr.send();
      } catch (error) {
        cb(error);
      }
    },
    post(url, body, headers, cb) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.addEventListener('load', () => {
          if (Math.floor(xhr.status / 100) !== 2) {
            cb(`Error. Status code: ${xhr.status}`, xhr);
            return;
          }
          const response = JSON.parse(xhr.responseText);
          cb(null, response);
        });

        xhr.addEventListener('error', () => {
          cb(`Error. Status code: ${xhr.status}`, xhr);
        });

        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(JSON.stringify(body));
      } catch (error) {
        cb(error);
      }
    },
  };
}
// Init http module
const http = customHttp();
const cont = document.querySelector('.grid-container')
const form = document.forms['newsControls']
const county = form.elements['country']
const query = form.elements['autocomplete-input']
form.addEventListener('submit', (e)=>{
  e.preventDefault()
  if(!query.value){
    NewsServise.topHead(county.value, getResponceNews)
    return
  }
  NewsServise.everyThing(query.value, getResponceNews)
})
//  -----init selects----------
document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();
  LoadNews()
});
const NewsServise = function(){
  const url = 'http://newsapi.org/v2';
  const api = '9320deac48a1453382c781b5d0716f5a'
  return{
    topHead(country = 'us', cb){
      http.get(`${url}/top-headlines?country=${country}&apiKey=${api}`,cb)
    },
    everyThing(query,cb){
      http.get(`${url}/everything?q=${query}&apiKey=${api}`,cb)
    }
  }
}();

function LoadNews (){
  NewsServise.topHead('ru', getResponceNews)
}
function getResponceNews(err, res){
  if (err) {
    console.log(err);
  }
  NewsTemplate(res)
}
function NewsTemplate(res){
  let fragment = ''
  res.articles.forEach(news=>{
    const frag = createHTMLNews(news);
    fragment += frag;
  })
  cont.innerHTML=''
  cont.insertAdjacentHTML('afterbegin',fragment)
}
function createHTMLNews(news){
  return `
  <div class="col s12">
  <div class="card">
    <div class="card-image">
      <img src="${news.urlToImage || 's.jfif'}" alt="">
      <span class="card-title">${news.title}</span>
    </div>
    <div class="card-content">
      <p>${news.description || ''}</p>
    </div>
    <div class="card-action">
      <a href="${news.url}">Read More</a>
    </div>
  </div>
</div>
  `
}
