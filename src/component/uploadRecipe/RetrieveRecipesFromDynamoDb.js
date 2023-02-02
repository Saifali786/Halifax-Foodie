import { useEffect, useState } from "react"
import { DYANMODB_TABLE, dynamoDb } from "../../AwsConfig"
import Table from 'react-bootstrap/Table';
import { SendDetailsToLambda } from "./SendDetailsToLambda";

/**
 * @author Meet Master
 * References - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property
 *              https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html
 *              https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-query-scan.html
 *              https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#scan-property
 *              https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.UpdateItem.html
 *              https://stackoverflow.com/questions/61556179/how-to-display-an-array-of-objects-in-a-table-in-react
 *              https://react-bootstrap.github.io/getting-started/introduction/
 */


const fetch = async() => {
    const params = {
        TableName: DYANMODB_TABLE
    }
    let As = await dynamoDb.scan(params).promise()
    return As.Items;
}

const RetrieveRecipesFromDynamoDb = (props) => {

    const [results, setResults] = useState([])

    const fetchRecipeList = () => {
        fetch().then(res => {
            setResults(result => [])
            res.forEach(element => {
                setResults((list)=> [...list, element])
            });
        })
    }

    if(props.callApi) {       
        fetchRecipeList()
        props.resetUploadFlag()
    } 

    useEffect(()=> { 
        fetchRecipeList();
    }, [])

    return(
        <div>
            <Table striped>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Receipe Name</th>
                    <th>File Name</th>
                    <th>Extract Entities</th>
                    </tr>
                </thead>
                <tbody>
                    {results.length && results.map((item, i)=>(
                            <tr key={i}>
                                <td>
                                    {i+1}
                                </td>
                                <td>
                                    {item.recipeName}
                                </td>
                                <td>
                                    {item.fileName}
                                </td>
                                <td>
                                    <button type="submit" onClick={() => SendDetailsToLambda(item.id, item.fileName)}>
                                    Extract
                                    </button>
                                </td>
                            </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}
export {RetrieveRecipesFromDynamoDb}