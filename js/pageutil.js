

const PageUtils= (ldWrapper) => {
    
    ldWrapper = (!ldWrapper) ? window.ldWrapperInstance : ldWrapper ;
    let {project, environment, clientId, version:SDKVersion} = ldWrapper;
    
    function setLaunchersDetails(){
        pageUtils.setDataSet('user1', {userId:'Seth', group:'Light Launchers', state:'Delaware', coast:'East Coast', flagKey:'get-launcher-details'});
        pageUtils.setDataSet('user2', {userId:'Lisa', group:'Dark Launchers',state:'California', coast:'West Coast', flagKey:'get-launcher-details'});
        pageUtils.setDataSet('user3', {userId:'Rajah', group:'Light Launchers',state:'Massachusetts', coast:'East Coast', flagKey:'get-launcher-details'});
        pageUtils.setDataSet('user4', {userId:'Maria', group:'Dark Launchers',state:'Oregon', coast:'West Coast', flagKey:'get-launcher-details'});
        pageUtils.setDataSet('user5', {userId:'', group:'', flagKey:'get-launcher-details', anonymous:true});
    }

    function setDataSet(byId, {userId, group, state, coast, flagKey, anonymous=false}, data){
            let element = document.getElementById(byId);
            element.dataset.email=`${userId.toLowerCase()}@tester.com`;
            element.dataset.key=`${userId.toLowerCase()}@tester.com`;
            element.dataset.name=`${userId}`;
            element.dataset.group= `${group}`;
            element.dataset.anonymous= anonymous;
            element.dataset.flagKey= `${flagKey}`;
            element.dataset.state= `${state}`;
            element.dataset.coast= `${coast}`;

            if (data){
                element.dataset= {...element.dataset, ...data};
            }
    }
    function getDataSet(byId){
        let {dataset} = document.getElementById(byId);
        let flagKey= dataset.flagKey;
        delete dataset.flagKey;
        
        for (k in dataset){
            if (dataset[k]=='undefined'){
                    delete dataset[k]
            }
        }
        return {flagKey, userDetail:{...dataset}};
        
    }
    function updateBadge(value){
        let element = document.querySelector('#captionBadge');

        if (element){
            let count = ((value)?value: parseInt (element.textContent))+1;
            element.textContent = count;
            
            ldWrapper.sendMetric('like-counter', count, {"value":count, "trigger":"click"})
        }
    }

    function updateUserPageDetails({name, groupName="", coast, state, badgeValue="0"}){
        document.getElementById('captionMessage').textContent=`Hello ${name}`;
        
        document.getElementById('captionMessage2').textContent=`${groupName}`;
        document.getElementById('captionMessage3').textContent=`${coast} - ${state}`;
        document.getElementById('captionBadge').textContent= badgeValue;
    }

    async function switchUser(byId){

        let {flagKey, userDetail} = getDataSet(byId);
        
        let userObj = createUser( {...userDetail} );
        let {anonymous, name, custom} = userObj;
        if (anonymous){
            delete userObj.key;
            localStorage.clear('ld:$anonUserId');
        }
        if(ldWrapper.status == ldWrapper.STATUS_READY){
            await ldWrapper.identify(userObj)
        }
        
        let groupName=custom.group;
        if (anonymous){
            let id= ldWrapper.getUser().key.split("-")[0]
            name= `${id}`;
            groupName=''
        }
      
        updateUserPageDetails({name, groupName, ...custom});

        // document.getElementById('captionMessage').textContent=`Hello ${name}`;
        // document.getElementById('captionMessage2').textContent=`${groupName}`;
        // document.getElementById('captionMessage3').textContent=`${custom.coast} - ${custom.state}`;
        // document.getElementById('captionBadge').textContent="0"

        logDebug();
    }

    function ldsubscribe_badge(){
        return new Promise(resolve=>{
            let element = document.querySelector("span#captionBadge");
            const flagKey='show-badge';
            let show= ldWrapper.variation(flagKey, false);
            

            element.textContent=0;
            element.style= (show)?"display:inline !important":"display:none !important";

            ldWrapper.onChange(flagKey,  (show)=>{
                    // console.log(`show-badge: show=${show}`)
                    element.style= (show)?"display:inline !important":"display:none !important";
                });
            
            resolve (true);
        })
        .catch(error=>{
           console.log(`ldsubscribe_badge(): Error[${error}]`);
        });

       
    }

    function ldsubscribe_likeButton(){
       return new Promise( resolve=>{
            let element = document.querySelector("img#likeButton");
            const flagKey='show-like-button';
            
            let details= ldWrapper.variationDetail(flagKey, false);
            let {value:show, variationIndex} = details;
            element.style= (show)?"display:inline !important":"display:none !important";
            // console.log(`ldsubscribe_likeButton(): variationDetail=${JSON.stringify(details)}`);

            ldWrapper.onChange(flagKey,  (show)=>{
                element.style= (show)?"display:inline !important":"display:none !important";
            });
            
            resolve(true);
       })
        .catch(error=>{
           console.log(`ldsubscribe_likeButton(): Error[${error}]`);
        });

    }

    function ldsubscribe_hero(){
        let {flagKey} = getDataSet('user1');
        const toggle={
            "heroName":"Toggle",
            "backgroundImage":"jtoggle-hero.png",
            "heroImage":"jtoggle-hero.png"}
        ;
        
        return new Promise( resolve=>{
            

            let details= ldWrapper.variationDetail(flagKey, toggle);
            let {heroName, backgroundImage, heroImage}= details.value;

            // console.log(`ldsubscribe_heroImage(): user=[${JSON.stringify(ldWrapper.getUser())}] flagKey=[${flagKey}] variationDetail=${JSON.stringify(details)}`);
            document.querySelector("img#heroBGImage").src=`./images/${backgroundImage}`;
            document.querySelector("img#heroImage").src=`./images/${heroImage}`;
           
            ldWrapper.onChange(flagKey,  ({heroName, backgroundImage, heroImage})=>{
                document.querySelector("img#heroBGImage").src=`./images/${backgroundImage}`;
                document.querySelector("img#heroImage").src=`./images/${heroImage}`;
                // for debug
                // let details= ldWrapper.variationDetail(flagKey, toggle);
                // console.log(`ldsubscribe_heroImage(): user=[${JSON.stringify(ldWrapper.getUser())}] flagKey=[${flagKey}] variationDetail=${JSON.stringify(details)}`);

            });
            resolve(true);
       })
       .catch(error=>{
           console.log(`ldsubscribe_heroImage(): Error[${error}]`);
        });
    }

   function ldsubscribe_darkMode(){
       return new Promise( resolve=>{
            let selectors=[".site-bg", ".header", ".image-container"];
            let darkColor= '#181818';
            let lightColor='#2d475c';
            const flagKey='dark-mode';

            let details= ldWrapper.variationDetail(flagKey, false);
            let enable = details.value;
            // console.log(`ldsubscribe_darkMode(): variationDetail=${JSON.stringify(details)}`);
            
            for (selector of selectors){
                let element = document.querySelector(selector);
                element.style.backgroundColor= (enable)? darkColor: lightColor;    

                ldWrapper.onChange(flagKey,  (enable)=>{
                   element.style.backgroundColor= (enable)? darkColor :lightColor;
                    // for debug
                    // let details= ldWrapper.variationDetail(flagKey, false);
                    // console.log(`ldsubscribe_darkMode(): variationDetail=${JSON.stringify(details)}`);
                })
            }
            
            resolve(true);
        })
        .catch(error=>{
           console.log(`ldsubscribe_darkMode(): Error[${error}]`);
        });

    }

    function logDebug(){
            let envEle = document.querySelector("#envDetail");
            envEle.textContent= `Project=[${project}]\nEnvironment=[${environment}] \nClientID=[${clientId}]\nJS Client version=[${SDKVersion}]`;
            let usrEle = document.querySelector("#userDetail");
            usrEle.textContent= JSON.stringify(ldWrapper.getUser(),null,2);

            // console.log("JSClient release https://github.com/launchdarkly/js-client-sdk/releases");
    }
    function ldsubscribe_debug(){
       return new Promise( resolve=>{
            let element = document.querySelector("#debugContainer");
            const flagKey='show-ui-debug';
            logDebug();

            let show= ldWrapper.variation(flagKey, false);
            element.style= (show)?"display:inline !important":"display:none !important";

            ldWrapper.onChange(flagKey,   (show)=>{
                element.style= (show)?"display:inline !important":"display:none !important";
            })
            resolve(true);
       });
    }



    function register(){
        return Promise.allSettled([
            ldsubscribe_hero(),
            ldsubscribe_badge(),
            ldsubscribe_likeButton(),
            ldsubscribe_darkMode(),
            ldsubscribe_debug()
        ])
    }


    return{
        ldWrapper,
        setDataSet,
        getDataSet,
        switchUser,
        updateBadge,
        setLaunchersDetails,
        updateUserPageDetails,
        register
    }
};
