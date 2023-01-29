import { useParams, useNavigate } from "react-router-dom";
import Form from "@rjsf/mui";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

import { useAuth } from '../../providers/auth';
import { AppEditSchemaTemplate } from "../templates/app-edit-schemas";

const schema: RJSFSchema = {
  title: "Todo",
  type: "object",
  required: ["title"],
  properties: {
    title: {type: "string", title: "Title", default: "A new task"},
    done: {type: "boolean", title: "Done?", default: false}
  }
};
const log = (type: any) => console.log.bind(console, type);
export const AppEditSchemaPage = () => {
  const navigate = useNavigate();
  const { topic, subject } = useParams();
  const { userToken, exp, legalEntity, setOpenSnackbar } = useAuth();
  const isEdit = subject !== 'new';
  
  return (
    <AppEditSchemaTemplate 
      title={<div>Edit title</div>}
      forms={<Form schema={schema}
      validator={validator}
      onChange={log("changed")}
      onSubmit={log("submitted")}
      onError={log("errors")} />}
    />
  );
}
