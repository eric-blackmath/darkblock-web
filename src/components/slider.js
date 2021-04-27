import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

const marks = [
    {
      value: 0,
      label: 'No Encryption',
    },
    {
      value: 50,
      label: 'Darkblock-Lite',
    },
    {
      value: 100,
      label: 'Darkblock',
    },
  ];



export default function DiscreteSlider() {
  const classes = useStyles();

  return (
    <div style={{marginLeft:"100px"}} className={classes.root}>
      <Typography id="discrete-slider" gutterBottom>
        Level of Encryption
      </Typography>
      <Slider
        defaultValue={0}
        // getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        // valueLabelDisplay="auto"
        marks={marks}
        min={10}
        step={null}
        max={100}
      />
    </div>
  );
}
