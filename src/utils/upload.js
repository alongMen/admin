import axios from 'axios';

import { get_upload_token } from '@/service/index'






const get_token = (folder , extensionName)=>{
  return new Promise(async(resolve)=>{
    const res = await get_upload_token(folder , extensionName);
    resolve(res.data);
  });
}



//获取文件后缀
const getFileSufix = filename => {
	const arr = filename.split('.');
	return arr[arr.length - 1];
};


const upload_img_to_clound = (buffer, url,cb ) => {
	return new Promise(async (resolve, reject) => {
		const res = await axios.put(
			url,
			buffer,
			{
				timeout: 0,
				headers: {
					'Content-Type': 'image/*',
					'x-ms-blob-type': 'BlockBlob',
					'Access-Control-Allow-Origin': '*'
				},
				onUploadProgress(progressEvent) {
          console.log(progressEvent)
          if(cb){
            cb(progressEvent);
          }
					
				}
			}
		);
			resolve(res);
	});
};



export const upload_image = (event ,folder , cb)=>{
  return new Promise(async(resolve , reject)=>{
    const files = event.target.files;
    const file = files[0];
    const extensionName = getFileSufix(file.name);
    const data = await get_token(folder , extensionName);

    const uploadUrl = data.filePath + data.fileToken;
    const filePath = data.filePath;
    const buffer = await file_reader(file);
    const uploadRes = await upload_img_to_clound(buffer,uploadUrl,cb);
    resolve({
      res:uploadRes,
      url: filePath,
    })
  })

}




const file_reader = (file) => {
	return new Promise((res, rej) => {
		let data;
		const reader = new FileReader();
		reader.onload = function(e) {
			data = new Uint8Array(e.target.result);
			res(data);
		};
		reader.readAsArrayBuffer(file);
	});
};




export const editor_upload_file = async(file,folder,cb)=>{
  return new Promise(async(resolve,reject)=>{
    const extensionName = getFileSufix(file.name);
    const data = await get_token(folder,extensionName);


    const uploadUrl = data.filePath + data.fileToken;
    const filePath = data.filePath;



    const buffer = await file_reader(file);
    const uploadRes = await upload_img_to_clound(buffer,uploadUrl,cb);
    resolve({
      res:uploadRes,
      url: filePath
    })
  })
}