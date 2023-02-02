// Reference: https://www.youtube.com/watch?v=8WZmIdXZe3Q

import { CognitoUserPool} from "amazon-cognito-identity-js";
const poolData = {  //Cognito Credentials
  UserPoolId : "us-east-1_ggjTuUt7o",
  ClientId: "31tjimu3kvka54igl64u6b6meu"
    
}
export default new CognitoUserPool(poolData);
