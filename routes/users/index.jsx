import create from "./create"
import get from "./get";
import login from "./login";
import logout from "./logout";


export default (router, params) => {    
    create(router, params);
    get(router, params);
    login(router, params);
    logout(router, params);
}