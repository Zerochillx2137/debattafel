/** Browser client for the DEBATTAFEL server API. Secrets never enter this module. */
export const categories=['Nederlandse politiek','Internationale politiek','Economie','Klimaat','Technologie','Maatschappij','Europa','Onderwijs','Wetenschap'];
let latest=null;
async function request(path,options={}){const response=await fetch(path,{headers:{Accept:'application/json','Content-Type':'application/json',...(options.headers||{})},...options});const data=await response.json().catch(()=>({}));if(!response.ok){const error=Error(data.error||'Er ging iets mis.');error.status=response.status;throw error}return data}
export async function getLatestNews(force=false){if(latest&&!force)return latest;latest=await request('/api/news');return latest}
export async function getLastSuccessfulUpdate(){return (await getLatestNews()).updatedAt?{updatedAt:(await getLatestNews()).updatedAt}:null}
export async function getNewsByCategory(category){return (await getLatestNews()).articles.filter(article=>article.category===category)}
export async function searchNews(query){const value=query.trim().toLocaleLowerCase('nl');return (await getLatestNews()).articles.filter(article=>[article.title,article.summary,article.category,article.source,...(article.tags||[])].join(' ').toLocaleLowerCase('nl').includes(value))}
export async function getDebate(slug){return request(`/api/debates/${encodeURIComponent(slug)}`)}
export async function trainerRound(statement,argument,round){return request('/api/trainer',{method:'POST',body:JSON.stringify({statement,argument,round})})}
