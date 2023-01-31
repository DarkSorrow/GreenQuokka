import { useEffect, useState } from "react";
import Form from "@rjsf/mui";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { useParams, useNavigate } from "react-router-dom";
import Typography from '@mui/joy/Typography';
import { useTranslation } from "react-i18next";
import Card from '@mui/joy/Card';
import Button from '@mui/joy/Button';

import { CommonFormTemplate } from "../templates/common-form";
import { LoadingSuspense } from "../atoms/loading-suspense";
import { ErrorNotFound } from "../molecules/error-sheet";
import { Template } from "../../types/Schemas";

interface Data {
  loading: boolean;
  error: boolean;
  msg: string;
  template?: Template;
  schema: RJSFSchema;
}

const log = (type: any) => console.log.bind(console, type);
export const CommonFormPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<Data>({
    loading: true,
    error: false,
    msg: '',
    schema: {}
  });
  const { company, topic, subject, version } = useParams();

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch(`/Priv/forms/${company}/${topic}/${subject}/${version}`, {
          method: 'GET',
        });
        const resp = await response.json();
        if (response.status === 200) {
          const template: Template = resp.form;
          setData({
            loading: false,
            error: false,
            template: resp.form,
            msg: '',
            schema: JSON.parse(template.schema_body)
          });
          return;
        }
        setData({
          loading: false,
          error: true,
          msg: 'status.error',
          schema: {},
        });
        return;
      } catch (err) {
        console.log(err);
        setData({
          loading: false,
          error: true,
          msg: 'req.error',
          schema: {},
        })
      }
    };
    init();
  }, [company, topic, subject, version]);

  const handleSubmit = ({ formData }: any, e: React.SyntheticEvent<HTMLFormElement>) => console.log("Data submitted: ",  formData);

  if (data.loading) {
    <LoadingSuspense />
  } else if (data.error) {
    <ErrorNotFound />
  }
  return (
    <CommonFormTemplate 
      forms={<Card sx={{ height: '100%' }}>
      <Typography level="h2" fontSize="lg" id="card-description" mb={0.5}>
        {t<string>('eschema.example')}
      </Typography>
      <Form schema={data.schema}
        validator={validator}
        children={<Button type="submit" size="lg">{t<string>('submit')}</Button>}
        onError={log("errors")}
        onSubmit={handleSubmit}
      />
    </Card>}
      submit={<div>Submit page of page</div>}
    />
  );
}
