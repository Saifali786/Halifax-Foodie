/**
 * @author Meet Master
 * References - https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples
 *              https://stackoverflow.com/questions/52852018/use-npm-uuid-in-reactjs
 *              https://stackoverflow.com/questions/39914455/react-validatedomnesting-text-cannot-appear-as-a-child-of-tr
 */



const SendDetailsToLambda  = async (id, fileName) => {
    

    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
            'id': id,
            'fileName': fileName
        })
    }

    const response = await fetch("https://55bizz3s57r7x3khd36oin4zr40gnnre.lambda-url.us-east-1.on.aws/", requestOptions)
        .then(response => response.json())

    console.log(response)
    if(response){
        alert("Data Extraction Successful!")
    }
}

export {SendDetailsToLambda}