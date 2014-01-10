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


for i in *.jar;do echo "" && echo $i && jar -tf $i|grep EventFactoryContext;done |less 

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

Get size of DB
```
SELECT table_schema "Data Base Name", SUM( data_length + index_length) / 1024 / 1024 
"Data Base Size in MB" FROM information_schema.TABLES GROUP BY table_schema ;
```


Get size of DB
```
SELECT
  table_schema, count(*) TABLES,
  concat(round(sum(table_rows)/1000000,2),'M')
  rows,concat(round(sum(data_length)/(1024*1024*1024),2),'G')
  DATA,concat(round(sum(index_length)/(1024*1024*1024),2),'G')
  idx,concat(round(sum(data_length+index_length)/(1024*1024*1024),2),'G')
  total_size,round(sum(index_length)/sum(data_length),2) idxfrac
FROM
  information_schema.TABLES group by table_schema;
 ```
  
Get row size in bytes
```
select
  device_id,
  sum(length(device_id) + length(friendly_name) + length(user_id) + length(device_os) + length(device_model)+ length(last_accessed_time)+ length(status)) as bytes
from DEVICES
where device_id = "00009304-A35B-3F8C-BB96-7FFCA1840C0C";
```


Amazon EC2

sudo yum install gcc-c++ make 

sudo yum install openssl-devel 

sudo yum install git 

git clone git://github.com/joyent/node.git 

cd node

git checkout v0.8.1 

./configure 

make 

sudo make install


xcrun -sdk iphoneos lipo -info
