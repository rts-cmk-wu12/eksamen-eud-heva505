
export function withParams(current,nextParms){
    const url=new URL(current, 'http://example.com');
    const searchParams=new URLSearchParams(url.search);

    Object.entries(nextParms).forEach(([key,value])=>{
        if(value=== null || value===undefined || value===""){
            searchParams.delete(key);
        } else {
            searchParams.set(key,String(value));
        }
    });

        url.search=searchParams.toString();
        return url.search? `?${searchParams.toString()}`
        : "";
    }