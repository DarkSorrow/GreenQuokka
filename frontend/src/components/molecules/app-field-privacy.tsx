import React, { Dispatch, SetStateAction } from 'react';
import Typography from '@mui/joy/Typography';
import { PrivacyRule, PrivacySchema } from "../../types/Schemas";
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Grid from '@mui/joy/Grid';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { useTranslation } from "react-i18next";

interface MoleculeProps {
  privacySchema: PrivacySchema;
  setPrivacySchema: Dispatch<SetStateAction<PrivacySchema>>;
}
/*
<div>Create a list of keys and put choice [Confidential, internal only, restricted ]<br />
  Confidential: Will require specific access or only work with zero knowledge to get info on this data
  Internal only: will be available to the company requesting the data and providing the information
  Restricted: will be given to people holding group token who are allowed access
</div>
*/
export const AppFieldPrivacy = ({ privacySchema, setPrivacySchema }: MoleculeProps) => {
  const { t } = useTranslation();
  const handleSelect = (e: any, newValue: any) => {
    if (e.target.dataset && e.target.dataset['label']) {
      const label = e.target.dataset['label'];
      setPrivacySchema((prev: PrivacySchema) => ({
        fields: {
          ...prev.fields,
          [label]: newValue as PrivacyRule,
        },
        modified: new Date(),
      }));
      
    }
  }
  return (<Grid container spacing={1}>
    {Object.keys(privacySchema.fields).map((fieldProperty) => (
      <React.Fragment key={fieldProperty}>
        <Grid xs={4}><Typography level="body1">{fieldProperty}</Typography></Grid>
        <Grid xs={8}>
          <Select
            placeholder={t<string>('privacy.sel')}
            data-label={fieldProperty}
            onChange={handleSelect}
            indicator={<KeyboardArrowDown />}
            value={privacySchema.fields[fieldProperty]}
            size="sm"
            sx={{
              width: 240,
              [`& .${selectClasses.indicator}`]: {
                transition: '0.2s',
                [`&.${selectClasses.expanded}`]: {
                  transform: 'rotate(-180deg)',
                },
              },
            }}
          >
            <Option data-label={fieldProperty} value={PrivacyRule.Confidential}>{t<string>('privacy.confidential')}</Option>
            <Option data-label={fieldProperty} value={PrivacyRule.Internal}>{t<string>('privacy.internal')}</Option>
            <Option data-label={fieldProperty} value={PrivacyRule.Restricted}>{t<string>('privacy.restricted')}</Option>
          </Select>
        </Grid>
      </React.Fragment>
    ))}
    
  </Grid>);
}