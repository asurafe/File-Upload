import SparkMD5 from 'spark-md5';

/**
 * 计算文件Md5
 * @param {*} file
 */
 
 export default function computeFileMD5(file) { 
   return new Promise((resolve, reject) => {
      let spark = new SparkMD5.ArrayBuffer();
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = function (e) {
        spark.append(e.target.result);
        console.log('finished loading');
        let md5 = spark.end(); //最终md5值
        spark.destroy(); //释放缓存
        resolve(md5);
      };
      
      fileReader.onerror = function (e) {
        console.warn('oops, something went wrong.');
        reject(e);
      };
   }) 
 }