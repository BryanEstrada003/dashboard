import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

import imagen from '../assets/images/sunrise.jpeg';

interface Config {
    horaAmanecer: string;
    horaAtardecer: string;
}

export default function Summary( {horaAmanecer, horaAtardecer}: Config) {
    return (
        <Card sx={{
          p: 2,
        }}>
            <CardActionArea>
                
                <CardMedia
                    component="img"
                    height="450"
                    image={imagen}
                    alt="Amanecer"
                />
                <CardContent>
                    <Typography gutterBottom component="h2" variant="h6" color="primary">
                        
                    </Typography>
                    <Typography component="p" variant="h6">
                    Amanece a las {horaAmanecer} y Atardece a las {horaAtardecer}
                    </Typography>
                    
                    
                </CardContent>
            </CardActionArea>
        </Card>
    )
}