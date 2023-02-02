import axios from "axios";
import { useState } from "react";

/**
 * @author - Meet Master
 * Refernces - https://cloud.google.com/architecture/transferring-data-from-amazon-s3-to-cloud-storage-using-vpc-service-controls-and-storage-transfer-service
 *             https://cloud.google.com/natural-language/automl/docs/create-ml-model
 *              
 */

const CalculateSimilarityScore = () => {
  const [file, setFile] = useState();
  const [file1, setFile1] = useState();
  const [res, setResponse] = useState(null);

  const CallAutoML = async () => {

      const r = axios.post("https://us-central1-serverless-project-370320.cloudfunctions.net/automl", {
          "first": file,
          "second": file1
      })
          .then(response => {
            console.log(response.data)
            setResponse(response.data)})

    setResponse(r);
  };

  return (
    <div>
      <table striped bordered hover>
        <thead>
          <tr>
            <th>Enter first receipe</th>
            <th>Enter second receipe</th>
            <th>Submit</th>
            <th>Similar</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                onChange={(event) => setFile(event.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                onChange={(event) => setFile1(event.target.value)}
              />
            </td>
            <td>
              <button type="submit" value="Submit" onClick={CallAutoML}>
                Submit
              </button>
            </td>
            <td>
              {res !== null && <input type="text" value={res.similar} />}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export { CalculateSimilarityScore };
