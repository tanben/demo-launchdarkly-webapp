
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
        // LDOptions Streaming options for LD Relay
        // https://launchdarkly.github.io/js-client-sdk/interfaces/_launchdarkly_js_client_sdk_.ldoptions.html#streamurl
        // baseUrl:'http://localhost:8030'
        const options={
            evaluationReasons:true
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

    if (window && window.ldWrapperInstance){
        if (window.ldWrapperInstance.clientId == clientId){
            return window.ldWrapperInstance;
        }
        
    }

    main();

    if (window){
        window.ldWrapperInstance=ldInstance;
    }

    return ldInstance;
};


function getGeoData(){
    let coasts=[];
    let coastsStr=[];
    if (!eastCoastData && !westCoastData){
        return {coast:"East Coast", state:"Georgia"};
    }
    if (eastCoastData){
        coasts.push (eastCoastData);
        coastsStr.push("East Coast");
    }

    if (westCoastData){
        coasts.push (westCoastData);
        coastsStr.push("West Coast")
    }

    let coastInt = Math.floor(Math.random() * coasts.length);
    let stateInt = Math.floor(Math.random() * coasts[coastInt].length);
    return {coast:coastsStr[coastInt], state:coasts[coastInt][stateInt].State};  //?

}

function createUser({key, name, email, group, coast, state,  anonymous}={anonymous:true, name:""}){

    let isAnonymous= (anonymous && (anonymous=='true' || anonymous==true));
    let userObj={
        key: (isAnonymous)? null :key,
        name, email,
        anonymous: isAnonymous,
        custom:{
            timestamp: Date.now(),
            group,
            secret:"secret-124"
        },
        privateAttributeNames:['secret']
    };
    
    if (isAnonymous){
        delete userObj.key;
    }
    
    if (!coast || !state){
        let geo= getGeoData();
        state= geo.state;
        coast= geo.coast;
    }
    
    userObj.custom.state= state;
    userObj.custom.coast= coast;

    return userObj;
}