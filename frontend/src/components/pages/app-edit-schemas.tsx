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
import Divider from '@mui/joy/Divider';

import { useDebounce } from "../../utils/functions";
import { useAuth } from '../../providers/auth';
import { AppTitle } from "../molecules/app-title";
import { AppEditSchemaTemplate } from "../templates/app-edit-schemas";
import { AppSchemaInfo } from "../molecules/app-schema-info";
import { AppCardTitle } from "../molecules/app-card-title";
import { AppFieldPrivacy } from "../molecules/app-field-privacy";
import { AppFieldContract } from "../organisms/app-field-contracts";
import { Template, PrivacyRule, PrivacySchema, ContractType, ContractData } from "../../types/Schemas";
import { LoadingSuspense } from "../atoms/loading-suspense";

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
  const [privacyFields, setPrivacyFields] = useState<PrivacySchema>({
    fields: {},
    modified: new Date(),
  });
  const [loading, setLoading] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [template, setTemplate] = useState<Template>({
    topic: topic ?? '',
    subject: "",
    version: 1,
    schema_body: schema,
    schema_rights: {},
    contracts: '',
    format: 'json',
  });
  const [listContract, setListContract] = useState<ContractData[]>([{
    dataUsed: [],
    formula: {},
    type: ContractType.STORAGE,
    name: 'Storage',
    contract: '',
    isError: false,
    errors: [],
    price: 0,
    share: 0,
    qty: 0,
    currency: "FIL",
  }]);
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
      const parseSchema: RJSFSchema = JSON.parse(debounceValue);
      
      // Create new item only if other don't exist
      // don't go in subelement yet but make recursive check on final version
      if (parseSchema.properties) {
        const copyPrivacy: Record<string, PrivacyRule> = {};
        //let modified = false;
        Object.keys(parseSchema.properties).forEach((propertyKey) => {
          copyPrivacy[propertyKey] = (privacyFields.fields[propertyKey]) ? privacyFields.fields[propertyKey] : PrivacyRule.Confidential;
        });
        //if (modified) {
          setPrivacyFields({
            fields: copyPrivacy,
            modified: new Date(),
          });
        //}
      }
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
  
  // TODO make the version type differently
  // Allow version diff and only let use review old version
  // Modification made must create a new version in order not to break compatibility
  useEffect(() => {
    setLoading(true);
    const init = async () => {
      const response = await fetch(`/api/v1/template/${topic}/${subject}`, {
        method: 'GET',
        headers: {
          "X-Quokka-Token": userToken ?? '',
        }
      });
      const resp = await response.json();
      console.log("SCHEMA LOAD FIRST DATA")
      if (response.status === 200) {
        console.log(resp)
        setTemplate((prev) => ({
          ...prev,
          subject: resp.data.subject,
          format: resp.data.format,
          schema_body: JSON.parse(resp.data.schema_body),
          schema_rights: JSON.parse(resp.data.schema_rights),
        }));
        setListContract(JSON.parse(resp.data.contracts))
      }
      setLoading(false);
    }
    if (isEdit) {
      init();
    } else {
      setLoading(false);
    }
  }, [topic, subject, isEdit])

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
        // Make a loop to change contract type
        // Maybe store storage and contracts in different area?
        body: JSON.stringify({
          ...template,
          schema_body: JSON.stringify(template.schema_body),
          schema_rights: JSON.stringify(privacyFields.fields),
          contracts: JSON.stringify(listContract),
        }),
      });
      setSubmit(false);
      navigate('/schemas');
    } catch (err)  {
      console.log(err);
      setSubmit(false);
    }
  }

  if (loading) {
    return <LoadingSuspense />;
  }
  return (
    <AppEditSchemaTemplate 
      title={<AppTitle
        title={t<string>('eschema.title')}
        subtitle={t<string>('eschema.subtitle')}
      />}
      schemaInfo={<AppSchemaInfo
        isEdit={isEdit}
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
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" />}
          spacing={1}
        >
          <AppFieldPrivacy
            privacySchema={privacyFields}
            setPrivacySchema={setPrivacyFields}
          />
          <AppFieldContract
            privacySchema={privacyFields}
            listContract={listContract}
            setListContract={setListContract}
          />
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
