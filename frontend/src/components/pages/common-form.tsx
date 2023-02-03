import { useEffect, useState } from "react";
import Form from "@rjsf/mui";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { useParams } from "react-router-dom";
import Typography from '@mui/joy/Typography';
import { useTranslation } from "react-i18next";
import Card from '@mui/joy/Card';
import Grid from '@mui/joy/Grid';
import Button from '@mui/joy/Button';
import Badge from '@mui/joy/Badge';
import CardOverflow from '@mui/joy/CardOverflow';
import Tooltip from '@mui/joy/Tooltip';
import Divider from '@mui/joy/Divider';

import { CommonFormTemplate } from "../templates/common-form";
import { AnonymousWalletConnect } from "../molecules/anonymous-wallet-connect";
import { LoadingSuspense } from "../atoms/loading-suspense";
import { ErrorNotFound } from "../molecules/error-sheet";
import { Template, PrivacyRule, ContractData } from "../../types/Schemas";

interface Data {
  loading: boolean;
  error: boolean;
  msg: string;
  template?: Template;
  schema: RJSFSchema;
  fields: Record<PrivacyRule, string[]>;
  privacy: Record<string, PrivacyRule>;
  contracts: ContractData[];
}

const log = (type: any) => console.log.bind(console, type);
export const CommonFormPage = () => {
  let yourForm: any;
  const { t } = useTranslation();
  const [data, setData] = useState<Data>({
    loading: true,
    error: false,
    msg: '',
    schema: {},
    fields: {
      [PrivacyRule.Confidential]: [],
      [PrivacyRule.Internal]: [],
      [PrivacyRule.Restricted]: [],
    },
    privacy: {},
    contracts: [],
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
          const privacy: Record<string, PrivacyRule> = JSON.parse(template.schema_rights);
          const fields: Record<PrivacyRule, string[]> = {
            [PrivacyRule.Confidential]: [],
            [PrivacyRule.Internal]: [],
            [PrivacyRule.Restricted]: [],
          };
          Object.keys(privacy).forEach((keys) => {
            fields[privacy[keys]].push(keys);
          })
          setData({
            loading: false,
            error: false,
            template: resp.form,
            msg: '',
            schema: JSON.parse(template.schema_body),
            privacy,
            fields,
            contracts: JSON.parse(template.contracts),
          });
          return;
        }
        setData({
          loading: false,
          error: true,
          msg: 'status.error',
          schema: {},
          privacy: {},
          fields: {
            [PrivacyRule.Confidential]: [],
            [PrivacyRule.Internal]: [],
            [PrivacyRule.Restricted]: [],
          },
          contracts: [],
        });
        return;
      } catch (err) {
        console.log(err);
        setData({
          loading: false,
          error: true,
          msg: 'req.error',
          schema: {},
          privacy: {},
          fields: {
            [PrivacyRule.Confidential]: [],
            [PrivacyRule.Internal]: [],
            [PrivacyRule.Restricted]: [],
          },
          contracts: [],
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
      <Form schema={data.schema}
        validator={validator}
        children={<></>}
        onError={log("errors")}
        onSubmit={handleSubmit}
        ref={(form) => {yourForm = form;}}
      />
    </Card>}
      submit={<Card sx={{ 
        position: 'fixed',
        width: '350px'
      }}>
        <Badge badgeContent={`v${version}`}>
          <Typography level="h2" fontSize="lg" mb="1.5">{subject}</Typography>
        </Badge>
        <Grid container spacing={1}>
          <Grid xs={12}>
            {t<string>('forms.wallet')}
          </Grid>
          <Grid xs={12}>
            <AnonymousWalletConnect />
          </Grid>
          <Grid xs={12}>
            <Button fullWidth onClick={() => yourForm.submit()}>{t<string>('submit')}</Button>
          </Grid>
        </Grid>
        <Divider />
        <CardOverflow
          variant="soft"
          sx={{
            display: 'flex',
            gap: 1.5,
            py: 1.5,
            px: 'var(--Card-padding)',
            bgcolor: 'background.level1',
          }}
        >
          <Tooltip sx={{ maxWidth: '320px' }} title={t<string>('forms.confidential')} variant="soft">
            <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
              {t<string>('forms.0', { length: data.fields[PrivacyRule.Confidential].length })}
            </Typography>
          </Tooltip>
          <Divider orientation="vertical" />
          <Tooltip sx={{ maxWidth: '320px' }} title={t<string>('forms.internal')} variant="soft">
            <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
              {t<string>('forms.1', { length: data.fields[PrivacyRule.Internal].length })}
            </Typography>
          </Tooltip>
          <Divider orientation="vertical" />
          <Tooltip sx={{ maxWidth: '320px' }} title={t<string>('forms.restricted')} variant="soft">
            <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
            {t<string>('forms.2', { length: data.fields[PrivacyRule.Restricted].length })}
            </Typography>
          </Tooltip>
        </CardOverflow>

      </Card>}
    />
  );
}
