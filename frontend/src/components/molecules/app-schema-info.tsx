import { SetStateAction, Dispatch } from 'react';
import Card from '@mui/joy/Card';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Grid from '@mui/joy/Grid';
import Input from '@mui/joy/Input';
import { Template } from "../../types/Schemas";

interface MoleculeProps {
  template: Template;
  setTemplate: Dispatch<SetStateAction<Template>>;
  subject: string;
  version: string;
  format: string;
}
/*
export interface Template {
  topic:      string;
  subject:    string;
  version:    number;
  schemaBody: any;
  format:     string;
	updatedBy?: string;
	updatedAt?: Date;
  createdAt?: Date;
}
*/
export const AppSchemaInfo = ({ subject, version, format, template, setTemplate }: MoleculeProps) => {
  return (<Card
    variant="outlined"
    orientation="horizontal"
    sx={{
      width: '100%',
      gap: 2,
    }}
  >
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      <Grid xs={6}>
        <Input value={template.subject} onChange={(event) => {
          setTemplate((prev) => ({
            ...prev,
            subject: event.target.value
          }))
        }} placeholder={subject} fullWidth />
      </Grid>
      <Grid xs={2}>
        <Input value={template.version} onChange={(event) => {
          setTemplate((prev) => ({
            ...prev,
            version: parseInt(event.target.value, 10)
          }))
        }} type="number" placeholder={version} fullWidth />
      </Grid>
      <Grid xs={4}>
        <Select placeholder={format} value={template.format} onChange={(e, newValue) => {
          setTemplate((prev) => ({
            ...prev,
            format: newValue || 'json'
          }))
        }}>
          <Option value="json">JSON</Option>
          <Option value="protobuff" disabled>Protobuff</Option>
          <Option value="avro" disabled>Avro</Option>
        </Select>
      </Grid>
    </Grid>
  </Card>);
}