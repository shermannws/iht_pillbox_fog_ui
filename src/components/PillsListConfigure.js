import {useState, cloneElement} from "react";
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { addNewPill, deletePillFromList } from "../services/pillList"

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
    <Box sx={{ display: 'flex' }}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Add new pills into the list</FormLabel>
        <FormGroup>
          
        <Grid item xs={12} md={6}>
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
                    secondary={state[k] + " mg"}
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
            label="Name of New Pill"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            value={newPillWeight}
            onInput={ e=>setNewPillWeight(e.target.value)}
            label="Mass of New Pill (mg)"
            type="number"
          />
          <Button type="submit" onClick={handleSubmit}>Add Pill</Button>
        </FormGroup>
      </FormControl>
      
      <p>{JSON.stringify(state)}</p>
    </Box>
  );
}