import { useState } from "react"
import { RetrieveRecipesFromDynamoDb } from "./RetrieveRecipesFromDynamoDb"
import { UploadToS3 } from "./UploadToS3"

/**
 * 
 * @author - Meet Master
 */

const DataProcessing = () => {

    const [isUploaded,setIsUploaded] = useState(false)

    const setUploadFlag = (value) => {
        setIsUploaded(value)
    }

    return(
        <div>
            <UploadToS3 isUploaded={() => setUploadFlag(true)} />
            <RetrieveRecipesFromDynamoDb callApi={isUploaded} resetUploadFlag={() => setUploadFlag(false)}/>
        </div>
    )
}

export default DataProcessing
