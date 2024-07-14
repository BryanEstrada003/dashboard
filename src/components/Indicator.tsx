import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface Config {
    subtitle?: String;
    value: Number | String;
}

export default function Indicator(config: Config) {
	return (
        <Paper
        sx={{
          p: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography component="p" variant="h4">
            {config.value.toString()}
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
            {config.subtitle}
        </Typography>
    </Paper> 
)
}