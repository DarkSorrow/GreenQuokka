import Card from '@mui/joy/Card';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Grid from '@mui/joy/Grid';
import Input from '@mui/joy/Input';

interface MoleculeProps {
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
export const AppSchemaInfo = ({ subject, version, format }: MoleculeProps) => {
  return (<Card
    variant="outlined"
    row
    sx={{
      width: '100%',
      gap: 2,
    }}
  >
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      <Grid xs={6}>
        <Input placeholder={subject} fullWidth />
      </Grid>
      <Grid xs={2}>
        <Input type="number" placeholder={version} fullWidth />
      </Grid>
      <Grid xs={4}>
        <Select placeholder={format} defaultValue="json">
          <Option value="json">JSON</Option>
          <Option value="protobuff" disabled>Protobuff</Option>
          <Option value="avro" disabled>Avro</Option>
        </Select>
      </Grid>
    </Grid>
  </Card>);
}