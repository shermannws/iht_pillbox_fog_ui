import {useState} from "react";
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { addNewPill, deletePillFromList } from "../services/pillList";

import './PillsListConfigure.css';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function PillsListConfigure(props) {
  const state = props.pills;
  const setState = props.setPills;
  const [newPillName, setNewPillName] = useState("");
  const [newPillWeight, setNewPillWeight] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setState({
      ...state,
      [newPillName]: Number(newPillWeight),
    });
    addNewPill(newPillName, Number(newPillWeight))
    setNewPillName("");
    setNewPillWeight("");
  };

  const handleDelete = (k) => {
    // Create a copy of the current pills state
    const updatedPills = { ...state };

    // Check if the pill to delete exists in the state
    if (k in updatedPills) {
      // Delete the pill from the copied state
      delete updatedPills[k];

      // Update the state with the modified pills dictionary
      setState(updatedPills);
    }
    deletePillFromList(k);
  }

  return (
    <Box className="pill-list-box" sx={{ display: 'flex' }}>
      <FormControl className="pill-list-box" sx={{ m: 6 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Add new pills into the list</FormLabel>
        <FormGroup>
          
        <Grid item xs={12} md={12}>
          <Demo>
            <List dense={false}>
              {Object.keys(state).map((k) => {
                return (
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon onClick={()=>handleDelete(k)} />
                      </IconButton>
                    }
                  >
                  <ListItemText
                    primary={k}
                    secondary={state[k] + " weight unit"}
                  />
                </ListItem>
                );
              })}
            </List>
          </Demo>
        </Grid>
        </FormGroup>
        <FormGroup onSubmit={handleSubmit}>
          <TextField
            value={newPillName}
            onInput={ e=>setNewPillName(e.target.value)}
            label="Name of New Pill (Strength of Pill)"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            value={newPillWeight}
            onInput={ e=>setNewPillWeight(e.target.value)}
            label="Mass of New Pill (weight unit)"
            type="number"
          />
          <Button type="submit" onClick={handleSubmit}>Add Pill</Button>
        </FormGroup>
      </FormControl>
    </Box>
  );
}