
const BASE_URL = 'http://192.168.6.164:8080'
import qs from 'qs';
// import fileDownload from "js-file-download";
function service(request) {
    return new Promise(async (resolve, reject) => {
   
       var url =''
        let config = {
            headers: {
                // 'token': localStorage.getItem('token') || "",
                'Accept':'application/json'
            },
        };
      
        if(request.method === 'get' || request.method === 'delete') {
            if(request.params) {
                 url = `${request.url}`+"?" + qs.stringify(request.params);                       
            }
            else{
                 url = request.url;
            }
        }
        else if(request.method === 'post' || request.method === 'put') {
            url = request.url;
            config = {
                method:request.method,
                headers: {
                    'Content-Type': 'application/json',
                    ...config.headers,
                },
            };
            if(request.data) {
                config = {
                    ...config,
                    body: JSON.stringify(request.data),
                };
            }
        }
     
        try {
            const response = await fetch(`${BASE_URL + url}`, {
                mode: 'cors',
                ...config,
            });

         if(request.responseType == "blob"){
           
         
            response.blob().then(blob =>{
                resolve(blob);
            })
          
         
         }else{
            response.json().then(res => {
                resolve(res);
            })
         }
        
        } catch(error) {
            reject(error);
        }
    });
}
 

export default service;

