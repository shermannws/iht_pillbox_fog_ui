import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function PillsSelect(props) {
  const state = props.pills;
  const setState = props.setPills;


  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Select pills prescribed</FormLabel>
        <FormGroup>
          {Object.keys(state).map((k) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox checked={state[k]} onChange={handleChange} name={k} />
                }
                label={k}
              />
            );
          })} 
        </FormGroup>
      </FormControl>
      <p>{JSON.stringify(state)}</p>
    </Box>
  );
}