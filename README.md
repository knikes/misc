misc
====

Linux open port
iptables -I INPUT -p tcp -m tcp --dport PORTNUMBER -j ACCEPT

Symbolic Link
ln -s {/path/to/file-name} {link-name}

SCP Example
scp your_username@remotehost.edu:foobar.txt /some/local/directory

TAR
tar xvzf file-1.0.tar.gz - 	to uncompress a gzip tar file (.tgz or .tar.gz) 

tar xvjf file-1.0.tar.bz2 - to uncompress a bzip2 tar file (.tbz or .tar.bz2) 

tar xvf file-1.0.tar - 		to uncompressed tar file (.tar) 


Call adapter from URL

curl -v -XGET -g http://localhost:8080/invoke?adapter=Test\&procedure=getStories\&parameters=[]


Download Files from web directory

wget -r --no-parent --reject "index.html*" http://url.com

View all ports being listened to on OSX

lsof -i -P | grep -i "listen"

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-web-security


Adatper example:
```
/**********************************************************************************
*   		 				Sync
**********************************************************************************/
function sync(){
	
	var invocationData = {
			adapter : 'MQTT_Adapter',
			procedure : 'sync',
			parameters : []
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess : syncSuccess,
		onFailure : syncFailure
	});
}

function syncSuccess(response){
	console.log("sync Success");
	console.log(response);
	var returnedItems = response.invocationResult.items;
	
	for(var i=0; i<returnedItems.length; i++){
		addItemToList('#item_list', returnedItems[i]);
	}
}

function syncFailure(response){
	console.log("sync Failure");
	console.log(response);
}
```
