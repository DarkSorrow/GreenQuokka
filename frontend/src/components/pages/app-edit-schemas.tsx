import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from '../../providers/auth';
import { AppEditSchemaTemplate } from "../templates/app-edit-schemas";

export const AppEditSchemaPage = () => {
  const navigate = useNavigate();
  const { topic, subject } = useParams();
  const { userToken, exp, legalEntity, setOpenSnackbar } = useAuth();
  const isEdit = subject !== 'new';
  
  return (
    <AppEditSchemaTemplate 
      title={<div>Edit title</div>}
      forms={<div>Forms</div>}
    />
  );
}
