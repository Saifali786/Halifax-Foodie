import { Component } from "material";

class kommunicateChat extends Component{
    constructor(props){
        super(props)

    }

    ComponentDidMount(){
        (function(d, m){
            var kommunicateSettings = {"appId":"6db3a3e9fa923776078e2111cb4ec3f9","popupWidget":true,"automaticChatOpenOnNavigation":true};
            var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
            s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
            var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
            window.kommunicate = m; m._globals = kommunicateSettings;
          })(document, window.kommunicate || {});
    }

    render(){
        return(
            <div>

            </div>
        )
    }
}

export default kommunicateChat