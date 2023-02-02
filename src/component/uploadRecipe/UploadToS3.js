import React, { useRef, useState } from "react";
import { DYANMODB_TABLE, dynamoDb, myBucket, S3_BUCKET } from "../../AwsConfig";

/**
 * @author Meet Master
 * References - https://javascript.plainenglish.io/how-to-upload-files-to-aws-s3-in-react-591e533d615e
                https://blog.devgenius.io/upload-files-to-amazon-s3-from-a-react-frontend-fbd8f0b26f5
                https://betterprogramming.pub/how-to-use-aws-dynamodb-in-react-70b55ffff93e
                https://stackoverflow.com/questions/34447304/example-of-update-item-in-dynamodb-boto3
                https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.put_item
 */



const UploadToS3 = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState();
  const fileInputRef = useRef(null);
  const fileNameInputRef = useRef(null);
  const d = new Date()

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleFileName = (e) => {
    setFileName(e.target.value);
  };

  const uploadFile = (file, name) => {
    const paramsS3 = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name,
    };

    console.log(paramsS3)
    // console.log(Body)
    // console.log(Bucket)
    // console.log(Key)
    myBucket.putObject(paramsS3).send((err) => {
      if (err) {

        console.log(err, S3_BUCKET);
        alert("Unable to save file");
      } else {
        const e = localStorage.getItem('email')
        const paramsDynamoDb = {
          TableName: DYANMODB_TABLE,
          Item: {
            id: Date.now().toString(),
            recipeName: name,
            fileName: file.name,
            email:e!=null ? e : "res@gmail.com",
            year: d.getFullYear(),
            month: d.toLocaleString('default', { month: 'long' }),
            day: d.getDate()
          },
        };

        dynamoDb.put(paramsDynamoDb, function (err, data) {
          if (err) {
            console.log(err, err.stack);
            alert("Unable to save file name!");
          } else {
            console.log(data);
            fileNameInputRef.current.value = "";
            fileInputRef.current.value = null;
            props.isUploaded();
            alert("File Upload Successfull!");
          }
        });
      }
    });
  };

  return (
    <div>
      <input ref={fileNameInputRef} type="text" onChange={handleFileName} />
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        onChange={handleFileInput}
      />
      <button onClick={() => uploadFile(selectedFile, fileName)}>
        Upload to S3
      </button>
    </div>
  );
};

export { UploadToS3 };

