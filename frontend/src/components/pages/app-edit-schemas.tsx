import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "@rjsf/mui";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import Editor from "@monaco-editor/react";
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import { useTranslation } from "react-i18next";

import { useDebounce } from "../../utils/functions";
import { useAuth } from '../../providers/auth';
import { AppTitle } from "../molecules/app-title";
import { AppEditSchemaTemplate } from "../templates/app-edit-schemas";
import { AppSchemaInfo } from "../molecules/app-schema-info";
import { AppCardTitle } from "../molecules/app-card-title";
import { Template } from "../../types/Schemas";

const schema: RJSFSchema = {
  "title": "Example",
  "type": "object",
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "type": "string",
      "title": "Name",
      "default": ""
    },
    "lastname": {
      "type": "string",
      "title": "LastName",
      "default": ""
    },
    "purchases": {
      "type": "array",
      "title": "Pourchases",
      "items": {
        "type": "string"
      }
    }
  }
};
const log = (type: any) => console.log.bind(console, type);
export const AppEditSchemaPage = () => {
  const navigate = useNavigate();
  const { userToken, exp, legalEntity, setOpenSnackbar } = useAuth();
  const { topic, subject } = useParams();
  const isEdit = subject !== 'new';
  const [loading, setLoading] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [template, setTemplate] = useState<Template>({
    topic: topic ?? '',
    subject: "",
    version: 1,
    schema_body: schema,
    schema_rights: {},
    contracts: {},
    format: 'json',
  })
  const [jsonString, setJsonString] = useState<string>(JSON.stringify(schema, null, 2));
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
      setTemplate((prev) => ({
        ...prev,
        schema_body: parseSchema
      }))
    } catch (err) {
      console.log(err);
      setSchemaError(true);
      return;
    }
  }, [debounceValue]);
  
  const submitForms = async () => {
    setSubmit(true);
    try {
      console.log(template)
      await fetch('/api/v1/template', {
        method: 'POST',
        headers: {
          "X-Quokka-Token": userToken ?? '',
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...template,
          schema_body: JSON.stringify(template.schema_body),
          schema_rights: JSON.stringify(template.schema_rights),
        }),
      });
      setSubmit(false);
      navigate('/schemas');
    } catch (err)  {
      console.log(err);
      setSubmit(false);
    }
  }

  return (
    <AppEditSchemaTemplate 
      title={<AppTitle
        title={t<string>('eschema.title')}
        subtitle={t<string>('eschema.subtitle')}
      />}
      schemaInfo={<AppSchemaInfo
        template={template}
        setTemplate={setTemplate}
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
          <div>FVM data access control / FVM actors to perform verifications</div>
        </Stack>
        
      </AppCardTitle>
      }
      forms={
        <Card sx={{ height: '100%' }}>
          <Typography level="h2" fontSize="lg" id="card-description" mb={0.5}>
            {t<string>('eschema.example')}
          </Typography>
          <Form schema={template.schema_body}
            validator={validator}
            onChange={log("changed")}
            children={<></>}
            onError={log("errors")}
          />
        </Card>
      }
      submit={
        <Button loading={submit} onClick={submitForms} size="lg">{t<string>('create')}</Button>
      }
    />
  );
}
