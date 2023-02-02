import { Route, Routes } from "react-router-dom/dist";
import Chat from "./component/chatModule/Chat";
import DataProcessing from "./component/uploadRecipe/DataProcessing";
import Signup from './component/usermanagement/Signup';
import RegistrationQuestions from './component/usermanagement/RegistrationQuestions'
import Login from './component/usermanagement/Login';
import LoginQuestions from './component/usermanagement/LoginQuestions';
import CipherRegistration from './component/usermanagement/RegistrationCipher';
import CipherLogin from './component/usermanagement/CipherLogin';
import CustomerPage from './component/usermanagement/CustomerPage'
import OwnerPage from './component/visualization/OwnerPage';
import Feedback from "./component/usermanagement/Feedback";
import { CalculateSimilarityScore } from "./component/semanticScore/CalculateSimilarityScore";

/**
 * 
 * @author Meet Master
 */


const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/uploadRecipe" element={<DataProcessing />} />
        <Route path="/" element={<Signup/>}/>
        <Route path="/registration/questions" element={<RegistrationQuestions/>}/>
        <Route path="/registration/cipher" element={<CipherRegistration/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/login/questions" element={<LoginQuestions/>}/>
        <Route path="/login/cipher" element={<CipherLogin/>}/>
        <Route path="/customer" element={<CustomerPage/>}/>
        <Route path="/owner" element={<OwnerPage/>}/>
        <Route path="/feedback" element={<Feedback/>}/><Route path="/menu" element={<CalculateSimilarityScore/>}/>
      </Routes>
    </div>
  );
};
export { AppRoutes };
