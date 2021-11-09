
//
// LaunchDarkly Client JS SDK wrapper
// - wraps commonly used APIs
// - creates a single instance of the LaunchDarkly client to window.ldWrapperInstance
//
const ld_js_wrapper = ({clientId, project, environment,  debug=false, createUser=_=>({anonymous:true})} )=>{
    
    var user=createUser();

    let ldInstance = {
        STATUS_READY:'ready',
        STATUS_FAILED:'failed',
        STATUS_ERROR:'error',
        status:"initializing",
        version: LDClient.version,
        project,
        environment,
        clientId,
        onError:function(fn){this.on('error',function(error){
            this.status= this.STATUS_ERROR;
            fn(error);
        })},
        onFailed:function(fn){this.on('failed',function(error){
            this.status= this.STATUS_FAILED;
            fn(error);
        })},
        sendMetric:function(metricName, value, data){this.track(metricName, data, value)},
        onReady:function(fn){
            this.on('ready',_=>{
                this.status= this.STATUS_READY;
                fn();
            })
        },
        onChange:function(flagKey, fn){this.on(`change:${flagKey}`,fn)}
    }
    ;
    function main(){
        
        const options={
            evaluationReasons:false
        };

        if (debug){
            options.logger=LDClient.createConsoleLogger("debug");
        }

        
        
        let ldClient = LDClient.initialize(
                                            clientId,
                                            user,
                                            options);
        // Extend the LDClient obj
        // Add your LDClient API overridies here
        // For example:
        // ldInstance={ 
        //         ...ldClient, 
        //         ...ldInstance, 
        //         variation:(flagKey, defaultValue)=> this.variation(flagKey, defaultValue)
        // };
        ldInstance={...ldClient, ...ldInstance};
        
        ldClient.on('ready', function(){
            ldInstance.status="ready";
        })
         
        ldClient.on('error', function({message}){
            ldInstance.status="error";
            console.log(`ld_js_wrapper.js: Error status detected. ${message}`);
        })
        ldClient.on('failed', function({message}){
            ldInstance.status="failed";
            console.log(`ld_js_wrapper.js: Failed status detected. ${message}`);
           
        })
    }

    // check if instance already exist
    if (window && window.ldWrapperInstance){
        debugger;
        if (window.ldWrapperInstance.clientId == clientId){
            return window.ldWrapperInstance;
        }
        
    }


    // Main
    main();

    if (window){
        window.ldWrapperInstance=ldInstance;
    }

    return ldInstance;
};


function createUser({key, name, email, group, anonymous}={anonymous:true, name:"anonymous"}){

    let isAnonymous= (anonymous && (anonymous=='true' || anonymous==true));
    let userObj={
        key: (isAnonymous)? null :key,
        name, email,
        anonymous: isAnonymous,
        custom:{
            timestamp: Date.now(),
            group
        }
    };

    if (isAnonymous){
        delete userObj.key;
    }

    return userObj;
}