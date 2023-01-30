import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "@rjsf/mui";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import Editor from "@monaco-editor/react";
import Stack from '@mui/joy/Stack';
import Divider from '@mui/joy/Divider';

import { useDebounce } from "../../utils/functions";
import { useTranslation } from "react-i18next";
import { useAuth } from '../../providers/auth';
import { AppTitle } from "../molecules/app-title";
import { AppEditSchemaTemplate } from "../templates/app-edit-schemas";
import { AppSchemaInfo } from "../molecules/app-schema-info";
import { AppCardTitle } from "../molecules/app-card-title";

const schema: RJSFSchema = {
  title: "Example",
  type: "object",
  required: ["name"],
  properties: {
    name: {type: "string", title: "Name", default: ""},
  }
};
const log = (type: any) => console.log.bind(console, type);
export const AppEditSchemaPage = () => {
  const [jsonString, setJsonString] = useState<string>(JSON.stringify(schema, null, 2));
  const [jsonSchema, setJsonSchema] = useState<RJSFSchema>(schema);
  const [isSchemaError, setSchemaError] = useState(false);
  const { t } = useTranslation();
  const debounceValue = useDebounce(jsonString, 500);
  const handleEditorChange = (value: string | undefined, event: any) => {
    if (value !== undefined) {
      setJsonString(value);
    }
  };
  useEffect(() => {
    try {
      const parseSchema = JSON.parse(debounceValue);
      setSchemaError(false);
      setJsonSchema(parseSchema);
    } catch (err) {
      console.log(err);
      setSchemaError(true);
      return;
    }
  }, [debounceValue]);
  const navigate = useNavigate();
  const { topic, subject } = useParams();
  const { userToken, exp, legalEntity, setOpenSnackbar } = useAuth();
  const isEdit = subject !== 'new';
  
  return (
    <AppEditSchemaTemplate 
      title={<AppTitle
        title={t<string>('eschema.title')}
        subtitle={t<string>('eschema.subtitle')}
      />}
      schemaInfo={<AppSchemaInfo
        subject={t<string>('eschema.subject')}
        version={t<string>('eschema.version')}
        format={t<string>('eschema.format')}
      />}
      definition={
      <AppCardTitle sx={{
        height: '375px',
        minHeight: '375px',
        maxHeight: '600px',
      }} title={t<string>('eschema.schema')}>
        <Editor
          defaultLanguage="json"
          defaultValue={jsonString}
          onChange={handleEditorChange}
        />
      </AppCardTitle>
      }
      privacyDisplay={
      <AppCardTitle title={t<string>('eschema.privacy')}>
        <Stack sx={{
          height: '340px',
          minHeight: '340px',
          maxHeight: '600px',
          width: '100%',
        }}
          direction="row"
          spacing={1}
        >
          <Editor
            width="50%"
            defaultLanguage="json"
            defaultValue={jsonString}
            onChange={handleEditorChange}
          />
          <div>test of right stuff</div>
        </Stack>
        
      </AppCardTitle>
      }
      forms={
        <Card sx={{ height: '100%' }}>
          <Typography level="h2" fontSize="lg" id="card-description" mb={0.5}>
            {t<string>('eschema.example')}
          </Typography>
          <Form schema={jsonSchema}
            validator={validator}
            onChange={log("changed")}
            onSubmit={log("submitted")}
            onError={log("errors")}
          />
        </Card>
      }
    />
  );
}
