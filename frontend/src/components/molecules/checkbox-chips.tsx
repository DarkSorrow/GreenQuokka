import React from 'react';
import Typography from '@mui/joy/Typography';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Checkbox from '@mui/joy/Checkbox';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';

interface MoleculeCheckChipProps {
  label: string;
  available: string[];
  fields: string[];
  idx: number;
  setChosen: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
/*<Typography level="body1" id="field-used" mb={2}>
{label}
</Typography>*/
export const CheckboxChip = ({ label, available, idx, setChosen, fields }: MoleculeCheckChipProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box>
        <Typography level="body1" id="field-used" mb={2}>
          {label}
        </Typography>
        <Box
          role="group"
          aria-labelledby="field-used"
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
        >
          {available.map((name) => {
            const checked = fields.includes(name);
            return (
              <Chip
                key={name}
                variant={checked ? 'soft' : 'plain'}
                color={checked ? 'primary' : 'neutral'}
                startDecorator={
                  checked && <CheckIcon sx={{ zIndex: 1, pointerEvents: 'none' }} />
                }
              >
                <Checkbox
                  variant="outlined"
                  color={checked ? 'primary' : 'neutral'}
                  disableIcon
                  overlay
                  label={name}
                  checked={checked}
                  slotProps={{
                    input: {
                      "data-name": name,
                      "data-index": idx
                    }
                  }}
                  onChange={setChosen}
                />
              </Chip>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
